import { useEffect, useState } from "react";
import { OssImage } from "@/app/components/oss-midea";
import { Comment } from "@/api/internal/model/static/base-resp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowAltCircleDown,
    faArrowAltCircleRight,
    faReply
} from "@fortawesome/free-solid-svg-icons";
import { api } from "@/api/instance";


interface CommentStripProps {
    comment: Comment;
    className?: string;
    onReply?: (name: string, cid: string) => void;
}

export function CommentStrip({
    comment,
    className,
    onReply
}: CommentStripProps) {
    const [childrenComment, setChildrenComment] = useState<Array<Comment>>([])
    const [openChildren, setOpenChildren] = useState(false)

    const visibleComments = openChildren
        ? childrenComment
        : childrenComment.slice(0, 1)

    useEffect(() => {
        async function fetchData() {
            const childrenCommentRes = await api.commentService.under_comment({
                parent: comment.id,
                size: 1
            });
            if (childrenCommentRes.base.code !== 200) {
                setChildrenComment([])
            } else {
                setChildrenComment(childrenCommentRes.comments)
            }
        }
        fetchData()
    }, [comment.id]);
    useEffect(() => {
        async function fetchData() {
            const childrenCommentRes = await api.commentService.under_comment({
                parent: comment.id,
                size: comment.children + 1
            });
            if (childrenCommentRes.base.code !== 200) {
                setChildrenComment([])
            } else {
                setChildrenComment(childrenCommentRes.comments)
            }
        }
        fetchData()
    }, [comment.children, comment.id, openChildren]);



    return (
        <div className={`w-full flex flex-row ${className || ""}`}>
            <div className="w-1/10 shrink-0">
                <div className="p-3">
                    <OssImage
                        url={comment.avatar}
                        className="w-full aspect-square rounded-full"
                    />
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="p-3 flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="text-xl text-on-surface-variant">{comment.name}</div>
                        <FontAwesomeIcon
                            icon={faArrowAltCircleRight}
                            className="hover:scale-110 transition-all cursor-pointer"
                            size="xl"
                        />
                    </div>

                    <div className="text-on-background text-wrap break-words">
                        {comment.content}
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-outline">{comment.time}</div>
                        {(
                            <button
                                onClick={() => onReply?.(comment.name, comment.id)}
                                className="text-primary hover:text-primary-dark flex items-center gap-1 px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                            >
                                <FontAwesomeIcon
                                    icon={faReply}
                                    className="text-sm"
                                />
                                <span>回复</span>
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col space-y-4">
                        {visibleComments.map((child) => (
                            <div key={child.id} className="group">
                                <ChildrenList comment={child} />
                            </div>
                        ))}
                    </div>

                    {childrenComment.length > 1 && !openChildren && (
                        <div className="pt-2">
                            <button
                                onClick={() => setOpenChildren(true)}
                                className="text-primary hover:text-primary-dark flex items-center"
                            >
                                展开全部{comment.children}条回复
                                <FontAwesomeIcon
                                    icon={faArrowAltCircleDown}
                                    className="ml-2 animate-bounce"
                                    size="sm"
                                />
                            </button>
                        </div>
                    )}
                </div>
                <div className="border-b border-outline"></div>
            </div>
        </div>
    )
}

function ChildrenList({ comment }: { comment: Comment }) {
    return (
        <div className={`w-full flex flex-row`}>
            <div className={`w-1/10 h-full justify-center`}>
                <div className={`w-full p-3`}>
                    <OssImage url={comment.avatar} className={`w-full aspect-square rounded-full`}>
                    </OssImage>
                </div>
            </div>
            <div className={`w-full flex flex-col p-3 space-y-2`}>
                <div className={`w-full text-wrap break-all `}>
                    <div className={`flex flex-row space-x-3 space-y-2`}>
                        <div className={`text-on-surface-variant`}>{comment.name}</div>
                        <FontAwesomeIcon icon={faArrowAltCircleRight} className={`mr-3 hover:scale-110 transition-all duration-200 hover:cursor-pointer`} size={"xl"}></FontAwesomeIcon>
                    </div>
                    {comment.content}
                </div>
                <div className={`text-sm text-outline`}>{comment.time}</div>
            </div>

        </div>
    )
}