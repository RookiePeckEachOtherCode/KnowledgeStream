import {useScreenRecord} from "../../context/screen-record-provider";
import {useEffect, useRef, useState} from "react";
import {IconButton} from "../components/icon-button.tsx";
import {useOss} from "../../context/oss-uploader-provider.tsx";
import {OssVideo} from "../components/oss-midea.tsx";
import {useModal} from "../../context/modal-provider.js";
import {api} from "../../api/instance.ts";
import {useNotification} from "../../context/notification-provider.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";

export function ScreenRecordControlPage(props){
    const {                
        isRecording,
        isPaused,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        clearRecordedData,
        recordedBlob,
        liveStream} = useScreenRecord();
    const {isShow, toggleShowModal, setForm}=useModal()
    
    const previewVideoRef = useRef(null);//实时预览流

    const {testUrl, setTestUrl}= useState()
    var {handleFileUpload,generateSignedUrl} = useOss();

    // 视频录制中回显
    useEffect(() => {
        if (previewVideoRef.current && liveStream) {
            previewVideoRef.current.srcObject = liveStream;
        }
    }, [liveStream]);
    
    
    useEffect(()=>{
        setForm(<VideoSubmitForm
            key={Date.now()}
            blob={recordedBlob}
        >
        </VideoSubmitForm>)
    },[])
    
    

    return (
        <div className={`w-full  space-x-6  h-full flex flex-row p-8`}>
            <div className={`h-full flex flex-col space-y-6`}>
                {!isRecording?
                    <IconButton 
                        className={` bg-secondary  text-on-secondary
                     hover:text-on-primary hover:bg-primary w-24 h-12`}
                        text={`开始录制`}
                        onClick={startRecording}>
                    </IconButton>:  <IconButton 
                        className={`w-24 h-12 bg-error-container text-on-error-container 
                        hover:bg-error hover:text-on-error
                        `} 
                        text={`结束录制`} 
                        onClick={stopRecording}>
                    </IconButton >
                }
                {
                    isRecording&&(!isPaused?
                        <IconButton text={`暂停录制`} onClick={pauseRecording}
                                    className={`bg-secondary  hover:bg-secondary-fixed`}></IconButton>
                        :<IconButton text={`恢复录制`} onClick={resumeRecording} 
                                     className={`bg-primary-fixed-dim`}></IconButton>)
                }
                {recordedBlob&&<IconButton
                    className={` bg-tertiary-container  text-on-tertiary-container
                     hover:text-on-tertiary hover:bg-tertiary w-24 h-12`}
                    onClick={()=>toggleShowModal(true)}
                    text={`上传录屏`}
                >
                </IconButton>}
                {recordedBlob&&<IconButton
                    className={` bg-surface-dim  text-on-surface
                     hover:text-on-tertiary hover:bg-tertiary w-24 h-12`}
                    text={`清除缓存`}
                 onClick={clearRecordedData}
                >
                </IconButton>}
            </div>

            <div className={`w-full items-center flex  justify-center`}>
                {
                    isRecording?(
                            <div className={`w-3/4 relative flex`}>
                                {isPaused&&<div className={`bg-black bg-opacity-10 absolute w-full h-full`}>录制暂停中</div>}
                                <video
                                    ref={previewVideoRef}
                                    autoPlay={true}
                                    muted={true}
                                    className={`w-full object-cover`}
                                ></video>
                            </div>
                        )
                        : recordedBlob ? (
                            <video
                                controls
                                src={URL.createObjectURL(recordedBlob)}
                                className={`w-3/4 object-cover`}
                        />
                        ):<div className={`w-full flex  h-full relative`}>
                            <div className={`text-4xl absolute top-2/5 left-2/5 flex flex-col justify-center text-center`}>录制未开始<p>点击左侧按钮开启录制</p></div>
                        </div>
                }
            </div>
        </div>
    )

}

