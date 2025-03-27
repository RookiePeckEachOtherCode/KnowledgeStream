export type ClassServiceRequest={
    ADD_CLASS:{
        name:string
    };
    QUERY_CLASS:{
        keyword:string,
        offset:number,
        size:number
    }
    
}