namespace go statistics

include "./base/common.thrift"

struct StudentStatisticsReq{
    1:i32 offset;
    2:i32 size;
}
struct StudentStatisticsResp{
    1:common.BaseResponse base;
    2:list<common.StudentsStatistics> statistics;
}
struct TeacherStatisticsReq{
    1:i32 offset;
    2:i32 size;
}
struct TeacherStatisticsResp{
    1:common.BaseResponse base;
    2:list<common.TeachersStatistics> statistics;
}
struct VideoStatisticsReq{
    1:i32 offset;
    2:i32 size;
}
struct VideoStatisticsResp{
    1:common.BaseResponse base;
    2:list<common.VideosStatistics> statistics;
}
struct VideoPlaysStatisticsReq{
    1:i32 offset;
    2:i32 size;
}
struct VideoPlaysStatisticsResp{
    1:common.BaseResponse base;
    2:list<common.VideosPlaysStatistics> statistics;
}
service StatisticsService{
    StudentStatisticsResp StudentStatistics(1:StudentStatisticsReq req)(api.get="/statistics/faculty-student")
    TeacherStatisticsResp TeacherStatistics(1:TeacherStatisticsReq req)(api.get="/statistics/faculty-teacher")
    VideoStatisticsResp VideoStatistics(1:VideoStatisticsReq req)(api.get="/statistics/video-major")
    VideoPlaysStatisticsResp VideoPlaysStatistics(1:VideoPlaysStatisticsReq req)(api.get="/statistics/video-plays")
}