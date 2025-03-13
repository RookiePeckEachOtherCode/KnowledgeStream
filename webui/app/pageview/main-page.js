import MDInput from "../components/md-input.tsx";
import {useState} from "react";
import CourseCard from "../components/course-card.tsx";

export function MainPage() {
    const [searchKeyword, setSearchKeyword] = useState(null)
    
  return (
    <div className={`w-full  h-full flex flex-col p-8`}>
        <div className={`w-1/9 hover:w-1/4 transition-all duration-300`}>
            <MDInput 
                value={searchKeyword} 
                onValueChange={e=>setSearchKeyword(e)}
                placeholder={`搜索课程`}
            ></MDInput>
        </div>
      <div className={`text-3xl`}>我の课程</div>
        <CourseCard 
            className={`w-1/7`} 
            bucket={`ks-course-cover`} 
            fileName={`test.jpg`} 
            onClick={()=>{}} 
            course={`区块链市场震荡经济学`} 
            teacher={`w2h34d`}>
            
        </CourseCard>
    </div>
  );
}
