"use client"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faClock, faMagnet, faMinus, faTimes} from "@fortawesome/free-solid-svg-icons";
import {faDiscourse} from "@fortawesome/free-brands-svg-icons";
import {OssImage, OssVideo} from "../../components/oss-midea.tsx";
import {useEffect, useState} from "react";
import {Divider} from "../../components/divider.tsx";


export default  function PlayPage({params}){
    const vid=params
    
    const videoInfo={
        cover:"ks-course-cover/test.jpg",
        chapter:"第一章",
        title:"趣谈趣谈人工智能背景下拨动指针",
        source:"ks-video/test",
        description:"威风堂堂罗教授极品讲座解析",
        length:"",
        ascription:"cid",
        uploader:"uid",
        upload_time:"2077-27-78"
    }
    const courseInfo={
        title:"AAA超级JAVA精品课程",
        description:"这里用不到捏",
        begin_time:"huh",
        end_time:"huh",
        major:"软件工程"
        
    }
    const teacherInfo={
        avatar:"ks-user-avatar/114514.jpg",
        name:"罗名西",
        signature:"第五人格我真的豪爽!!!就这个第五爽!!"
    }
    
    const videos = [
        {
            id: "1",
            cover: "https://example.com/covers/video1.jpg",
            chapter: "第一章",
            title: "趣谈人工智能背景下拨动指针",
            source: "https://example.com/videos/video1.mp4",
            description: "罗西东教授极品讲座解析",
            length: "12:34",
            ascription: "cid_123",
            uploader: "uid_456",
            upload_time: "2023-10-01T12:00:00Z"
        },
        {
            id: "2",
            cover: "https://example.com/covers/video2.jpg",
            chapter: "第一章",
            title: "Java 编程基础",
            source: "https://example.com/videos/video2.mp4",
            description: "Java 编程入门教程",
            length: "15:20",
            ascription: "cid_124",
            uploader: "uid_457",
            upload_time: "2023-10-02T14:30:00Z"
        },
        {
            id: "3",
            cover: "https://example.com/covers/video3.jpg",
            chapter: "第三章",
            title: "Python 数据分析",
            source: "https://example.com/videos/video3.mp4",
            description: "Python 数据分析实战",
            length: "20:45",
            ascription: "cid_125",
            uploader: "uid_458",
            upload_time: "2023-10-03T09:15:00Z"
        },
        {
            id: "4",
            cover: "https://example.com/covers/video4.jpg",
            chapter: "第四章",
            title: "React 高级教程",
            source: "https://example.com/videos/video4.mp4",
            description: "React 高级特性详解",
            length: "18:10",
            ascription: "cid_126",
            uploader: "uid_459",
            upload_time: "2023-10-04T16:45:00Z"
        },
        {
            id: "5",
            cover: "https://example.com/covers/video5.jpg",
            chapter: "第五章",
            title: "Node.js 后端开发",
            source: "https://example.com/videos/video5.mp4",
            description: "Node.js 后端开发实战",
            length: "22:30",
            ascription: "cid_127",
            uploader: "uid_460",
            upload_time: "2023-10-05T11:00:00Z"
        }
    ];
    
    return(
        <div className={`min-w-screen min-h-screen bg-background pl-32 pr-32 pt-12 flex flex-col`}>
            <div className={` flex flex-row space-x-6`}>
                
                {/*视频，视频内容，（评论）交互条*/ }
                <div className={`w-2/3 space-y-4 flex-col text-on-background flex `}>
                    <div className={`w-full flex text-3xl `}>{videoInfo.title}</div>
                    <div className={`w-full flex flex-row space-x-3`}>
                        <IconWithText className={`text-on-background`} text={courseInfo.major}>
                            <FontAwesomeIcon size={`xl`} icon={faMagnet}/>
                        </IconWithText>
                        <IconWithText className={`text-on-background`} text={courseInfo.title}>
                            <FontAwesomeIcon size={`xl`} icon={faDiscourse}/>
                        </IconWithText>
                        <IconWithText className={`text-on-background`} text={videoInfo.upload_time}>
                            <FontAwesomeIcon size={`xl`} icon={faClock}/>
                        </IconWithText>
                    </div>
                    <OssVideo url={videoInfo.source} className={`w-full h-auto`}>

                    </OssVideo>
                    <div className={`w-full text-wrap text-on-background`}>
                        {videoInfo.description}
                    </div>
                </div>
                {/*选集，其他课程视频*/}
                <div className={` w-1/3 flex flex-col space-y-6`}>
                    <div className={`w-full flex flex-row items-center space-x-6`}>
                        <OssImage 
                            url={teacherInfo.avatar}
                            className={`w-1/5 aspect-square rounded-full`}
                        >
                        </OssImage>
                        <div className={`w-full flex flex-col space-y-3`}>
                            <div className={`text-on-background text-2xl`}>{teacherInfo.name}</div>
                            <div className={`text-on-secondary-container`}>{teacherInfo.signature}</div>
                        </div>
                    </div>
                    <ChapterList videos={videos}></ChapterList>
                </div>
                
            </div>
            
        </div>
    )
    
}

function IconWithText({ children, text, className }) {
    return (
        <div className={` flex flex-row p-1 space-x-2`}>
            {children}
            <div className={`${className}`}>{text}</div>
        </div>
    );
}

function ChapterList({ videos }) {
    const [chapter, setChapter] = useState([]);

    useEffect(() => {
        // 去重并提取章节名称
        const chapters = [...new Set(videos.map((item) => item.chapter))];
        setChapter(chapters);
    }, [videos]); // 添加 videos 到依赖数组，确保数据更新时重新计算

    return (
        <div className={`w-full h-auto transition-all p-3 flex space-y-3 flex-col bg-secondary-container rounded-2xl`}>
            <div className={`w-full hover:cursor-pointer hover:bg-on-secondary rounded-t-2xl flex items-center text-on-secondary-container justify-center`}>
                <FontAwesomeIcon size={`xl`} icon={faMinus}></FontAwesomeIcon>
            </div>
            {chapter.map((item, index) => (
                <div className={`w-full flex flex-col`}>
                    <div key={index} className={`w-full p-3 bg-surface-variant rounded-2xl  text-on-secondary-container flex flex-row justify-between`}>
                        <div className={``}>{item}</div>
                        <FontAwesomeIcon size={`sm`} icon={faChevronDown}></FontAwesomeIcon>
                    </div>
                </div>
            ))}
        </div>
    );
}