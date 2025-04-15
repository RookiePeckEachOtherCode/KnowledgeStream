import {ReactNode, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowDown,
    faBookOpen, faBuilding, faCalendarDays, faCancel,
    faChalkboardUser, faChevronDown, faChevronUp, faCommentDots,
    faEye,
    faFile, faGraduationCap,
    faKeyboard, faPenSquare, faPenToSquare, faSave, faTrash, faUpload, faUsers,
    faUserSecret,
    faUsersViewfinder
} from "@fortawesome/free-solid-svg-icons";
import {StudentFaculty, TeacherFaculty, VideoMajor, VideoPlays} from "@/api/internal/model/static/statistics";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart, PolarGrid, RadialBar, RadialBarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {CourseInfo, UserInfo, VideoInfo} from "@/api/internal/model/static/base-resp";
import MDInput from "@/app/components/md-input";
import {faKeybase} from "@fortawesome/free-brands-svg-icons";
import {Divider} from "@/app/components/divider";
import MDButton from "@/app/components/md-button";
import {IconButton} from "@/app/components/icon-button";
import {OssImage} from "@/app/components/oss-midea";
import {api} from "@/api/instance";
import {useNotification} from "@/context/notification-provider";
import {useModal} from "@/context/modal-provider";
import {CustomDatePicker} from "@/app/components/custom-date-picker.jsx";
import dayjs from "dayjs";

export function AdminPage() {
    const [pager, setPager] = useState(0)
    const Block = ["数据一览", "课程域管理", "用户数据管理", "文件管理", "权限管理"]

    const ChildrenPlayer = () => {
        switch (pager) {
            case 0:
                return <GlanceData></GlanceData>
            case 1:
                return <ManageCourse></ManageCourse>
            case 2:
                return <ManageUser></ManageUser>
            case 3:
                return <ManageFile></ManageFile>
            case 4:
                return <AuthorityControl></AuthorityControl>
            default:
                return <GlanceData></GlanceData>
        }

    }

    return (
        <div className={`w-full h-full flex flex-row p-6 space-x-8`}>
            <div
                className={`w-1/18  h-full `}>
                <div
                    className={`sticky  top-3 h-auto w-full space-y-5 pt-3 pb-3 flex items-center flex-col justify-between  rounded-2xl bg-primary-container`}>
                    {
                        Block.map((item, index) => {
                            return <NavItem
                                inUse={pager === index}
                                title={item}
                                onClick={() => setPager(index)}>
                                <div
                                    className={`${pager === index ? `text-on-secondary ` : `text-on-secondary-container`}`}>
                                    {index === 0 && <FontAwesomeIcon icon={faEye}/>}
                                    {index === 1 && <FontAwesomeIcon icon={faChalkboardUser}/>}
                                    {index === 2 && <FontAwesomeIcon icon={faUsersViewfinder}/>}
                                    {index === 3 && <FontAwesomeIcon icon={faFile}/>}
                                    {index === 4 && <FontAwesomeIcon icon={faUserSecret}/>}
                                </div>
                            </NavItem>
                        })
                    }
                </div>

            </div>
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 p-6 bg-surface-variant rounded-2xl">
                    <div className="w-full h-auto ">
                        {ChildrenPlayer()}
                    </div>
                </div>
            </div>


        </div>
    )

}

interface NavItemProps {
    title: string;
    onClick: () => void;
    children: ReactNode;
    inUse: boolean;
}

