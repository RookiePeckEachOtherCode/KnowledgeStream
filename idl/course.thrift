namespace go course

include "./base/common.thrift"

struct CourseInfoReq{
    1:string cid;
}
struct CourseInfoResp{
    1:common.BaseResponse base;
    2:common.CourseInfo courseinfo;
    3:list<common.UserInfo> membersinfo;
}
struct CourseVideosInfoReq{
     1:string cid;
}
struct CourseVideosInfoResp{
    1:common.BaseResponse base;
    2:list<common.VideoInfo> videosinfo;
}
service CourseService{
    CourseInfoResp CourseInfo(1:CourseInfoReq req)(api.post="/course/info")
    CourseVideosInfoResp CourseVideosInfo(1:CourseVideosInfoReq req)(api.post="/course/videos")

}