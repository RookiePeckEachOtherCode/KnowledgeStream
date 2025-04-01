import {BaseResponse, CourseInfo, UserInfo, VideoInfo} from "@/api/internal/model/static/base-resp";


export type CourseServiceResponse={
    COURSE_INFO:{
        base:BaseResponse;
        courseinfo:CourseInfo;
        membersinfo:Array<UserInfo>
    };
    COURSE_VIDEOS:{
        base:BaseResponse;
        videosinfo:Array<VideoInfo>
    }
    
}