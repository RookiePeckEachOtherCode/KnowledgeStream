"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useNotification } from "@/context/notification-provider"
import AnimatedContent from "@/app/components/animated-content"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFile } from "@fortawesome/free-solid-svg-icons"
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons"
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons"
import { CommentStrip } from "@/app/components/comment-strip"
import { Comment, UserInfo } from "@/api/internal/model/static/base-resp"
import { OssImage } from "@/app/components/oss-midea"
import { api } from "@/api/instance"
import { IconButton } from "@/app/components/icon-button"
import { faPaperPlane, } from "@fortawesome/free-solid-svg-icons";
import { NotifyType } from "@/api/internal/model/response/notify"

export default function NotifyPage() {
    const searchParams = useSearchParams()
    const [notify, setNotify] = useState<NotifyType | null>(null)
    const { showNotification } = useNotification()
    const [isLike, setIsLike] = useState<boolean>(false)
    const [comments, setComments] = useState<Array<Comment>>([])
    const [focusComment, setFocusComment] = useState(false)
    const [commentContent, setCommentContent] = useState("")
    const [commentParent, setCommentParent] = useState<string | null>(null)
    const [commentPlaceholder, setCommentPlaceholder] = useState("想说些什么?")


    const likeAction = async () => {
        if (!notify) return
        //TODO impl api
        setIsLike(!isLike)
        setNotify(prev => ({
            ...prev!,
            favorite: prev!.favorite + (isLike ? -1 : 1)
        }))
    }

    useEffect(() => {
        const fetchNotifyData = async () => {
            const id = searchParams.get('id')
            if (!id) return
            const res = await api.notifyService.notifyInfo({ id })
            if (res.base.code !== 200) {
                showNotification({
                    title: "获取课程数据失败",
                    content: res.base.msg,
                    type: "error"
                })
                return
            }
            setNotify(res.notification)
            setIsLike(res.notification.isLike ?? false)
        }
        fetchNotifyData()
    }, [searchParams, showNotification])

    useEffect(() => {
        const fetchComments = async () => {
            const res = await mockComments()
            setComments(res.comments)
        }
        fetchComments()
    }, [])


    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

    useEffect(() => {
        async function fetchData() {
            const resp = await api.userService.queryInfo({});
            if (resp.base.code !== 200) {
                showNotification({
                    title: "获取用户信息失败",
                    content: resp.base.msg,
                    type: "error"
                })
                return
            }
            setUserInfo(resp.userinfo)
        }
        fetchData()
    }, [showNotification])

    const SubmitComment = async () => {
        if (!notify) return;

        if (commentParent !== null) {
            const commentRes = await api.commentService.add({
                parent: commentParent,
                content: commentContent,
                name: userInfo?.name ?? "",
                avatar: userInfo?.avatar ?? "",
            });
            if (commentRes.base.code !== 200) {
                showNotification({
                    title: "评论失败",
                    content: commentRes.base.msg,
                    type: "error"
                });
                return;
            }
            //TODO impl api
            // const commentsRes = await api.commentService.under_notify({
            //     nid: notify.id
            // });
            const commentsRes = await mockComments()
            if (commentsRes.base.code !== 200) {
                showNotification({
                    title: "刷新评论列表失败",
                    content: commentsRes.base.msg,
                    type: "error"
                });
            } else {
                setComments(commentsRes.comments);
            }
        } else {
            const replyRes = await api.commentService.add({
                parent: notify.id,
                content: commentContent,
                name: userInfo?.name ?? "",
                avatar: userInfo?.avatar ?? "",
            });
            if (replyRes.base.code !== 200) {
                showNotification({
                    title: "添加回复失败",
                    content: replyRes.base.msg,
                    type: "error"
                });
                return;
            }
            //TODO impl api
            // const commentsRes = await api.commentService.under_notify({
            //     nid: notify.id
            // });
            const commentsRes = await mockComments()
            if (commentsRes.base.code !== 200) {
                showNotification({
                    title: "刷新评论列表失败",
                    content: commentsRes.base.msg,
                    type: "error"
                });
            } else {
                setComments(commentsRes.comments);
            }
        }
        setCommentContent("");
        setFocusComment(false);
    };

    const setReplyTo = (name: string, cid: string) => {
        setCommentPlaceholder("回复@" + name);
        setCommentParent(cid);
        setFocusComment(true);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.comment-input-container')) {
                setFocusComment(false);
                setCommentParent(null);
                setCommentPlaceholder("想说些什么?");
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="p-6 min-h-screen bg-surface text-on-surface">
            {notify && (
                <div className="max-w-4xl mx-auto space-y-6">
                    <AnimatedContent
                        distance={100}
                        reverse={true}
                        config={{ tension: 80, friction: 20 }}
                    >
                        <div className="bg-surface-container rounded-3xl p-6 shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <h1 className="text-3xl font-bold text-on-surface">{notify.title}</h1>
                                <button
                                    onClick={likeAction}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${isLike ? 'bg-primary text-on-primary' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                                >
                                    <FontAwesomeIcon icon={isLike ? faHeartSolid : faHeartRegular} />
                                    <span>{notify.favorite}</span>
                                </button>
                            </div>
                            <div className="prose prose-sm max-w-none text-on-surface-variant">
                                {notify.content}
                            </div>
                            {notify.file && (
                                <div className="mt-6 p-4 bg-surface-container-high rounded-2xl flex items-center gap-4 hover:bg-surface-container-highest transition-colors cursor-pointer">
                                    <FontAwesomeIcon icon={faFile} className="text-2xl text-primary" />
                                    <div className="flex-1">
                                        <a href={notify.file} target="_blank" rel="noopener noreferrer" className="text-on-surface hover:underline">
                                            附件下载
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </AnimatedContent>

                    <div className={`w-full flex flex-row items-center space-x-3`}>
                        <div className={`text-3xl`}>评论</div>
                        <div className={`text-outline text-xl`}>{comments.length}</div>
                    </div>
                    <div className="w-full flex flex-col space-y-4">
                        <div className="w-full p-3 flex items-center gap-4">
                            <OssImage
                                url={userInfo?.avatar ?? ""}
                                className="w-18 aspect-square shrink-0 rounded-full"
                            />
                            <div className="flex-1 relative comment-input-container" onClick={e => e.stopPropagation()}>
                                <input
                                    type="text"
                                    className={`w-full px-4 py-3 rounded-2xl transition-all duration-200
                    border-2 ${focusComment ?
                                            "border-primary bg-secondary-container" :
                                            "border-outline hover:border-on-surface"}
                    focus:outline-none focus:ring-2 focus:ring-primary/30
                    placeholder:text-on-surface/60`}
                                    onFocus={() => setFocusComment(true)}
                                    // onBlur={() => setFocusComment(false)}
                                    placeholder={commentPlaceholder}
                                    value={commentContent}
                                    onChange={e => setCommentContent(e.target.value)}
                                    style={{ textIndent: "0.5rem" }}
                                />
                                {focusComment && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2" >
                                        <button
                                            className="px-2 py-1 text-sm text-primary hover:bg-primary/10 rounded-lg"
                                            onClick={() => {
                                                setCommentParent(null);
                                                setCommentPlaceholder("想说些什么?")
                                            }}
                                        >
                                            取消
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={`flex justify-end px-3 ${focusComment ? `max-h-96` : `max-h-0`} transition-all duration-300 overflow-hidden`}>
                            <IconButton
                                text="提交"
                                onClick={async () => {
                                    await SubmitComment()
                                }}
                                className="bg-primary-container text-on-primary-container
                                hover:bg-primary-container/90 space-x-3"
                            ><FontAwesomeIcon icon={faPaperPlane} /></IconButton>
                        </div>
                    </div>


                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4 text-on-surface">评论</h2>
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <CommentStrip
                                    key={comment.id}
                                    comment={comment}
                                    onReply={(name, id) => setReplyTo(name, id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


async function mockComments() {
    return {
        base: {
            code: 200,
            msg: "success"
        },
        comments: [
            {
                id: "1",
                ascription: "user1",
                avatar: "ks-user-avatar/beriholic.jpg",
                content: "这是一条测试评论",
                name: "用户1",
                parent: "0",
                time: "2024-01-01 12:00:00",
                children: 2
            },
            {
                id: "2",
                ascription: "user2",
                avatar: "ks-user-avatar/beriholic.jpg",
                content: "这是另一条测试评论",
                name: "用户2",
                parent: "0",
                time: "2024-01-01 13:00:00",
                children: 0
            }
        ]
    }
}