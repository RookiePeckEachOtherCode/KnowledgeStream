
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
}
