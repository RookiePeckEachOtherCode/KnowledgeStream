package middleware

import (
	"context"
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/base"
	"net/http"

	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/utils"
	"github.com/cloudwego/hertz/pkg/app"
)

func VerifyToken() app.HandlerFunc {
	return func(c context.Context, ctx *app.RequestContext) {
		token := ctx.Request.Header.Get("Authorization")
		if token == "" {
			ctx.JSON(http.StatusUnauthorized, MiddleWareResponse{
				Base: base.BaseResponse{
					Code: http.StatusUnauthorized,
					Msg:  "未找到token",
				},
				Data: nil,
			})
			ctx.Abort()
			return
		}

		uid, authority, err := utils.ParseToken(token)
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, MiddleWareResponse{
				Base: base.BaseResponse{
					Code: http.StatusUnauthorized,
					Msg:  err.Error(),
				},
				Data: nil,
			})
			ctx.Abort()
			return
		}

		ctx.Set("uid", *uid)
		ctx.Set("authority", *authority)
		ctx.Next(c)
	}
}
