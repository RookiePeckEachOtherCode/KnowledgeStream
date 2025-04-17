"use client"
import { useNotification } from "@/context/notification-provider"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { faPlayCircle, faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import AnimatedContent from "@/app/components/animated-content";
import { api } from "@/api/instance";
import { NotifyType } from "@/api/internal/model/response/notify";
import MDButton from "@/app/components/md-button";
import { UserAuthority } from "@/api/internal/service/user";
import { OssImage } from "@/app/components/oss-midea";
import { CourseDataVO, fetchCourseData } from "../vo";


export default function CoursePage({
    params,
}: {
    params: Promise<{ cid: string }>;
}) {
    const [cid, setCid] = useState("")
    const router = useRouter()
    const { showNotification } = useNotification()
    const [courseData, setCourseData] = useState<CourseDataVO | null>(null)
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
    const [courseNotify, setCourseNotify] = useState<Array<NotifyType>>([])
    const [isNotifyLoading, setIsNotifyLoading] = useState(true)
    //mock true
    const [isTeacher, setIsTeacher] = useState(true)

    const gotoPlay = (id: string) => {
        router.push(`/play/${id}`)
    }
    const gotoNotification = (id: string) => {
        router.push(`/course/${cid}/notify?id=${id}`)
    }

    const toggleSection = (sectionNumber: string) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev)
            if (newSet.has(sectionNumber)) {
                newSet.delete(sectionNumber)
            } else {
                newSet.add(sectionNumber)
            }
            return newSet
        })
    }

    const groupedSections = courseData ? Object.entries(
        courseData.list.reduce((acc, section) => {
            if (!acc[section.section_number]) {
                acc[section.section_number] = []
            }
            acc[section.section_number].push(section)
            return acc
        }, {} as Record<string, typeof courseData.list>)
    ) : []

    useEffect(() => {
        const fetchData = async () => {
            const cid = (await params).cid
            const res = await fetchCourseData(cid)
            if (res.base.code !== 200) {
                showNotification({
                    title: "获取课程数据失败",
                    content: res.base.msg,
                    type: "error"
                })
                return
            }
            setCid(cid)
            setCourseData(res.data)
        }
        fetchData()
    }, [params, showNotification])
    useEffect(() => {
        const fetchCourseNotify = async () => {
            setIsNotifyLoading(true)
            try {
                const cid = (await params).cid
                const res = await api.notifyService.courseNotifyList({ cid })
                if (res.base.code !== 200) {
                    showNotification({
                        title: "获取课程通知失败",
                        content: res.base.msg,
                        type: "error"
                    })
                    return
                }
                setCourseNotify(res.notifacitons)
            } finally {
                setIsNotifyLoading(false)
            }
        }

        fetchCourseNotify()
    }, [params, showNotification])

    useEffect(() => {
        if (localStorage.getItem("authority") === UserAuthority.Teacher) {
            setIsTeacher(true)
        }
    }, [])

    const gotoTecher = () => {
        if (!courseData?.techer.id) return
        router.push(`/techer/${courseData.techer.id}`)
    }

    return (
        <div className="p-6 min-h-screen bg-surface">
            {courseData && (
                <div className="max-w-7xl mx-auto flex gap-6">
                    <div className="flex-1 space-y-6">
                        <AnimatedContent
                            distance={100}
                            reverse={false}
                            config={{ tension: 80, friction: 20 }}
                        >
                            <div className="bg-surface-container rounded-3xl p-6 shadow-md">
                                <div className="flex justify-between items-center">
                                    <h1 className="text-3xl font-bold text-on-surface mb-4">{courseData.name}</h1>
                                    {isTeacher && (
                                        <MDButton onClick={() => router.push(`/course/edit/${cid}`)}>修改课程</MDButton>
                                    )}
                                </div>
                                <div className="flex items-start space-x-4">
                                    <OssImage className="size-12 rounded-full" url={courseData.techer.avatar} />
                                    <div className="flex flex-col">
                                        <span className="text-on-surface-variant text-xl hover:underline cursor-pointer" onClick={() => { gotoTecher() }}>{courseData.techer.name}</span>
                                        <span className="text-sm text-on-surface-variant mt-1 italic">{courseData.techer.signatrue}</span>
                                    </div>
                                </div>
                            </div>
                        </AnimatedContent>


                        <AnimatedContent
                            distance={100}
                            reverse={false}
                            config={{ tension: 80, friction: 20 }}
                        >
                            <div className="bg-surface-container rounded-3xl p-6 shadow-md">
                                <h2 className="text-xl font-semibold text-on-surface mb-4">课程章节</h2>
                                <div className="space-y-3">
                                    {groupedSections.map(([sectionNumber, sections]) => (
                                        <div key={sectionNumber} className="bg-surface-container-low rounded-2xl overflow-hidden">
                                            <div
                                                onClick={() => toggleSection(sectionNumber)}
                                                className="p-4 bg-surface-container-high hover:bg-surface-container-highest transition-colors cursor-pointer flex items-center justify-between"
                                            >
                                                <h3 className="font-medium text-on-surface text-lg flex items-center gap-2">
                                                    <FontAwesomeIcon
                                                        icon={expandedSections.has(sectionNumber) ? faChevronDown : faChevronRight}
                                                        className="w-4 h-4"
                                                    />
                                                    {sectionNumber}
                                                </h3>
                                                <span className="text-on-surface-variant text-sm">{sections.length} 小节</span>
                                            </div>
                                            <div className={`transition-all duration-300 ${expandedSections.has(sectionNumber) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                                {sections.map((section) => (
                                                    <div
                                                        key={`${section.id}-${section.section_name}`}
                                                        className="p-4 hover:bg-surface-container-highest transition-colors cursor-pointer border-t border-outline/10"
                                                        onClick={() => gotoPlay(section.video_id)}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-on-surface-variant">{section.section_name}</p>
                                                            <button className="text-xl text-primary hover:cursor-pointer">
                                                                <FontAwesomeIcon icon={faPlayCircle} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </AnimatedContent>
                    </div>

                    <div className="w-80 shrink-0">
                        <AnimatedContent
                            distance={100}
                            reverse={false}
                            direction="horizontal"
                            config={{ tension: 80, friction: 20 }}
                        >
                            <div className="bg-surface-container rounded-3xl p-6 shadow-md sticky top-6">
                                <h2 className="text-xl font-semibold text-on-surface mb-4">课程通知</h2>
                                <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-scroll pr-2 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-surface-container-highest hover:scrollbar-thumb-primary">
                                    {isNotifyLoading ? (
                                        <div className="text-center text-on-surface-variant py-4">
                                            Loading notifications...
                                        </div>
                                    ) : courseNotify && courseNotify.length > 0 ? (
                                        courseNotify.map((notify, index) => (
                                            <div
                                                key={index}
                                                className="p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container-high transition-colors relative group cursor-pointer mt-2"
                                                onClick={() => gotoNotification(notify.id)}
                                            >
                                                {!notify.read && (
                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
                                                )}
                                                <h3 className="font-medium text-on-surface flex items-center justify-between">
                                                    <span>{notify.title}</span>
                                                    <span className="text-xs text-on-surface-variant">
                                                        {notify.read ? "已读" : "未读"}
                                                    </span>
                                                </h3>
                                                <p className="text-sm text-on-surface-variant mt-2">{notify.content}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-on-surface-variant py-4">
                                            暂无通知
                                        </div>
                                    )}
                                </div>
                            </div>
                        </AnimatedContent>
                    </div>
                </div>
            )}
        </div>
    )
};
