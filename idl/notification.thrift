namespace go notification

include "./base/common.thrift"

struct QueryNotificationReq{

}

struct QueryNotificationResp{
    1:common.BaseResponse base;
    2:list<common.NotificationInfo> notifications;
}

struct NotificationUnderCourseReq{
    1:string cid;
}

struct NotificationUnderCourseResp{
    1:common.BaseResponse base;
    2:list<common.NotificationInfo> notifications;
}

struct CreateNotificationReq{
    1:string cid;
    2:string content;
    3:string file;
}

struct  CreateNotificationResp{
    1:common.BaseResponse base;
}

struct BrowseNotificationReq{
    1:string cid;
}

struct BrowseNotificationResp{
    1:common.BaseResponse base;
    2:common.NotificationInfo notification;
}

service NotificationService{
    QueryNotificationResp  QueryNotification(1:QueryNotificationReq req)(api.get="/notification");
    NotificationUnderCourseResp NotificationUnderCourse(1:NotificationUnderCourseReq req)(api.get="/notification/course");
    CreateNotificationResp CreateNotification(1:CreateNotificationReq req)(api.post="/notification/create");
    BrowseNotificationResp BrowseNotification(1:BrowseNotificationReq req)(api.get="/notification/browse")
}
