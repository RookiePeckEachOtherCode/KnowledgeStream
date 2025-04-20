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
	"gorm.io/gen"
	"gorm.io/gorm"
	"strconv"
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
	result.EndTime = course.EndTime
	result.BeginTime = course.BeginTime
	result.Class = course.Class
	result.Major = course.Major
	result.Ascription = fmt.Sprintf("%d", course.Ascription)
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
		videoInfo.Chapter = video.Chapter
		videoInfo.Length = video.Length
		videoInfo.Ascription = fmt.Sprintf("%d", video.Ascription)
		videoInfo.Uploader = fmt.Sprintf("%d", video.Uploader)
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
		userInfo.Faculty = member.Faculty
		userInfo.Class = member.Class
		userInfo.Major = member.Major
		userInfo.Signature = member.Signature
		userInfo.Grade = member.Grade
		userInfo.Phone = member.Phone
		if member.Authority == entity.AuthorityUser {
			userInfo.Authority = "Student"
		} else if member.Authority == entity.AuthorityAdmin {
			userInfo.Authority = "Teacher"
		}
		userInfo.UID = fmt.Sprintf("%d", member.ID)
		result = append(result, userInfo)
	}
	return result, nil
}

func (s *CourseService) StudentQueryCourse(
	c context.Context,
	uid int64,
	keyword string,
	size int32,
	offset int32,
	begin_time string,
	end_time string,
) ([]*base.CourseInfo, error) {
	uc := query.UserInCourse
	qu := query.User
	cu := query.Course

	// 查询匹配关键字的教师
	teacher, err := qu.WithContext(c).
		Where(qu.Authority.In("ADMIN", "SUPER_ADMIN")).
		Where(qu.Name.Like("%" + keyword + "%")).
		Find()
	if err != nil {
		hlog.Error("查询教师失败: ", err)
		return nil, err
	}

	var tides []int64
	for _, user := range teacher {
		tides = append(tides, user.ID)
	}

	// 获取学生课程关联记录
	userIn, err := uc.WithContext(c).
		Where(uc.UserID.Eq(uid)).
		Find()
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			hlog.Error("查询用户课程关联失败: ", err)
		}
		return nil, err
	}

	// 收集课程ID
	var cides []int64
	for _, courseRecord := range userIn {
		cides = append(cides, courseRecord.CourseID)
	}

	// 构建基础查询
	queryBuilder := cu.WithContext(c).
		Where(cu.ID.In(cides...)).
		Where(cu.Title.Like("%" + keyword + "%")).Or(cu.Ascription.In(tides...))

	// 添加时间过滤条件
	if begin_time != "" {
		queryBuilder = queryBuilder.Where(cu.BeginTime.Gte(begin_time))
	}
	if end_time != "" {
		queryBuilder = queryBuilder.Where(cu.EndTime.Lte(end_time))
	}

	// 执行查询
	courses, err := queryBuilder.
		Offset(int(offset)).
		Limit(int(size)).
		Find()
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			hlog.Error("查询课程失败: ", err)
		}
		return nil, err
	}

	// 转换结果
	var result []*base.CourseInfo
	for _, course := range courses {
		result = append(result, &base.CourseInfo{
			Cid:         fmt.Sprintf("%d", course.ID),
			Cover:       course.Cover,
			Description: course.Description,
			Title:       course.Title,
			Major:       course.Major,
			Class:       course.Class,
			EndTime:     course.EndTime,
			BeginTime:   course.BeginTime,
			Ascription:  fmt.Sprintf("%d", course.Ascription),
		})
	}
	return result, nil
}

