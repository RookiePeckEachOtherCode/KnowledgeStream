package utils

import (
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/dal/pg/entity"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/srverror"
	"github.com/cloudwego/hertz/pkg/app"
)

func IDCheck(c *app.RequestContext) (uid int64, err error) {
	_uid, exists := c.Get("uid")
	if !exists {
		err = srverror.NewAuthError("未获取到用户信息")
		return
	}
	uid = _uid.(int64)
	err = nil
	return

}

func AuthCheck(c *app.RequestContext) (uid int64, authority entity.AuthorityEnum, err error) {
	_uid, exists := c.Get("uid")
	if !exists {
		err = srverror.NewAuthError("未获取到用户信息")
		return
	}
	_authority, exists := c.Get("authority")
	if !exists {
		err = srverror.NewAuthError("未获取到完整权限信息")
		return
	}
	uid = _uid.(int64)
	authority = _authority.(entity.AuthorityEnum)
	err = nil
	return
}
