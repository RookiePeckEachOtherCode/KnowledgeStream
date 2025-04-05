import { useState } from "react";
import { OssImage } from "./oss-midea";

interface CourseCardProps {
    className: string
    url: string,
    gotoCourse: () => void
    gotoTeacher: () => void
    course: string,
    teacher: string
}


export default function CourseCard({
    className,
    url,
    gotoCourse,
    gotoTeacher,
    course,
    teacher,
}: CourseCardProps) {
    const [isHover, setIsHover] = useState(false)

    return (
        <div
            className={`${className} bg-primary-container  p-4
        transition-all duration-300 flex flex-col space-y-3 rounded-2xl
        hover:bg-primary-fixed-dim hover:cursor-pointer`}
            onMouseOver={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <div onClick={() => gotoCourse()}>
                <OssImage
                    className={`w-full aspect-square rounded-2xl`}
                    url={url}
                />
            </div>
            <div className={`${isHover ? `text-on-primary-fixed-variant` : `text-on-primary-container`} `} onClick={() => gotoCourse()}>{course}</div>
            <div className={`${isHover ? `text-on-primary-fixed-variant` : `text-on-primary-container`} `} onClick={() => gotoTeacher()}>{teacher}</div>
        </div>
    )
}