package service

import (
	"context"
	"errors"
	"fmt"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/entity"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/query"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/base"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/utils"
	"github.com/cloudwego/hertz/pkg/common/hlog"
	"gorm.io/gorm"
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
	var result *base.VideoInfo
	result.Vid = fmt.Sprintf("%d", video.ID)
	result.Title = video.Title
	result.Description = video.Description
	result.Cover = video.Cover
	result.Source = video.Source
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
func (s *VideoService) UploadVideoWithCidAndUid(c context.Context, uid int64, cid int64, source string, title string, description string, cover string, length int) error {
	v := query.Video
	id, err := utils.NextSnowFlakeId()
	if err != nil {
		return err
	}
	video := entity.Video{
		ID:          *id,
		Uploader:    uid,
		Source:      source,
		Title:       title,
		Description: description,
		Cover:       cover,
		Ascription:  cid,
		Length:      length,
	}

	err = v.WithContext(c).Save(&video)
	if err != nil {
		hlog.Error("上传视频失败: ", err)
		return err
	}
	return nil
}
