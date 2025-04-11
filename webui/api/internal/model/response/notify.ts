import { BaseResponse } from "../static/base-resp";

export type NotifyServiceResponse={
    COURSE_NOTIFY:{
        base: BaseResponse;
        notifacitons: Array<CourseNotifyType> 
    }
}

export interface CourseNotifyType{
    id:string
    cid:string
    title: string;
    content: string;
    file: string;
    favorite: number;
    read: boolean
    time: string;
}