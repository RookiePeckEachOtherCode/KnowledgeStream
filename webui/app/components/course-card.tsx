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
    return (
        <div
            className={`${className} bg-surface-container border-1 border-surface-dim  shadow-sm  p-4
        transition-all duration-300 flex flex-col space-y-3 rounded-2xl
        hover:shadow-2xl hover:scale-95 hover:cursor-pointer`} >
            <div onClick={() => gotoCourse()}>
                <OssImage
                    className={`w-full aspect-square rounded-2xl`}
                    url={url}
                />
            </div>
            <div  onClick={() => gotoCourse()}>{course}</div>
            <div  onClick={() => gotoTeacher()}>{teacher}</div>
        </div>
    )
}