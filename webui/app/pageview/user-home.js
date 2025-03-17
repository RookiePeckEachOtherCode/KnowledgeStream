import {OssImage} from "../components/oss-midea.tsx";
import {Divider} from "../components/divider.tsx";
import {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faEdit, faIdCard, faPhone, faUpload, faUserGraduate} from "@fortawesome/free-solid-svg-icons";
import {useModal} from "../../context/modal-provider.js";
import {IconButton} from "../components/icon-button.tsx";
import MDInput from "../components/md-input.tsx";

export function UserHome() {
    const userInfo={
        id:"114514",
        bucket:"ks-course-cover",
        fileName:"test.jpg",
        name:"raymes",
        authority:"Student",
        phone:""
    }
    
    const [pager, setPager] = useState(0)
    const Block=["基本资料","修改头像","修改密码","管理课程"]
    
    const currentDisplay=()=>{
        switch (pager){
            case 0:
                return <BaseInfo></BaseInfo>
            case 1:
                return <UpdateAvatar bucket={userInfo.bucket} fileName={userInfo.fileName}></UpdateAvatar>
            case 2:
                return <EditForm></EditForm>
        }
    }
    
    
  return (
      <div className={`w-full h-full flex flex-col space-y-6 p-8`}>

          <div className={`w-full flex flex-col space-y-8 rounded-b-2xl p-3  bg-primary-container`}>
              <div className={`w-full flex-row flex `}>
                  <div className={`text-3xl`}>个人资料</div>
              </div>
              <Divider vertical={false}></Divider>
              <div className={`flex w-full space-x-8  flex-row`}>
                  {
                      Block.map((item,index)=>
                          <TagButton title={item} onClick={()=>setPager(index)} underline={index===pager}></TagButton>
                      )
                  }
              </div>
          </div>
          {
              currentDisplay()
          }


      </div>
  );
}

function BaseInfo(){
    const userInfo={
        id:"114514",
        bucket:"ks-course-cover",
        fileName:"test.jpg",
        name:"raymes",
        authority:"Student",
        phone:"1534658465846",
        grade:"2077",
        signature:"wwwwwwjbwwwwwwwwwwwjbwwwwwwwwwwwjb",
    }
    var {isShowModal,toggleShowModal,setForm} = useModal();
    


    useEffect(() => {
        setForm(<UpdateBaseInfoForm name={userInfo.name} phone={userInfo.phone} signature={userInfo.signature} />) //直接传递JSX元素
    }, [setForm]);
    
    return (
        <div className={`w-full bg-secondary-container space-y-3 rounded-2xl p-6 flex flex-col`}>
            <div
                className={`w-full flex items-center justify-between space-x-3 flex-row justify-items-start`}>
                <div className={`h-48 w-48 bg-green-300 rounded-full space-x-6 flex flex-row`}>
                    <OssImage fileName={userInfo.fileName} bucket={userInfo.bucket} className={`rounded-full`}>
                    </OssImage>
                    <div className={`flex flex-col space-y-6  justify-center h-full`}>
                        <div className={`flex text-3xl`}>{userInfo.name}</div>
                        <div className={`flex text-xl`}>{userInfo.authority}</div>
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
                                    <span className="text-on-surface">{userInfo.id}</span>
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

function UpdateBaseInfoForm(props) {
    const { toggleShowModal } = useModal();
    const [formData, setFormData] = useState({
        phone: props.phone || '',
        signature: props.signature || '',
        name: props.name || ''
    });
    const [errors, setErrors] = useState({});

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
            //TODO
            // 这里替换为实际的API调用
           // await updateUserInfo(formData);
            toggleShowModal(false);
            // 可以在这里触发父组件刷新数据
        } catch (error) {
            console.error('更新失败:', error);
        }
    };

    return (
        <div className="p-6 w-full max-w-2xl bg-primary-container rounded-2xl shadow-xl"
             onClick={e => e.stopPropagation()}>
            <div className="text-3xl text-on-primary-container mb-6 font-medium">编辑基础信息</div>

            <form  className="space-y-6">
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
            </form>
        </div>
    );
}

function UpdateAvatar(props) {
    const { bucket, fileName } = props;
    const [newFileName, setNewFileName] = useState(null);
    const [newFile, setNewFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

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
                        fileName={fileName}
                        bucket={bucket}
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
                        onClick={handleUploadClick}
                        className="h-auto space-x-3 bg-primary-container text-on-primary-container"
                    >
                        <FontAwesomeIcon icon={faUpload} />
                    </IconButton>
                    
                    <span className="text-sm  text-center text-on-surface-variant">
                        {newFileName || "未选择文件"}
                    </span>
                    <FontAwesomeIcon size={`3x`}  icon={faArrowRight}></FontAwesomeIcon>
                    
                </div>

                {/* 预览 */}
                <div className="w-1/5 aspect-square bg-secondary text-on-secondary rounded-sm overflow-hidden">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="预览"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            点击上传
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function EditForm() {
    return (
        <div
            className={`w-full bg-secondary-container rounded-2xl p-6 flex items-center space-x-3 flex-row justify-items-start`}>

        </div>
    )

}

function TagButton(props) {
    const [isHover, setIsHover] = useState(false)

    return <div
        className={`relative inline-flex flex-col items-center justify-center px-3 py-2 transition-colors`}
        onMouseOver={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={props.onClick}
    >
        <div className={`relative z-10`}>{props.title}</div>

        <div
            className={`absolute bottom-0 left-0 h-[2px] bg-on-primary-container transition-all duration-300 
                ${(props.underline || isHover) ? 'w-full' : 'w-0'}`}
            style={{transformOrigin: 'center'}}
        />
    </div>
}