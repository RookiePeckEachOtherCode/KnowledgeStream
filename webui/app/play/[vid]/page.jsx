"use client";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChevronDown,
    faClock,
    faMagnet,
    faMinus,
    faPaperPlane,
    faPlay,
} from "@fortawesome/free-solid-svg-icons";
import {faDiscourse} from "@fortawesome/free-brands-svg-icons";
import {OssImage, OssVideo, OssVideoCover} from "../../components/oss-midea.tsx";
import {useEffect, useState} from "react";
import {Divider} from "../../components/divider.tsx";
import {CommentStrip} from "../../components/comment-strip.tsx";
import {IconButton} from "../../components/icon-button.tsx";
import {api} from "../../../api/instance.ts";
import {useNotification} from "../../../context/notification-provider.tsx";

import {useParams} from "next/navigation";
import {useRouter} from "next/navigation.js";

export default function PlayPage() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [focusComment, setFocusComment] = useState(false);
    const {showNotification} = useNotification();
    const params = useParams();
    const vid = params.vid;

    //新评论
    const [commentContent, setCommentContent] = useState("");
    const [commentPlaceholder, setCommentPlaceholder] = useState("有什么想说的?");
    const [commentParent, setCommentParent] = useState(null);

    const ChangeCommentToReply = (name, cid) => {
        console.log(111);
        setCommentPlaceholder("回复@" + name);
        setCommentParent(cid);
    };

    const SubmitComment = async () => {
        if (commentParent !== null) {
            const commentRes = await api.commentService.add({
                parent: commentParent,
                content: commentContent,
                name: userInfo.name,
                avatar: userInfo.avatar,
            });
            if (commentRes.base.code !== 200) {
                showNotification({
                    title: "评论失败",
                    content: commentRes.base.msg,
                });
                return;
            }
            const commentsRes = await api.commentService.under_video({
                vid: vid,
            });
            if (commentsRes.base.code !== 200) {
                showNotification({
                    title: "刷新评论列表失败",
                    content: commentsRes.base.msg,
                    type: "error",
                });
            } else {
                setComments(commentsRes.comments);
            }
        } else {
            const replyRes = await api.commentService.add({
                parent: vid,
                content: commentContent,
                name: userInfo.name,
                avatar: userInfo.avatar,
            });
            if (replyRes.base.code !== 200) {
                showNotification({
                    title: "添加回复失败",
                    content: replyRes.base.msg,
                    type: "error",
                });
                return;
            }
            const commentsRes = await api.commentService.under_video({
                vid: vid,
            });
            if (commentsRes.base.code !== 200) {
                showNotification({
                    title: "刷新评论列表失败",
                    content: commentsRes.base.msg,
                    type: "error",
                });
            } else {
                setComments(commentsRes.comments);
            }
        }
        setCommentContent("");
    };

    const [userInfo, setUserInfo] = useState({
        id: "",
        avatar: "",
        name: "",
        authority: "",
        signature: "",
        grade: "",
        faculty: "",
        major: "",
        class: "",
    });
    const [teacherInfo, setTeacherInfo] = useState({
        id: "",
        avatar: "",
        name: "",
        authority: "",
        signature: "",
        grade: "",
        faculty: "",
        major: "",
        class: "",
    });
    const [videoInfo, setVideoInfo] = useState({
        ascription: "",
        chapter: "",
        cover: "",
        description: "",
        id: "",
        length: "",
        source: "",
        title: "",
        upload_time: "",
        uploader: "",
    });
    const [courseInfo, setCourseInfo] = useState({
        ascription: "",
        begin_time: "",
        class: "",
        cover: "",
        description: "",
        end_time: "",
        cid: "",
        major: "",
        title: "",
    });
    const [videoList, setVideoList] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const userInfoRes = await api.userService.queryInfo({});
            if (userInfoRes.base.code !== 200) {
                showNotification({
                    title: "获取用户信息失败",
                    content: userInfoRes.base.msg,
                    type: "error",
                });
            } else {
                setUserInfo(userInfoRes.userinfo);
            }
            const videoInfoRes = await api.videoService.videoInfo({
                vid: vid,
            });
            if (videoInfoRes.base.code !== 200) {
                showNotification({
                    type: "error",
                    title: "获取视频信息失败",
                    content: "请尝试刷新页面",
                });
            } else {
                setVideoInfo(videoInfoRes.videoinfo);
                const teacherInfoRes = await api.userService.uidInfo({
                    uid: videoInfoRes.videoinfo.uploader,
                });
                if (teacherInfoRes.base.code !== 200) {
                    showNotification({
                        title: "获取上传者信息失败",
                        content: teacherInfoRes.base.msg,
                        type: "error",
                    });
                } else {
                    setTeacherInfo(teacherInfoRes.userinfo);
                }
                const courseInfoRes = await api.courseService.info({
                    cid: videoInfoRes.videoinfo.ascription,
                });
                if (courseInfoRes.base.code !== 200) {
                    showNotification({
                        title: "获取课程域信息失败",
                        content: courseInfoRes.base.msg,
                        type: "error",
                    });
                } else {
                    setCourseInfo(courseInfoRes.courseinfo);
                }
                const videosRes = await api.courseService.videos({
                    cid: videoInfoRes.videoinfo.ascription,
                });
                if (videosRes.base.code !== 200) {
                    showNotification({
                        title: "获取视频列表失败",
                        content: videosRes.base.msg,
                        type: "error",
                    });
                } else {
                    setVideoList(videosRes.videosinfo);
                }
                const commentsRes = await api.commentService.under_video({
                    vid: videoInfoRes.videoinfo.vid,
                });
                if (commentsRes.base.code !== 200) {
                    showNotification({
                        title: "获取评论列表失败",
                        content: commentsRes.base.msg,
                        type: "error",
                    });
                } else {
                    setComments(commentsRes.comments);
                }
            }
        }

        fetchData();
    }, []);

    return (
        <div
            className={`max-w-screen min-h-screen  overflow-auto bg-background pl-32 pr-32 pt-12 flex flex-col`}
            onClick={() => setFocusComment(false)}
        >
            <div className={` flex flex-row space-x-6`}>
                {/*视频，视频内容，（评论）交互条*/}
                <div className={`w-2/3 space-y-4 flex-col text-on-background flex `}>
                    <div className={`w-full flex text-3xl `}>{videoInfo.title}</div>
                    <div className={`w-full flex flex-row space-x-3`}>
                        <IconWithText
                            className={`text-on-background`}
                            text={courseInfo.major}
                        >
                            <FontAwesomeIcon size={`xl`} icon={faMagnet}/>
                        </IconWithText>
                        <IconWithText
                            className={`text-on-background`}
                            text={courseInfo.title}
                        >
                            <FontAwesomeIcon size={`xl`} icon={faDiscourse}/>
                        </IconWithText>
                        <IconWithText
                            className={`text-on-background`}
                            text={videoInfo.upload_time}
                        >
                            <FontAwesomeIcon size={`xl`} icon={faClock}/>
                        </IconWithText>
                    </div>
                    <OssVideo
                        url={videoInfo.source}
                        className={`w-full h-auto`}
                    ></OssVideo>
                    {/* 描述部分 */}
                    <div className={`w-full flex flex-col items-start`}>
                        <div
                            className={`w-full text-wrap overflow-hidden text-on-background
                        ${isExpanded ? `h-full` : `max-h-24`}
                        `}
                        >
                            {videoInfo.description}
                        </div>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="hover:text-primary text-on-secondary-containerfgbvtt// mt-2"
                        >
                            {isExpanded ? "收起" : "展开详情"}
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
                                url={userInfo.avatar}
                                className="w-18 aspect-square shrink-0 rounded-full"
                            />
                            <div
                                className="flex-1 relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <input
                                    type="text"
                                    className={`w-full px-4 py-3 rounded-2xl transition-all duration-200
                    border-2 ${
                                        focusComment
                                            ? "border-primary bg-secondary-container"
                                            : "border-outline hover:border-on-surface"
                                    }
                    focus:outline-none focus:ring-2 focus:ring-primary/30
                    placeholder:text-on-surface/60`}
                                    onFocus={() => setFocusComment(true)}
                                    onBlur={() => setFocusComment(false)}
                                    placeholder={commentPlaceholder}
                                    value={commentContent}
                                    onChange={(e) => setCommentContent(e.target.value)}
                                    style={{textIndent: "0.5rem"}}
                                />
                                {focusComment && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 z-[999]">
                                        <button
                                            className="px-2 py-1 text-sm text-primary hover:bg-primary/10 rounded-lg"
                                            onMouseDown={() => {  // 改用 onMouseDown
                                                setCommentParent(null);
                                                setCommentPlaceholder("想说些什么?");
                                            }}
                                        >
                                            取消
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div
                            className={`flex justify-end px-3 ${
                                focusComment ? `max-h-96` : `max-h-0`
                            } transition-all duration-300 overflow-hidden`}
                        >
                            <IconButton
                                text="提交"
                                onClick={async () => {
                                    await SubmitComment();
                                }}
                                className="bg-primary-container text-on-primary-container
                                hover:bg-primary-container/90 space-x-3"
                            >
                                <FontAwesomeIcon icon={faPaperPlane}/>
                            </IconButton>
                        </div>
                    </div>

                    <div className={`w-full flex flex-col`}>
                        {comments.map((item, index) => {
                            return (
                                <CommentStrip
                                    key={item.id}
                                    comment={item}
                                    onReply={ChangeCommentToReply}
                                ></CommentStrip>
                            );
                        })}
                    </div>
                </div>
                {/*选集，其他课程视频*/}
                <div className={` w-1/3 flex flex-col space-y-6`}>
                    <div className={`w-full flex flex-row items-center space-x-6`}>
                        <OssImage
                            url={teacherInfo.avatar}
                            className={`w-1/5 aspect-square rounded-full`}
                        ></OssImage>
                        <div className={`w-full flex flex-col space-y-3`}>
                            <div className={`text-on-background text-2xl`}>
                                {teacherInfo.name}
                            </div>
                            <div className={`text-on-secondary-container`}>
                                {teacherInfo.signature}
                            </div>
                        </div>
                    </div>
                    <ChapterList
                        videos={videoList}
                        currentVideo={videoInfo}
                    ></ChapterList>
                    <div className={`w-full flex flex-col`}>
                        <div>下一个播放</div>
                        <div className={`w-full flex flex-row justify-between`}>
                            <OssVideoCover url={videoInfo.source} className={`w-1/2 h-auto`}></OssVideoCover>           
                            
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
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
    const [openChapter, setOpenChapter] = useState(false);
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
                <FontAwesomeIcon size="xl" icon={faMinus}/>
            </div>

            <div
                className={`w-full transition-all duration-300 overflow-hidden ${
                    openChapter ? "max-h-[720px]" : "max-h-0"
                }`}
            >
                <div className="space-y-3">
                    {chapter.map((item, index) => (
                        <VideoList
                            key={index}
                            title={item}
                            videos={videos}
                            currentVideo={currentVideo}
                        ></VideoList>
                    ))}
                </div>
            </div>
        </div>
    );
}