export function NavItem({title, onClick, children, inUse}: NavItemProps) {
    const [isHover, setIsHover] = useState(false);

    return (
        <div
            className={`w-1/2 aspect-square flex items-center justify-center rounded-xl relative
        bg-primary-container transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${(inUse || isHover) ? "bg-primary-fixed-dim shadow-elevation-1" : "shadow-none"}
        hover:scale-105 active:scale-95 cursor-pointer`}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={onClick}
        >
            {/* 图标容器 */}
            <div className={`w-full h-full flex items-center justify-center 
        transition-transform duration-300 ${isHover ? "scale-110" : "scale-100"}`}>
                {children}
            </div>

            {/* 浮动提示文字 */}
            <div className={`absolute left-full ml-3 top-1/2 -translate-y-1/2
        bg-secondary-container rounded-xl p-3 pointer-events-none
        transition-opacity duration-300 ${
                isHover ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            }`}
                 style={{transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)"}}>
                <div className="text-on-secondary-container text-sm whitespace-nowrap">
                    {title}
                </div>
            </div>
        </div>
    );
}

export function GlanceData() {

    const [studentFaculty, setStudentFaculty] = useState<Array<StudentFaculty>>([
        {
            faculty: "计算工程学院",
            students: 220,
        },
        {
            faculty: "工商学院",
            students: 90,
        },
        {
            faculty: "财经学院",
            students: 60,
        }, {
            faculty: "马克思学院",
            students: 30,
        },
        {
            faculty: "计算工程学院1",
            students: 220,
        },
        {
            faculty: "工商学院1",
            students: 90,
        },
        {
            faculty: "财经学院1",
            students: 60,
        }, {
            faculty: "马克思学院1",
            students: 30,
        },
    ])

    const [teacherFaculty, setTeacherFaculty] = useState<Array<TeacherFaculty>>([
        {
            faculty: "计算工程学院",
            teachers: 220,
        },
        {
            faculty: "工商学院",
            teachers: 90,
        },
        {
            faculty: "财经学院",
            teachers: 60,
        }, {
            faculty: "马克思学院",
            teachers: 30,
        },
    ])
    const COLORS = [
        '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
        '#6f5141', '#9C27B0', '#4CAF50', '#E91E63',
        '#795548', '#2196F3', '#FF9800', '#009688'
    ];

    const [videoMajor, setVideoMajor] = useState<Array<VideoMajor>>([
        {
            major: "软件工程",
            videos: 100,
        },
        {
            major: "区块链开发",
            videos: 60,
        },
        {
            major: "计算机科学",
            videos: 32,
        },
        {
            major: "英语",
            videos: 8,
        }
    ])
    const [videoPlays, setVideoPlays] = useState<Array<VideoPlays>>([
        {
            video: "C++指针应用",
            plays: 1000,
        },
        {
            video: "五十音图",
            plays: 600,
        },
        {
            video: "基础交易形态",
            plays: 2000,
        },
        {
            video: "k线动能和支撑",
            plays: 30,
        },

    ])
    const [offset, setOffset] = useState(0)
    const [size, setSize] = useState(10)
    const [currentTarget, setCurrentTarget] = useState()
    const {showNotification} = useNotification();

    const GetStudentFacultyData = async () => {
        const sfRes = await api.statisticService.studentFaculty({
            offset: offset,
            size: size
        });
        if (sfRes.base.code !== 200) {
            showNotification({
                title: "暂时无法获取学生学院信息",
                content: "",
                type: "info"
            })
        } else {
            setStudentFaculty(sfRes.datas)
        }
    }

    const GetTeacherFacultyData = async () => {
        const tfRes = await api.statisticService.teacherFaculty({
            offset: offset,
            size: size
        });
        if (tfRes.base.code !== 200) {
            showNotification({
                title: "暂时无法获取学生学院信息",
                content: "",
                type: "info"
            })
        } else {
            setTeacherFaculty(tfRes.datas)
        }
    }
    const GetPlayCntData = async () => {
        const pcRes = await api.statisticService.videoPlays({
            offset: offset,
            size: size
        })
        if (pcRes.base.code !== 200) {
            showNotification({
                title: "暂时无法获取视频播放数据",
                content: "",
                type: "info"
            })
        } else {
            setVideoPlays(pcRes.datas)
        }
    }
    const GetMajorVideosData = async () => {
        const mvRes = await api.statisticService.videoMajor({
            offset: offset,
            size: size
        });
        if (mvRes.base.code !== 200) {
            showNotification({
                title: "暂时无法获取视频数量数据",
                content: "",
                type: "info"
            })
        } else {
            setVideoMajor(mvRes.datas)
        }

    }

    useEffect(() => {
        const fetchData = async () => {
            await GetStudentFacultyData()
            await GetTeacherFacultyData()
            await GetPlayCntData()
            await GetMajorVideosData()
        }
        fetchData()
    }, []);

    // noinspection TypeScriptValidateTypes
    return (
        <div className="w-full min-h-screen  flex flex-col space-y-5 p-4 overflow-visible">
            <div className="text-3xl font-medium">数据一览</div>

            <div className="grid grid-cols-2 gap-6">
                <div className="w-full h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={studentFaculty}
                            margin={{top: 20, right: 30, left: 40, bottom: 80}}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            {/* X 轴 */}
                            <XAxis
                                dataKey="faculty"
                                tick={{
                                    fill: 'var(--color-on-surface)',
                                    fontSize: 12
                                }}
                                axisLine={{stroke: 'var(--color-outline)'}}
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                            />

                            {/* Y 轴 */}
                            <YAxis
                                label={{
                                    value: '学生人数',
                                    angle: -90,
                                    position: 'insideLeft',
                                    fill: 'var(--color-on-surface)',
                                    fontSize: 12
                                }}
                                tick={{fill: 'var(--color-on-surface-variant)'}}
                                axisLine={{stroke: 'var(--color-outline)'}}
                            />

                            {/* 提示框 */}
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--color-surface-container)',
                                    border: '1px solid var(--color-outline-variant)',
                                    borderRadius: '4px',
                                    boxShadow: 'var(--color-shadow) 0 2px 8px'
                                }}
                                itemStyle={{color: 'var(--color-on-surface)'}}
                                formatter={(value) => [`${value} 人`, '人数']}
                            />

                            {/* 柱状图 */}
                            <Bar
                                dataKey="students"
                                name="学生人数"
                                fill="var(--color-primary)"
                                animationBegin={200}
                                animationDuration={800}
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {/* 教师数据饼状图 */}
                <div className="w-full h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={teacherFaculty}
                                dataKey="teachers"
                                nameKey="faculty"
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                innerRadius={70}
                                paddingAngle={5}
                                label={({
                                            faculty,
                                            teachers,
                                            percent
                                        }) => `${faculty}\n${teachers}人(${(percent * 100).toFixed(0)}%)`}
                                labelLine={false}
                            >
                                {teacherFaculty.map((_, index) => (
                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                        stroke="var(--color-surface-container)"
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--color-surface-container)',
                                    border: '1px solid var(--color-outline-variant)',
                                    borderRadius: '4px',
                                    boxShadow: 'var(--color-shadow) 0 2px 8px'
                                }}
                                itemStyle={{color: 'var(--color-on-surface)'}}
                                formatter={(value: number) => [`${value} 人`, '教师人数']}
                            />
                            <Legend
                                layout="vertical"
                                align="right"
                                verticalAlign="middle"
                                wrapperStyle={{
                                    paddingLeft: '20px',
                                    fontSize: '14px',
                                    color: 'var(--color-on-surface)'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div>

            </div>
            <div className="grid grid-cols-2 h-full flex-grow  gap-6">
                <div className="w-full h-[500px] min-h-[500px]">
                    {/* 视频播放量面积图 */}

                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={videoPlays}
                            margin={{top: 20, right: 30, left: 40, bottom: 80}}
                        >
                            <defs>
                                <linearGradient id="colorPlays" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis
                                dataKey="video"
                                angle={-45}
                                textAnchor="end"
                                tick={{fill: 'var(--color-on-surface)'}}
                                axisLine={{stroke: 'var(--color-outline)'}}
                            />
                            <YAxis
                                label={{
                                    value: '播放量',
                                    angle: -90,
                                    position: 'insideLeft',
                                    fill: 'var(--color-on-surface)',
                                    fontSize: 12
                                }}
                                tick={{fill: 'var(--color-on-surface-variant)'}}
                                axisLine={{stroke: 'var(--color-outline)'}}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--color-surface-container)',
                                    border: '1px solid var(--color-outline-variant)',
                                    borderRadius: '4px',
                                    boxShadow: 'var(--color-shadow) 0 2px 8px'
                                }}
                                itemStyle={{color: 'var(--color-on-surface)'}}
                            />
                            <Area
                                type="monotone"
                                dataKey="plays"
                                stroke="#0088FE"
                                fillOpacity={1}
                                fill="url(#colorPlays)"
                                name="播放量"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-full h-[500px] min-h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={videoMajor}
                            margin={{top: 20, right: 30, left: 40, bottom: 80}}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            {/* X 轴 */}
                            <XAxis
                                dataKey="major"
                                tick={{
                                    fill: 'var(--color-on-surface)',
                                    fontSize: 12
                                }}
                                axisLine={{stroke: 'var(--color-outline)'}}
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                            />

                            {/* Y 轴 */}
                            <YAxis
                                label={{
                                    value: '视频上传数',
                                    angle: -90,
                                    position: 'insideLeft',
                                    fill: 'var(--color-on-surface)',
                                    fontSize: 12
                                }}
                                tick={{fill: 'var(--color-on-surface-variant)'}}
                                axisLine={{stroke: 'var(--color-outline)'}}
                            />

                            {/* 提示框 */}
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--color-surface-container)',
                                    border: '1px solid var(--color-outline-variant)',
                                    borderRadius: '4px',
                                    boxShadow: 'var(--color-shadow) 0 2px 8px'
                                }}
                                itemStyle={{color: 'var(--color-on-surface)'}}
                                formatter={(value) => [`${value} 个`, '个数']}
                            />

                            {/* 柱状图 */}
                            <Bar
                                dataKey="videos"
                                name="视频数"
                                fill="var(--color-primary)"
                                animationBegin={200}
                                animationDuration={800}
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>

                </div>


            </div>
        </div>
    );

}

