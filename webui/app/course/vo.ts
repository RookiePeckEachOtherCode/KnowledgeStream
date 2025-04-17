import { api } from "@/api/instance";

export interface CourseDataVO {
  id: string;
  name: string;
  techer: {
    id: string;
    name: string;
    avatar: string;
    signatrue: string;
  };
  list: Array<{
    id: string;
    section_number: string;
    section_name: string;
    video_id: string;
    video_url: string;
  }>;
}
export interface CourseSectionVO {
  id: string;
  section_number: string;
  section_name: string;
  video_id: string;
}

export interface CourseInfoRequestVO {
  base: {
    code: number;
    msg: string;
  };
  data: CourseDataVO;
}

export async function fetchCourseData(
  cid: string
): Promise<CourseInfoRequestVO> {
  const courseCapt = await api.courseService.videos({ cid });
  const courseInfo = await api.courseService.info({ cid });

  if (courseCapt.base.code !== 200 || courseInfo.base.code !== 200) {
    const resp = {
      base: {
        code: 0,
        msg: "",
      },
      data: emptyCourseData(),
    };
    if (courseCapt.base.code !== 200) {
      resp.base.code = courseCapt.base.code;
      resp.base.msg = courseCapt.base.msg;
    } else if (courseInfo.base.code !== 200) {
      resp.base.code = courseInfo.base.code;
      resp.base.msg = courseInfo.base.msg;
    }
    return resp;
  }

  const capts = courseCapt.videosinfo.map((item) => {
    return {
      id: item.vid,
      section_number: item.chapter,
      section_name: item.title,
      video_id: item.vid,
      video_url: item.source,
    };
  });
  // .sort((a, b) => {
  //   return a.id < b.id ? -1 : 1;
  // });

  const techerInfo = await api.userService.uidInfo({
    uid: courseInfo.courseinfo.ascription,
  });
  if (techerInfo.base.code !== 200) {
    return {
      base: {
        code: techerInfo.base.code,
        msg: techerInfo.base.msg,
      },
      data: emptyCourseData(),
    };
  }

  return {
    base: {
      code: 200,
      msg: "success",
    },
    data: {
      id: techerInfo.userinfo.uid,
      name: courseInfo.courseinfo.title,
      techer: {
        id: techerInfo.userinfo.uid,
        name: techerInfo.userinfo.name,
        avatar: techerInfo.userinfo.avatar,
        signatrue: techerInfo.userinfo.signature,
      },
      list: capts,
    },
  };
}
function emptyCourseData(): CourseDataVO {
  return {
    id: "",
    name: "",
    techer: {
      id: "",
      name: "",
      avatar: "",
      signatrue: "",
    },
    list: [],
  };
}
