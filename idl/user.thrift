namespace go user

include "./base/common.thrift"

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
    5: string authority;
}
struct userInfoReq{

}
struct userInfoResp{
    1:common.BaseResponse base;
    2:common.UserInfo userinfo
}
struct userInfoUpdateReq{
    1:string name;
    3:string avatar;
    4:string phone;
    5:string signature;
}
struct userInfoUpdateResp{
    1:common.BaseResponse base;
}
//------------------------------------------Student
struct StudentMyCoursesReq{
    1:string keyword;
    2:i32 offset;
    3:i32 size;
}
struct StudentMyCoursesResp{
    1:common.BaseResponse base;
    2:list<common.CourseInfo> coursesinfo
}
//------------------------------------------Techer
struct CreateCourseReq{//创建课程域
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
struct DeleteCourseReq{//删除课程域
    1:string cid;
}
struct DeleteCourseResp{
    1:common.BaseResponse base;
}
struct UpdateCourseReq{//修改课程域信息
    1:string cid;
    2:string cover;
    3:string title;
    4:string description;
    5:string begin_time;
    6:string end_time;
}
struct UpdateCourseResp{
    1:common.BaseResponse base;
}
struct InviteStudentReq{//将学生拉入课程域
    1:string cid;
    2:string sid;
}
struct InviteStudentResp{
    1:common.BaseResponse base;
}
struct OperateMemberReq{
    1:string cid;
    2:string uid;
    3:bool   delete;
}
struct OperateMemberResp{
    1:common.BaseResponse base;
}
struct UploadVideosReq{//上传视频
    1:string source;
    2:string title;
    3:string description;
    4:string cover;
    5:string cid;
    6:string length;
    7:string chapter;
}
struct UploadVideosResp{
    1:common.BaseResponse base;
}
struct EnquiryMyCoursesReq{
    1:string keyword;
    2:i32 offset;
    3:i32 size;
}
struct EnquiryMyCoursesResp{
    1:common.BaseResponse base;
    2:list<common.CourseInfo> coursesinfo;
}
struct DeleteVideoReq{
    1:string vid;
}
struct DeleteVideoResp{
    1:common.BaseResponse base;
}
struct EnquiryStudentReq{
    1:string keyword;
    2:i32 offset;
    3:i32 size;
    4:string grade;
    5:string faculty;
    6:string major;
}
struct EnquiryStudentResp{
    1:common.BaseResponse base;
    2:list<common.UserInfo> usersinfo;
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
    EnquiryMyCoursesResp EnquiryMyCourses(1:EnquiryMyCoursesReq req)(api.get="/user/teacher/mycourse")
    DeleteVideoResp DeleteVideo(1:DeleteVideoReq req)(api.post="/user/teacher/deletevideo")
    EnquiryStudentResp EnquiryStudent(1:EnquiryStudentReq req)(api.post="/teacher/query/student")
    //------------------------------------------Student
    StudentMyCoursesResp StudentMyCourses(1:StudentMyCoursesReq req)(api.get="/user/student/mycourse")
}
