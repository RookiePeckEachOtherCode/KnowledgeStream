import type { Executor } from "./executor";
import {StudentService, TeacherService, UserService} from "./service/user";

export class Api {
  readonly userService: UserService;
  readonly studentService:StudentService
  readonly teacherService:TeacherService
  constructor(executor: Executor) {
    this.userService = new UserService(executor);
    this.studentService=new StudentService(executor)
    this.teacherService=new TeacherService(executor)
  }
}
