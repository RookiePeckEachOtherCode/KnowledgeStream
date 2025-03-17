import {ReactNode, useState} from "react";
import {OssImage} from "./oss-midea.tsx";
import {SpringConfig} from "@react-spring/web";

interface CourseCardProps {
    className:string
    bucket:string,
    fileName:string,
    onClick:()=>void
    course:string,
    teacher:string
}


export  default function CourseCard({
    className,
    bucket,
    fileName,
    onClick,
    course,
    teacher
}:CourseCardProps){
    const [isHover, setIsHover] = useState(false)
    
    return(
        <div className={`${className} bg-primary-container  p-4
        transition-all duration-300 flex flex-col relative space-y-3 rounded-2xl
        hover:bg-primary-fixed-dim hover:cursor-pointer`}
             onMouseOver={() => setIsHover(true)}
             onMouseLeave={() => setIsHover(false)}
        >
            <OssImage
                className={`w-full aspect-square rounded-2xl`}
                fileName={fileName}
                bucket={bucket}
            ></OssImage>
            <div className={`${isHover ? `text-on-primary-fixed-variant` : `text-on-primary-container`} `}>{course}</div>
            <div className={`${isHover ? `text-on-primary-fixed-variant` : `text-on-primary-container`} `}>{teacher}</div>
        </div>


    )

}