"use client"
import { useNotification } from "@/context/notification-provider"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { faPlayCircle, faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import AnimatedContent from "@/app/components/animated-content";
import { api } from "@/api/instance";


export default function CoursePage({
    params,
}: {
    params: Promise<{ cid: string }>;
}) {
    const [cid, setCid] = useState("")
    const router = useRouter()
    const { showNotification } = useNotification()
    const [courseData, setCourseData] = useState<MockCourseDataType | null>(null)
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
    const [courseNotify, setCourseNotify] = useState<Array<MockNotifacitionType>>([])

    const gotoPlay = (id: string) => {
        router.push(`/play/${id}`)
    }
    const gotoNotification = (index: number, id: string) => {
        if (courseNotify[index].read) {
            //TODO impl api
            setCourseNotify((prev) => {
                const newData = [...prev]
                newData[index].read = true
                return newData
            })
        }

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
        const fetchCourseData = async () => {
            const cid = (await params).cid
            const res = await mockData(cid)
            if (res.base.code !== 200) {
                showNotification({
                    title: "获取课程数据失败",
                    content: res.base.msg,
                    type: "error"
                })
                return
            }

            setCid(cid)
            setCourseData(res)
        }

        fetchCourseData()
    }, [params, showNotification])
    useEffect(() => {
        const fetchCourseNotify = async () => {
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
        }

        fetchCourseNotify()
    }, [params, showNotification])


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
                            reverse={true}
                            config={{ tension: 80, friction: 20 }}
                        >
                            <div className="bg-surface-container rounded-3xl p-6 shadow-md">
                                <h1 className="text-3xl font-bold text-on-surface mb-4">{courseData.name}</h1>
                                <div className="flex items-start space-x-4">
                                    <img
                                        src={courseData.techer.avatar}
                                        alt={courseData.techer.name}
                                        className="w-12 h-12 rounded-full"
                                    />
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
                                <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-scroll  pr-2 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-surface-container-highest hover:scrollbar-thumb-primary">
                                    {courseNotify.map((notify, index) => (
                                        <div
                                            key={index}
                                            className="p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container-high transition-colors relative group cursor-pointer mt-2"
                                            onClick={() => gotoNotification(index, notify.id)}
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
                                    ))}
                                    {courseNotify.length === 0 && (
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


interface MockCourseDataType {
    id: string,
    name: string,
    techer: {
        id: string,
        name: string
        avatar: string
        signatrue: string
    },
    list: Array<{
        id: string,
        section_number: string,
        section_name: string,
        video_id: string
    }>
}

interface MockRequestType {
    base: {
        code: number,
        msg: string
    },
    id: string,
    name: string,
    techer: {
        id: string,
        name: string,
        avatar: string,
        signatrue: string
    },
    list: Array<{
        id: string,
        section_number: string,
        section_name: string,
        video_id: string
    }>
}

async function mockData(cid: string): Promise<MockRequestType> {
    console.log(cid)
    return {
        base: {
            code: 200,
            msg: "success"
        },
        id: "114514",
        name: "韭菜动力学",
        techer: {
            id: "1919810",
            name: "罗民西",
            avatar: "https://tse3-mm.cn.bing.net/th/id/OIP-C.huUG6H4rNQYhb6yiOl9ZugHaHW?rs=1&pid=ImgDetMain",
            signatrue: "我会使用指针拨动整个计算机世界！！！",
        },
        list: [
            {
                id: "1",
                section_number: "章节1",
                section_name: "韭菜的起源(上)",
                video_id: "1"
            },
            {
                id: "1",
                section_number: "章节1",
                section_name: "韭菜的起源(下)",
                video_id: "1"
            },
            {
                id: "2",
                section_number: "章节2",
                section_name: "韭菜的心理(上)",
                video_id: "20"
            },
            {
                id: "2",
                section_number: "章节2",
                section_name: "韭菜的心理(中)",
                video_id: "20"
            },
            {
                id: "2",
                section_number: "章节2",
                section_name: "韭菜的心理(下)",
                video_id: "20"
            },
            {
                id: "3",
                section_number: "章节3",
                section_name: "趣谈波动韭菜的指针(上)",
                video_id: "3"
            },
            {
                id: "3",
                section_number: "章节3",
                section_name: "趣谈波动韭菜的指针(下)",
                video_id: "3"
            },
            {
                id: "4",
                section_number: "章节4",
                section_name: "韭菜的动力",
                video_id: "4"
            },
            {
                id: "5",
                section_number: "章节5",
                section_name: "噶韭菜的方法",
                video_id: "5"
            },
            {
                id: "6",
                section_number: "章节6",
                section_name: "韭菜可持续发展的路径",
                video_id: "6"
            }
        ]
    }
}

interface MockNotifacitionDataType {
    base: {
        code: number,
        msg: string
    },
    notifacitons: Array<MockNotifacitionType>
}

interface MockNotifacitionType {
    content: string,
    file: string,
    cid: string,
    favorite: number,
    read: boolean,
    id: string,
    title: string
}
async function mockNotifacition(cid: string): Promise<MockNotifacitionDataType> {
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
                cid: "114514",
                favorite: 233,
                read: false,
                id: "1",
                title: "课程更新通知"
            },
            {
                content: "请同学们及时完成作业",
                file: "http://mock.file.com/韭菜动力学作业.pdf",
                cid: "114514",
                favorite: 114,
                read: true,
                id: "2",
                title: "作业提醒"
            },
            {
                content: "下周二进行线上答疑",
                file: "",
                cid: "114514",
                favorite: 514,
                read: false,
                id: "3",
                title: "答疑通知"
            },
            {
                content: "期中考试安排已发布",
                file: "http://mock.file.com/期中考试大纲.pdf",
                cid: "114514",
                favorite: 999,
                read: false,
                id: "4",
                title: "考试通知"
            },
            {
                content: "关于韭菜动力学实验课程的安排",
                file: "http://mock.file.com/实验指导书.pdf",
                cid: "114514",
                favorite: 456,
                read: true,
                id: "5",
                title: "实验课通知"
            },
            {
                content: "请查看最新的课程参考资料",
                file: "http://mock.file.com/韭菜动力学进阶读物.pdf",
                cid: "114514",
                favorite: 789,
                read: false,
                id: "6",
                title: "学习资料更新"
            },
            {
                content: "课程大纲有重要更新",
                file: "http://mock.file.com/韭菜动力学大纲V2.pdf",
                cid: "114514",
                favorite: 321,
                read: true,
                id: "7",
                title: "课程大纲更新"
            },
            {
                content: "关于期末项目展示的具体安排",
                file: "http://mock.file.com/项目展示要求.pdf",
                cid: "114514",
                favorite: 567,
                read: false,
                id: "8",
                title: "项目展示通知"
            },
            {
                content: "韭菜动力学竞赛报名开始",
                file: "http://mock.file.com/竞赛规则.pdf",
                cid: "114514",
                favorite: 888,
                read: false,
                id: "9",
                title: "竞赛通知"
            },
            {
                content: "课程教材勘误表发布",
                file: "http://mock.file.com/勘误说明.pdf",
                cid: "114514",
                favorite: 234,
                read: true,
                id: "10",
                title: "教材勘误"
            },
            {
                content: "期末复习重点指南",
                file: "http://mock.file.com/复习指南.pdf",
                cid: "114514",
                favorite: 777,
                read: false,
                id: "11",
                title: "复习指导"
            },
        ]
    }
}