function VideoSubmitForm({blob}){

    const [formData, setFormData] = useState({
        source:"",
        title:"",
        description:"",
        cid:"",
        length:"",
        chapter:"",
    })
    const [courseName, setCourseName] = useState("")
    const [courses, setCourses] = useState([])
    const [errors, setErrors] = useState({});
    const [courseDrawerIsOpen, setCourseDrawerIsOpen] = useState(false)
    const {showNotification} = useNotification();
    const handleChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        // 清除对应字段的错误
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };
    var {handleFileUpload,generateSignedUrl} = useOss();
    
    useEffect(()=>{
      async function fetchData(){
          const res = await api.teacherService.myCourse({
              keyword:"",
              offset:"0",
              size:"666"
          });
            if(res.base.code===200){
                setCourses(res.coursesinfo)                
            }else{
                showNotification({
                    title:"获取教师课程失败!",
                    type:'info',
                    content:"请重启表单并保证有可用课程域"
                })
            }
      }
      fetchData()
    },[])
    
    const ChooseCourse=(index)=>{
        setCourseName(courses[index].title)
        setFormData(prev => ({
            ...prev,
            ['cid']:courses[index].id 
        }));
    }
    
    const validateForm=()=>{
        const newErrors={}
        if(!formData.chapter.trim()){
            newErrors.chapter="章节不能为空"
        }
        if(!formData.title.trim()){
            newErrors.title="标题不能为空"
        }
        if(!formData.cid.trim()||!courses.includes({id:formData.cid})){
            newErrors.cid="未找到课程域"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0;
    }
    const uploadVideoToOss=()=>{
        
    }    
    const handleSubmit=async (e)=>{
        e.preventDefault();
        if (!validateForm()) return;
         await api.teacherService.uploadVideo({
             source:formData.source,
             title:formData.title,
             description:formData.description,
             cover:null,
             length:blob.length,
             chapter:formData.chapter
        })
    }
    
    
    return(
        <div className={`w-2/5 p-6 bg-secondary-container flex flex-col rounded-2xl space-y-6 `} onClick={(e)=>e.stopPropagation()}>
            <div className={`w-full text-2xl  text-on-secondary-container`}>{`完善视频信息`}</div>
            <form className={`space-y-6`}>
                <div className={`grid grid-cols-2 gap-4`}>
                    <div className={`space-y-2`}>
                        <label className="text-sm font-medium text-on-secondary-container">
                            标题
                            <span className="text-error">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={handleChange('title')}
                            className={`w-full p-3 rounded-lg border ${
                                errors.title ? 'border-error' : 'border-outline'
                            } bg-secondary-container text-on-surface`}
                            placeholder="请输入视频标题"
                        />
                        {errors.title && (
                            <p className="text-error text-sm">{errors.title}</p>
                        )}
                    </div>
                    <div className={`space-y-2 relative`}>
                        <label className="text-sm font-medium text-on-secondary-container ">
                            所属课程
                            <span className="text-error">*</span>
                        </label>
                        <div className={`w-full relative flex `}>
                            <input
                                type="text"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                                className={`w-full flex  justify-between p-3 rounded-lg text-on-secondary-container border ${
                                    errors.title ? 'border-error' : 'border-outline'
                                } bg-secondary-container `}
                                placeholder="选择课程"
                            ></input>
                            <FontAwesomeIcon
                                icon={faArrowDown}
                                onClick={() => setCourseDrawerIsOpen(true)}
                                className={`absolute text-on-surface hover:scale-125 transition-all duration-300 top-1/3 hover:cursor-pointer right-1/24`}/>
                        </div>
                        <div className={`w-full
                          ${courseDrawerIsOpen ? "max-h-[200px]" : "max-h-0"}
                          overflow-hidden
                          transition-all duration-300
                          absolute top-full rounded-xl bg-primary-fixed
                        `}>
                            <div className="p-3 space-y-2 flex flex-col">
                                {courses.map((item, index) => (
                                    <div key={index}
                                         onClick={()=>{ChooseCourse(index);setCourseDrawerIsOpen(false)}}     
                                         className="w-full hover:bg-secondary rounded-xl h-full　text-on-primary-fixed">
                                        <div className={`pl-3 flex w-full overflow-hidden`}>
                                            {item.title}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {errors.courseName && (
                            <p className="text-error text-sm">{errors.courseName}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-on-secondary-container">
                        视频简介
                        <span className="text-xs text-on-primary-container/60 ml-2">（最多2048个字符）</span>
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={handleChange('description')}
                        className={`w-full p-3 rounded-lg border ${
                            errors.description ? 'border-error' : 'border-outline'
                        } bg-secondary-container text-on-surface resize-none h-32`}
                        placeholder="展示在播放页中...."
                        maxLength={2048}
                    />
                    <div className="flex justify-between text-sm">
                        {errors.description && (
                            <p className="text-error">{errors.description}</p>
                        )}
                        <span className="text-on-surface-variant ml-auto">
                            {formData.description.length}/2048
                        </span>
                    </div>
                </div>
                
                <div className={`space-y-2 relative`}>
                    <label className="text-sm font-medium text-on-secondary-container ">
                        章节名称
                        <span className="text-error">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.chapter}
                        onChange={handleChange('chapter')}
                        className={`w-full p-3 rounded-lg border ${
                            errors.chapter ? 'border-error' : 'border-outline'
                        } bg-secondary-container text-on-surface`}
                        placeholder="新章节自动创建"
                    />
                    {errors.chapter && (
                        <p className="text-error text-sm">{errors.chapter}</p>
                    )}
                </div>


            </form>

        </div>

    )


}