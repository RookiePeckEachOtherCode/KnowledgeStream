"use client"
import {useEffect, useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faHeart as faHeartRegular} from "@fortawesome/free-regular-svg-icons"
import {faHeart as faHeartSolid} from "@fortawesome/free-solid-svg-icons"
import {useRouter} from "next/navigation"
import {api} from "@/api/instance";
import {Notification} from "@/api/internal/model/static/base-resp";


export function NotificationList() {
    const [notifications, setNotifications] = useState<Array<Notification>>([])
    const router = useRouter()

    useEffect(() => {
        const fetchNotifications = async () => {
            const res = await api.notifyService.all()
            if (res.base.code === 200) {
                setNotifications(res.notifications)
            }
        }
        fetchNotifications()
    }, [])

    const handleNotificationClick = (id: string, cid: string) => {
        router.push(`/course/${cid}/notify?id=${id}`)
    }

    return (
        <div className="p-6 min-h-screen bg-surface w-full">
            <div className="w-full mx-auto space-y-6 px-4">
                <h1 className="text-3xl font-bold text-on-surface mb-6">通知列表</h1>
                {notifications.length === 0 ? (
                    <div className="text-center text-on-surface-variant py-12">暂无通知</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification.id, notification.cid)}
                                className="bg-surface-container rounded-2xl p-6 shadow-md hover:bg-surface-container-high transition-colors cursor-pointer relative group"
                            >
                                {!notification.read && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
                                )}
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-xl font-semibold text-on-surface">{notification.title}</h2>
                                    <div className="flex items-center gap-2 text-primary">
                                        <FontAwesomeIcon icon={notification.faved ? faHeartSolid : faHeartRegular}/>
                                        <span>{notification.favorite}</span>
                                    </div>
                                </div>
                                <p className="text-on-surface-variant mb-4 line-clamp-2">{notification.content}</p>
                                <span className="text-sm">{notification.time}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}