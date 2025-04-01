"use client"
import {useEffect, useState} from "react";
import CourseCard from "../components/course-card";
import { useRouter } from "next/navigation";
import {UserAuthority} from "@/api/internal/service/user";
import {api} from "@/api/instance";
import {useNotification} from "@/context/notification-provider";
import {CourseInfo} from "@/api/internal/model/static/base-resp";
import MDInput from "@/app/components/md-input";
import {CustomDatePicker} from "@/app/components/custom-date-picker.jsx";
import dayjs, {Dayjs} from "dayjs";

export function MainPage() {
    const router = useRouter()
    const {showNotification} = useNotification();
    const [courses, setCourses] = useState<Array<CourseInfo>>([])

    const [searchKeyword, setSearchKeyword] = useState("")
    const [searchBeginTime, setSearchBeginTime] = useState("")
    const [searchEndTime, setSearchEndTime] = useState("")

    const handleTimeChange=(field:string)=>(value:any)=>{
        if(field==="begin"){
            setSearchBeginTime(
                value?dayjs(value).format('YYYY-MM-DD'):''
            )
        }else{
            setSearchEndTime(
                value?dayjs(value).format('YYYY-MM-DD'):''
            )
        }
        
    }
    useEffect(() => {
    async function fetchData(){
        const auth=localStorage.getItem("authority")
        if(auth===UserAuthority.Student){
            const res = await api.studentService.myCourse({
                offset:0,
                size:100,
                keyword:""
            });
            if(res.base.code!==200){
                showNotification({
                    title:"获取课程列表失败",
                    type:"error",
                    content:""
                })
                return
            }
            setCourses(res.coursesinfo)
            
        }else{
            const res = await api.teacherService.myCourse({
                offset:0,
                size:100,
                keyword:""
            });
            if(res.base.code!==200){
                showNotification({
                    title:"获取课程列表失败",
                    type:"error",
                    content:""
                })
                return
            }
            setCourses(res.coursesinfo)
        }
    } 
    fetchData()

  }, [])
    
    const SearchCourse=async ()=>{
        if(localStorage.getItem("authority")===UserAuthority.Student){
            const res = await api.studentService.myCourse({
                keyword:searchKeyword,
                offset:0,
                size:100,
                begin_time:searchBeginTime,
                end_time:searchEndTime
            });
            if(res.base.code!==200){
                showNotification({
                    title:"查询失败",
                    content:"",
                    type:"error"
                })
                return
            }
            setCourses(res.coursesinfo)
        }else{
            const res = await api.teacherService.myCourse({
                keyword:searchKeyword,
                offset:0,
                size:100,
                begin_time:searchBeginTime,
                end_time:searchEndTime
            });
            if(res.base.code!==200){
                showNotification({
                    title:"查询失败",
                    content:"",
                    type:"error"
                })
                return
            }
            setCourses(res.coursesinfo)
        }    
        
    }
  return (
    <div className={`w-full  h-full flex flex-col p-8 space-y-6`}>

      <div className={`text-3xl`}>我の课程</div>
        <div className={`w-full items-center flex flex-row justify-between`}>
            <div className={`w-1/6 hover:w-1/3 transition-all duration-300`}>
                <MDInput
                    value={searchKeyword}
                    onValueChange={e => setSearchKeyword(e)}
                    placeholder={`搜索课程`}
                    onEnter={SearchCourse}
                ></MDInput>
            </div>
            <div className={` flex flex-row`}>
                <div className={`grid grid-cols-2 gap-4 z-index-[100] p-3`}>
                    <div className={`space-y-2`}>
                        <label className={`text-sm font-medium text-on-surface`}>
                            起始时间
                        </label>
                        <CustomDatePicker
                            value={searchBeginTime}
                            onChange={handleTimeChange("begin")}>
                        </CustomDatePicker>
                    </div>
                    <div className={`space-y-2`}>
                        <label className={`text-sm font-medium text-on-surface`}>
                            结束时间
                        </label>
                        <CustomDatePicker
                            value={searchEndTime}
                            onChange={handleTimeChange("end")}>
                        </CustomDatePicker>
                    </div>

                </div>
            </div>
        </div>
        <div className={`w-full h-auto p-3 justify-center flex flex-row flex-wrap gap-6 `}>
            {courses.map((item, index) => (
                <CourseCard
                    className={`w-1/6`}
                    url={item.cover}
                    gotoCourse={() => {
                        router.push(`/course/` + item.cid)
                    }}
                    gotoTeacher={() => {
                    }}
                    course={item.title}
                    teacher={item.major}
          />
        ))}
      </div>
    </div>
  );
}
