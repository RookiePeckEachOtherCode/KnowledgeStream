import {BaseResponse, CourseInfo, UserInfo} from "../static/base-resp";

export type UserServiceResponse = {
    LOGIN: {
        base: BaseResponse;
        id: string;
        name: string;
        token: string;
        authority: string
    };
    REGISTER: {
        base: BaseResponse;
    };
    USER_INFO: {
        base: BaseResponse;
        userinfo: UserInfo
    };
    UPDATE_INFO: {
        base: BaseResponse
    }
    SEARCH_STUDENT: {
        base: BaseResponse,
        students: Array<UserInfo>
    }
    UID_INFO: {
        base: BaseResponse;
        userinfo: UserInfo
    }
};

export type  StudentServiceResponse = {
    MY_COURSE: {
        base: BaseResponse,
        coursesinfo: Array<CourseInfo>
    };
}

export type TeacherServiceResponse = {
    SEARCH_STUDENT: {
        base: BaseResponse,
        usersinfo: Array<UserInfo>
    }
    MY_COURSE: {
        base: BaseResponse,
        coursesinfo: Array<CourseInfo>
    }
    INVITE_STUDENT: {
        base: BaseResponse
    }
    UPLOAD_VIDEO: {
        base: BaseResponse,
        newid: string
    }
    CREATE_COURSE: {
        base: BaseResponse
    }
    DELETE_COURSE: {
        base: BaseResponse
    }
    UPDATE_COURSE: {
        base: BaseResponse
    }
    HANDLE_COURSE_MEMBER: {
        base: BaseResponse
    }
    DELETE_VIDEO: {
        base: BaseResponse
    }

}
