namespace go admin

include "./base/common.thrift"
struct DeleteTargetReq{
    1:string target(api.query="target");
    2:string tid(api.query="tid");
}
struct DeleteTargetResp{
    1:common.BaseResponse base;
}
struct UpdateUserInfoReq{
    1:string uid(api.query="uid");
    2:string name(api.query="name");
    3:string phone(api.query="phone");
    4:string avatar(api.query="avatar");
    5:string authority(api.query="authority");
}
struct UpdateUserInfoResp{
    1:common.BaseResponse base;
}
struct UploadVideoReq{
    
}
struct UploadVideoResp{

}
struct CreateCourseReq{

}
struct CreateCourseResp{

}
struct DeleteUserFromCourseReq{

}
struct DeleteUserFromCourseResp{

}
struct UpdateCourseInfoReq{

}
struct UpdateCourseInfoResp{

}
service AdminService{

}