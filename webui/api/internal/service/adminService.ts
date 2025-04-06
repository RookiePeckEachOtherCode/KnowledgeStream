import {Executor} from "@/api/internal/executor";
import {AdminServiceRequest} from "@/api/internal/model/request/admin";
import {AdminServiceResponse} from "@/api/internal/model/response/admin"; // 假设存在对应的Response类型

export class AdminService {
    constructor(private executor: Executor) {
    }

    async objectDelete(
        req: AdminServiceRequest["OBJECT_DELETE"]
    ): Promise<AdminServiceResponse["OBJECT_DELETE"]> {
        return this.executor({
            uri: "/admin/delete", // 请填写实际URL（如：/admin/object/${tid}?target=xxx）
            method: "POST",     // 或根据需求调整为其他方法（如POST+body）
            body: req,           // DELETE通常用query或路径参数，若需body则改为req
        }) as Promise<AdminServiceResponse["OBJECT_DELETE"]>;
    }

    // 更新用户信息
    async updateUser(
        req: AdminServiceRequest["UPDATE_USER"]
    ): Promise<AdminServiceResponse["UPDATE_USER"]> {
        return this.executor({
            uri: "/admin/update/user",
            method: "POST",
            body: req,            // 更新操作通常用body传参
        }) as Promise<AdminServiceResponse["UPDATE_USER"]>;
    }

    // 管理课程成员（添加/删除）
    async handleCourseMember(
        req: AdminServiceRequest["HANDLE_COURSE_MEMBER"]
    ): Promise<AdminServiceResponse["HANDLE_COURSE_MEMBER"]> {
        return this.executor({
            uri: "/admin/update/course/member", // 如：/admin/course/${cid}/member
            method: "POST",             // 或DELETE（根据业务逻辑）
            body: req,                  // 包含cid、uid和delete布尔值
        }) as Promise<AdminServiceResponse["HANDLE_COURSE_MEMBER"]>;
    }

    // 更新课程信息
    async updateCourse(
        req: AdminServiceRequest["UPDATE_COURSE"]
    ): Promise<AdminServiceResponse["UPDATE_COURSE"]> {
        return this.executor({
            uri: "/admin/update/course", // 如：/admin/course/${cid}
            method: "POST",        // 或PATCH
            body: req,            // 修改内容通过body传递
        }) as Promise<AdminServiceResponse["UPDATE_COURSE"]>;
    }

    // 查询课程列表（分页+过滤）
    async queryCourse(
        req: AdminServiceRequest["QUERY_COURSE"]
    ): Promise<AdminServiceResponse["QUERY_COURSE"]> {
        return this.executor({
            uri: "/admin/query/course", // 如：/admin/course
            method: "GET",
            body: null,
            query: req                 // GET请求用query传分页和过滤参数
        }) as Promise<AdminServiceResponse["QUERY_COURSE"]>;
    }

    // 查询用户列表（分页+过滤）
    async queryUser(
        req: AdminServiceRequest["QUERY_USER"]
    ): Promise<AdminServiceResponse["QUERY_USER"]> {
        return this.executor({
            uri: "/admin/query/user",
            method: "GET",
            body: null,
            query: req
        }) as Promise<AdminServiceResponse["QUERY_USER"]>;
    }

    // 查询视频列表（分页+过滤）
    async queryVideo(
        req: AdminServiceRequest["QUERY_VIDEO"]
    ): Promise<AdminServiceResponse["QUERY_VIDEO"]> {
        return this.executor({
            uri: "/admin/video",
            method: "GET",
            body: null,
            query: req
        }) as Promise<AdminServiceResponse["QUERY_VIDEO"]>;
    }
}