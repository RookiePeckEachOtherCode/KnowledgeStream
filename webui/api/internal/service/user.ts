// UserService.ts
import { Executor } from "../executor";
import { UserServiceRequest } from "../model/request/user";
import { UserServiceResponse } from "../model/response/user";
import { StudentServiceRequest } from "../model/request/user";
import { StudentServiceResponse } from "../model/response/user";
import { TeacherServiceRequest } from "../model/request/user.ts";
import { TeacherServiceResponse } from "../model/response/user.ts";

export class UserService {
  constructor(private executor: Executor) {}

  async login(
      req: UserServiceRequest["LOGIN"]
  ): Promise<UserServiceResponse["LOGIN"]> {
    return this.executor({
      uri: "/user/login",
      method: "POST",
      body: req,
    }) as Promise<UserServiceResponse["LOGIN"]>;
  }

  async register(
      req: UserServiceRequest["REGISTER"]
  ): Promise<UserServiceResponse["REGISTER"]> {
    return this.executor({
      uri: "/user/register",
      method: "POST",
      body: req,
    }) as Promise<UserServiceResponse["REGISTER"]>;
  }

  async queryInfo(
      req: UserServiceRequest["USER_INFO"]
  ): Promise<UserServiceResponse["USER_INFO"]> {
    return this.executor({
      uri: "/user/info",
      method: "GET",
      body: null,
      query:req
    }) as Promise<UserServiceResponse["USER_INFO"]>;
  }

  async updateInfo(
      req: UserServiceRequest["UPDATE_INFO"]
  ): Promise<UserServiceResponse["UPDATE_INFO"]> {
    return this.executor({
      uri: "/user/update",
      method: "POST",
      body: req,
    }) as Promise<UserServiceResponse["UPDATE_INFO"]>;
  }

  async searchStudent(
      req: UserServiceRequest["SEARCH_STUDENT"]
  ): Promise<UserServiceResponse["SEARCH_STUDENT"]> {
    return this.executor({
      uri: "/teacher/query/student",
      method: "GET",
      body: null,
      query:req
    }) as Promise<UserServiceResponse["SEARCH_STUDENT"]>;
  }
}



export class StudentService {
  constructor(private executor: Executor) {}

  async myCourse(
      req: StudentServiceRequest["MY_COURSE"]
  ): Promise<StudentServiceResponse["MY_COURSE"]> {
    return this.executor({
      uri: "/user/student/mycourse",
      method: "GET",
      body: null,
      query:req
    }) as Promise<StudentServiceResponse["MY_COURSE"]>;
  }
}



export class TeacherService {
  constructor(private executor: Executor) {}

  async myCourse(
      req: TeacherServiceRequest["MY_COURSE"]
  ): Promise<TeacherServiceResponse["MY_COURSE"]> {
    return this.executor({
      uri: "/user/teacher/mycourse",
      method: "GET",
      body: null,
      query:req
    }) as Promise<TeacherServiceResponse["MY_COURSE"]>;
  }

  async inviteStudent(
      req: TeacherServiceRequest["INVITE_STUDENT"]
  ): Promise<TeacherServiceResponse["INVITE_STUDENT"]> {
    return this.executor({
      uri: "/user/teacher/invite",
      method: "POST",
      body: req,
    }) as Promise<TeacherServiceResponse["INVITE_STUDENT"]>;
  }

  async uploadVideo(
      req: TeacherServiceRequest["UPLOAD_VIDEO"]
  ): Promise<TeacherServiceResponse["UPLOAD_VIDEO"]> {
    return this.executor({
      uri: "/user/teacher/uploadvideo",
      method: "POST",
      body: req,
    }) as Promise<TeacherServiceResponse["UPLOAD_VIDEO"]>;
  }

  async createCourse(
      req: TeacherServiceRequest["CREATE_COURSE"]
  ): Promise<TeacherServiceResponse["CREATE_COURSE"]> {
    return this.executor({
      uri: "/user/teacher/createcourse",
      method: "POST",
      body: req,
    }) as Promise<TeacherServiceResponse["CREATE_COURSE"]>;
  }

  async deleteCourse(
      req: TeacherServiceRequest["DELETE_COURSE"]
  ): Promise<TeacherServiceResponse["DELETE_COURSE"]> {
    return this.executor({
      uri: "/user/teacher/deletecourse",
      method: "POST",
      body: req,
    }) as Promise<TeacherServiceResponse["DELETE_COURSE"]>;
  }

  async updateCourse(
      req: TeacherServiceRequest["UPDATE_COURSE"]
  ): Promise<TeacherServiceResponse["UPDATE_COURSE"]> {
    return this.executor({
      uri: "/user/teacher/update/course",
      method: "POST",
      body: req,
    }) as Promise<TeacherServiceResponse["UPDATE_COURSE"]>;
  }

  async handleCourseMember(
      req: TeacherServiceRequest["HANDLE_COURSE_MEMBER"]
  ): Promise<TeacherServiceResponse["HANDLE_COURSE_MEMBER"]> {
    return this.executor({
      uri: "/user/teacher/update/course/member",
      method: "POST",
      body: req,
    }) as Promise<TeacherServiceResponse["HANDLE_COURSE_MEMBER"]>;
  }

  async deleteVideo(
      req: TeacherServiceRequest["DELETE_VIDEO"]
  ): Promise<TeacherServiceResponse["DELETE_VIDEO"]> {
    return this.executor({
      uri: "/user/teacher/deletevideo",
      method: "POST",
      body: req,
    }) as Promise<TeacherServiceResponse["DELETE_VIDEO"]>;
  }
}