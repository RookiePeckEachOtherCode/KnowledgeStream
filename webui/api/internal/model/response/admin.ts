import {BaseResponse, CourseInfo, UserInfo, VideoInfo} from "@/api/internal/model/static/base-resp";
import {CompleteUserInfo} from "@/app/pageview/admin-page";

export type AdminServiceResponse = {

    OBJECT_DELETE: {
        base: BaseResponse
    }
    UPDATE_USER: {
        base: BaseResponse
    }
    HANDLE_COURSE_MEMBER: {
        base: BaseResponse
    }
    UPDATE_COURSE: {
        base: BaseResponse
    }
    QUERY_COURSE: {
        base: BaseResponse
        courses: Array<CourseInfo>
    }
    QUERY_USER: {
        base: BaseResponse
        users: Array<CompleteUserInfo>
    }
    QUERY_VIDEO: {
        base: BaseResponse
        videos: Array<VideoInfo>
    }
    IMPORT_STUDENT: {
        base: BaseResponse
    }
}