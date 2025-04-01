import {Executor} from "@/api/internal/executor";
import {VideoServiceRequest} from "@/api/internal/model/request/video";
import {VideoServiceResponse} from "@/api/internal/model/response/video";


export class VideoService {
    constructor(private executor: Executor) {}
    
    async videoInfo(
        req:VideoServiceRequest["VIDEO_INFO"]
    ):Promise<VideoServiceResponse["VIDEO_INFO"]>{
        return  this.executor({
          uri:"/video/info",
            method:"GET",
            body:null,
            query:req
        })as Promise<VideoServiceResponse["VIDEO_INFO"]>
        
    }
    

}