func (s *CourseService) TeacherQueryCourse(
	c context.Context,
	uid int64,
	keyword string,
	size int32,
	offset int32,
	begin_time string, // 新增开始时间参数
	end_time string, // 新增结束时间参数
) ([]*base.CourseInfo, error) {
	cu := query.Course

	// 构建基础查询
	queryBuilder := cu.WithContext(c).
		Where(cu.Title.Like("%" + keyword + "%")).
		Where(cu.Ascription.Eq(uid))

	// 添加时间过滤条件
	if begin_time != "" {
		queryBuilder = queryBuilder.Where(cu.BeginTime.Gte(begin_time))
	}
	if end_time != "" {
		queryBuilder = queryBuilder.Where(cu.EndTime.Lte(end_time))
	}

	// 执行分页查询
	courses, err := queryBuilder.
		Offset(int(offset)).
		Limit(int(size)).
		Find()

	if err != nil {
		hlog.Error("查询课程失败: ", err)
		return nil, fmt.Errorf("查询课程失败: %v", err)
	}

	// 转换结果集
	result := make([]*base.CourseInfo, 0, len(courses))
	for _, course := range courses {
		result = append(result, &base.CourseInfo{
			Cid:         fmt.Sprintf("%d", course.ID),
			Title:       course.Title,
			Cover:       course.Cover,
			Description: course.Description,
			Major:       course.Major,
			Class:       course.Class,
			Ascription:  fmt.Sprintf("%d", course.Ascription),
			BeginTime:   course.BeginTime,
			EndTime:     course.EndTime,
		})
	}
	return result, nil
}
func (s *CourseService) AdminQueryCourse(
	c context.Context,
	keyword string,
	size int32,
	offset int32,
	major string,
	faculty string,
	begin_time string,
	end_time string,
) ([]*base.CourseInfo, error) {
	qu := query.User
	cu := query.Course

	// 查询匹配关键字的教师
	teacherQuery := qu.WithContext(c).Where(qu.Authority.In("ADMIN", "SUPER_ADMIN"))
	if keyword != "" {
		teacherQuery = teacherQuery.Where(qu.Name.Like("%" + keyword + "%"))
	}
	teacher, err := teacherQuery.Find()
	if err != nil {
		hlog.Error("查询教师失败: ", err)
		return nil, err
	}

	var tides []int64
	for _, user := range teacher {
		tides = append(tides, user.ID)
	}

	// 动态构建课程查询条件
	queryBuilder := cu.WithContext(c)
	var orConditions []gen.Condition

	// 仅当字段非空时添加对应的OR条件
	if keyword != "" {
		orConditions = append(orConditions, cu.Title.Like("%"+keyword+"%"))
	}
	if major != "" {
		orConditions = append(orConditions, cu.Major.Like("%"+major+"%"))
	}
	if faculty != "" {
		orConditions = append(orConditions, cu.Faculty.Like("%"+faculty+"%"))
	}
	if len(tides) > 0 {
		orConditions = append(orConditions, cu.Ascription.In(tides...))
	}

	// 应用OR条件（仅在存在条件时添加）
	if len(orConditions) > 0 {
		queryBuilder = queryBuilder.Where(
			cu.Or(orConditions...),
		)
	}

	// 添加时间过滤条件
	if begin_time != "" {
		queryBuilder = queryBuilder.Where(cu.BeginTime.Gte(begin_time))
	}
	if end_time != "" {
		queryBuilder = queryBuilder.Where(cu.EndTime.Lte(end_time))
	}

	// 执行查询
	courses, err := queryBuilder.
		Offset(int(offset)).
		Limit(int(size)).
		Find()
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			hlog.Error("查询课程失败: ", err)
		}
		return nil, err
	}

	// 转换结果
	var result []*base.CourseInfo
	for _, course := range courses {
		result = append(result, &base.CourseInfo{
			Cid:         fmt.Sprintf("%d", course.ID),
			Cover:       course.Cover,
			Description: course.Description,
			Title:       course.Title,
			Major:       course.Major,
			Faculty:     course.Faculty,
			Class:       course.Class,
			Ascription:  fmt.Sprintf("%d", course.Ascription),
			EndTime:     course.EndTime,
			BeginTime:   course.BeginTime,
		})
	}
	return result, nil
}
func (s *CourseService) CreateCourseWithUid(c context.Context, id int64, title string, description string, cover string, begin_time string, end_time string, major string, faculty string, class string) error {
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
		BeginTime:   begin_time,
		EndTime:     end_time,
		Major:       major,
		Faculty:     faculty,
		Class:       class,
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
	v := query.Video
	_, err = v.WithContext(c).Where(v.Ascription.Eq(cid)).Delete()
	if err != nil {
		hlog.Error("删除课程域下视频失败: ", err)
		return err
	}
	if _, err = cc.WithContext(c).Delete(course); err != nil {

		hlog.Error("删除课程域失败: ", err)
		return err
	}
	return nil
}
func (s *CourseService) UpdateCourseWithCid(c context.Context, cid int64, title string, description string, cover string, begin_time string, end_time string, ascription string, faculty string, major string, class string) error {
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
	if begin_time != "" {
		course.BeginTime = begin_time
	}
	if end_time != "" {
		course.EndTime = end_time
	}
	if ascription != "" {
		as, _ := strconv.ParseInt(ascription, 10, 64)
		course.Ascription = as
	}
	if major != "" {
		course.Major = major
	}
	if faculty != "" {
		course.Faculty = faculty
	}
	if class != "" {
		course.Class = class
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
