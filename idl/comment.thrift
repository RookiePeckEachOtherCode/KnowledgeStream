namespace go comment

include "./base/common.thrift"

struct MakeCommentReq{
    1:string parent;
    2:string name;
    3:string avatar;
    4:string content;

}

struct MakeCommentResp{
    1:common.BaseResponse base;
}

struct QueryCommentUnderVideoReq{
    1: string vid;
}

struct QueryCommentUnderVideoResp{
    1:common.BaseResponse base;
    2:list<common.CommentInfo> comments;
}

struct QueryCommentUnderNotificationReq{
    1:string nid;
}

struct QueryCommentUnderNotificationResp{
    1:common.BaseResponse base;
    2:list<common.CommentInfo> comments;
}

struct QueryChildrenCommentReq{
    1:string parent;
    2:i64   size;
}

struct QueryChildrenCommentResp{
    1:common.BaseResponse base;
    2:list<common.CommentInfo> comments;
}

struct ReplyCommentReq{
    1:string avatar;
    2:string name;
    3:string parent;
    4:string content;
}

struct ReplyCommentResp{
    1:common.BaseResponse base;
}

service CommentService{
    MakeCommentResp MakeComment(1:MakeCommentReq req)(api.post="/comment/create");
    QueryCommentUnderVideoResp QueryCommentUnderVideo(1:QueryCommentUnderVideoReq req)(api.get="/comment/video");
    QueryCommentUnderNotificationResp QueryCommentUnderNotification(1:QueryCommentUnderNotificationReq req)(api.get="/comment/notification");
    QueryChildrenCommentResp QueryChildrenComment(1:QueryChildrenCommentReq req)(api.get="/comment/children");
    ReplyCommentResp ReplyComment(1:ReplyCommentReq req)(api.post="/comment/reply");
}