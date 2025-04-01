import {Executor} from "@/api/internal/executor";
import {ClassServiceRequest} from "@/api/internal/model/request/class";
import {ClassServiceResponse} from "@/api/internal/model/response/class";
import {CourseServiceRequest} from "@/api/internal/model/request/course";
import {CourseServiceResponse} from "@/api/internal/model/response/course";


export class CourseService{
    constructor(private  executor:Executor) {}

    async info(
        req:CourseServiceRequest["COURSE_INFO"]
    ):Promise<CourseServiceResponse["COURSE_INFO"]>{
        return this.executor({
            uri:"/course/info",
            method:"GET",
            body:null,
            query:req

        })as Promise<CourseServiceResponse["COURSE_INFO"]>

    }

    async videos(
        req:CourseServiceRequest["COURSE_VIDEOS"]
    ):Promise<CourseServiceResponse["COURSE_VIDEOS"]>{
        return this.executor({
            uri:"/course/videos",
            method:"GET",
            body:null,
            query:req

        })as Promise<CourseServiceResponse["COURSE_VIDEOS"]>

    }


}