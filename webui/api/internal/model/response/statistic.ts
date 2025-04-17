import {BaseResponse} from "@/api/internal/model/static/base-resp";
import {StudentFaculty, TeacherFaculty, VideoMajor, VideoPlays} from "@/api/internal/model/static/statistics";

export  type StatisticServiceResponse = {
    FACULTY_STUDENTS: {
        base: BaseResponse,
        datas: Array<StudentFaculty>
    }
    FACULTY_TEACHER: {
        base: BaseResponse,
        datas: Array<TeacherFaculty>
    }
    VIDEO_MAJOR: {
        base: BaseResponse,
        datas: Array<VideoMajor>
    }
    VIDEO_PLAYS: {
        base: BaseResponse,
        datas: Array<VideoPlays>

    }
}