export type UserServiceRequest = {
  LOGIN: {
    phone: string;
    password: string;
  };
  REGISTER: {
    name: string;
    phone: string;
    password: string;
  };
  USER_INFO:{
  };
  UPDATE_INFO:{
    name:string,
    avatar:string,
    phone:string
    signature:string
  };
  SEARCH_STUDENT:{
    grade:string,
    keyword:string,
    faculty:string,
    major:string
    
  }
  
};
export type StudentServiceRequest={
  MY_COURSE:{
   keyword:string,
   offset:string,
   size:string 
  }
}

export type TeacherServiceRequest={
  MY_COURSE:{
    keyword:string,
    offset:string,
    size:string
  }
  INVITE_STUDENT:{
    cid:string,
    sid:string
  }
  UPLOAD_VIDEO:{
    source:string,
    title:string,
    description:string
    cover:string,
    cid:string,
    length:string,
    chapter:string
  }
  CREATE_COURSE:{
    title:string,
    description:string,
    cover:string,
    begin_time:string,
    end_time:string,
    major:string,
    faculty:string,
    class:string
  }
  DELETE_COURSE:{
    cid:string
  }
  UPDATE_COURSE:{
    cid:string,
    cover:string,
    title:string,
    description:string,
    begin_time:string,
    end_time:string
  }
  HANDLE_COURSE_MEMBER:{
    cid:string,
    uid:string,
    delete:boolean
  }
  DELETE_VIDEO:{
    vid:string
  }
  
}
