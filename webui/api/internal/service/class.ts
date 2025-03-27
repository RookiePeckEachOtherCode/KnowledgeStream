import { Executor } from "../executor";
import {ClassServiceResponse} from "@/api/internal/model/response/class";
import {ClassServiceRequest} from "@/api/internal/model/request/class";

export class ClassService{
    constructor(private  executor:Executor) {}
    
    async add(
        req:ClassServiceRequest["ADD_CLASS"]
    ):Promise<ClassServiceResponse["ADD_CLASS"]>{
        return this.executor({
            uri:"/class/add",
            method:"POST",
            body:req
            
        })as Promise<ClassServiceResponse["ADD_CLASS"]>
        
    }

    async query(
        req:ClassServiceRequest["QUERY_CLASS"]
    ):Promise<ClassServiceResponse["QUERY_CLASS"]>{
        return this.executor({
            uri:"/class",
            method:"GET",
            body:req

        })as Promise<ClassServiceResponse["QUERY_CLASS"]>

    }
    
}