export function ManageCourse() {

    const [keyword, setKeyword] = useState("")
    const [size, setSize] = useState(10)
    const [courses, setCourses] = useState<Array<CourseInfo>>([
        {
            ascription: "计算机学院",
            begin_time: "2023-09-01",
            class: "2023级1班",
            cover: "ks-user-avatar/114514.jpg",
            description: "数据结构与算法基础课程，涵盖链表、树、图等核心内容",
            end_time: "2024-01-15",
            cid: "CS101-2023",
            major: "计算机科学与技术",
            title: "数据结构导论"
        },
        {
            ascription: "数学系",
            begin_time: "2023-08-28",
            class: "数学实验班",
            cover: "ks-user-avatar/114514.jpg",
            description: "高等数学进阶课程，重点讲解微积分与线性代数应用",
            end_time: "2024-01-10",
            cid: "MATH201-2023",
            major: "应用数学",
            title: "高等数学精讲"
        },
        {
            ascription: "外国语学院",
            begin_time: "2023-09-10",
            class: "英语强化班",
            cover: "ks-user-avatar/114514.jpg",
            description: "商务英语实战训练，提升专业写作与口语交流能力",
            end_time: "2023-12-20",
            cid: "ENG301-2023",
            major: "英语",
            title: "商务英语实践"
        }
    ])
    const [major, setMajor] = useState("")
    const [faculty, setFaculty] = useState("")
    const [endTime, setEndTime] = useState("")
    const [beginTime, setBeginTime] = useState("")
    const {isShow, toggleShowModal, setForm} = useModal()
    const {showNotification} = useNotification();
    const SearchCourse = async () => {
        const queryRes = await api.adminService.queryCourse({
            keyword: keyword,
            major: major,
            offset: 0,
            size: size,
            begin_time: beginTime,
            end_time: endTime,
            faculty: faculty
        });
        if (queryRes.base.code !== 200) {
            showNotification({
                title: "查询课程信息失败",
                content: queryRes.base.msg,
                type: "error"
            })
            return
        }
        setCourses(queryRes.courses)

    }
    const openEditForm = async (index: number) => {
        await setForm(<EditCourseInfo
            key={Date.now()}
            ascription={courses[index].ascription}
            begin_time={courses[index].begin_time}
            class={courses[index].class}
            cover={courses[index].cover}
            description={courses[index].description}
            end_time={courses[index].end_time}
            cid={courses[index].cid}
            major={courses[index].major}
            reload={() => {
                SearchCourse()
            }} r
            title={courses[index].title}/>)
        toggleShowModal(true)

    }

    return (
        <div className={`w-full h-full flex flex-col p-3 space-y-6`}>
            <div className={`text-3xl`}>管理课程</div>
            <div className={`w-full flex flex-row items-center   justify-start space-x-6`}>
                <FontAwesomeIcon icon={faKeyboard} size={`lg`}></FontAwesomeIcon>
                <div className={`w-1/6`}>
                    <MDInput
                        value={keyword}
                        placeholder={`课程标题`}
                        onEnter={SearchCourse}
                        onValueChange={e => setKeyword(e)}>
                    </MDInput>
                </div>
                <input
                    type={`text`}
                    value={major}
                    onChange={e => setMajor(e.target.value)}
                    className={`w-1/8 p-3 rounded-lg border bg-secondary-container text-on-surface`}
                    placeholder="课程专业"
                />
                <input
                    type={`text`}
                    value={faculty}
                    onChange={e => setFaculty(e.target.value)}
                    className={`w-1/8 p-3 rounded-lg border bg-secondary-container text-on-surface`}
                    placeholder="所属学院"
                />
            </div>
            <div className={`w-full flex`}>
                <div className={`grid grid-cols-2 gap-4 z-index-[100] `}>
                    <div className={`space-y-2 ml-12`}>
                        <label className={`text-sm font-medium text-on-surface`}>
                            起始时间
                        </label>
                        <CustomDatePicker
                            value={beginTime}
                            onChange={(value) => setBeginTime(value ? dayjs(value).format('YYYY-MM-DD') : '')}>
                        </CustomDatePicker>
                    </div>
                    <div className={`space-y-2`}>
                        <label className={`text-sm font-medium text-on-surface`}>
                            结束时间
                        </label>
                        <CustomDatePicker
                            value={endTime}
                            onChange={(value) => setEndTime(value ? dayjs(value).format('YYYY-MM-DD') : '')}>
                        </CustomDatePicker>
                    </div>

                </div>
            </div>
            <Divider vertical={false}></Divider>
            <div className={`w-full flex flex-col p-6`}>
                {
                    courses?.map((item, index) => {
                        return <CourseListItem
                            title={item.title}
                            id={item.cid}
                            major={item.major}
                            begin_time={item.begin_time}
                            end_time={item.end_time}
                            cover={item.cover}
                            onEdit={() => {
                                openEditForm(index)
                            }}
                            className={item.class}>

                        </CourseListItem>
                    })
                }

            </div>


        </div>
    )
}

