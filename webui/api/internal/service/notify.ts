import {Executor} from "@/api/internal/executor";
import {NotifyServiceResponse} from "../model/response/notify";


export class NotifyService {
    constructor(private executor: Executor) {
    }

    async courseNotifyList(
        req: { cid: string }
    ): Promise<NotifyServiceResponse['COURSE_NOTIFY']> {
        return this.executor({
            uri: "/notification/course",
            method: "GET",
            body: null,
            query: req,
        }) as Promise<NotifyServiceResponse['COURSE_NOTIFY']>;
    }

    async notifyInfo(
        req: { nid: string }
    ): Promise<NotifyServiceResponse['NOTIFY_INFO']> {
        return this.executor({
            uri: "/notification/browse",
            method: "GET",
            body: null,
            query: req,
        }) as Promise<NotifyServiceResponse['NOTIFY_INFO']>;
    }

    async like(
        req: { nid: string }
    ): Promise<NotifyServiceResponse['NOTIFY_ACTION']> {
        return this.executor({
            uri: "/notification/like",
            method: "POST",
            body: req,
        }) as Promise<NotifyServiceResponse['NOTIFY_ACTION']>;
    }

    async all(): Promise<NotifyServiceResponse['COURSE_NOTIFY']> {
        return this.executor({
            uri: "/notification",
            method: "GET",
            body: null,
        }) as Promise<NotifyServiceResponse['COURSE_NOTIFY']>;
    }

    async create(req: {
        cid: string,
        content: string,
        file: boolean,
        title: string
    }): Promise<NotifyServiceResponse[`CREATE_NOTIFY`]> {
        return this.executor({
            uri: "/notification/create",
            method: "POST",
            body: req
        }) as Promise<NotifyServiceResponse[`CREATE_NOTIFY`]>

    }
}