function VideoList(props) {
    let {title, videos, currentVideo} = props;
    const [unfold, setUnfold] = useState(false);
    const [hover, setHover] = useState(-1);
    const router = useRouter()
    return (
        <div className="w-full   transition-all rounded-2xl text-on-secondary-container flex justify-between flex-col">
            <div
                className={`w-full p-2 flex 
            bg-surface-variant  ${
                    unfold ? `rounded-t-2xl` : `rounded-2xl `
                }transition-all duration-200  
            hover:bg-secondary-fixed-dim  hover:text-on-secondary-fixed hover:rounded-t-2xl
            flex-row justify-between pl-3 pr-3 `}
                onClick={() => setUnfold(!unfold)}
            >
                <div>{title}</div>
                <FontAwesomeIcon size="sm" icon={faChevronDown}/>
            </div>

            <div
                className={`w-full overflow-hidden bg-secondary-fixed transition-all flex rounded-b-2xl flex-col ${
                    unfold ? `max-h-[520px]` : `max-h-0`
                }`}
            >
                {videos.map(
                    (item, index) =>
                        item.chapter === title && (
                            <div
                                onMouseLeave={() => setHover(-1)}
                                onMouseOver={() => setHover(index)}
                                onClick={() => {
                                    router.push(`/play/${item.vid}`)
                                }}

                                className={`flex flex-row  hover:bg-primary-fixed-dim transition-all duration-200 pl-3 pr-3 justify-between items-center h-auto min-h-10`}
                            >
                                <div className={`text-on-secondary-fixed`}>{item.title}</div>
                                {currentVideo.vid === item.vid ? (
                                    <PlayingIcon></PlayingIcon>
                                ) : (
                                    hover === index && (
                                        <FontAwesomeIcon
                                            className={`text-on-primary-fixed-variant`}
                                            icon={faPlay}
                                        ></FontAwesomeIcon>
                                    )
                                )}
                            </div>
                        )
                )}
            </div>
        </div>
    );
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
