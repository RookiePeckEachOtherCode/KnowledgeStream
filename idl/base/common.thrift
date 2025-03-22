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
    5:string tid;
    6:string teacher_name;
    7:string begin_time;
    8:string end_time;
}
struct VideoInfo{
    1:string vid;
    2:string title;
    3:string description;
    4:string cover;
    5:string source;
    6:string upload_time
}
struct NotificationInfo{
    1:string content;
    2:string file;
    3:string cid;
    4:i32 favorite;
    5:bool read;
    6:string id;
}
struct CommentInfo{
    1:string id;
    2:string ascription;
    3:string name;
    4:string content;
    5:string parent;
}