"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useNotification } from "@/context/notification-provider"
import AnimatedContent from "@/app/components/animated-content"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFile } from "@fortawesome/free-solid-svg-icons"
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons"
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons"

export default function NotifyPage() {
    const searchParams = useSearchParams()
    const [notify, setNotify] = useState<MockNotifacitionType | null>(null)
    const { showNotification } = useNotification()
    const [isLike, setIsLike] = useState<boolean>(false)

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
            const res = await mockNotifacition(id ?? "")
            if (res.base.code !== 200) {
                showNotification({
                    title: "获取课程数据失败",
                    content: res.base.msg,
                    type: "error"
                })
                return
            }
            setNotify(res.notifaciton)
            setIsLike(res.notifaciton.isLike)
        }
        fetchNotifyData()

    }, [searchParams, showNotification])

    return (
        <div className="p-6 min-h-screen bg-surface">
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
                </div>
            )}
        </div>
    )
}


interface MockNotifacitionDataType {
    base: {
        code: number,
        msg: string
    },
    notifaciton: MockNotifacitionType
}

interface MockNotifacitionType {
    content: string,
    file: string,
    cid: string,
    favorite: number,
    read: boolean,
    id: string,
    title: string,
    isLike: boolean
}

async function mockNotifacition(cid: string): Promise<MockNotifacitionDataType> {
    console.log(cid)
    return {
        base: {
            code: 200,
            msg: "success"
        },
        notifaciton: {
            content: "老师发布了新的课程内容",
            file: "http://mock.file.com/韭菜动力学第七章.pdf",
            cid: "114514",
            favorite: 233,
            read: false,
            id: "1",
            title: "课程更新通知",
            isLike: false
        }
    }
}