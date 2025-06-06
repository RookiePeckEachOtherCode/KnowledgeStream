// Code generated by hertz generator.

package user

import (
	"context"
	"fmt"
	"net/http"
	"strconv"

	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/entity"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/base"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/service"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/utils"

	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/srverror"
	user "github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/user"
	"github.com/cloudwego/hertz/pkg/app"
	"github.com/cloudwego/hertz/pkg/common/hlog"
	"github.com/cloudwego/hertz/pkg/protocol/consts"
)

// UserLogin .
// @router /user/login [GET]
func UserLogin(ctx context.Context, c *app.RequestContext) {
	var err error
	var req user.UserLoginReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		c.String(consts.StatusBadRequest, err.Error())
		return
	}
	resp := new(user.UserLoginResp)

	if len(req.Phone) == 0 || len(req.Password) == 0 {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusBadRequest, "手机号或者密码不能为空")
		c.JSON(consts.StatusOK, resp)
		return
	}

	uid, name, token, authority, err := service.UserServ().UserLoginWithPhone(ctx, req.Phone, req.Password)

	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		c.JSON(consts.StatusOK, resp)
		return
	}

	resp.ID = strconv.FormatInt(uid, 10)
	resp.Name = name
	resp.Token = token
	resp.Authority = authority
	resp.Base = srverror.WrapWithSuccess("登录成功")

	c.JSON(consts.StatusOK, resp)
}

// UserRegister .
// @router /user/register [POST]
func UserRegister(ctx context.Context, c *app.RequestContext) {
	var err error
	var req user.UserRegisterReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(user.UserRegisterResp)
	if len(req.Name) == 0 || len(req.Phone) == 0 || len(req.Password) == 0 {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusBadRequest, "用户名、手机号或者密码不能为空")
		c.JSON(consts.StatusOK, resp)
		return
	}

	err = service.UserServ().UserRegister(ctx, req.Name, req.Phone, req.Password, "", "", "", "")
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp.Base = srverror.WrapWithSuccess("注册成功")
	c.JSON(consts.StatusOK, resp)
}

// UserInfo .
// @router /user/info [GET]
func UserInfo(ctx context.Context, c *app.RequestContext) {
	var err error
	var req user.UserInfoReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(user.UserInfoResp)
	resp.Base = new(base.BaseResponse)
	resp.Userinfo = new(base.UserInfo)
	uid, authority, err := utils.AuthCheck(c)
	if err != nil {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = err.Error()
		c.JSON(consts.StatusOK, resp)
		return
	}
	dbuser, err := service.UserServ().GetUserInfoWithId(ctx, uid)
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		c.JSON(consts.StatusOK, resp)
	} else {
		resp.Userinfo.UID = fmt.Sprintf("%d", dbuser.ID)
		resp.Userinfo.Name = dbuser.Name
		resp.Userinfo.Avatar = dbuser.Avatar
		resp.Userinfo.Grade = dbuser.Grade
		resp.Userinfo.Authority = string(authority)
		resp.Userinfo.Class = dbuser.Class
		resp.Userinfo.Faculty = dbuser.Faculty
		resp.Userinfo.Major = dbuser.Major
		resp.Userinfo.Signature = dbuser.Signature
		resp.Userinfo.Phone = dbuser.Phone
	}
	resp.Base = srverror.WrapWithSuccess("查询用户信息成功")
	c.JSON(consts.StatusOK, resp)
}

// UserInfoUpdate .
// @router /user/updateinfo [GET]
func UserInfoUpdate(ctx context.Context, c *app.RequestContext) {
	var err error
	var req user.UserInfoUpdateReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(user.UserInfoUpdateResp)
	resp.Base = new(base.BaseResponse)
	uid, _, err := utils.AuthCheck(c)
	if err != nil {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = err.Error()
		c.JSON(consts.StatusOK, resp)
		return
	}
	err = service.UserServ().UpdateUserInfoWithId(ctx, uid, req.Name, req.Avatar, req.Phone, req.Signature, "", "", "", "")
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp.Base = srverror.WrapWithSuccess("更新用户信息成功")
	c.JSON(consts.StatusOK, resp)
}

