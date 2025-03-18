namespace go admin

include "./base/common.thrift"

struct ImportStudentsReq{
    1:list<common.StudentInfo> students;
}
struct ImportStudentsResp{
    1:common.BaseResponse base;
}
struct DeleteTargetReq{
    1:string target(api.query="target");
    2:string tid(api.query="tid");
}
struct DeleteTargetResp{
    1:common.BaseResponse base;
}
struct UpdateUserInfoReq{
    1:string uid(api.query="uid");
    2:string name(api.query="name");
    3:string phone(api.query="phone");
    4:string avatar(api.query="avatar");
    5:string authority(api.query="authority");
    6:string password(api.query="password");
}
struct UpdateUserInfoResp{
    1:common.BaseResponse base;
}
struct UploadVideoReq{
    1:string source(api.query="source");
    2:string title(api.query="title");
    3:string description(api.query="description");
    4:string cover(api.query="cover");
    5:string cid(api.query="cid");
    6:string length(api.query="length");
}
struct UploadVideoResp{
    1:common.BaseResponse base;
}
struct CreateCourseReq{
    1:string title(api.query="title");
    2:string description(api.query="description");
    3:string cover(api.query="cover");
    4:string ascription(api.query="ascription");
}
struct CreateCourseResp{
    1:common.BaseResponse base;
}
struct DeleteUserFromCourseReq{
    1:string cid(api.query="cid");
    2:string uid(api.query="uid");
}
struct DeleteUserFromCourseResp{
    1:common.BaseResponse base;
}
struct UpdateCourseInfoReq{
    1:string cid(api.query="cid");
    2:string cover(api.query="cover");
    3:string title(api.query="title");
    4:string description(api.query="description");
    5:string ascription(api.query="ascription");
}
struct UpdateCourseInfoResp{
    1:common.BaseResponse base;
}
struct EnquiryCourseReq{
    1:string keyword(api.query="keyword");
    2:i32 offset(api.query="offset");
    3:i32 size(api.query="size");
}
struct EnquiryCourseResp{
    1:common.BaseResponse base;
    2:list<common.CourseInfo> coursesinfo
}
struct EnquiryVideoReq{
    1:string keyword(api.query="keyword");
    2:i32 offset(api.query="offset");
    3:i32 size(api.query="size");
}
struct EnquiryVideoResp{
    1:common.BaseResponse base;
    2:list<common.VideoInfo> videosinfo
}
struct EnquiryUserReq{
    1:string keyword(api.query="keyword");
    2:i32 offset(api.query="offset");
    3:i32 size(api.query="size");
}
struct EnquiryUserResp{
    1:common.BaseResponse base;
    2:list<common.UserInfo> usersinfo
}
service AdminService{
    ImportStudentsResp ImportStudents(1:ImportStudentsReq req)(api.post="/admin/import");
    DeleteTargetResp DeleteTarget(1:DeleteTargetReq req)(api.post="/admin/delete");
    UpdateUserInfoResp UpdateUserInfo(1:UpdateUserInfoReq req)(api.post="/admin/update/user");
    UploadVideoResp UploadVideo(1:UploadVideoReq req)(api.post="/admin/uploadvideo");
    CreateCourseResp CreateCourse(1:CreateCourseReq req)(api.post="/admin/createcourse");
    DeleteUserFromCourseResp DeleteUserFromCourse(1:DeleteUserFromCourseReq req)(api.post="/admin/update/course/member");
    UpdateCourseInfoResp UpdateCourseInfo(1:UpdateCourseInfoReq req)(api.post="/admin/update/course");
    EnquiryCourseResp EnquirytCourse(1:EnquiryCourseReq req)(api.post="/admin/query/course");
    EnquiryVideoResp EnquiryVideo(1:EnquiryVideoReq req)(api.post="/admin/query/video");
    EnquiryUserResp EnquiryUser(1:EnquiryUserReq req)(api.post="/admin/query/user");
}