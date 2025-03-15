import MDInput from "../components/md-input.tsx";
import {useEffect, useState} from "react";
import CourseCard from "../components/course-card.tsx";

export function MainPage() {
    const arr=[1,2,3,4,5,6,7,8,9,10]
    const [userAuthority, setUserAuthority] = useState("USER")
    
    useEffect(()=>{
        //GetUserInfo
        
        
        
    },[])
    
  return (
    <div className={`w-full  h-full flex flex-col p-8 space-y-6`}>

      <div className={`text-3xl`}>我の课程</div>
        <div className={`w-full h-auto p-3 justify-center flex flex-row flex-wrap gap-6 `}>
            {arr.map((item,index)=>(
                <CourseCard
                    className={`w-1/6`}
                    bucket={`ks-course-cover`}
                    fileName={`test.jpg`}
                    onClick={()=>{}}
                    course={`区块链市场震荡生态经济学`}
                    teacher={`w2h34d`}>
                </CourseCard>
            ))}
        </div>
    </div>
  );
}
