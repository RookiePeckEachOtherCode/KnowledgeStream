namespace go base


struct BaseResponse {
     1: i32 code;
     2: string msg;
}
struct StudentInfo{
    1:string name;
    2:string phone;
}
struct UserInfo{
    1:string uid;
    2:string avatar;
    3:string name;
    4:string authority;
}
struct CourseInfo{
    1:string cid;
    2:string title;
    3:string description;
    4:string cover;
}
struct VideoInfo{
    1:string vid;
    2:string title;
    3:string description;
    4:string cover;
    5:string source;
}