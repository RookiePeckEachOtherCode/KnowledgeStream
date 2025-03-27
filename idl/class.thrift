namespace go class

include "./base/common.thrift"

struct AddClassReq{
    1:string name
}

struct AddClassResp{
    1:common.BaseResponse base
}

struct QueryClassReq{
    1:i32 size
    2:i32 offset
    3:string keyword
}

struct QueryClassResp{
    1:common.BaseResponse base
    2:list<string> classes
}

service ClassService{
    AddClassResp AddClass(1:AddClassReq req)(api.post="/class/add")
    QueryClassResp QueryClass(1: QueryClassReq req)(api.get="/class")

}