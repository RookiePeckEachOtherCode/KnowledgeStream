import {BaseResponse} from "@/api/internal/model/static/base-resp";


export type CommentServiceResponse={
    CREATE_COMMENT:{
        base:BaseResponse
    },
    COMMENT_UNDER_VIDEO:{
        base:BaseResponse,
        comments:Array<Comment>
    }
    COMMENT_UNDER_NOTIFICATION:{
        base:BaseResponse,
        comments:Array<Comment>
    }
    COMMENT_UNDER_COMMENT:{
        base:BaseResponse,
        comments:Array<Comment>
    }
    COMMENT_REPLY:{
        base:BaseResponse
    }
    
}