// Code generated by hertz generator.

package notification

import (
	"context"
	"errors"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/base"
	notification "github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/notification"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/srverror"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/service"
	"github.com/cloudwego/hertz/pkg/app"
	"github.com/cloudwego/hertz/pkg/protocol/consts"
	"net/http"
	"strconv"
)

// QueryNotification .
// @router /notification [GET]
func QueryNotification(ctx context.Context, c *app.RequestContext) {
	var err error
	var req notification.QueryNotificationReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(notification.QueryNotificationResp)
	Uid, exists := c.Get("uid")
	if !exists {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusUnauthorized, errors.New("未获取到用户信息").Error())
		c.JSON(consts.StatusOK, resp)
		return
	}
	uid := Uid.(int64)

	queryNotificationResp, err := service.NotificationServ().QueryUserNotification(ctx, uid)
	if err != nil {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusBadRequest, err.Error())
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp = queryNotificationResp
	c.JSON(consts.StatusOK, resp)
}

// NotificationUnderCourse .
// @router /notification/course [GET]
func NotificationUnderCourse(ctx context.Context, c *app.RequestContext) {
	var err error
	var req notification.NotificationUnderCourseReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(notification.NotificationUnderCourseResp)

	cid, err := strconv.ParseInt(req.Cid, 10, 64)

	notificationUnderCourseResp, err := service.NotificationServ().QueryCourseNotifications(ctx, cid)
	if err != nil {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusBadRequest, err.Error())
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp = notificationUnderCourseResp

	c.JSON(consts.StatusOK, resp)
}

// CreateNotification .
// @router /notification/create [POST]
func CreateNotification(ctx context.Context, c *app.RequestContext) {
	var err error
	var req notification.CreateNotificationReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}
	resp := new(notification.CreateNotificationResp)

	cid, err := strconv.ParseInt(req.Cid, 10, 64)
	if err != nil {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusBadRequest, err.Error())
		c.JSON(consts.StatusOK, resp)
		return
	}

	response, nid, err := service.NotificationServ().CreateNotification(
		ctx,
		cid,
		req.Content,
		req.Title,
		req.File,
	)
	if err != nil {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusBadRequest, err.Error())
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp.Base = response
	resp.Nid = *nid
	c.JSON(consts.StatusOK, resp)
}

// BrowseNotification .
// @router /notification/browse [GET]
func BrowseNotification(ctx context.Context, c *app.RequestContext) {
	var err error
	var req notification.BrowseNotificationReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(notification.BrowseNotificationResp)

	Uid, exists := c.Get("uid")
	if !exists {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusUnauthorized, errors.New("未获取到用户信息").Error())
		c.JSON(consts.StatusOK, resp)
		return
	}
	uid := Uid.(int64)

	nid, err := strconv.ParseInt(req.Nid, 10, 64)
	if err != nil {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusBadRequest, err.Error())
		c.JSON(consts.StatusOK, resp)
		return
	}

	browseNotificationResp, err := service.NotificationServ().BrowseNotification(ctx, uid, nid)
	if err != nil {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusBadRequest, err.Error())
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp = browseNotificationResp

	c.JSON(consts.StatusOK, resp)
}

// FavNotification .
// @router /notification/like [POST]
func FavNotification(ctx context.Context, c *app.RequestContext) {
	var err error
	var req notification.FavNotificationReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}
	resp := new(notification.FavNotificationResp)
	Uid, exists := c.Get("uid")
	if !exists {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusUnauthorized, errors.New("未获取到用户信息").Error())
		c.JSON(consts.StatusOK, resp)
		return
	}
	uid := Uid.(int64)
	nid, err := strconv.ParseInt(req.Nid, 10, 64)
	if err != nil {
		resp.Base = &base.BaseResponse{
			Code: http.StatusBadRequest,
			Msg:  "转换通知id失败" + err.Error(),
		}
	}
	favNotificationResp, err := service.NotificationServ().FavNotification(nid, uid, ctx)
	if err != nil {
		resp.Base = &base.BaseResponse{
			Code: 400,
			Msg:  "点赞失败:" + err.Error(),
		}
	} else {
		resp = favNotificationResp
	}
	c.JSON(consts.StatusOK, resp)
}
