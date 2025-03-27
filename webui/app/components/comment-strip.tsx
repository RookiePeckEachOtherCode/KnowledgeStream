import {Children, useState} from "react";
import {OssImage} from "@/app/components/oss-midea";
import {Comment} from "@/api/internal/model/static/base-resp";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowAltCircleDown, faArrowAltCircleRight, faArrowAltCircleUp} from "@fortawesome/free-solid-svg-icons";


export function CommentStrip(
    comment: Comment,
    className?: string
) {
    const [childrenComment] = useState<Array<Comment>>([
        {
            parent: "123",
            content: "看完我直接和红球一样红温了",
            ascription: "123",
            id: "1",
            name: comment.name,
            avatar: comment.avatar,
            time: "2024-02-20 14:30"
        },
        {
            parent: "123",
            content: "看完仿佛穿越到了10年前的计算机技术栈",
            ascription: "123",
            id: "2",
            name: "其他用户",
            avatar: "another_avatar.jpg",
            time: "2024-02-20 15:00"
        },
    ])
    const [openChildren, setOpenChildren] = useState(false)

    const visibleComments = openChildren
        ? childrenComment
        : childrenComment.slice(0, 1)

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

                        <div className="text-sm text-outline">{comment.time}</div>

                    <div className="flex flex-col space-y-4">
                        {visibleComments.map((child, index) => (
                            <div key={child.id} className="group">
                                <ChildrenList comment={child}/>
                            </div>
                        ))}
                    </div>

                    {childrenComment.length > 1 && !openChildren && (
                        <div className="pt-2">
                            <button
                                onClick={() => setOpenChildren(true)}
                                className="text-primary hover:text-primary-dark flex items-center"
                            >
                                展开全部{childrenComment.length}条回复
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

function ChildrenList({comment}: { comment: Comment }) {
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