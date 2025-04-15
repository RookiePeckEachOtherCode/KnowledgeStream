export  type AdminServiceRequest = {
    OBJECT_DELETE: {
        tid: string,
        target: string
    }
    UPDATE_USER: {
        authority?: string;
        avatar?: string;
        faculty?: string;
        grade?: string;
        major?: string;
        name?: string;
        password?: string;
        phone?: string;
        signature?: string;
        class?: string;
        uid?: string;
    }
    HANDLE_COURSE_MEMBER: {
        cid: string,
        uid: string,
        delete: boolean

    }
    UPDATE_COURSE: {
        ascription?: string;
        cid?: string;
        cover?: string;
        description?: string;
        id?: string;
        title?: string;
        faculty?: string;
        major?: string;
        begin_time?: string,
        end_time?: string
    }
    QUERY_COURSE: {
        keyword?: string;
        major?: string;
        offset?: number;
        size?: number;
        begin_time?: string;
        end_time?: string;
        faculty?: string;
    }
    QUERY_USER: {
        authority?: string;
        faculty?: string;
        keyword?: string;
        major?: string;
        offset?: number;
        size?: number;

    }
    QUERY_VIDEO: {
        keyword?: string;
        major?: string;
        offset?: number;
        size?: number;
    }

} 