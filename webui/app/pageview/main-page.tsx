"use client"
import { useEffect } from "react";
import CourseCard from "../components/course-card";
import { useRouter } from "next/navigation";

export function MainPage() {
  const router = useRouter()
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]


  useEffect(() => {
    //GetUserInfo



  }, [])

  return (
    <div className={`w-full  h-full flex flex-col p-8 space-y-6`}>

      <div className={`text-3xl`}>我の课程</div>
      <div className={`w-full h-auto p-3 justify-center flex flex-row flex-wrap gap-6 `}>
        {arr.map((item, index) => (
          <CourseCard
            key={index}
            className={`w-1/6`}
            bucket={`ks-course-cover`}
            fileName={`test.jpg`}
            gotoCourse={() => { router.push(`/course/114514`) }}
            gotoTecher={() => { }}
            course={`区块链市场震荡生态经济学`}
            teacher={`罗民西`}
          />
        ))}
      </div>
    </div>
  );
}
