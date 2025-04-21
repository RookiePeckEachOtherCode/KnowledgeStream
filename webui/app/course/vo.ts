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
  const courseInfo = await api.courseService.info({ cid });
  const techerInfo = await api.userService.uidInfo({
    uid: courseInfo.courseinfo.ascription,
  });
  const courseCapt = await api.courseService.videos({ cid });
  const capts = courseCapt.videosinfo.map((item) => {
    return {
      id: item.vid,
      section_number: item.chapter,
      section_name: item.title,
      video_id: item.vid,
      video_url: item.source,
    };
  });

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
      list: capts ?? [],
    },
  };
}
