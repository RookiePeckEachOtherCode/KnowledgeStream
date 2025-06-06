package service

import (
	"context"
	"errors"
	"fmt"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/entity"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/query"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/redis"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/base"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/utils"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/config"
	"github.com/cloudwego/hertz/pkg/common/hlog"
	"gorm.io/gorm"
	"sort"
	"strconv"
	"sync"
)

var (
	videoServiceOnce sync.Once
	videoService     *VideoService
)

func VideoServ() *VideoService {
	videoServiceOnce.Do(func() {
		/**
		* 依赖注入位置
		* eg.
		* videoService = &VideoService{
		  videoRepo: VideoRepo,
		  otherService: OtherService,
		}
		**/
		videoService = &VideoService{}
	})
	return videoService
}

type VideoService struct {
}

func (s *VideoService) VideoInfoService(c context.Context, vid int64) (*base.VideoInfo, error) {
	v := query.Video
	video, err := v.WithContext(c).Where(v.ID.Eq(vid)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("视频不存在或已被删除")
		}
		hlog.Error("查询视频信息失败: ", err)
		return nil, err
	}
	result := new(base.VideoInfo)
	result.Vid = fmt.Sprintf("%d", video.ID)
	result.Title = video.Title
	result.Description = video.Description
	result.Cover = video.Cover
	result.Source = video.Source
	result.Chapter = video.Chapter
	result.Ascription = fmt.Sprintf("%d", video.Ascription)
	result.Uploader = fmt.Sprintf("%d", video.Uploader)
	result.Length = fmt.Sprintf("%d", video.Length)
	result.UploadTime = video.UploadTime
	recordKey := redis.GenVideoPlaysRecordKey(video.ID)
	exists, err := redis.Client.R.Exists(c, recordKey).Result()
	if err != nil {
		hlog.Error("VideoPlaysRecord redis的记录查询存在爆了: ", err)
		return nil, err
	}
	if exists > 0 {
		record := &redis.VideoPlaysRecord{}
		err = redis.Client.GetValue(c, recordKey, record)
		if err != nil {
			hlog.Error("VideoPlays redis的记录查询爆了:: ", err)
			return nil, err
		}
		record.Plays++
		result.Plays = fmt.Sprintf("%d", record.Plays)
		redis.Client.SetValue(c, recordKey, record)
		return result, nil
	}
	video.Plays = video.Plays + 1
	result.Plays = fmt.Sprintf("%d", video.Plays)
	_, err = v.WithContext(c).Where(v.ID.Eq(video.ID)).Updates(video)
	if err != nil {
		hlog.Error("更新视频信息失败: ", err)
		return result, err
	}
	record := redis.VideoPlaysRecord{Vid: vid, Plays: video.Plays}
	redis.Client.SetValue(c, recordKey, record)
	return result, nil
}
func (s *VideoService) DeleteVideoWithVid(c context.Context, vid int64) error {
	v := query.Video
	video, err := v.WithContext(c).Where(v.ID.Eq(vid)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("视频不存在或已被删除")
		}
		hlog.Error("查询视频失败: ", err)
		return err
	}
	_, err = v.WithContext(c).Delete(video)
	if err != nil {
		hlog.Error("删除视频失败: ", err)
		return err
	}
	return nil
}
func (s *VideoService) UploadVideoWithCidAndUid(c context.Context, uid int64, cid int64, title string, description string, cover string, length string, timestr string, chapter string) (int64, error) {
	v := query.Video
	cu := query.Course
	course, _ := cu.WithContext(c).Where(cu.ID.Eq(cid)).First()
	id, err := utils.NextSnowFlakeId()
	if err != nil {
		return 0, err
	}
	source := config.Get().OssBuckets.VideoSource + "/" + strconv.FormatInt(*id, 10)
	video := entity.Video{
		ID:          *id,
		Uploader:    uid,
		Source:      source,
		Title:       title,
		Description: description,
		Cover:       cover,
		Ascription:  cid,
		Length:      length,
		UploadTime:  timestr,
		Chapter:     chapter,
		Major:       course.Major,
	}

	err = v.WithContext(c).Save(&video)
	if err != nil {
		hlog.Error("上传视频失败: ", err)
		return 0, err
	}
	return *id, nil
}
func (s *VideoService) AdminQueryVideo(
	c context.Context,
	keyword string,
	size int32,
	offset int32,
	major string,
) ([]*base.VideoInfo, error) {
	v := query.Video
	videos, err := v.WithContext(c).
		Where(v.Title.Like("%" + keyword + "%")).
		Where(v.Major.Like("%" + major + "%")).
		Offset(int(offset)).
		Limit(int(size)).Find()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		hlog.Error("查询视频失败: ", err)
		return nil, err
	}
	var result []*base.VideoInfo
	for _, video := range videos {
		videoInfo := new(base.VideoInfo)
		videoInfo.Source = video.Source
		videoInfo.Cover = video.Cover
		videoInfo.UploadTime = video.UploadTime
		videoInfo.Vid = fmt.Sprintf("%d", video.ID)
		videoInfo.Title = video.Title
		videoInfo.Ascription = fmt.Sprintf("%d", video.Ascription)
		videoInfo.Chapter = video.Chapter
		videoInfo.Length = fmt.Sprintf("%d", video.Length)
		videoInfo.Uploader = fmt.Sprintf("%d", video.Uploader)
		videoInfo.Description = video.Description
		result = append(result, videoInfo)
	}
	return result, nil
}
func (s *VideoService) TeacherQueryVideo(
	c context.Context,
	keyword string,
	size int32,
	offset int32,
	uid int64,
) ([]*base.VideoInfo, error) {
	v := query.Video

	videos, err := v.WithContext(c).
		Where(v.Title.Like("%" + keyword + "%")).
		Where(v.Uploader.Eq(uid)).
		Offset(int(offset)).
		Limit(int(size)).Find()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		hlog.Error("查询视频失败: ", err)
		return nil, err
	}
	var result []*base.VideoInfo
	for _, video := range videos {
		videoInfo := new(base.VideoInfo)
		videoInfo.Source = video.Source
		videoInfo.Cover = video.Cover
		videoInfo.UploadTime = video.UploadTime
		videoInfo.Vid = fmt.Sprintf("%d", video.ID)
		videoInfo.Title = video.Title
		videoInfo.Ascription = fmt.Sprintf("%d", video.Ascription)
		videoInfo.Chapter = video.Chapter
		videoInfo.Length = fmt.Sprintf("%d", video.Length)
		videoInfo.Uploader = fmt.Sprintf("%d", video.Uploader)
		videoInfo.Description = video.Description
		result = append(result, videoInfo)
	}
	return result, nil
}
func (s *VideoService) VideosStatistics(c context.Context, offset int32, size int32) ([]*base.VideosStatistics, error) {
	v := query.Video

	videos, err := v.WithContext(c).
		Offset(int(offset)).
		Limit(int(size)).Find()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		hlog.Error("查询视频失败: ", err)
		return nil, err
	}
	mp := make(map[string]int64)
	for _, video := range videos {
		mp[video.Major]++
	}
	var result []*base.VideosStatistics
	for major, count := range mp {
		vs := new(base.VideosStatistics)
		vs.Major = major
		vs.Videos = count
		result = append(result, vs)
	}
	sort.Slice(result, func(i, j int) bool {
		return result[i].Videos > result[j].Videos
	})
	return result, nil
}
func (s *VideoService) VideoPlaysStatistics(c context.Context, offset int32, size int32) ([]*base.VideosPlaysStatistics, error) {
	v := query.Video

	videos, err := v.WithContext(c).
		Offset(int(offset)).
		Limit(int(size)).Find()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		hlog.Error("查询视频失败: ", err)
		return nil, err
	}
	var result []*base.VideosPlaysStatistics
	for _, video := range videos {
		vps := new(base.VideosPlaysStatistics)
		vps.Plays = int64(video.Plays)
		vps.Video = video.Title
		result = append(result, vps)
	}
	sort.Slice(result, func(i, j int) bool {
		return result[i].Plays > result[j].Plays
	})
	return result, nil
}
