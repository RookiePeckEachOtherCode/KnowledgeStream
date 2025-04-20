import {BaseResponse, Notification} from "../static/base-resp";

export type NotifyServiceResponse = {
    COURSE_NOTIFY: {
        base: BaseResponse;
        notifications: Array<Notification>;
    }
    NOTIFY_INFO: {
        base: BaseResponse;
        notification: Notification
    }
    NOTIFY_ACTION: {
        base: BaseResponse;
    }
    CREATE_NOTIFY: {
        base: BaseResponse;
        nid: string
    }
}

export interface NotifyType {
    id: string
    cid: string
    title: string;
    content: string;
    file: string;
    favorite: number;
    read: boolean
    time: string;
    faved: boolean;
}