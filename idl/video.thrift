namespace go video

include "./base/common.thrift"

struct VideoInfoReq{
    1:string vid;
}
struct VideoInfoResp{
    1:common.BaseResponse base;
    2:common.VideoInfo videoinfo
}
service VideoService{
    VideoInfoResp VideoInfo(1:VideoInfoReq req)(api.get="/video/info")
}