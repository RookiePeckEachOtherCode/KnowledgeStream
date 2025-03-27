"use client"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChevronDown,
    faClock,
    faLeaf,
    faMagnet,
    faMinus, faPaperPlane,
    faPlay,
    faSubway,
    faTimes
} from "@fortawesome/free-solid-svg-icons";
import {faDiscourse} from "@fortawesome/free-brands-svg-icons";
import {OssImage, OssVideo} from "../../components/oss-midea.tsx";
import {useEffect, useState} from "react";
import {Divider} from "../../components/divider.tsx";
import {CommentStrip} from "../../components/comment-strip.tsx";
import {IconButton} from "../../components/icon-button.tsx";
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
        title: "趣谈趣谈人工智能背景下拨动指针",
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

const comments=[{
    id:"1",
    ascription: "123",
    avatar:"ks-user-avatar/114514.jpg",
    name:"麦克*莫顿",
    content:"这个老师讲的就像我的减速球一样全是屎",
}]

export default  function PlayPage({params}){
    const vid=params
    const [isExpanded, setIsExpanded] = useState(false);
    const [focusComment, setFocusComment] = useState(false)
        
    return(
        <div className={`max-w-screen min-h-screen  overflow-auto bg-background pl-32 pr-32 pt-12 flex flex-col`}>
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
                    {/* 描述部分 */}
                    <div className={`w-full flex flex-col items-start`}>
                        <div className={`w-full text-wrap overflow-hidden text-on-background
                        ${isExpanded ? `h-full` : `max-h-24`}
                        `}>
                            {videoInfo.description}
                        </div>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="hover:text-primary text-on-secondary-containerfgbvtt// mt-2"
                        >
                            {isExpanded ? '收起' : '展开详情'}
                        </button>
                    </div>
                    <Divider vertical={false}></Divider>
                    <div className={`w-full flex flex-row items-center space-x-3`}>
                        <div className={`text-3xl`}>评论</div>
                        <div className={`text-outline text-xl`}>{comments.length}</div>
                    </div>
                    <div className="w-full flex flex-col space-y-4">
                        <div className="w-full p-3 flex items-center gap-4">
                            <OssImage
                                url="ks-user-avatar/114514.jpg"
                                className="w-18 aspect-square shrink-0 rounded-full"
                            />
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    className={`w-full px-4 py-3 rounded-2xl transition-all duration-200
                    border-2 ${focusComment ?
                                        "border-primary bg-secondary-container" :
                                        "border-outline hover:border-on-surface"}
                    focus:outline-none focus:ring-2 focus:ring-primary/30
                    placeholder:text-on-surface/60`}
                                    onFocus={() => setFocusComment(true)}
                                    onBlur={() => setFocusComment(false)}
                                    placeholder="有什么想说的？"
                                    style={{textIndent: "0.5rem"}}
                                />
                                {focusComment && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                        <button
                                            className="px-2 py-1 text-sm text-primary hover:bg-primary/10 rounded-lg"
                                            onClick={() => setFocusComment(false)}
                                        >
                                            取消
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={`flex justify-end px-3 ${focusComment?`max-h-96`:`max-h-0`} transition-all duration-300 overflow-hidden`}>
                            <IconButton
                                text="提交"
                                onClick={() => {
                                }}
                                className="bg-primary-container text-on-primary-container
                                hover:bg-primary-container/90 space-x-3"
                            ><FontAwesomeIcon icon={faPaperPlane}/></IconButton>
                        </div>
                    </div>

                    <div className={`w-full flex flex-col`}>
                        {comments.map((item, index) => {
                            return <CommentStrip
                                key={index}
                                avatar={item.avatar}
                                content={item.content}
                                id={item.id}
                                name={item.name}
                                ascription={item.ascription}
                                parent={"no use"}
                                time={"2077-27-78 11:45"}
                            >
                            </CommentStrip>
                        })}
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
                    <ChapterList videos={videos} currentVideo={videoInfo}></ChapterList>
                </div>

            </div>

        </div>
    )

}

function IconWithText({children, text, className}) {
    return (
        <div className={` flex flex-row p-1 space-x-2`}>
            {children}
            <div className={`${className}`}>{text}</div>
        </div>
    );
}

function ChapterList({videos, currentVideo}) {
    const [chapter, setChapter] = useState([]);
    const [openChapter, setOpenChapter] = useState(false)
    useEffect(() => {
        // 去重并提取章节名称
        const chapters = [...new Set(videos.map((item) => item.chapter))];
        setChapter(chapters);
    }, [videos]);

    return (
        <div className="w-full h-auto p-3 flex flex-col bg-secondary-container rounded-2xl">
            <div
                onClick={() => setOpenChapter(!openChapter)}
                className="w-full hover:cursor-pointer hover:bg-on-secondary rounded-t-2xl flex items-center text-on-secondary-container justify-center"
            >
                <FontAwesomeIcon size="xl" icon={faMinus} />
            </div>

            <div
                className={`w-full transition-all duration-300 overflow-hidden ${
                    openChapter ? "max-h-[720px]" : "max-h-0"
                }`}
            >
                <div className="space-y-3">
                    {chapter.map((item, index) => (
                        <VideoList key={index} title={item} videos={videos} currentVideo={currentVideo}>
                            
                        </VideoList>
                    ))}
                </div>
            </div>
        </div>
    );  
}
function VideoList(props){
    let {title,videos,currentVideo} = props;
    const [unfold, setUnfold] = useState(false )
    const [hover, setHover] = useState(-1)
    
    
    return (
        <div
             className="w-full   transition-all rounded-2xl text-on-secondary-container flex justify-between flex-col">
            <div 
                className={`w-full p-2 flex 
            bg-surface-variant  ${unfold?`rounded-t-2xl`:`rounded-2xl `}transition-all duration-200  
            hover:bg-secondary-fixed-dim  hover:text-on-secondary-fixed hover:rounded-t-2xl
            flex-row justify-between pl-3 pr-3 `}
                onClick={()=>setUnfold(!unfold)}
            >
                <div>{title}</div>
                <FontAwesomeIcon size="sm" icon={faChevronDown}/>
            </div>

            <div 
                className={`w-full overflow-hidden bg-secondary-fixed transition-all flex rounded-b-2xl flex-col ${unfold ? `max-h-[520px]` : `max-h-0`}`}
            >
                {
                    videos.map((item,index)=>
                        item.chapter===title&&
                        <div
                            onMouseLeave={()=>setHover(-1)}
                            onMouseOver={()=>setHover(index)}
                            className={`flex flex-row  hover:bg-primary-fixed-dim transition-all duration-200 pl-3 pr-3 justify-between items-center h-auto min-h-10`}>
                            <div className={`text-on-secondary-fixed`}>{item.title}</div>
                            {currentVideo.title===item.title?<PlayingIcon></PlayingIcon>:
                                hover===index&&<FontAwesomeIcon className={`text-on-primary-fixed-variant`} icon={faPlay}></FontAwesomeIcon>
                            }
                        </div>)
                }
            </div>

        </div>
    )


}


function PlayingIcon() {
    return (
        <div className="flex h-5 items-end gap-1">
            {/* 通过任意值语法直接写动画 */}
            <span
                className="w-2 bg-gray-500 
          animate-[wave_1s_ease-in-out_infinite] 
          h-[60%]"
            />
            <span
                className="w-2 bg-gray-500 
          animate-[wave_1s_ease-in-out_infinite_100ms] 
          h-[80%]"
            />
            <span
                className="w-2 bg-gray-500 
          animate-[wave_1s_ease-in-out_infinite_200ms] 
          h-[40%]"
            />
        </div>
    );
}