export function ManageUser() {
    const Authorities = ["Student", "Teacher", "Admin"]
    const [major, setMajor] = useState("")
    const [faculty, setFaculty] = useState("")
    const [keyword, setKeyword] = useState("")
    const [authority, setAuthority] = useState(Authorities[0])
    const [users, setUsers] = useState<Array<CompleteUserInfo>>([])
    const [offset, setOffset] = useState(0)
    const [authorityDrawer, setAuthorityDrawer] = useState(false)
    const {showNotification} = useNotification();
    const {isShow, toggleShowModal, setForm} = useModal()

    const SearchUser = async () => {
        const usersRes = await api.adminService.queryUser({
            keyword: keyword,
            offset: offset,
            size: 10,
            major: major,
            faculty: faculty,
            authority: authority
        });
        if (usersRes.base.code !== 200) {
            showNotification({
                title: "搜索失败",
                content: usersRes.base.msg,
                type: "error"
            })
            return
        }
        setUsers(usersRes.users)

    }

    const OpenEditInfoForm = async (index: number) => {
        await setForm(<EditUserInfo
            key={Date.now()}
            authority={users[index].authority}
            faculty={users[index].faculty ? users[index].faculty : `未知学院`}
            name={users[index].name}
            password={users[index].password}
            phone={users[index].phone}
            reload={() => {
                SearchUser()
            }}
            class={users[index].class} uid={users[index].uid}/>)

        toggleShowModal(true)
    }

    return (
        <div className={`w-full h-full flex flex-col p-3 space-y-6`}>
            <div className={`w-full text-3xl`}>管理用户</div>
            <div className={`w-full flex flex-row items-center  justify-start space-x-6`}>
                <FontAwesomeIcon icon={faKeyboard} size={`lg`}></FontAwesomeIcon>
                <div className={`w-1/6`}>
                    <MDInput
                        value={keyword}
                        placeholder={`课程标题`}
                        onEnter={SearchUser}
                        onValueChange={e => setKeyword(e)}>
                    </MDInput>
                </div>
                <input
                    type={`text`}
                    value={major}
                    onChange={e => setMajor(e.target.value)}
                    className={`w-1/8 p-3 rounded-lg border bg-secondary-container text-on-surface`}
                    placeholder="课程专业"
                />
                <input
                    type={`text`}
                    value={faculty}
                    onChange={e => setFaculty(e.target.value)}
                    className={`w-1/8 p-3 rounded-lg border bg-secondary-container text-on-surface`}
                    placeholder="所属学院"
                />
                <div className="w-1/8 relative flex">
                    <input
                        type="text"
                        value={authority}
                        readOnly
                        className={`w-full flex justify-between p-3 rounded-lg text-on-secondary-container border bg-secondary-container`}
                        placeholder="筛选角色"
                    />
                    <FontAwesomeIcon
                        icon={faArrowDown}
                        onClick={() => setAuthorityDrawer(!authorityDrawer)}
                        className="absolute text-on-surface hover:scale-125 transition-all duration-300 top-1/3 right-4 cursor-pointer"
                    />
                    <div
                        className={`w-full ${
                            authorityDrawer ? "max-h-[200px]" : "max-h-0"
                        } overflow-hidden transition-all duration-300 absolute top-full rounded-xl bg-primary-fixed z-10`}
                    >
                        <div className="p-3 space-y-2 flex flex-col">
                            {Authorities.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setAuthority(item);
                                        setAuthorityDrawer(false);
                                    }}
                                    className="w-full hover:bg-secondary rounded-xl p-2 cursor-pointer text-on-primary-fixed"
                                >
                                    <div className="pl-3 truncate">{item}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <IconButton text={`批量导入用户`} onClick={() => {
                }} className={`w-auto h-12 space-x-3 bg-inverse-primary`}>
                    <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>

                </IconButton>

            </div>
            <Divider vertical={false}></Divider>
            <div className={`w-full flex flex-col p-6`}>
                {
                    users?.map((item, index) => {
                        return <UserListItem
                            uid={item.uid}
                            avatar={item.avatar ? item.avatar : ``}
                            name={item.name}
                            authority={item.authority}
                            signature={item.signature ? item.signature : ``}
                            grade={item.grade ? item.grade : `未定义`}
                            faculty={item.faculty}
                            major={item.major ? item.major : `未定义`}
                            onEdit={() => {
                                OpenEditInfoForm(index)
                            }}
                            class={item.class}>
                        </UserListItem>
                    })
                }
            </div>
        </div>
    )

}

