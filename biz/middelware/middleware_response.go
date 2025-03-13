package middleware

import (
	"github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/base"
)

type MiddleWareResponse struct {
	Base base.BaseResponse `json:"base"`
	Data any               `json:"data"`
}
