import type {Executor} from "./executor";
import {StudentService, TeacherService, UserService} from "./service/user";
import {VideoService} from "@/api/internal/service/videoService";
import {CourseService} from "@/api/internal/service/courseService";
import {CommentService} from "@/api/internal/service/commentService";
import {AdminService} from "@/api/internal/service/adminService";
import { NotifyService } from "./service/notify";

export class Api {
    readonly userService: UserService;
    readonly studentService: StudentService
    readonly teacherService: TeacherService
    readonly videoService: VideoService
    readonly courseService: CourseService
    readonly commentService: CommentService
    readonly adminService: AdminService
    readonly notifyService: NotifyService

    constructor(executor: Executor) {
        this.userService = new UserService(executor);
        this.studentService = new StudentService(executor)
        this.teacherService = new TeacherService(executor)
        this.videoService = new VideoService(executor)
        this.courseService = new CourseService(executor)
        this.commentService = new CommentService(executor)
        this.adminService = new AdminService(executor)
        this.notifyService = new NotifyService(executor)
    }
}
