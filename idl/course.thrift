namespace go course

include "./base/common.thrift"

struct CourseInfoReq{
    1:string cid(api.query="cid");
}
struct CourseInfoResp{
    1:common.BaseResponse base;
    2:common.CourseInfo courseinfo;
}
struct CourseVideosInfoReq{
     1:string cid(api.query="cid");
}
struct CourseVideosInfoResp{
    1:common.BaseResponse base;
    2:list<common.VideoInfo> videosinfo;
}
struct CourseMembersInfoReq{
    1:string cid(api.query="cid");
}
struct CourseMembersInfoResp{
    1:common.BaseResponse base;
    2:list<common.UserInfo> usersinfo;
}
service CourseService{
    CourseInfoResp CourseInfo(1:CourseInfoReq req)(api.post="/course/info")
    CourseVideosInfoResp CourseVideosInfo(1:CourseVideosInfoReq req)(api.post="/course/videos")
    CourseMembersInfoResp CourseMembersInfo(1:CourseMembersInfoReq req)(api.post="/course/members")
}