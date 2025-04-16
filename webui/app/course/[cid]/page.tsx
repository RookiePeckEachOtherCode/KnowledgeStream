"use client"
import {useNotification} from "@/context/notification-provider"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {useEffect, useState} from "react"
import {faPlayCircle, faChevronDown, faChevronRight, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/navigation";
import AnimatedContent from "@/app/components/animated-content";
import {api} from "@/api/instance";
import {NotifyType} from "@/api/internal/model/response/notify";
import {func} from "prop-types";
import {useModal} from "@/context/modal-provider";
import {IconButton} from "@/app/components/icon-button";
import MDButton from "@/app/components/md-button";


export default function CoursePage({
                                       params,
                                   }: {
    params: Promise<{ cid: string }>;
}) {
    const [cid, setCid] = useState("")
    const router = useRouter()
    const {showNotification} = useNotification()
    const [courseData, setCourseData] = useState<MockCourseDataType | null>(null)
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
    const [courseNotify, setCourseNotify] = useState<Array<NotifyType>>([])
    const [isNotifyLoading, setIsNotifyLoading] = useState(true)
    const {isShow, toggleShowModal, setForm} = useModal()

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

    const createNotification = async () => {
        await setForm(<CreateNotificationForm
            key={Date.now()}
            cid={cid}/>)
        toggleShowModal(true);

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
            setIsNotifyLoading(true)
            try {
                const cid = (await params).cid
                const res = await api.notifyService.courseNotifyList({cid})
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
                            config={{tension: 80, friction: 20}}
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
                                        <span className="text-on-surface-variant text-xl hover:underline cursor-pointer"
                                              onClick={() => {
                                                  gotoTecher()
                                              }}>{courseData.techer.name}</span>
                                        <span
                                            className="text-sm text-on-surface-variant mt-1 italic">{courseData.techer.signatrue}</span>
                                    </div>
                                </div>
                            </div>
                        </AnimatedContent>


                        <AnimatedContent
                            distance={100}
                            reverse={false}
                            config={{tension: 80, friction: 20}}
                        >
                            <div className="bg-surface-container rounded-3xl p-6 shadow-md">
                                <h2 className="text-xl font-semibold text-on-surface mb-4">课程章节</h2>
                                <div className="space-y-3">
                                    {groupedSections.map(([sectionNumber, sections]) => (
                                        <div key={sectionNumber}
                                             className="bg-surface-container-low rounded-2xl overflow-hidden">
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
                                                <span
                                                    className="text-on-surface-variant text-sm">{sections.length} 小节</span>
                                            </div>
                                            <div
                                                className={`transition-all duration-300 ${expandedSections.has(sectionNumber) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                                {sections.map((section) => (
                                                    <div
                                                        key={`${section.id}-${section.section_name}`}
                                                        className="p-4 hover:bg-surface-container-highest transition-colors cursor-pointer border-t border-outline/10"
                                                        onClick={() => gotoPlay(section.video_id)}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-on-surface-variant">{section.section_name}</p>
                                                            <button
                                                                className="text-xl text-primary hover:cursor-pointer">
                                                                <FontAwesomeIcon icon={faPlayCircle}/>
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
                    <div className={`flex flex-col items-center `}>

                        <div className="w-80 shrink-0 ">
                            <AnimatedContent
                                distance={100}
                                reverse={false}
                                direction="horizontal"
                                config={{tension: 80, friction: 20}}
                            >
                                <div className="bg-surface-container rounded-3xl p-6 shadow-md sticky top-6 ">
                                    <h2 className="text-xl font-semibold text-on-surface mb-4">课程通知</h2>
                                    <div
                                        className="space-y-4 max-h-[calc(100vh-12rem)] scroll-auto pr-2 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-surface-container-highest hover:scrollbar-thumb-primary">
                                        {isNotifyLoading ? (
                                            <div className="text-center text-on-surface-variant py-4">
                                                Loading notifications...
                                            </div>
                                        ) : courseNotify && courseNotify.length > 0 ? (
                                            courseNotify.map((notify, index) => (
                                                <div
                                                    key={index}
                                                    className="p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container-high transition-colors relative group cursor-pointer mt-2"
                                                    onClick={() => gotoNotification(index, notify.id)}
                                                >
                                                    {!notify.read && (
                                                        <div
                                                            className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
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
                            <AnimatedContent
                                distance={100}
                                reverse={false}
                                direction="horizontal"
                                config={{tension: 80, friction: 20}}
                            >
                                <div className={`w-full mt-8  flex items-center justify-center`}>
                                    <IconButton
                                        text={"发送通知"}
                                        onClick={createNotification}
                                        className={`w-1/2 h-12 bg-inverse-primary space-x-3 text-on-primary-container`}>
                                        <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
                                    </IconButton>
                                </div>
                            </AnimatedContent>

                        </div>
                    </div>


                </div>
            )}
        </div>
    )
};

interface CreateNotificationFormProps {
    cid: string
}

function CreateNotificationForm({cid}: CreateNotificationFormProps) {
    const [content, setContent] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState("");
    const [fileSize, setFileSize] = useState("");
    const {isShow, toggleShowModal, setForm} = useModal()
    const MAX_FILE_SIZE_MB = 500; // 最大500MB
    const BYTES_PER_MB = 1024 * 1024;

    var {showNotification} = useNotification();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 检查文件大小
        if (file.size > MAX_FILE_SIZE_MB * BYTES_PER_MB) {
            showNotification({
                title: "文件过大",
                content: `最大限制为${MAX_FILE_SIZE_MB}MB`,
                type: "error"
            })
            e.target.value = ""; // 清空文件输入
            setFile(null);
            setFileName("");
            setFileSize("");
            return;
        }

        // 计算并格式化文件大小
        const sizeInMB = (file.size / BYTES_PER_MB).toFixed(2);

        setFile(file);
        setFileName(file.name);
        setFileSize(`${sizeInMB} MB`);
    };

    return (
        <div className={`w-1/2 h-1/2 bg-secondary flex flex-col p-6 rounded-2xl space-y-3`}
             onClick={e => e.stopPropagation()}>
            <div className={`w-full flex flex-row items-end space-x-3`}>
                <div className={`text-2xl text-on-secondary`}>发起通知</div>
                <div className={`text-outline`}>当前课程id:{cid}</div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-on-secondary">
                    通知内容
                </label>

                <textarea
                    value={content || ''}
                    onChange={e => setContent(e.target.value)}
                    className="w-full p-3 rounded-lg border bg-secondary-container text-on-surface h-24"
                    placeholder="输入内容"
                />
            </div>
            <div className={`space-y-2 space-x-3`}>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileUpload"
                />
                <label
                    htmlFor="fileUpload"
                    className="px-4 py-2 bg-on-secondary-fixed-variant text-on-primary-container rounded-lg cursor-pointer hover:bg-primary-hover transition-colors"
                >
                    选择附件
                </label>
                {fileName && (
                    <span className="text-on- truncate max-w-[300px]">
            {fileName} ({fileSize})
          </span>
                )}
            </div>
            <div className={`w-full flex flex-row items-center justify-center`}>
                <div className={`w-1/2 flex-row justify-between flex`}>
                    <MDButton className={`w-24 h-12 `}>
                        <div>发送</div>
                    </MDButton>
                    <MDButton className={`w-24 h-12 bg-error-container`}>
                        <div>取消</div>
                    </MDButton>
                </div>
            </div>


        </div>

    )


}


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
