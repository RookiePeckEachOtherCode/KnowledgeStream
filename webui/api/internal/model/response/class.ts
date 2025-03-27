import {BaseResponse} from "@/api/internal/model/static/base-resp";

export type ClassServiceResponse={
    ADD_CLASS:{
        base:BaseResponse
    }
    QUERY_CLASS:{
        base:BaseResponse;
        classes:Array<string>
        
    }
    
}