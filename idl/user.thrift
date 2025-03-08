namespace go user


struct BaseResponse {
     1: i32 code;
     2: string msg;
 }

//------------------------------------------Common

struct userRegisterReq{
    1:string Name(api.query="name")
    2:string Password(api.query="password")
    3:string Phone(api.query="phone")

}
struct userRegisterResp{
    1:BaseResponse Base;
}

struct userLoginReq{
    1:string Name(api.query="name");
    2:string Password(api.query="password");
    3:string Phone(api.query="phone");
}

struct userLoginResp{
    1:BaseResponse Base;
    2:string Id;
    3:string Token;
}

//------------------------------------------Student


//------------------------------------------Techer


service UserSerivce{
    userLoginResp UserLogin(1:userLoginReq req)(api.get="/user/login");
    userRegisterResp UserRegister(1:userRegisterReq req)(api.get="/user/register")
}