export function ManageFile() {
    return (
        <div className={`w-full h-full`}>
            <div>文件一览</div>
        </div>
    )

}

export function AuthorityControl() {
    return (
        <div className={`w-full h-full`}>
            <div>权限管理</div>
        </div>
    )

}

interface CourseListItemProps {
    title: string;
    id: string;
    major: string;
    begin_time: string;
    end_time: string;
    className: string;
    cover: string;
    onEdit?: () => void;
    onDelete?: () => void
}

export function CourseListItem({
                                   title,
                                   id,
                                   major,
                                   begin_time,
                                   end_time,
                                   className,
                                   cover,
                                   onEdit,
                                   onDelete
                               }: CourseListItemProps) {
    return (
        <div
            className={`
                w-full flex items-center 
                p-4 mb-4 
                bg-surface-container-high 
                rounded-xl 
                shadow-sm 
                hover:shadow-md 
                transition-shadow
            `}
        >
            {/* 封面图片 */}
            <OssImage
                alt="课程封面"
                className="w-20 h-20 rounded-lg object-cover mr-6"
                url={cover}/>

            {/* 课程信息主体 */}
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline mb-2">
                    <h3 className="text-title-medium truncate mr-4 text-on-surface">
                        {title}
                    </h3>
                    <span className="text-label-medium text-outline">
                        {id}
                    </span>
                </div>

                <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center">
                        <FontAwesomeIcon
                            icon={faBookOpen}
                            className="text-primary mr-2"
                        />
                        <span className="text-body-medium text-on-surface-variant">
                            {major}
                        </span>
                    </div>

                    <div className="flex items-center">
                        <FontAwesomeIcon
                            icon={faUsers}
                            className="text-primary mr-2"
                        />
                        <span className="text-body-medium text-on-surface-variant">
                            {className}
                        </span>
                    </div>
                </div>

                <div className="flex items-center">
                    <FontAwesomeIcon
                        icon={faCalendarDays}
                        className="text-primary mr-2"
                    />
                    <span className="text-body-medium text-on-surface-variant">
                        {`${begin_time} ~ ${end_time}`}
                    </span>
                </div>
            </div>

            {/* 操作按钮组 */}
            <div className="flex space-x-4 ml-6">
                <IconButton
                    className={`w-24 h-12 bg-tertiary text-on-tertiary space-x-2`}
                    onClick={() => {
                        onEdit?.()
                    }}
                    text={`编辑`}>
                    <FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>
                </IconButton>

                <IconButton
                    className={`w-24 h-12 bg-error-container space-x-2`}
                    onClick={() => {
                        onDelete?.()
                    }}
                    text={`删除`}>
                    <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                </IconButton>
            </div>
        </div>
    )
}

