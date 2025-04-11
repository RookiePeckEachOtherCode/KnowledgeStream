import { BaseResponse } from "../static/base-resp";

export type NotifyServiceResponse={
    COURSE_NOTIFY:{
        base: BaseResponse;
        notifacitons: Array<NotifyType> 
    }
    NOTIFY_INFO:{
        base: BaseResponse;
        notification: NotifyType
    }
    NOTIFY_ACTION:{
        base: BaseResponse;
    }
}

export interface NotifyType{
    id:string
    cid:string
    title: string;
    content: string;
    file: string;
    favorite: number;
    read: boolean
    time: string;
    isLike: boolean;
}