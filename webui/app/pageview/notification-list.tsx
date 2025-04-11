"use client"
import { NotifyServiceResponse } from "@/api/internal/model/response/notify"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons"
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons"
import { useRouter } from "next/navigation"

export function NotificationList() {
    const [notifications, setNotifications] = useState<NotifyServiceResponse['COURSE_NOTIFY']['notifacitons']>([])
    const router = useRouter()

    useEffect(() => {
        const fetchNotifications = async () => {
            // const res = await api.notifyService.all()
            const res = await mockNotifacition("114514")
            if (res.base.code === 200) {
                setNotifications(res.notifacitons)
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
                                        <FontAwesomeIcon icon={notification.faved ? faHeartSolid : faHeartRegular} />
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

async function mockNotifacition(cid: string): Promise<NotifyServiceResponse['COURSE_NOTIFY']> {
    console.log(cid)
    return {
        base: {
            code: 200,
            msg: "success"
        },
        notifacitons: [
            {
                content: "老师发布了新的课程内容",
                file: "http://mock.file.com/韭菜动力学第七章.pdf",
                cid: "1",
                favorite: 233,
                read: false,
                id: "1",
                title: "课程更新通知[mock数据]",
                time: "2023-05-20 12:00:00",
                faved: false
            },
            {
                content: "请同学们及时完成作业",
                file: "http://mock.file.com/韭菜动力学作业.pdf",
                cid: "114514",
                favorite: 114,
                read: true,
                id: "2",
                title: "作业提醒[mock数据]",
                time: "2023-05-19 15:30:00",
                faved: false
            },
            {
                content: "下周二进行线上答疑",
                file: "",
                cid: "114514",
                favorite: 514,
                read: false,
                id: "3",
                title: "答疑通知[mock数据]",
                time: "2023-05-18 09:00:00",
                faved: false
            },
            {
                content: "期中考试安排已发布",
                file: "http://mock.file.com/期中考试大纲.pdf",
                cid: "114514",
                favorite: 999,
                read: false,
                id: "4",
                title: "考试通知[mock数据]",
                time: "2023-05-17 14:20:00",
                faved: false
            },
            {
                content: "关于韭菜动力学实验课程的安排",
                file: "http://mock.file.com/实验指导书.pdf",
                cid: "114514",
                favorite: 456,
                read: true,
                id: "5",
                title: "实验课通知[mock数据]",
                time: "2023-05-16 11:45:00",
                faved: false
            },
            {
                content: "请查看最新的课程参考资料",
                file: "http://mock.file.com/韭菜动力学进阶读物.pdf",
                cid: "114514",
                favorite: 789,
                read: false,
                id: "6",
                title: "学习资料更新[mock数据]",
                time: "2023-05-15 16:30:00",
                faved: false
            },
            {
                content: "课程大纲有重要更新",
                file: "http://mock.file.com/韭菜动力学大纲V2.pdf",
                cid: "114514",
                favorite: 321,
                read: true,
                id: "7",
                title: "课程大纲更新[mock数据]",
                time: "2023-05-14 10:15:00",
                faved: false
            },
            {
                content: "关于期末项目展示的具体安排",
                file: "http://mock.file.com/项目展示要求.pdf",
                cid: "114514",
                favorite: 567,
                read: false,
                id: "8",
                title: "项目展示通知[mock数据]",
                time: "2023-05-13 13:40:00",
                faved: false
            },
            {
                content: "韭菜动力学竞赛报名开始",
                file: "http://mock.file.com/竞赛规则.pdf",
                cid: "114514",
                favorite: 888,
                read: false,
                id: "9",
                title: "竞赛通知[mock数据]",
                time: "2023-05-12 08:50:00",
                faved: false
            },
            {
                content: "课程教材勘误表发布",
                file: "http://mock.file.com/勘误说明.pdf",
                cid: "114514",
                favorite: 234,
                read: true,
                id: "10",
                title: "教材勘误[mock数据]",
                time: "2023-05-11 17:25:00",
                faved: false
            },
            {
                content: "期末复习重点指南",
                file: "http://mock.file.com/复习指南.pdf",
                cid: "114514",
                favorite: 777,
                read: false,
                id: "11",
                title: "复习指导[mock数据]",
                time: "2023-05-10 14:55:00",
                faved: false
            },
        ]
    }
}