interface UserListItemProps {
    uid: string;
    avatar: string;
    name: string;
    authority: string;
    signature: string;
    grade: string;
    faculty: string;
    major: string;
    class: string;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function UserListItem({
                                 uid,
                                 avatar,
                                 name,
                                 authority,
                                 signature,
                                 grade,
                                 faculty,
                                 major,
                                 class: className,
                                 onEdit,
                                 onDelete
                             }: UserListItemProps) {
    // 权限徽章颜色映射
    const authorityColors: Record<string, string> = {
        admin: "bg-error text-on-error",
        teacher: "bg-tertiary text-on-tertiary",
        student: "bg-primary-container text-on-primary-container"
    };

    const [showSignature, setShowSignature] = useState(false);
    const toggleSignature = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowSignature(!showSignature);
    };
    return (
        <div className={`
      w-full flex items-center 
      p-4 mb-4 
      bg-surface-container-high 
      rounded-xl 
      shadow-sm 
      hover:shadow-md 
      transition-shadow
    `}>
            {/* 用户头像 */}
            <OssImage
                alt="用户头像"
                className="w-20 h-20 rounded-full object-cover mr-6"
                url={avatar}
            />

            {/* 用户信息主体 */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center mb-2">
                    <h3 className="text-title-medium truncate mr-4 text-on-surface">
                        {name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-label-medium ${
                        authorityColors[authority.toLowerCase()] || authorityColors.student
                    }`}>
            {authority}
          </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-2">
                    <div className="flex items-center">
                        <FontAwesomeIcon
                            icon={faBuilding}
                            className="text-primary mr-2"
                        />
                        <span className="text-body-medium text-on-surface-variant">
              {faculty || '未设置学院'}
            </span>
                    </div>

                    <div className="flex items-center">
                        <FontAwesomeIcon
                            icon={faBookOpen}
                            className="text-primary mr-2"
                        />
                        <span className="text-body-medium text-on-surface-variant">
              {major || '未设置专业'}
            </span>
                    </div>

                    <div className="flex items-center">
                        <FontAwesomeIcon
                            icon={faGraduationCap}
                            className="text-primary mr-2"
                        />
                        <span className="text-body-medium text-on-surface-variant">
              {`${grade}级 · ${className}`}
            </span>
                    </div>
                </div>
                <div className="flex items-center mt-2">
                    <FontAwesomeIcon
                        icon={faCommentDots}
                        className="text-primary mr-2 cursor-pointer"
                        onClick={toggleSignature}
                    />
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={toggleSignature}
                    >
                        {signature ? (
                            <>
                <span className="text-body-medium text-on-surface-variant">
                  {showSignature ? signature : "点击展示签名"}
                </span>
                                <FontAwesomeIcon
                                    icon={showSignature ? faChevronUp : faChevronDown}
                                    className="text-primary text-sm transition-transform"
                                />
                            </>
                        ) : (
                            <span className="text-body-medium text-on-surface-variant/50">
                无签名
              </span>
                        )}
                    </div>
                </div>
            </div>

            {/* 操作按钮组 */}
            <div className="flex space-x-4 ml-6">
                <IconButton
                    className="w-24 h-12 bg-tertiary text-on-tertiary space-x-2"
                    onClick={() => {
                        onEdit?.();
                    }}
                    text="编辑"
                >
                    <FontAwesomeIcon icon={faPenToSquare}/>
                </IconButton>

                <IconButton
                    className="w-24 h-12 bg-error-container space-x-2"
                    onClick={() => {
                        onDelete?.();
                    }}
                    text="删除"
                >
                    <FontAwesomeIcon icon={faTrash}/>
                </IconButton>
            </div>
        </div>
    );
}

export interface CompleteUserInfo {
    authority: string;
    avatar?: string;
    faculty: string;
    grade?: string;
    major?: string;
    name: string;
    password: string;
    phone: string;
    signature?: string;
    uid: string,
    class: string,
    reload: () => void
}

export function EditUserInfo({
                                 authority,
                                 avatar,
                                 faculty,
                                 grade,
                                 major,
                                 name,
                                 password,
                                 phone,
                                 signature,
                                 uid,
                                 class: userClass, // 使用别名避免与class关键字冲突,
                                 reload
                             }: CompleteUserInfo) {
    // 状态管理
    const [f_name, setName] = useState(name)
    const [f_phone, setPhone] = useState(phone)
    const [f_avatar, setAvatar] = useState(avatar)
    const [f_authority, setAuthority] = useState(authority)
    const [f_grade, setGrade] = useState(grade)
    const [f_faculty, setFaculty] = useState(faculty)
    const [f_major, setMajor] = useState(major)
    const [f_password, setPassword] = useState(password)
    const [f_signature, setSignature] = useState(signature)
    const [f_class, setClass] = useState(userClass)

    // 头像处理
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                if (reader.result) {
                    setAvatar(reader.result as string)
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const {isShow, toggleShowModal, setForm} = useModal()
    const {showNotification} = useNotification();

    const SaveEdit = async () => {
        const saveRes = await api.adminService.updateUser({
            authority: f_authority,
            avatar: f_avatar,
            faculty: f_faculty,
            grade: f_grade,
            major: f_major,
            name: f_name,
            password: f_password,
            phone: f_phone,
            signature: f_signature,
            uid: uid
        });
        if (saveRes.base.code !== 200) {
            showNotification({
                title: "保存信息失败",
                content: saveRes.base.msg,
                type: "error"
            })
            return
        }
        showNotification({
            title: "保存成功",
            content: "",
            type: "success"
        })
        reload()
        toggleShowModal(false)
    }

    return (
        <div className="w-full h-full relative flex items-center">
            <div
                onClick={e => e.stopPropagation()}
                className="p-6 absolute transition-all duration-300 w-1/2 space-y-6 right-0 h-full bg-primary-container rounded-l-2xl flex flex-col"
            >
                {/* 标题部分 */}
                <div className="w-full flex flex-row space-x-6 items-center justify-between">
                    <div className="text-2xl text-on-primary-container">编辑用户信息</div>
                    <div className="text-outline">用户id：{uid}</div>
                </div>

                {/* 表单主体 */}
                <div className="space-y-6 transition-all duration-300">
                    {/* 第一行：名称 + 电话 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-on-primary-container">
                                名称<span className="text-error">*</span>
                            </label>
                            <input
                                type="text"
                                value={f_name}
                                onChange={e => setName(e.target.value)}
                                className="w-full p-3 rounded-lg border bg-secondary-container text-on-surface"
                                placeholder="请输入用户名"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-on-primary-container">
                                电话<span className="text-error">*</span>
                            </label>
                            <input
                                type="tel"
                                value={f_phone}
                                onChange={e => setPhone(e.target.value)}
                                className="w-full p-3 rounded-lg border bg-secondary-container text-on-surface"
                                placeholder="请输入电话"
                            />
                        </div>
                    </div>

                    {/* 第二行：权限 + 学院 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-on-primary-container">
                                权限<span className="text-error">*</span>
                            </label>
                            <select
                                value={f_authority}
                                onChange={e => setAuthority(e.target.value)}
                                className="w-full p-3 rounded-lg border bg-secondary-container text-on-surface"
                            >
                                <option value="admin">管理员</option>
                                <option value="teacher">教师</option>
                                <option value="student">学生</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-on-primary-container">
                                学院<span className="text-error">*</span>
                            </label>
                            <input
                                type="text"
                                value={f_faculty}
                                onChange={e => setFaculty(e.target.value)}
                                className="w-full p-3 rounded-lg border bg-secondary-container text-on-surface"
                                placeholder="请输入学院"
                            />
                        </div>
                    </div>

                    {/* 第三行：年级 + 专业 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-on-primary-container">
                                年级
                            </label>
                            <input
                                type="text"
                                value={f_grade || ''}
                                onChange={e => setGrade(e.target.value)}
                                className="w-full p-3 rounded-lg border bg-secondary-container text-on-surface"
                                placeholder="请输入年级"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-on-primary-container">
                                专业
                            </label>
                            <input
                                type="text"
                                value={f_major || ''}
                                onChange={e => setMajor(e.target.value)}
                                className="w-full p-3 rounded-lg border bg-secondary-container text-on-surface"
                                placeholder="请输入专业"
                            />
                        </div>
                    </div>

                    {/* 单独行：密码 */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-on-primary-container">
                            密码<span className="text-error">*</span>
                        </label>
                        <input
                            type="password"
                            value={f_password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg border bg-secondary-container text-on-surface"
                            placeholder="请输入密码"
                        />
                    </div>

                    {/* 单独行：班级 */}
                    <div className="space-y-2 ">
                        <label className="text-sm font-medium text-on-primary-container">
                            班级<span className="text-error">*</span>
                        </label>
                        <input
                            type="text"
                            value={f_class}
                            onChange={e => setClass(e.target.value)}
                            className="w-full p-3 rounded-lg border bg-secondary-container text-on-surface"
                            placeholder="请输入班级"
                        />
                    </div>

                    {/* 头像上传部分 */}
                    <div className="space-y-2 transition-all duration-300">
                        <label className="text-sm font-medium text-on-primary-container">
                            头像<span className="text-error">*</span>
                        </label>
                        <div className="flex gap-4 items-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                                id="avatarUpload"
                                required={!f_avatar}
                            />
                            <label
                                htmlFor="avatarUpload"
                                className="cursor-pointer transition-all duration-300  p-3 rounded-lg border bg-secondary-container text-on-surface hover:bg-secondary-container-hover"
                            >
                                选择头像文件
                            </label>
                            {f_avatar && (
                                <div className="relative group">
                                    <img
                                        src={f_avatar}
                                        alt="头像预览"
                                        className="w-20 h-20 rounded-full object-cover border-2 border-outline"
                                    />
                                    <div
                                        className="absolute inset-0 bg-error/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer"
                                        onClick={() => setAvatar(undefined)}
                                    >
                                        <span className="text-on-error">删除</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 个性签名 */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-on-primary-container">
                            个性签名
                        </label>
                        <textarea
                            value={f_signature || ''}
                            onChange={e => setSignature(e.target.value)}
                            className="w-full p-3 rounded-lg border bg-secondary-container text-on-surface h-24"
                            placeholder="请输入个性签名"
                        />
                    </div>
                    <div className={`w-auto flex items-center space-x-6 justify-end `}>
                        <IconButton text={`保存`} onClick={() => {
                            SaveEdit()
                        }} className={`w-24 h-12 space-x-3 bg-primary-fixed`}>
                            <FontAwesomeIcon icon={faSave}></FontAwesomeIcon>
                        </IconButton>
                        <IconButton text={`取消修改`} onClick={() => {
                            toggleShowModal(false)
                        }} className={`w-auto space-x-3 bg-error`}>
                            <FontAwesomeIcon icon={faCancel}></FontAwesomeIcon>
                        </IconButton>

                    </div>

                </div>
            </div>
        </div>
    )
}

interface EditCourseInfoProps {
    ascription: string;
    begin_time: string;
    class: string;
    cover: string;
    description: string;
    end_time: string;
    cid: string;
    major: string;
    title: string;
    reload: () => void
}

export function EditCourseInfo({
                                   ascription,
                                   begin_time,
                                   cover,
                                   description,
                                   end_time,
                                   cid,
                                   major,
                                   title,
                                   class: courseClass,
                                   reload
                               }: EditCourseInfoProps) {
    // 状态管理
    const [f_title, setTitle] = useState(title)
    const [f_major, setMajor] = useState(major)
    const [f_beginTime, setBeginTime] = useState(begin_time)
    const [f_endTime, setEndTime] = useState(end_time)
    const [f_description, setDescription] = useState(description)
    const [f_class, setClass] = useState(courseClass)
    const [f_cover, setCover] = useState(cover)
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const {showNotification} = useNotification();
    const {isShow, toggleShowModal, setForm} = useModal()
    // 处理封面上传
    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                if (reader.result) {
                    setCover(reader.result as string)
                }
            }
            reader.readAsDataURL(file)
        }
    }

    // 处理视频上传
    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVideoFile(e.target.files?.[0] || null)
    }

    const SaveEditInfo = async () => {
        const saveRes = await api.adminService.updateCourse({
            ascription: ascription,
            cid: cid,
            cover: f_cover,
            title: f_title,
            description: f_description,
            id: cid,
            major: f_major,
            begin_time: f_beginTime,
            end_time: f_endTime
        });
        if (saveRes.base.code !== 200) {
            showNotification({
                title: "保存信息失败",
                content: saveRes.base.msg,
                type: "error"
            })
            return
        }
        reload()
        toggleShowModal(false)
        showNotification({
            title: "修改成功",
            content: "",
            type: "success",
        })
    }

    return (
        <div className="w-full h-full relative flex items-center">
            <div
                onClick={e => e.stopPropagation()}
                className="p-6 absolute w-1/2 space-y-6 right-0 h-full bg-primary-container rounded-l-2xl flex flex-col"
            >
                {/* 标题部分 */}
                <div className="w-full flex flex-row space-x-6 items-center justify-between">
                    <div className="text-2xl text-on-primary-container">编辑课程信息</div>
                    <div className="space-y-1">
                        <div className="text-outline">课程ID：{cid}</div>
                        <div className="text-outline">负责教师：{ascription}</div>
                    </div>
                </div>

                {/* 表单主体 */}
                <div className="space-y-6">
                    {/* 第一行：课程名称 + 所属专业 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-on-primary-container">
                                课程名称<span className="text-error">*</span>
                            </label>
                            <input
                                type="text"
                                value={f_title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full p-3 rounded-lg border bg-secondary-container text-on-surface"
                                placeholder="请输入课程名称"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-on-primary-container">
                                所属专业<span className="text-error">*</span>
                            </label>
                            <input
                                type="text"
                                value={f_major}
                                onChange={e => setMajor(e.target.value)}
                                className="w-full p-3 rounded-lg border bg-secondary-container text-on-surface"
                                placeholder="请输入所属专业"
                                required
                            />
                        </div>
                    </div>

                    {/* 第二行：开课时间 + 结课时间 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-on-primary-container">
                                开课时间<span className="text-error">*</span>
                            </label>
                            <CustomDatePicker
                                value={f_beginTime}
                                onChange={value => setBeginTime(dayjs(value).format('YYYY-MM-DD'))}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-on-primary-container">
                                结课时间<span className="text-error">*</span>
                            </label>
                            <CustomDatePicker
                                value={f_endTime}
                                onChange={value => setEndTime(dayjs(value).format('YYYY-MM-DD'))}
                                minDate={dayjs(begin_time)}
                            />
                        </div>
                    </div>

                    {/* 第三行：课程班级 + 文件上传 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-on-primary-container">
                                课程班级
                            </label>
                            <input
                                type="text"
                                value={f_class}
                                onChange={e => setClass(e.target.value)}
                                className="w-full p-3 rounded-lg border bg-secondary-container text-on-surface"
                                placeholder="请输入课程班级"
                            />
                        </div>

                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {/* 封面上传 */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-on-primary-container">
                                课程封面<span className="text-error">*</span>
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverChange}
                                    className="hidden"
                                    id="coverUpload"
                                    required={!f_cover}
                                />
                                <label
                                    htmlFor="coverUpload"
                                    className="cursor-pointer p-2 rounded-lg border bg-secondary-container text-on-surface hover:bg-secondary-container-hover"
                                >
                                    上传封面
                                </label>
                                {f_cover && (
                                    <img
                                        src={f_cover}
                                        alt="封面预览"
                                        className="w-12 h-12 rounded object-cover border"
                                    />
                                )}
                            </div>
                        </div>

                    </div>
                    {/* 课程描述 */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-on-primary-container">
                            课程描述<span className="text-error">*</span>
                        </label>
                        <textarea
                            value={f_description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full p-3 rounded-lg border bg-secondary-container text-on-surface h-32"
                            placeholder="请输入课程描述"
                            required
                        />
                    </div>
                    <div className={`w-auto flex items-center space-x-6 justify-end `}>
                        <IconButton text={`保存`} onClick={() => {
                            SaveEditInfo()
                        }} className={`w-24 h-12 space-x-3 bg-primary-fixed`}>
                            <FontAwesomeIcon icon={faSave}></FontAwesomeIcon>
                        </IconButton>
                        <IconButton text={`取消修改`} onClick={() => {
                            toggleShowModal(false)
                        }} className={`w-auto space-x-3 bg-error`}>
                            <FontAwesomeIcon icon={faCancel}></FontAwesomeIcon>
                        </IconButton>

                    </div>
                </div>
            </div>
        </div>
    )
}