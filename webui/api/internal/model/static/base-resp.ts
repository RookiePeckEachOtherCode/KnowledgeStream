export interface BaseResponse {
    code: number;
    msg: string;
}

export interface UserInfo {
    uid: string,
    avatar: string,
    name: string,
    authority: string,
    signature: string,
    grade: string,
    faculty: string,
    major: string,
    class: string,
    phone: string

}

export interface VideoInfo {
    ascription: string;
    chapter: string;
    cover: string;
    description: string;
    vid: string;
    length: string;
    source: string;
    title: string;
    upload_time: string;
    uploader: string;
}

export interface CourseInfo {
    ascription: string;
    begin_time: string;
    class: string;
    cover: string;
    description: string;
    end_time: string;
    cid: string;
    major: string;
    title: string;
}

export interface Notification {
    /**
     * 所属课程id
     */
    cid: string;
    content: string;
    /**
     * 点赞
     */
    favorite: number;
    /**
     * 可能的附件
     */
    file: string;
    id: string;
    /**
     * 是否已读
     */
    read: boolean;
}

export interface Comment {
    /**
     * 评论者id
     */
    ascription: string;
    /**
     * 评论者头
     */
    avatar: string;
    /**
     * 评论内容
     */
    content: string;
    id: string;
    /**
     * 评论者名
     */
    name: string;
    /**
     * 上层归属
     */
    parent: string;
    time: string;
    children: number;
}