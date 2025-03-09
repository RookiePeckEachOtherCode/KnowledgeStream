namespace go user


struct BaseResponse {
     1: i32 code;
     2: string msg;
 }

//------------------------------------------Common

struct userRegisterReq{
    1:string name(api.query="name")
    2:string password(api.query="password")
    3:string phone(api.query="phone")

}
struct userRegisterResp{
    1:BaseResponse base;
}

struct userLoginReq{
    1:string name(api.query="name");
    2:string password(api.query="password");
    3:string phone(api.query="phone");
}

struct userLoginResp{
    1:BaseResponse base;
    2:string id;
    3:string token;
}
struct userInfoReq{

}
struct userInfoResp{
    1:BaseResponse base;
    2:string name;
    3:string avatar;
    4:string authoriry;
    5:string phone;
}
struct userInfoUpdateReq{
    1:string name(api.query="name");
    2:string password(api.query="password");
    3:string avatar(api.query="avatar");
    4:string phone(api.query="phone");
}
struct userInfoUpdateResp{
    1:BaseResponse base;
}
//------------------------------------------Student


//------------------------------------------Techer


service UserSerivce{
    userLoginResp UserLogin(1:userLoginReq req)(api.get="/user/login");
    userRegisterResp UserRegister(1:userRegisterReq req)(api.post="/user/register")
    userInfoResp UserInfo(1:userInfoReq req)(api.get="/user/info")
    userInfoUpdateResp UserInfoUpdate(1:userInfoUpdateReq req)(api.get="/user/update")
}
