package service

import (
	"context"
	"fmt"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/query"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/base"
	"sync"
)

var (
	courseServiceOnce sync.Once
	courseService     *CourseService
)

func CourseServ() *CourseService {
	courseServiceOnce.Do(func() {
		/**
		* 依赖注入位置
		* eg.
		* courseService = &CourseService{
		  courseRepo: CourseRepo,
		  otherService: OtherService,
		}
		**/
		courseService = &CourseService{}
	})
	return courseService
}

type CourseService struct {
}

func (s *CourseService) CourseInfoWithCid(c context.Context, cid int64) (*base.CourseInfo, error) {
	cc := query.Course
	course, err := cc.WithContext(c).Where(cc.ID.Eq(cid)).First()
	if err != nil {
		return nil, fmt.Errorf("查询课程域信息失败: %w", err)
	}
	result := new(base.CourseInfo)
	result.Title = course.Title
	result.Cid = fmt.Sprintf("%d", course.ID)
	result.Description = course.Description
	result.Cover = course.Cover
	return result, nil
}
func (s *CourseService) CourseVideosInfoWithCid(c context.Context, cid int64) ([]*base.VideoInfo, error) {
	v := query.Video
	videos, err := v.Where(v.Ascription.Eq(cid)).Find()
	if err != nil {
		return nil, fmt.Errorf("查询课程域视频列表失败: %w", err)
	}
	var result []*base.VideoInfo
	for _, video := range videos {
		videoInfo := new(base.VideoInfo)
		videoInfo.Source = video.Source
		videoInfo.Cover = video.Cover
		videoInfo.Vid = fmt.Sprintf("%d", video.ID)
		videoInfo.Title = video.Title
		videoInfo.Description = video.Description
		result = append(result, videoInfo)
	}
	return result, nil
}
func (s *CourseService) CourseMembersInfoWithCid(c context.Context, cid int64) ([]*base.UserInfo, error) {
	uc := query.UserInCourse
	memberids, err := uc.Where(uc.CourseID.Eq(cid)).Find()
	if err != nil {
		return nil, fmt.Errorf("查询课程域成员失败: %w", err)
	}
	var result []*base.UserInfo
	for _, memberid := range memberids {
		member, err := UserServ().GetUserInfoWithId(c, memberid.UserID)
		if err != nil {
			return nil, err
		}
		userInfo := new(base.UserInfo)
		userInfo.Name = member.Name
		userInfo.Avatar = member.Avatar
		userInfo.UID = fmt.Sprintf("%d", member.ID)
		result = append(result, userInfo)
	}
	return result, nil
}
