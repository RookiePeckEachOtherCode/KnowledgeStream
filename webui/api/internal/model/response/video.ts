import {BaseResponse, CourseInfo, UserInfo, VideoInfo} from "../static/base-resp";

export type VideoServiceResponse={
    VIDEO_INFO:{
        base:BaseResponse,
        videoinfo:VideoInfo
    }
    
}