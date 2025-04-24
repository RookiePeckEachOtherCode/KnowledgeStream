namespace go admin

include "./base/common.thrift"

struct ImportStudentsReq{
        1:string name;
        2:string phone;
        3:string major;
        4:string faculty;
        5:string class;
        6:string grade;
}
struct ImportStudentsResp{
    1:common.BaseResponse base;
}
struct DeleteTargetReq{
    1:string target;
    2:string tid;
}
struct DeleteTargetResp{
    1:common.BaseResponse base;
}
struct UpdateUserInfoReq{
    1:string uid;
    2:string name;
    3:string phone;
    4:string avatar;
    5:string authority;
    6:string grade;
    7:string faculty;
    8:string major;
    9:string password;
    10:string signature;
    11:string class;
}
struct UpdateUserInfoResp{
    1:common.BaseResponse base;
}
struct UploadVideoReq{
    1:string source;
    2:string title;
    3:string description;
    4:string cover;
    5:string cid;
    6:string length;
    7:string chapter;
}
struct UploadVideoResp{
    1:common.BaseResponse base;
    2:string newid
}
struct CreateCourseReq{
    1:string title;
    2:string description;
    3:string public;
    4:string cover;
    5:string begin_time;
    6:string end_time;
    7:string major;
    8:string faculty;
    9:string class;
}
struct CreateCourseResp{
    1:common.BaseResponse base;
}
struct DeleteUserFromCourseReq{
    1:string cid;
    2:string uid;
}
struct DeleteUserFromCourseResp{
    1:common.BaseResponse base;
}
struct UpdateCourseInfoReq{
    1:string cid;
    2:string cover;
    3:string title;
    4:string description;
    5:string begin_time;
    6:string end_time;
    7:string ascription;
    8:string major;
    9:string faculty;
    10:string class;
}
struct UpdateCourseInfoResp{
    1:common.BaseResponse base;
}
struct EnquiryCourseReq{
    1:string keyword;
    2:i32 offset;
    3:i32 size;
    4:string major;
    5:string faculty;
    6:string begin_time;
    7:string end_time;
}
struct EnquiryCourseResp{
    1:common.BaseResponse base;
    2:list<common.CourseInfo> courses
}
struct EnquiryVideoReq{
    1:string keyword;
    2:i32 offset;
    3:i32 size;
    4:string major;
}
struct EnquiryVideoResp{
    1:common.BaseResponse base;
    2:list<common.VideoInfo> videos
}
struct EnquiryUserReq{
    1:string keyword;
    2:i32 offset;
    3:i32 size;
    4:string faculty;
    5:string major;
    6:string authority;
}
struct EnquiryUserResp{
    1:common.BaseResponse base;
    2:list<common.UserInfo> users
}
service AdminService{
    ImportStudentsResp ImportStudents(1:ImportStudentsReq req)(api.post="/admin/import");
    DeleteTargetResp DeleteTarget(1:DeleteTargetReq req)(api.post="/admin/delete");
    UpdateUserInfoResp UpdateUserInfo(1:UpdateUserInfoReq req)(api.post="/admin/update/user");
    UploadVideoResp UploadVideo(1:UploadVideoReq req)(api.post="/admin/uploadvideo");
    CreateCourseResp CreateCourse(1:CreateCourseReq req)(api.post="/admin/createcourse");
    DeleteUserFromCourseResp DeleteUserFromCourse(1:DeleteUserFromCourseReq req)(api.post="/admin/update/course/member");
    UpdateCourseInfoResp UpdateCourseInfo(1:UpdateCourseInfoReq req)(api.post="/admin/update/course");
    EnquiryCourseResp EnquirytCourse(1:EnquiryCourseReq req)(api.get="/admin/query/course");
    EnquiryVideoResp EnquiryVideo(1:EnquiryVideoReq req)(api.get="/admin/query/video");
    EnquiryUserResp EnquiryUser(1:EnquiryUserReq req)(api.get="/admin/query/user");
}