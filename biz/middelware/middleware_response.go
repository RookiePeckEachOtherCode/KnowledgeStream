package middleware

import "github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/user"

type MiddleWareResponse struct {
	Base user.BaseResponse `json:"base"`
	Data any               `json:"data"`
}
