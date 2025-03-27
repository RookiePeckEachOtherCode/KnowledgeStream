import {BaseResponse, CourseInfo, UserInfo} from "../static/base-resp";

export type UserServiceResponse = {
  LOGIN: {
    base: BaseResponse;
    id: string;
    name: string;
    token: string;
  };
  REGISTER: {
    base: BaseResponse;
  };
  USER_INFO:{
    base:BaseResponse;
    userinfo:UserInfo    
  };
  UPDATE_INFO:{
    base:BaseResponse
  }
  SEARCH_STUDENT:{
    base:BaseResponse,
    students:Array<UserInfo>
  }
};

export type  StudentServiceResponse={
  MY_COURSE: {
    base:BaseResponse,
    courses:Array<CourseInfo>
  };
}

export type TeacherServiceResponse={
  MY_COURSE:{
    base:BaseResponse,
    coursesinfo:Array<CourseInfo>
  }
  INVITE_STUDENT:{
    base:BaseResponse
  }
  UPLOAD_VIDEO:{
    base:BaseResponse
  }
  CREATE_COURSE: {
    base:BaseResponse
  }
  DELETE_COURSE:{
    base:BaseResponse
  }
  UPDATE_COURSE:{
    base:BaseResponse
  }
  HANDLE_COURSE_MEMBER:{
    base:BaseResponse
  }
  DELETE_VIDEO:{
    base:BaseResponse
  }
  
}
