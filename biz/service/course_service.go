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
		hlog.Error("查询课程域信息失败: ", err)
		return nil, err
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
		hlog.Error("查询课程域视频列表信息失败: ", err)
		return nil, err
	}
	var result []*base.VideoInfo
	for _, video := range videos {
		videoInfo := new(base.VideoInfo)
		videoInfo.Source = video.Source
		videoInfo.Cover = video.Cover
		videoInfo.Vid = fmt.Sprintf("%d", video.ID)
		videoInfo.Title = video.Title
		videoInfo.Description = video.Description
		videoInfo.UploadTime = video.UploadTime
		result = append(result, videoInfo)
	}
	return result, nil
}
func (s *CourseService) CourseMembersInfoWithCid(c context.Context, cid int64) ([]*base.UserInfo, error) {
	uc := query.UserInCourse
	memberids, err := uc.Where(uc.CourseID.Eq(cid)).Find()
	if err != nil {
		hlog.Error("查询课程域成员列表信息失败: ", err)
		return nil, err
	}
	var result []*base.UserInfo
	for _, memberid := range memberids {
		member, err := UserServ().GetUserInfoWithId(c, memberid.UserID)
		if err != nil {
			hlog.Error("查询用户信息失败: ", err)
			return nil, err
		}
		userInfo := new(base.UserInfo)
		userInfo.Name = member.Name
		userInfo.Avatar = member.Avatar
		if member.Authority == entity.AuthorityUser {
			userInfo.Authority = "student"
		} else if member.Authority == entity.AuthorityAdmin {
			userInfo.Authority = "teacher"
		}
		userInfo.UID = fmt.Sprintf("%d", member.ID)
		result = append(result, userInfo)
	}
	return result, nil
}
func (s *CourseService) SelectMyCoursesWithUid(c context.Context, uid int64) ([]*base.CourseInfo, error) {
	uc := query.UserInCourse
	courseids, err := uc.WithContext(c).Where(uc.UserID.Eq(uid)).Find()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		hlog.Error("查询所在课程域失败: ", err)
		return nil, err
	}
	var result []*base.CourseInfo
	for _, courseid := range courseids {
		course, err := CourseServ().CourseInfoWithCid(c, courseid.CourseID)
		if err != nil {
			hlog.Error("查询课程域信息失败: ", err)
			return nil, err
		}
		courseInfo := new(base.CourseInfo)
		courseInfo.Cid = fmt.Sprintf("%d", course.Cid)
		courseInfo.Cover = course.Cover
		courseInfo.Description = course.Description
		courseInfo.Title = course.Title
		result = append(result, courseInfo)
	}
	return result, nil
}
func (s *CourseService) CreateCourseWithUid(c context.Context, id int64, title string, description string, cover string) error {
	cid, err := utils.NextSnowFlakeId()
	if err != nil {
		return err
	}
	cc := query.Course
	course := entity.Course{
		ID:          *cid,
		Title:       title,
		Description: description,
		Cover:       cover,
		Ascription:  id,
	}
	if err := cc.WithContext(c).Save(&course); err != nil {
		hlog.Error("创建课程域失败: ", err)
		return err
	}
	if err = CourseServ().InviteUserWithCidAndUid(c, *cid, id); err != nil {
		hlog.Error("课程初始化失败: ", err)
		return err
	}
	return nil
}
func (s *CourseService) DeleteCourseWithCid(c context.Context, cid int64) error {
	cc := query.Course
	course, err := cc.WithContext(c).Where(cc.ID.Eq(cid)).First()
	if err != nil {
		hlog.Error("查询课程域失败: ", err)
		return err
	}
	uc := query.UserInCourse
	_, err = uc.WithContext(c).Where(uc.CourseID.Eq(cid)).Delete()
	if err != nil {
		hlog.Error("删除课程域成员失败: ", err)
		return err
	}
	if _, err = cc.WithContext(c).Delete(course); err != nil {

		hlog.Error("删除课程域失败: ", err)
		return err
	}
	return nil
}
func (s *CourseService) UpdateCourseWithCid(c context.Context, cid int64, title string, description string, cover string) error {
	cc := query.Course
	course, err := cc.WithContext(c).Where(cc.ID.Eq(cid)).First()
	if err != nil {
		hlog.Error("查询课程域失败: ", err)
		return err
	}
	if title != "" {
		course.Title = title
	}
	if description != "" {
		course.Description = description
	}
	if cover != "" {
		course.Cover = cover
	}
	if err = cc.WithContext(c).Save(course); err != nil {
		hlog.Error("更新课程域信息失败: ", err)
		return err
	}
	return nil
}
func (s *CourseService) InviteUserWithCidAndUid(c context.Context, cid int64, uid int64) error {
	uc := query.UserInCourse
	uinc, err := uc.WithContext(c).Where(uc.UserID.Eq(uid), uc.CourseID.Eq(cid)).First()
	if err == nil {
		if uinc != nil {
			return errors.New("该学生已在课程中")
		}
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		hlog.Error("查询用户课程关联记录失败: ", err)
		return err
	}
	ucc := entity.UserInCourse{
		UserID:   uid,
		CourseID: cid,
	}
	if err = uc.WithContext(c).Save(&ucc); err != nil {
		hlog.Error("邀请用户加入课程域失败: ", err)
		return err
	}
	return nil
}
func (s *CourseService) OperateMemberWithCidAndUid(c context.Context, cid int64, uid int64) error {
	uc := query.UserInCourse
	uinc, err := uc.WithContext(c).Where(uc.UserID.Eq(uid), uc.CourseID.Eq(cid)).First()
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("该用户并不在该课程域中")
		}
		hlog.Error("查询用户课程关联记录失败: ", err)
		return err
	}
	if _, err = uc.WithContext(c).Delete(uinc); err != nil {
		hlog.Error("删除用户失败: ", err)
		return err
	}
	return nil
}
