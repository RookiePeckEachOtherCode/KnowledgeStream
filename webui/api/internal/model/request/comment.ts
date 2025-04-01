export type CommentServiceRequest={
    CREATE_COMMENT:{
        parent:string,
        name:string,
        avatar:string,
        content:string
    },
    COMMENT_UNDER_VIDEO:{
        vid:string,
    }
    COMMENT_UNDER_NOTIFICATION:{
        nid:string,
    }
    COMMENT_UNDER_COMMENT:{
        parent:string,
        siz:number
        
    }
    COMMENT_REPLY:{
        avatar:string,
        name:string,
        parent:string,
        content:string
    }
    
}