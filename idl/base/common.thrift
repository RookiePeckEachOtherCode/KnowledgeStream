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
    5:string signature;
    6:string grade;
    7:string faculty;
    8:string major;
    9:string class;
    10:string phone;
}
struct CourseInfo{
    1:string cid;
    2:string title;
    3:string description;
    4:string cover;
    5:string ascription;
    6:string begin_time;
    7:string end_time;
    8:string major;
    9:string class;
    10:string faculty;
}
struct VideoInfo{
    1:string vid;
    2:string cover;
    3:string chapter;
    4:string title;
    5:string source;
    6:string description;
    7:string length;
    8:string ascription;
    9:string uploader;
    10:string upload_time;
    11:string plays;
}
struct NotificationInfo{
    1:string content;
    2:string file;
    3:string cid;
    4:i32 favorite;
    5:bool read;
    6:string id;
    7:string title;
    8:bool faved;
    9:string time;
}
struct CommentInfo{
    1:string id;
    2:string ascription;
    3:string name;
    4:string content;
    5:string parent;
    6:string avatar;
    7:string time;
    8:i64   children;
}
struct StudentsStatistics{
    1:string faculty;
    2:i64 students;
}
struct TeachersStatistics{
    1:string faculty;
    2:i64 teachers;
}
struct VideosStatistics{
    1:string major;
    2:i64 videos;
}
struct VideosPlaysStatistics{
    1:string video;
    2:i64 plays;
}