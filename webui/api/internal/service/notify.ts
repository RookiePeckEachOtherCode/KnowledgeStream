
import {Executor} from "@/api/internal/executor";
import { NotifyServiceResponse } from "../model/response/notify";


export class NotifyService{
    constructor(private  executor:Executor) {}

    async courseNotifyList(
        req: { cid: string }
    ):Promise<NotifyServiceResponse['COURSE_NOTIFY']>{
        return this.executor({
            uri: "/notification/course",
            method: "GET",
            body: null,
            query: req,
        }) as Promise<NotifyServiceResponse['COURSE_NOTIFY']>;
    }

    async notifyInfo(
        req: {id:string}
    ):Promise<NotifyServiceResponse['NOTIFY_INFO']>{
        return this.executor({
            uri: "/notification/browse",
            method: "GET",
            body:null,
            query: req,
        }) as Promise<NotifyServiceResponse['NOTIFY_INFO']>;
    }
    async action(
        req: {id:string}
    ):Promise<NotifyServiceResponse['NOTIFY_ACTION']>{
        return this.executor({
            uri: "/notification/action",
            method: "POST",
            body: null,
            query: req,
        }) as Promise<NotifyServiceResponse['NOTIFY_ACTION']>;
    }
}
