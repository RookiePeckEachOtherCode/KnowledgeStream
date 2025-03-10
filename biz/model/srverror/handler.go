package srverror

import "github.com/RookiePeckEachOtherCode/KnowledgeStream/biz/model/base"

func WrapWithSuccess() *base.BaseResponse {
	return &base.BaseResponse{
		Code: 200,
		Msg:  "请求成功",
	}
}
func WrapWithCodeMsg(code int32, msg string) *base.BaseResponse {
	return &base.BaseResponse{
		Code: code,
		Msg:  msg,
	}
}
func WrapWithError(code int32, err error) *base.BaseResponse {
	resp := &base.BaseResponse{
		Code: code,
		Msg:  err.Error(),
	}

	switch err.(type) {
	case RuntimeError:
		break
	default:
		resp = WrapWithInternalError()
	}

	return resp
}

func WrapWithInternalError() *base.BaseResponse {
	return &base.BaseResponse{
		Code: 500,
		Msg:  "服务器内部错误，请联系管理员",
	}
}