// ------------------------------------------Techer
// CreateCourse .
// @router /user/teacher/createcourse [POST]
func CreateCourse(ctx context.Context, c *app.RequestContext) {
	var err error
	var req user.CreateCourseReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(user.CreateCourseResp)
	resp.Base = new(base.BaseResponse)
	uid, authority, err := utils.AuthCheck(c)
	if err != nil {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = err.Error()
		c.JSON(consts.StatusOK, resp)
		return
	}
	if authority == entity.AuthorityUser {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = "用户权限不够"
		c.JSON(consts.StatusOK, resp)
		return
	}
	err = service.CourseServ().CreateCourseWithUid(ctx, uid, req.Title, req.Description, req.Cover, req.BeginTime, req.EndTime, req.Major, req.Faculty, req.Class)
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp.Base = srverror.WrapWithSuccess("创建课程域成功")
	c.JSON(consts.StatusOK, resp)
}

// DeleteCourse .
// @router /user/teacher/deletecourse [POST]
func DeleteCourse(ctx context.Context, c *app.RequestContext) {
	var err error
	var req user.DeleteCourseReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(user.DeleteCourseResp)
	resp.Base = new(base.BaseResponse)
	_, authority, err := utils.AuthCheck(c)
	if err != nil {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = err.Error()
		c.JSON(consts.StatusOK, resp)
		return
	}
	if authority == entity.AuthorityUser {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = "用户权限不够"
		c.JSON(consts.StatusOK, resp)
		return
	}
	cid, err := strconv.ParseInt(req.Cid, 10, 64)
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		hlog.Error("课程域id数据格式转换失败：", err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	err = service.CourseServ().DeleteCourseWithCid(ctx, cid)
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp.Base = srverror.WrapWithSuccess("删除课程域成功")
	c.JSON(consts.StatusOK, resp)
}

// UpdateCourse .
// @router /user/teacher/update/course [POST]
func UpdateCourse(ctx context.Context, c *app.RequestContext) {
	var err error
	var req user.UpdateCourseReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(user.UpdateCourseResp)
	resp.Base = new(base.BaseResponse)
	_, authority, err := utils.AuthCheck(c)
	if err != nil {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = err.Error()
		c.JSON(consts.StatusOK, resp)
		return
	}
	if authority == entity.AuthorityUser {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = "用户权限不够"
		c.JSON(consts.StatusOK, resp)
		return
	}
	cid, err := strconv.ParseInt(req.Cid, 10, 64)
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		hlog.Error("课程域id数据格式转换失败：", err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	err = service.CourseServ().UpdateCourseWithCid(ctx, cid, req.Title, req.Description, req.Cover, req.BeginTime, req.EndTime, "", "", "", "")
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp.Base = srverror.WrapWithSuccess("更新课程域信息成功")
	c.JSON(consts.StatusOK, resp)
}

// InviteStudent .
// @router /user/teacher/invite [POST]
func InviteStudent(ctx context.Context, c *app.RequestContext) {
	var err error
	var req user.InviteStudentReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(user.InviteStudentResp)
	resp.Base = new(base.BaseResponse)
	_, authority, err := utils.AuthCheck(c)
	if err != nil {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = err.Error()
		c.JSON(consts.StatusOK, resp)
		return
	}
	if authority == entity.AuthorityUser {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = "用户权限不够"
		c.JSON(consts.StatusOK, resp)
		return
	}
	cid, err := strconv.ParseInt(req.Cid, 10, 64)
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		hlog.Error("课程域id数据格式转换失败：", err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	sid, err := strconv.ParseInt(req.Sid, 10, 64)
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		hlog.Error("学生id数据格式转换失败：", err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	err = service.CourseServ().InviteUserWithCidAndUid(ctx, cid, sid)
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp.Base = srverror.WrapWithSuccess("邀请学生加入课程域成功")
	c.JSON(consts.StatusOK, resp)
}

// OperateMember .
// @router /user/teacher/update/course/member [POST]
func OperateMember(ctx context.Context, c *app.RequestContext) {
	var err error
	var req user.OperateMemberReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(user.OperateMemberResp)
	resp.Base = new(base.BaseResponse)
	_, authority, err := utils.AuthCheck(c)
	if err != nil {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = err.Error()
		c.JSON(consts.StatusOK, resp)
		return
	}
	if authority == entity.AuthorityUser {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = "用户权限不够"
		c.JSON(consts.StatusOK, resp)
		return
	}
	cid, err := strconv.ParseInt(req.Cid, 10, 64)
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		hlog.Error("课程域id数据格式转换失败：", err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	deletedUserId, err := strconv.ParseInt(req.UID, 10, 64)
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		hlog.Error("被删除user_id数据格式转换失败：", err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	err = service.CourseServ().OperateMemberWithCidAndUid(ctx, cid, deletedUserId)
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp.Base = srverror.WrapWithSuccess("删除课程域成员成功")
	c.JSON(consts.StatusOK, resp)
}

// UploadVideos .
// @router /user/teacher/uploadvideo [POST]
func UploadVideos(ctx context.Context, c *app.RequestContext) {
	var err error
	var req user.UploadVideosReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(user.UploadVideosResp)
	resp.Base = new(base.BaseResponse)
	uid, authority, err := utils.AuthCheck(c)
	if err != nil {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = err.Error()
		c.JSON(consts.StatusOK, resp)
		return
	}
	if authority == entity.AuthorityUser {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = "用户权限不够"
		c.JSON(consts.StatusOK, resp)
		return
	}
	cid, err := strconv.ParseInt(req.Cid, 10, 64)
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		hlog.Error("课程域id数据格式转换失败：", err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	timestr, err := utils.GetNowTime()
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		hlog.Error("加载位置出错：", err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	newid, err := service.VideoServ().UploadVideoWithCidAndUid(ctx, uid, cid, req.Title, req.Description, req.Cover, req.Length, timestr, req.Chapter)
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp.Base = srverror.WrapWithSuccess("上传视频成功")
	resp.Newid = fmt.Sprintf("%d", newid)
	c.JSON(consts.StatusOK, resp)
}

func DeleteVideo(ctx context.Context, c *app.RequestContext) {
	var err error
	var req user.DeleteVideoReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(user.DeleteVideoResp)
	resp.Base = new(base.BaseResponse)
	_, authority, err := utils.AuthCheck(c)
	if err != nil {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = err.Error()
		c.JSON(consts.StatusOK, resp)
		return
	}
	if authority == entity.AuthorityUser {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = "用户权限不够"
		c.JSON(consts.StatusOK, resp)
		return
	}
	vid, err := strconv.ParseInt(req.Vid, 10, 64)
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		hlog.Error("视频id数据格式转换失败：", err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	err = service.VideoServ().DeleteVideoWithVid(ctx, vid)
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp.Base = srverror.WrapWithSuccess("删除视频成功")
	c.JSON(consts.StatusOK, resp)
}

// ------------------------------------------Student
// StudentMyCourses .
// @router /user/student/mycourse [GET]
func StudentMyCourses(ctx context.Context, c *app.RequestContext) {
	var err error
	var req user.StudentMyCoursesReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(user.StudentMyCoursesResp)
	resp.Base = new(base.BaseResponse)
	uid, _, err := utils.AuthCheck(c)
	if err != nil {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = err.Error()
		c.JSON(consts.StatusOK, resp)
		return
	}
	result, err := service.CourseServ().StudentQueryCourse(ctx, uid, req.Keyword, req.Size, req.Offset, req.BeginTime, req.EndTime)
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp.Coursesinfo = result
	resp.Base = srverror.WrapWithSuccess("查询所在课程域信息成功")
	c.JSON(consts.StatusOK, resp)
}

// EnquiryMyCourses .
// @router /user/teacher/mycourse [GET]
func EnquiryMyCourses(ctx context.Context, c *app.RequestContext) {
	var err error
	var req user.EnquiryMyCoursesReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}
	resp := new(user.EnquiryMyCoursesResp)
	resp.Base = new(base.BaseResponse)
	uid, authority, err := utils.AuthCheck(c)
	if err != nil {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = err.Error()
		c.JSON(consts.StatusOK, resp)
		return
	}
	if authority == entity.AuthorityUser {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = "用户权限不够"
		c.JSON(consts.StatusOK, resp)
		return
	}
	result, err := service.CourseServ().TeacherQueryCourse(ctx, uid, req.Keyword, req.Size, req.Offset, req.BeginTime, req.EndTime)
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp.Coursesinfo = result
	resp.Base = srverror.WrapWithSuccess("查询所在课程域信息成功")
	c.JSON(consts.StatusOK, resp)
}

// EnquiryStudent .
// @router /teacher/query/student [POST]
func EnquiryStudent(ctx context.Context, c *app.RequestContext) {
	var err error
	var req user.EnquiryStudentReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(user.EnquiryStudentResp)
	resp.Base = new(base.BaseResponse)
	_, authority, err := utils.AuthCheck(c)
	if err != nil {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = err.Error()
		c.JSON(consts.StatusOK, resp)
		return
	}
	if authority == entity.AuthorityUser {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = "用户权限不够"
		c.JSON(consts.StatusOK, resp)
		return
	}
	result, err := service.UserServ().TeacherQueryStudent(ctx, req.Keyword, req.Faculty, req.Class, req.Grade, req.Size, req.Offset)
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp.Usersinfo = result
	resp.Base = srverror.WrapWithSuccess("查询学生成功")
	c.JSON(consts.StatusOK, resp)
}

// UidInfo .
// @router /user/uid [GET]
func UidInfo(ctx context.Context, c *app.RequestContext) {
	var err error
	var req user.UidInfoReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(user.UidInfoResp)
	uid, err := strconv.ParseInt(req.UID, 10, 64)
	if err != nil {
		resp.Base.Code = http.StatusBadRequest
		resp.Base.Msg = err.Error()
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp.Userinfo = &base.UserInfo{}
	dbuser, err := service.UserServ().GetUserInfoWithId(ctx, uid)
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		c.JSON(consts.StatusOK, resp)
	} else {
		resp.Userinfo.UID = fmt.Sprintf("%d", dbuser.ID)
		resp.Userinfo.Name = dbuser.Name
		resp.Userinfo.Avatar = dbuser.Avatar
		resp.Userinfo.Grade = dbuser.Grade
		resp.Userinfo.Authority = string(dbuser.Authority)
		resp.Userinfo.Class = dbuser.Class
		resp.Userinfo.Faculty = dbuser.Faculty
		resp.Userinfo.Major = dbuser.Major
		resp.Userinfo.Signature = dbuser.Signature
		resp.Userinfo.Phone = dbuser.Phone
	}
	resp.Base = srverror.WrapWithSuccess("查询用户信息成功")
	c.JSON(consts.StatusOK, resp)
}

// EnquiryVideo .
// @router /teacher/query/video [GET]
func EnquiryVideo(ctx context.Context, c *app.RequestContext) {
	var err error
	var req user.EnquiryVideoReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(user.EnquiryVideoResp)
	resp.Base = new(base.BaseResponse)
	uid, authority, err := utils.AuthCheck(c)
	if err != nil {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = err.Error()
		c.JSON(consts.StatusOK, resp)
		return
	}
	if authority == entity.AuthorityUser {
		resp.Base.Code = http.StatusUnauthorized
		resp.Base.Msg = "用户权限不够"
		c.JSON(consts.StatusOK, resp)
		return
	}
	result, err := service.VideoServ().TeacherQueryVideo(ctx, req.Keyword, req.Size, req.Offset, uid)
	if err != nil {
		resp.Base = srverror.WrapWithError(http.StatusBadRequest, err)
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp.Videosinfo = result
	resp.Base = srverror.WrapWithSuccess("查询视频成功")
	c.JSON(consts.StatusOK, resp)
}
