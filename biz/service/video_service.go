package service

import (
	"context"
	"errors"
	"fmt"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/query"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/base"
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
		return nil, fmt.Errorf("查询视频信息失败: %w", err)
	}
	var result *base.VideoInfo
	result.Vid = fmt.Sprintf("%d", video.ID)
	result.Title = video.Title
	result.Description = video.Description
	result.Cover = video.Cover
	result.Source = video.Source
	return result, nil
}
