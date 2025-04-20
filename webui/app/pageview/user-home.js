import {OssImage} from "../components/oss-midea.tsx";
import {Divider} from "../components/divider.tsx";
import {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAdd,
    faArrowRight,
    faBook,
    faCalendar,
    faClock,
    faEdit,
    faIdCard,
    faMagnet,
    faPhone,
    faSchool,
    faUpload,
    faUpRightFromSquare,
    faUserGraduate
} from "@fortawesome/free-solid-svg-icons";
import {useModal} from "../../context/modal-provider.js";
import {IconButton} from "../components/icon-button.tsx";
import {OssBuckets, useOss} from "../../context/oss-uploader-provider.tsx";
import {useNotification} from "../../context/notification-provider.tsx";
import {api} from "../../api/instance.ts";
import dayjs from 'dayjs';
import {CustomDatePicker} from "../components/custom-date-picker.jsx.tsx";

export function UserHome() {
    const {showNotification} = useNotification();


    const [userInfo, setUserInfo] = useState({
        uid: "114514",
        avatar: "null",
        name: "未知用户",
        authority: "未知",
        phone: "无",
        grade: "2077",
        faculty: "未归属",
        major: "未归属",
        signature: "nil",
    })

    const GetUserInfo = async () => {
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
    useEffect(() => {
        async function fetchData() {
            await GetUserInfo()
        }

        fetchData()
    }, []);

    const [pager, setPager] = useState(0)
    const Block = ["基本资料", "修改头像", "修改密码", "管理课程"]

    const currentDisplay = () => {
        switch (pager) {
            case 0:
                return <BaseInfo userInfo={userInfo} flashUserInfo={GetUserInfo}></BaseInfo>
            case 1:
                return <UpdateAvatar url={userInfo.avatar} uid={userInfo.uid}
                                     flashUserInfo={GetUserInfo}></UpdateAvatar>
            case 2:
                return <EditPasswordForm></EditPasswordForm>
            case 3:
                return <CourseList></CourseList>
        }
    }


    const [animationClass, setAnimationClass] = useState("");
    useEffect(() => {
        setTimeout(() => {
            setAnimationClass("opacity-0")
            requestAnimationFrame(() => {
                setAnimationClass("opacity-100")
            })
        }, 300)
    }, [pager]);


    return (
        <div className={`w-full h-full flex flex-col space-y-6 p-8`}>

            <div className={`w-full flex flex-col space-y-8 rounded-b-2xl p-3  bg-primary-container`}>
                <div className={`w-full flex-row flex `}>
                    <div className={`text-3xl`}>个人资料</div>
                </div>
                <Divider vertical={false}></Divider>
                <div className={`flex w-full space-x-8  flex-row`}>
                    {
                        Block.map((item, index) => {
                                if (index !== 3 || userInfo.authority !== "USER") return <TagButton title={item}
                                                                                                    onClick={() => {
                                                                                                        setPager(index);
                                                                                                        setAnimationClass("hidden")
                                                                                                    }}
                                                                                                    underline={index === pager}></TagButton>

                            }
                        )
                    }
                </div>
            </div>
            <div className={`${animationClass} w-full h-full transition-all duration-200`}>
                {
                    currentDisplay()
                }
            </div>


        </div>
    );
}

function BaseInfo({userInfo, flashUserInfo}) {
    var {isShowModal, toggleShowModal, setForm} = useModal();


    useEffect(() => {
        setForm(
            <UpdateBaseInfoForm
                key={Date.now()} // 添加key强制重新渲染
                flashUserInfo={flashUserInfo}
                name={userInfo.name}
                phone={userInfo.phone}
                signature={userInfo.signature}
                avatar={userInfo.avatar}
            />
        );
    }, [userInfo]);
    return (
        <div className={`w-full bg-secondary-container space-y-3 rounded-2xl p-6 flex flex-col`}>
            <div
                className={`w-full flex items-center justify-between space-x-3 flex-row justify-items-start`}>
                <div className={`h-48 w-48 bg-green-300 rounded-full space-x-6 flex flex-row`}>
                    <OssImage
                        url={userInfo.avatar}
                        className={`rounded-full aspect-square`}>
                    </OssImage>
                    <div className={`flex flex-col space-y-6  justify-center h-full`}>
                        <div className={`flex text-3xl`}>{userInfo.name}</div>
                        <div className={`flex text-xl`}>{localStorage.getItem("authority")}</div>
                    </div>
                </div>
                <div className="w-1/3 bg-inverse-primary rounded-lg shadow-lg overflow-hidden">
                    <table className="w-full">
                        <tbody className="divide-y divide-on-surface-variant">

                        {/* 学号行 */}
                        <tr className="hover:bg-surface-variant transition-colors">
                            <td className="px-4 py-3">
                                <div className="flex items-center space-x-3 text-body-medium">
                                    <FontAwesomeIcon icon={faIdCard} className="text-primary w-4 h-4"/>
                                    <span>ID:</span>
                                    <span className="text-on-surface">{userInfo.uid}</span>
                                </div>
                            </td>
                        </tr>

                        {/* 手机号行 */}
                        <tr className="hover:bg-surface-variant transition-colors">
                            <td className="px-4 py-3">
                                <div className="flex items-center space-x-3 text-body-medium">
                                    <FontAwesomeIcon icon={faPhone} className="text-primary w-4 h-4"/>
                                    <span>手机号:</span>
                                    <span className="text-on-surface">{userInfo.phone || '未绑定'}</span>
                                </div>
                            </td>
                        </tr>
                        {/*学院*/}
                        <tr className={`hover:bg-surface-variant transition-all`}>
                            <td className="px-4 py-3">
                                <div className="flex items-center space-x-3 text-body-medium">
                                    <FontAwesomeIcon icon={faSchool} className="text-primary w-4 h-4"/>
                                    <span>学院:</span>
                                    <span className="text-on-surface">{userInfo.faculty || '未绑定'}</span>
                                </div>
                            </td>
                        </tr>
                        {/*专业*/}
                        <tr className={`hover:bg-surface-variant transition-all`}>
                            <td className="px-4 py-3">
                                <div className="flex items-center space-x-3 text-body-medium">
                                    <FontAwesomeIcon icon={faMagnet} className="text-primary w-4 h-4"/>
                                    <span>学院:</span>
                                    <span className="text-on-surface">{userInfo.major || '未绑定'}</span>
                                </div>
                            </td>
                        </tr>


                        {/* 年级行 */}
                        <tr className="hover:bg-surface-variant transition-colors hover:cursor-pointer">
                            <td className="px-4 py-3">
                                <div className="flex items-center space-x-3 text-body-medium">
                                    <FontAwesomeIcon icon={faUserGraduate} className="text-primary w-4 h-4"/>
                                    <span>年级:</span>
                                    <span className="text-on-surface">{userInfo.grade}</span>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={`w-full flex flex-row items-end space-x-6 mt-6`}>
                <div className="w-1/3 shadow-xl  bg-inverse-primary rounded-xl h-auto p-4">
                    <div
                        className="text-on-surface-tint break-words whitespace-pre-wrap"
                        style={{wordBreak: 'break-word'}}
                    >
                        {userInfo.signature}
                    </div>
                </div>
                <IconButton shadow={true} text={`修改`} onClick={() => {
                    toggleShowModal(true)
                }} className={`w-auto bg-inverse-primary space-x-3  rounded-2xl`}>
                    <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                </IconButton>
            </div>


        </div>


    )
}

function UpdateBaseInfoForm({phone, signature, name, avatar, flashUserInfo}) {
    const {toggleShowModal} = useModal();
    const [formData, setFormData] = useState({
        phone: phone || '',
        signature: signature || '',
        name: name || '',
        avatar: avatar
    });
    const [errors, setErrors] = useState({});
    const {showNotification} = useNotification();
    // 统一处理输入变化
    const handleChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        // 清除对应字段的错误
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // 表单验证
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = '用户名不能为空';
        }
        if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
            newErrors.phone = '请输入有效的手机号码';
        }
        if (formData.signature.length > 50) {
            newErrors.signature = '个性签名不能超过50字';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 提交处理
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const res = await api.userService.updateInfo({
                name: formData.name,
                signature: formData.signature,
                phone: formData.phone,
                avatar: formData.avatar
            });
            if (res.base.code !== 200) {
                showNotification({
                    title: "更新信息失败",
                    content: res.base.msg,
                    type: "error"
                })
            } else {
                flashUserInfo()
                showNotification({
                    title: "用户信息已更新",
                    type: "success"
                })
            }
            toggleShowModal(false);

        } catch (error) {
            console.error('更新失败:', error);
        }
    };

    return (
        <div className="p-6 w-full max-w-2xl bg-primary-container rounded-2xl shadow-xl"
             onClick={e => e.stopPropagation()}>
            <div className="text-3xl text-on-primary-container mb-6 font-medium">编辑基础信息</div>

            <div className="space-y-6">
                {/* 用户名输入 */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-on-primary-container">
                        用户名
                        <span className="text-error">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={handleChange('name')}
                        className={`w-full p-3 rounded-lg border ${
                            errors.name ? 'border-error' : 'border-outline'
                        } bg-secondary-container text-on-surface`}
                        placeholder="请输入用户名"
                    />
                    {errors.name && (
                        <p className="text-error text-sm">{errors.name}</p>
                    )}
                </div>

                {/* 手机号输入 */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-on-primary-container">
                        手机号
                        <span className="text-error">*</span>
                    </label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange('phone')}
                        className={`w-full p-3 rounded-lg border ${
                            errors.phone ? 'border-error' : 'border-outline'
                        } bg-secondary-container text-on-surface`}
                        placeholder="请输入手机号码"
                    />
                    {errors.phone && (
                        <p className="text-error text-sm">{errors.phone}</p>
                    )}
                </div>

                {/* 个性签名输入 */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-on-primary-container">
                        个性签名
                        <span className="text-xs text-on-primary-container/60 ml-2">（最多50字）</span>
                    </label>
                    <textarea
                        value={formData.signature}
                        onChange={handleChange('signature')}
                        className={`w-full p-3 rounded-lg border ${
                            errors.signature ? 'border-error' : 'border-outline'
                        } bg-secondary-container text-on-surface resize-none h-32`}
                        placeholder="请输入个性签名"
                        maxLength={50}
                    />
                    <div className="flex justify-between text-sm">
                        {errors.signature && (
                            <p className="text-error">{errors.signature}</p>
                        )}
                        <span className="text-on-surface-variant ml-auto">
                            {formData.signature.length}/50
                        </span>
                    </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex justify-end space-x-4 mt-8 transition-all">
                    <IconButton
                        type="button"
                        onClick={() => toggleShowModal(false)}
                        className="px-6 py-2 rounded-lg text-on-surface-variant hover:bg-inverse-primary transition-all"
                        text={"取消"}>
                    </IconButton>
                    <IconButton
                        type="submit"
                        className="px-6 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-hover transition-all"
                        onClick={handleSubmit}
                        text={"保存修改"}>
                    </IconButton>
                </div>
            </div>
        </div>
    );
}

function UpdateAvatar({uid, url, flashUserInfo}) {
    const [newFileName, setNewFileName] = useState(null);
    const [newFile, setNewFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    var {ossHandleUploadFile, generateSignedUrl} = useOss();
    var {showNotification} = useNotification();


    // 清理对象URL
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // 处理文件选择
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewFile(file);
            setNewFileName(file.name);

            // 生成预览URL
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleSubmit = async () => {
        if (!newFile || !newFileName) {
            showNotification({
                title: "未上传头像文件",
                type: "error"
            })
            return
        }
        var parts = newFileName.split(".");
        if (parts.length > 2) {
            showNotification({
                title: "哥们啥文件名啊",
                type: "error"
            })
            return
        }
        const ossName = uid
        const upload_success = await ossHandleUploadFile(newFile, ossName, OssBuckets.UserAvatar)
        if (upload_success) {
            var res = await api.userService.updateInfo({
                avatar: "ks-user-avatar/" + ossName
            });
            if (res.base.code !== 200) {
                showNotification({
                    title: "用户头像字段更新失败",
                    type: "error"
                })
                return
            }
        }
        flashUserInfo()
    }

    // 触发文件选择对话框
    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="w-full bg-secondary-container rounded-2xl p-6 flex flex-col space-y-6">
            <div className="text-2xl">当前头像</div>

            <div className="w-full flex flex-row items-center justify-between">
                {/* 当前头像 */}
                <div className="w-1/5 aspect-square">
                    <OssImage
                        className="w-full h-full rounded-sm"
                        url={url}
                    />
                </div>

                {/* 上传控件 */}
                <div className="flex flex-col space-y-6 h-auto">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <IconButton
                        text="上传头像"
                        onClick={handleSubmit}
                        className="h-auto space-x-3 bg-primary-container text-on-primary-container"
                    >
                        <FontAwesomeIcon icon={faUpload}/>
                    </IconButton>

                    <span className="text-sm  text-center text-on-surface-variant">
                        {newFileName || "未选择文件"}
                    </span>
                    <FontAwesomeIcon size={`3x`} icon={faArrowRight}></FontAwesomeIcon>

                </div>

                {/* 预览 */}
                <div className="w-1/5 aspect-square bg-secondary text-on-secondary rounded-sm overflow-hidden">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="预览"
                            className="w-full h-full object-cover"
                            onClick={handleUploadClick}
                        />
                    ) : (
                        <div
                            className="w-full h-full flex items-center justify-center"
                            onClick={handleUploadClick}
                        >
                            点击上传
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function EditPasswordForm() {
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {}
        if (oldPassword.length < 6) {
            newErrors.old = '密码大于等于6位';
        }
        if (newPassword.length) {
            newErrors.new = "密码大于等于6位"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async () => {
        if (!validateForm()) return;
        //TODO    
    }

    return (
        <div
            className={`w-full bg-secondary-container rounded-2xl p-6 flex items-start space-x-3 flex-col justify-items-start`}>
            <div className={`space-y-6`}>

                <div className={`space-x-4`}>
                    <label className={`text-on-secondary-container`}>
                        旧密码
                        <span className={`text-error`}>*</span>
                    </label>
                    <input
                        type={`text`}
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                        className={`w-2/3 p-3 rounded-lg border ${
                            errors.old ? 'border-error' : 'border-outline'
                        } bg-inverse-surface text-inverse-on-surface `}
                    />
                    {errors.old && (
                        <p className="text-error text-sm">{errors.old}</p>
                    )}
                </div>

                <div className={`space-x-4`}>
                    <label className={`text-on-secondary-container`}>
                        新密码
                        <span className={`text-error`}>*</span>
                    </label>
                    <input
                        type={`text`}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className={`w-2/3 p-3 rounded-lg border ${
                            errors.new ? 'border-error' : 'border-outline'
                        } bg-inverse-surface text-inverse-on-surface `}
                    />
                    {errors.new && (
                        <p className="text-error text-sm">{errors.new}</p>
                    )}
                </div>
                <div className={`w-full flex justify-end pr-6`}>
                    <IconButton
                        text={"提交"}
                        onClick={handleSubmit}
                        className={`bg-secondary-container hover:bg-tertiary transition-all`}>

                    </IconButton>
                </div>
            </div>

        </div>
    )

}

function TagButton({onClick, title, underline, hidden}) {
    const [isHover, setIsHover] = useState(false)

    return <div
        className={`relative inline-flex flex-col items-center justify-center px-3 py-2 transition-colors ${hidden && `hidden`}`}
        onMouseOver={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={onClick}
    >
        <div className={`relative z-10`}>{title}</div>

        <div
            className={`absolute bottom-0 left-0 h-[2px] bg-on-primary-container transition-all duration-300 
                ${(underline || isHover) ? 'w-full' : 'w-0'}`}
            style={{transformOrigin: 'center'}}
        />
    </div>
}

function CourseList({}) {
    const {showNotification} = useNotification();
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const {isShowModal, toggleShowModal, setForm} = useModal();
    const [list, setList] = useState([{
        title: "123",
        cid: "123",
        cover: "ks-user-avatar/114514.jpg",
        ascription: "1903740564063391744",
        begin_time: "null",
        end_time: "null",
        major: "rj",
        class: "miaomiao1"
    }]);

    const GetCourseListInfo = async (page = 1) => {
        const newOffset = (page - 1) * 10;
        const res = await api.teacherService.myCourse({
            keyword: "",
            offset: newOffset,
            size: 10
        });

        if (res.base.code === 200) {
            setList(res.coursesinfo);
            // 添加自动计算总页数逻辑
            const calculatedTotalPages = res.total ? Math.ceil(res.total / 10) : page;
            setTotalPages(calculatedTotalPages);
            setCurrentPage(page);
        }
    };

    useEffect(() => {
        async function fetchCourseData() {
            await GetCourseListInfo(currentPage);
        }

        fetchCourseData();
    }, [currentPage]);  // 依赖改为 currentPage

    useEffect(() => {
        setForm(<CreateCourseForm key={Date.now()} flashList={GetCourseListInfo}/>);
    }, [list]);

    // 分页控制器组件
    const Pagination = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        // 生成可见页码范围
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex justify-center items-center gap-2 mt-6">
                <button
                    className={`px-3 py-1 rounded ${currentPage === 1 ?
                        'bg-gray-200 cursor-not-allowed' :
                        'bg-primary hover:bg-primary-dark text-on-primary'}`}
                    onClick={() => GetCourseListInfo(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    上一页
                </button>

                {startPage > 1 && (
                    <button
                        className="px-3 py-1"
                        onClick={() => GetCourseListInfo(1)}
                    >
                        1
                    </button>
                )}
                {startPage > 2 && <span className="px-2">...</span>}

                {pageNumbers.map(number => (
                    <button
                        key={number}
                        className={`px-3 py-1 rounded ${
                            currentPage === number
                                ? 'bg-primary text-on-primary'
                                : 'hover:bg-secondary-container'
                        }`}
                        onClick={() => GetCourseListInfo(number)}
                    >
                        {number}
                    </button>
                ))}

                {endPage < totalPages - 1 && <span className="px-2">...</span>}
                {endPage < totalPages && (
                    <button
                        className="px-3 py-1"
                        onClick={() => GetCourseListInfo(totalPages)}
                    >
                        {totalPages}
                    </button>
                )}

                <button
                    className={`px-3 py-1 rounded ${currentPage === totalPages ?
                        'bg-gray-200 cursor-not-allowed' :
                        'bg-primary hover:bg-primary-dark text-on-primary'}`}
                    onClick={() => GetCourseListInfo(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    下一页
                </button>
            </div>
        );
    };

    return (
        <div className="w-full bg-secondary-container rounded-2xl p-6 flex flex-col space-y-6">
            <div className="w-full flex p-3 text-2xl">我管理的课程</div>

            <div className="w-full flex flex-col space-y-3">
                <div
                    onClick={() => toggleShowModal(true)}
                    className={`w-full p-3 hover:bg-surface-variant rounded-2xl flex flex-row`}>
                    <IconWithText text={`新建课程`} className={``}>
                        <FontAwesomeIcon size={`2x`} icon={faAdd}></FontAwesomeIcon>
                    </IconWithText>
                </div>
                {list.map((item, index) => (
                    <CourseListItem
                        key={item.cid}
                        title={item.title}
                        cover={item.cover}
                        major={item.major}
                        begin_time={item.begin_time}
                        end_time={item.end_time}
                        class_name={item.class}
                    />
                ))}
            </div>
            <Pagination/>
        </div>
    );
}

function CourseListItem({title, cover, major, begin_time, end_time, class_name}) {
    const [openDrawer, setOpenDrawer] = useState(false)
    const [isHover, setIsHover] = useState(false)

    return (
        <div className="w-full flex flex-col">
            <div
                onMouseOver={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                onClick={() => setOpenDrawer(!openDrawer)}
                className="w-full hover:bg-surface-variant flex flex-row justify-between h-24 items-center rounded-2xl transition-all duration-300 cursor-pointer">

                <OssImage
                    url={cover}
                    className="ml-6 h-2/3 aspect-square  rounded-2xl"
                />
                <text className="w-1/4">{title}</text>
                <text className="w-1/4">{class_name || "未知班级"}</text>
                <div
                    className={`transition-all duration-300 mr-6 p-3 rounded-full
                        ${isHover
                        ? "opacity-100 translate-x-0 bg-primary text-on-primary"
                        : "opacity-0 translate-x-12"}`}>
                    <FontAwesomeIcon icon={faUpRightFromSquare}/>
                </div>
            </div>

            <div
                className={`w-full p-3 flex transition-all overflow-hidden
                    ${openDrawer ? "max-h-52 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="w-full flex flex-row gap-4">
                    <IconWithText text={major || "未知专业"}>
                        <FontAwesomeIcon icon={faBook}/>
                    </IconWithText>
                    <IconWithText text={begin_time || "未设置开始时间"}>
                        <FontAwesomeIcon icon={faCalendar}/>
                    </IconWithText>
                    <IconWithText text={end_time || "未设置结束时间"}>
                        <FontAwesomeIcon icon={faClock}/>
                    </IconWithText>
                </div>
            </div>
        </div>
    )
}

function IconWithText({children, text, className}) {
    return (
        <div className={` flex flex-row items-center p-1 space-x-2`}>
            {children}
            <div className={`${className}`}>{text}</div>
        </div>
    );
}

function CreateCourseForm({flashList}) {
    const {toggleShowModal} = useModal();
    var {showNotification} = useNotification();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        cover: "",
        begin_time: "",
        end_time: "",
        major: "",
        faculty: "",
        class: ""
    })
    const [errors, setErrors] = useState({});
    const handleChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        // 清除对应字段的错误
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };
    const handleTimeChange = (field) => (value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value ? dayjs(value).format('YYYY-MM-DD') : '' // 转换为字符串
        }));

        // 清除错误
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.name = '标题不能为控';
        }
        if (!formData.major.trim()) {
            newErrors.major = '专业不能为控'
        }
        if (!formData.class.trim()) {
            newErrors.class = '班级不能为空'
        }
        if (formData.description.length > 100) {
            newErrors.description = '课程简介不能超过100字';
        }
        if (!formData.begin_time) {
            newErrors.begin_time = '请选择开始时间';
        }
        if (!formData.end_time) {
            newErrors.end_time = '请选择结束时间';
        }
        if (formData.begin_time && formData.end_time &&
            dayjs(formData.end_time).isBefore(dayjs(formData.begin_time))) {
            newErrors.end_time = '结束时间不能早于开始时间';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        var res = await api.teacherService.createCourse({
            title: formData.title,
            description: formData.description,
            begin_time: formData.begin_time,
            end_time: formData.end_time,
            major: formData.major,
            cover: "ks-course-cover/default.jpg",
            faculty: formData.faculty,
            class: formData.class
        });
        if (res.base.code === 200) {
            showNotification({
                type: "success",
                title: "课程信息已保存"
            })
            flashList()
            toggleShowModal(false)
        } else {
            showNotification({
                type: "error",
                title: "课程",
                content: res.base.msg
            })
        }

    }
    return (
        <div className="p-6 w-full max-w-2xl bg-primary-container rounded-2xl shadow-xl"
             onClick={e => e.stopPropagation()}>
            <div className="text-3xl text-on-primary-container mb-6 font-medium">创建课程域</div>
            <div className={`space-y-6`}>

                <div className={`space-y-2`}>
                    <label className="text-sm font-medium text-on-primary-container">
                        标题
                        <span className="text-error">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={handleChange('title')}
                        className={`w-full p-3 rounded-lg border ${
                            errors.title ? 'border-error' : 'border-outline'
                        } bg-secondary-container text-on-surface`}
                        placeholder="请输入课程名"
                    />
                    {errors.title && (
                        <p className="text-error text-sm">{errors.title}</p>
                    )}
                </div>
                <div className={`space-y-2`}>
                    <label className="text-sm font-medium text-on-primary-container">
                        所属学院
                        <span className="text-error">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.faculty}
                        onChange={handleChange('faculty')}
                        className={`w-full p-3 rounded-lg border ${
                            errors.faculty ? 'border-error' : 'border-outline'
                        } bg-secondary-container text-on-surface`}
                        placeholder="请输入学院名"
                    />
                    {errors.faculty && (
                        <p className="text-error text-sm">{errors.faculty}</p>
                    )}
                </div>
                <div className={`grid grid-cols-2 gap-4`}>
                    <div className={`space-y-2`}>
                        <label className="text-sm font-medium text-on-primary-container">
                            专业名称
                            <span className="text-error">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.major}
                            onChange={handleChange('major')}
                            className={`w-full p-3 rounded-lg border ${
                                errors.major ? 'border-error' : 'border-outline'
                            } bg-secondary-container text-on-surface`}
                            placeholder="输入专业名称"
                        />
                        {errors.major && (
                            <p className="text-error text-sm">{errors.major}</p>
                        )}
                    </div>
                    <div className={`space-y-2`}>
                        <label className="text-sm font-medium text-on-primary-container">
                            所属班级
                            <span className="text-error">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.class}
                            onChange={handleChange('class')}
                            className={`w-full p-3 rounded-lg border ${
                                errors.class ? 'border-error' : 'border-outline'
                            } bg-secondary-container text-on-surface`}
                            placeholder="输入或选择班级"
                        />
                        {errors.class && (
                            <p className="text-error text-sm">{errors.class}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-on-primary-container">
                        课程简介
                        <span className="text-xs text-on-primary-container/60 ml-2">（最多100字）</span>
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={handleChange('description')}
                        className={`w-full p-3 rounded-lg border ${
                            errors.description ? 'border-error' : 'border-outline'
                        } bg-secondary-container text-on-surface resize-none h-32`}
                        placeholder="展示在课程信息中...."
                        maxLength={100}
                    />
                    <div className="flex justify-between text-sm">
                        {errors.description && (
                            <p className="text-error">{errors.description}</p>
                        )}
                        <span className="text-on-surface-variant ml-auto">
                            {formData.description.length}/100
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 z-index-[9999]">
                    {/* 开始时间 */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-on-primary-container">
                            开始时间
                            <span className="text-error">*</span>
                        </label>
                        <CustomDatePicker
                            value={formData.begin_time}
                            onChange={handleTimeChange('begin_time')}
                            error={errors.begin_time}
                            helperText={errors.begin_time}
                        />
                    </div>

                    {/* 结束时间 */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-on-primary-container">
                            结束时间
                            <span className="text-error">*</span>
                        </label>
                        <CustomDatePicker
                            value={formData.end_time}
                            onChange={handleTimeChange('end_time')}
                            minDate={dayjs(formData.begin_time)}
                            error={errors.end_time}
                            helperText={errors.end_time}
                        />
                    </div>
                </div>
                {/* 操作按钮 */}
                <div className="flex justify-end space-x-4 mt-8 transition-all">
                    <IconButton
                        type="button"
                        onClick={() => toggleShowModal(false)}
                        className="px-6 py-2 rounded-lg text-on-surface-variant hover:bg-inverse-primary transition-all"
                        text={"取消"}>
                    </IconButton>
                    <IconButton
                        type="submit"
                        className="px-6 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-hover transition-all"
                        onClick={handleSubmit}
                        text={"保存修改"}>
                    </IconButton>
                </div>

            </div>

        </div>
    )

}

