import {Executor} from "@/api/internal/executor";
import {CommentServiceRequest} from "@/api/internal/model/request/comment";
import {CommentServiceResponse} from "@/api/internal/model/response/comment";


export class CommentService{
    constructor(private  executor:Executor) {}
    
    async add(
        req:CommentServiceRequest["CREATE_COMMENT"]
    ):Promise<CommentServiceResponse["CREATE_COMMENT"]>{
        return  this.executor({
            uri:"/comment/create",
            method:"POST",
            body:req
        })as Promise<CommentServiceResponse["CREATE_COMMENT"]>
        
    }

    async under_video(
        req:CommentServiceRequest["COMMENT_UNDER_VIDEO"]
    ):Promise<CommentServiceResponse["COMMENT_UNDER_VIDEO"]>{
        return  this.executor({
            uri:"/comment/video",
            method:"GET",
            body:null,
            query:req
        })as Promise<CommentServiceResponse["COMMENT_UNDER_VIDEO"]>

    }

    async under_notification(
        req:CommentServiceRequest["COMMENT_UNDER_NOTIFICATION"]
    ):Promise<CommentServiceResponse["COMMENT_UNDER_NOTIFICATION"]>{
        return  this.executor({
            uri:"/comment/notification",
            method:"GET",
            body:null,
            query:req
        })as Promise<CommentServiceResponse["COMMENT_UNDER_NOTIFICATION"]>

    }

    async under_comment(
        req:CommentServiceRequest["COMMENT_UNDER_NOTIFICATION"]
    ):Promise<CommentServiceResponse["COMMENT_UNDER_NOTIFICATION"]>{
        return  this.executor({
            uri:"/comment/children",
            method:"GET",
            body:null,
            query:req
        })as Promise<CommentServiceResponse["COMMENT_UNDER_NOTIFICATION"]>

    }

    async reply(
        req:CommentServiceRequest["COMMENT_REPLY"]
    ):Promise<CommentServiceResponse["COMMENT_REPLY"]>{
        return  this.executor({
            uri:"/comment/reply",
            method:"POST",
            body:req
        })as Promise<CommentServiceResponse["COMMENT_REPLY"]>

    }
    
    
}