// Code generated by hertz generator.

package comment

import (
	"context"
	"errors"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/base"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/srverror"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/service"
	"net/http"
	"strconv"

	comment "github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/comment"
	"github.com/cloudwego/hertz/pkg/app"
	"github.com/cloudwego/hertz/pkg/protocol/consts"
)

// MakeComment .
// @router /comment/create [POST]
func MakeComment(ctx context.Context, c *app.RequestContext) {
	var err error
	var req comment.MakeCommentReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(comment.MakeCommentResp)
	Uid, exists := c.Get("uid")
	if !exists {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusUnauthorized, errors.New("未获取到用户信息").Error())
		c.JSON(consts.StatusOK, resp)
		return
	}
	uid := Uid.(int64)

	parent, err := strconv.ParseInt(req.Parent, 10, 64)
	if err != nil {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusBadRequest, errors.New("转换评论父级id失败").Error())
		c.JSON(consts.StatusOK, resp)
		return
	}

	response, err := service.CommentServ().CrateComment(
		ctx,
		req.Name,
		req.Avatar,
		req.Content,
		parent,
		uid,
	)
	if err != nil {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusBadRequest, err.Error())
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp.Base = response

	c.JSON(consts.StatusOK, resp)
}

// QueryCommentUnderVideo .
// @router /comment/video [GET]
func QueryCommentUnderVideo(ctx context.Context, c *app.RequestContext) {
	var err error
	var req comment.QueryCommentUnderVideoReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(comment.QueryCommentUnderVideoResp)
	resp.Base = new(base.BaseResponse)
	parent, err := strconv.ParseInt(req.Vid, 10, 64)
	if err != nil {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusBadRequest, errors.New("转换评论父级id失败").Error())
		c.JSON(consts.StatusOK, resp)
		return
	}

	commentsWithParentId, err := service.CommentServ().QueryCommentsWithParentId(ctx, parent)
	if err != nil {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusBadRequest, err.Error())
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp.Comments = commentsWithParentId
	resp.Base.Msg = "查询成功"
	resp.Base.Code = http.StatusOK

	c.JSON(consts.StatusOK, resp)
}

// QueryCommentUnderNotification .
// @router /comment/notification [GET]
func QueryCommentUnderNotification(ctx context.Context, c *app.RequestContext) {
	var err error
	var req comment.QueryCommentUnderNotificationReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(comment.QueryCommentUnderNotificationResp)
	resp.Base = new(base.BaseResponse)
	parent, err := strconv.ParseInt(req.Nid, 10, 64)
	if err != nil {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusBadRequest, errors.New("转换评论父级id失败").Error())
		c.JSON(consts.StatusOK, resp)
		return
	}

	commentsWithParentId, err := service.CommentServ().QueryCommentsWithParentId(ctx, parent)
	if err != nil {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusBadRequest, err.Error())
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp.Comments = commentsWithParentId
	resp.Base.Msg = "查询成功"
	resp.Base.Code = http.StatusOK

	c.JSON(consts.StatusOK, resp)

}

// QueryChildrenComment .
// @router /comment/children [GET]
func QueryChildrenComment(ctx context.Context, c *app.RequestContext) {
	var err error
	var req comment.QueryChildrenCommentReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(comment.QueryChildrenCommentResp)
	resp.Base = new(base.BaseResponse)
	parent, err := strconv.ParseInt(req.Parent, 10, 64)
	if err != nil {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusBadRequest, errors.New("转换评论父级id失败").Error())
		c.JSON(consts.StatusOK, resp)
		return
	}

	commentsWithParentId, err := service.CommentServ().QueryCommentsWithParentId(ctx, parent, req.Size)
	if err != nil {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusBadRequest, err.Error())
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp.Comments = commentsWithParentId
	resp.Base.Msg = "查询成功"
	resp.Base.Code = http.StatusOK

	c.JSON(consts.StatusOK, resp)
}

// ReplyComment .
// @router /comments/reply [POST]
func ReplyComment(ctx context.Context, c *app.RequestContext) {
	var err error
	var req comment.ReplyCommentReq
	err = c.BindAndValidate(&req)
	if err != nil {
		c.String(consts.StatusBadRequest, err.Error())
		return
	}

	resp := new(comment.ReplyCommentResp)
	Uid, exists := c.Get("uid")
	if !exists {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusUnauthorized, errors.New("未获取到用户信息").Error())
		c.JSON(consts.StatusOK, resp)
		return
	}
	uid := Uid.(int64)

	parent, err := strconv.ParseInt(req.Parent, 10, 64)
	if err != nil {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusBadRequest, errors.New("转换评论父级id失败").Error())
		c.JSON(consts.StatusOK, resp)
		return
	}

	response, err := service.CommentServ().CrateComment(
		ctx,
		req.Name,
		req.Avatar,
		req.Content,
		parent,
		uid,
	)
	if err != nil {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusBadRequest, err.Error())
		c.JSON(consts.StatusOK, resp)
		return
	}
	response, err = service.CommentServ().AddCommentChildren(ctx, parent)
	if err != nil {
		resp.Base = srverror.WrapWithCodeMsg(http.StatusBadRequest, err.Error())
		c.JSON(consts.StatusOK, resp)
		return
	}
	resp.Base = response

	c.JSON(consts.StatusOK, resp)
}
