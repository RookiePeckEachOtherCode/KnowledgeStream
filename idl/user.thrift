namespace go user

include "./base/common.thrift"


struct BaseResponse {
     1: i32 code;
     2: string msg;
 }

//------------------------------------------Common

struct userRegisterReq{
    1: string name(api.body="name")
    2: string password(api.body="password")
    3: string phone(api.body="phone")
}
struct userRegisterResp{
    1: common.BaseResponse base;
}

struct userLoginReq{
    1: string phone(api.bdoy="phone");
    2: string password(api.body="password");
}

struct userLoginResp{
    1: common.BaseResponse base;
    2: string id;
    3: string name;
    4: string token;
}
struct userInfoReq{

}
struct userInfoResp{
    1:BaseResponse base;
    2:string name;
    3:string avatar;
    4:string authoriry;
    5:string phone;
}
struct userInfoUpdateReq{
    1:string name(api.query="name");
    2:string password(api.query="password");
    3:string avatar(api.query="avatar");
    4:string phone(api.query="phone");
}
struct userInfoUpdateResp{
    1:BaseResponse base;
}
//------------------------------------------Student


//------------------------------------------Techer
struct CreateCourseReq{//创建课程域
    1:string title(api.query="title");
    2:string description(api.query="description");
    3:string cover(api.query="cover");
}
struct CreateCourseResp{
    1:BaseResponse base;
}
struct DeleteCourseReq{//删除课程域
    1:string cid(api.query="cid");
}
struct DeleteCourseResp{
    1:BaseResponse base;
}
struct UpdateCourseReq{//修改课程域信息
    1:string cid(api.query="cid");
    2:string cover(api.query="cover");
    3:string title(api.query="title");
    4:string description(api.query="description");
}
struct UpdateCourseResp{
    1:BaseResponse base;
}
struct InviteStudentReq{//将学生拉入课程域
    1:string cid(api.query="cid");
    2:string sid(api.query="sid");
}
struct InviteStudentResp{
    1:BaseResponse base;
}
struct OperateMemberReq{
    1:string cid(api.query="cid");
    2:string uid(api.query="uid");
    3:bool   delete(api.query="delete");
}
struct OperateMemberResp{
    1:BaseResponse base;
}
struct UploadVideosReq{//上传视频
    1:string source(api.query="source");
    2:string title(api.query="title");
    3:string description(api.query="description");
    4:string cover(api.query="cover");
    5:string cid(api.query="cid");
}
struct UploadVideosResp{
    1:BaseResponse base;
}
struct SelectMyCoursesReq{

}
struct SelectMyCoursesResp{
    1:BaseResponse base;
    2:list<string> Courses;
}
service UserSerivce{
    userLoginResp UserLogin(1:userLoginReq req)(api.post="/user/login");
    userRegisterResp UserRegister(1:userRegisterReq req)(api.post="/user/register")
    userInfoResp UserInfo(1:userInfoReq req)(api.get="/user/info")
    userInfoUpdateResp UserInfoUpdate(1:userInfoUpdateReq req)(api.post="/user/update")
    //------------------------------------------Techer
    CreateCourseResp CreateCourse(1:CreateCourseReq req)(api.post="/user/teacher/createcourse")
    DeleteCourseResp DeleteCourse(1:DeleteCourseReq req)(api.post="/user/teacher/deletecourse")
    UpdateCourseResp UpdateCourse(1:UpdateCourseReq req)(api.post="/user/teacher/update/course")
    InviteStudentResp InviteStudent(1:InviteStudentReq req)(api.post="/user/teacher/invite")
    OperateMemberResp OperateMember(1:OperateMemberReq req)(api.post="/user/teacher/update/course/member")
    UploadVideosResp UploadVideos(1:UploadVideosReq req)(api.post="/user/teacher/uploadvideo")
    SelectMyCoursesResp SelectMyCourses(1:SelectMyCoursesReq req)(api.get="/user/teacher/mycourse")
    //------------------------------------------Student
}
