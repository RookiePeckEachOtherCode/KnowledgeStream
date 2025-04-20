import { useScreenRecord } from "../../context/screen-record-provider";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "../components/icon-button.tsx";
import { OssBuckets, useOss } from "../../context/oss-uploader-provider.tsx";
import { useModal } from "../../context/modal-provider.js";
import { api } from "../../api/instance.ts";
import { useNotification } from "../../context/notification-provider.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

export function ScreenRecordControlPage() {
  const {
    isRecording,
    isPaused,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecordedData,
    recordedBlob,
    liveStream,
  } = useScreenRecord();
  const { isShow, toggleShowModal, setForm } = useModal();
  const previewVideoRef = useRef(null); //实时预览流
  const { ossHandleUploadFile } = useOss();
  const { showNotification } = useNotification();

  //结束录屏生成预览
  const [blobUrl, setBlobUrl] = useState(null);
  useEffect(() => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      setBlobUrl(url);
    }
  }, [recordedBlob]);

  const [duration, setDuration] = useState(0);
  const timerRef = useRef(null);

  // 手动时间统计
  useEffect(() => {
    if (isRecording && !isPaused) {
      // 开始或恢复计时
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      // 暂停或停止时清除计时器
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording, isPaused]);

  const handleDownload = () => {
    if (!recordedBlob) return;

    const filename = `recording_${new Date().toISOString().slice(0, 19)}.webm`;
    const url = URL.createObjectURL(recordedBlob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  const videoRef = useRef(null);

  // 视频录制中回显
  useEffect(() => {
    if (previewVideoRef.current && liveStream) {
      previewVideoRef.current.srcObject = liveStream;
    }
  }, [liveStream]);

  useEffect(() => {
    setForm(
      <VideoSubmitForm
        key={Date.now()}
        uploadBlob={UploadVideoToOss}
        videoDuration={duration}
        blobSrc={blobUrl}
      ></VideoSubmitForm>
    );
  }, [isShow]);

  const UploadVideoToOss = async (fileName) => {
    const success = await ossHandleUploadFile(
      recordedBlob,
      fileName,
      OssBuckets.Video
    );
    if (success) {
      showNotification({
        type: "success",
        title: "视频文件已上传",
      });
    } else {
      showNotification({
        type: "error",
        title: "视频文件上传失败，请重试",
      });
    }
    return success;
  };

  return (
    <div className={`w-full  space-x-6  h-full flex flex-row p-8`}>
      <div className={`h-full flex flex-col space-y-6`}>
        {!isRecording ? (
          <IconButton
            className={` bg-secondary  text-on-secondary
                     hover:text-on-primary hover:bg-primary w-24 h-12`}
            text={`开始录制`}
            onClick={startRecording}
          ></IconButton>
        ) : (
          <IconButton
            className={`w-24 h-12 bg-error-container text-on-error-container 
                        hover:bg-error hover:text-on-error
                        `}
            text={`结束录制`}
            onClick={stopRecording}
          ></IconButton>
        )}
        {isRecording &&
          (!isPaused ? (
            <IconButton
              text={`暂停录制`}
              onClick={pauseRecording}
              className={`bg-secondary  hover:bg-secondary-fixed`}
            ></IconButton>
          ) : (
            <IconButton
              text={`恢复录制`}
              onClick={resumeRecording}
              className={`bg-primary-fixed-dim`}
            ></IconButton>
          ))}
        {recordedBlob && (
          <IconButton
            className={` bg-tertiary-container  text-on-tertiary-container
                     hover:text-on-tertiary hover:bg-tertiary w-24 h-12`}
            onClick={() => toggleShowModal(true)}
            text={`上传录屏`}
          ></IconButton>
        )}
        {recordedBlob && (
          <IconButton
            className={` bg-surface-dim  text-on-surface
                     hover:text-on-tertiary hover:bg-tertiary w-24 h-12`}
            text={`清除缓存`}
            onClick={clearRecordedData}
          ></IconButton>
        )}
        {recordedBlob && (
          <IconButton
            className={` bg-primary-fixed  text-on-primary-fixed
                     hover:text-on-primary-fixed-variant hover:bg-primary-fixed-dim w-24 h-12`}
            text={`下载视频`}
            onClick={handleDownload}
          ></IconButton>
        )}
      </div>

      <div className={`w-full items-center flex  justify-center`}>
        {isRecording ? (
          <div className={`w-3/4 relative flex`}>
            {isPaused && (
              <div className={`bg-black bg-opacity-10 absolute w-full h-full`}>
                录制暂停中
              </div>
            )}
            <video
              ref={previewVideoRef}
              autoPlay={true}
              muted={true}
              className={`w-full object-cover`}
            ></video>
          </div>
        ) : recordedBlob ? (
          <video
            ref={videoRef}
            controls
            src={blobUrl}
            className={`w-3/4 object-cover`}
            onLoadedMetadata={() => {}}
          />
        ) : (
          <div className={`w-full flex  h-full relative`}>
            <div
              className={`text-4xl absolute top-2/5 left-2/5 flex flex-col justify-center text-center`}
            >
              录制未开始
              <p>点击左侧按钮开启录制</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function VideoSubmitForm({ videoDuration, blobSrc, uploadBlob }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cid: "",
    length: "",
    chapter: "",
  });

  // 新增上传相关状态
  const [uploadMode, setUploadMode] = useState("blob");
  const [localFile, setLocalFile] = useState(null);
  const [localFileUrl, setLocalFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const { ossHandleUploadFile } = useOss();
  const [localVideoDuration, setLocalVideoDuration] = useState(0);
  // 原有状态
  const [courseName, setCourseName] = useState("");
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [courseDrawerIsOpen, setCourseDrawerIsOpen] = useState(false);
  const { showNotification } = useNotification();
  const { toggleShowModal } = useModal();

  // 预览处理
  const handlePreview = () => {
    if (uploadMode === "blob" && blobSrc) {
      window.open(blobSrc, "_blank");
    } else if (uploadMode === "local" && localFileUrl) {
      window.open(localFileUrl, "_blank");
    }
  };

  // 本地文件处理
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith("video/")) {
      showNotification({ type: "error", title: "仅支持视频文件" });
      return;
    }

    // 创建临时预览URL
    const url = URL.createObjectURL(file);

    try {
      // 获取视频时长
      const duration = await getVideoDuration(file);

      setLocalFile(file);
      setFileName(file.name);
      setLocalFileUrl(url);
      setLocalVideoDuration(duration);

      // 更新表单时长字段
      setFormData((prev) => ({ ...prev, length: duration }));
    } catch (error) {
      showNotification({
        type: "error",
        title: "读取文件失败",
        message: error.message,
      });
      URL.revokeObjectURL(url);
    }
  };
  const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(Math.round(video.duration));
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error("无法读取视频元数据"));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  // 课程数据获取
  useEffect(() => {
    async function fetchData() {
      const res = await api.teacherService.myCourse({
        keyword: "",
        offset: "0",
        size: "666",
      });
      if (res.base.code === 200) {
        setCourses(res.coursesinfo);
      } else {
        showNotification({
          title: "获取教师课程失败!",
          type: "info",
          content: "请重启表单并保证有可用课程域",
        });
      }
    }

    fetchData();
  }, []);

  // 表单字段变更处理
  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // 课程选择处理
  const ChooseCourse = (index) => {
    setCourseName(courses[index].title);
    setFormData((prev) => ({
      ...prev,
      ["cid"]: courses[index].cid,
    }));
  };

  // 表单验证
  const validateForm = () => {
    const newErrors = {};
    // 公共验证
    if (!formData.chapter.trim()) newErrors.chapter = "章节不能为空";
    if (!formData.title.trim()) newErrors.title = "标题不能为空";
    if (!formData.cid.trim()) {
      newErrors.cid = "请选择有效课程";
    }

    // 模式相关验证
    if (uploadMode === "blob" && !blobSrc) {
      newErrors.upload = "请先完成屏幕录制";
    }
    if (uploadMode === "local" && !localFile) {
      newErrors.upload = "请选择要上传的文件";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // TODO: 实现本地文件上传逻辑
  const handleLocalUpload = async (file) => {
    const currentDuration = formatDuration(localVideoDuration);
    const resp = await api.teacherService.uploadVideo({
      title: formData.title,
      description: formData.description,
      cid: formData.cid,
      chapter: formData.chapter,
      length: currentDuration,
    });
    if (resp.base.code === 200) {
      const success = await ossHandleUploadFile(
        file,
        resp.newid,
        OssBuckets.Video
      );
      if (success) {
        showNotification({
          title: "视频已上传",
          type: "success",
        });
      } else {
        showNotification({
          title: "视频存储出现错误",
          type: "error",
        });
        await api.teacherService.deleteVideo({
          vid: resp.newid,
        });
      }
    } else {
      showNotification({
        title: "保存视频信息失败",
        content: resp.base.msg,
        type: "error",
      });
    }
  };

  const handleOnlineUpload = async () => {
    const currentDuration = formatDuration(videoDuration);
    const resp = await api.teacherService.uploadVideo({
      title: formData.title,
      description: formData.description,
      cid: formData.cid,
      chapter: formData.chapter,
      length: currentDuration,
    });
    if (resp.base.code !== 200) {
      showNotification({
        title: "保存视频信息失败",
        content: resp.base.msg,
        type: "error",
      });
    } else {
      const success = await uploadBlob(resp.newid);
      if (!success) {
        await api.teacherService.deleteVideo({
          vid: resp.newid,
        });
      }
    }
  };

  // 提交处理
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (uploadMode === "blob") {
      await handleOnlineUpload();
    } else {
      const parts = fileName.split(".");
      if (parts.length > 2) {
        showNotification({
          title: "哥们啥文件名啊",
          type: "error",
        });
        return;
      }
      await handleLocalUpload(localFile, parts[1]);
    }
  };

  return (
    <div
      className="w-2/5 p-6 bg-secondary-container flex flex-col rounded-2xl space-y-6"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 上传模式切换 */}
      <div className="flex gap-4 items-center mb-6">
        <label className="flex items-center gap-2 text-on-secondary-container">
          <input
            type="radio"
            value="blob"
            checked={uploadMode === "blob"}
            onChange={() => setUploadMode("blob")}
            className="w-4 h-4 accent-primary"
          />
          使用屏幕录制
        </label>
        <label className="flex items-center gap-2 text-on-secondary-container">
          <input
            type="radio"
            value="local"
            checked={uploadMode === "local"}
            onChange={() => {
              setUploadMode("local");
              setFileName("");
              setLocalFile(null);
            }}
            className="w-4 h-4 accent-primary"
          />
          上传本地文件
        </label>
      </div>

      {/* 本地文件上传区域 */}
      {uploadMode === "local" && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
              id="fileUpload"
            />
            <label
              htmlFor="fileUpload"
              className="px-4 py-2 bg-primary text-on-primary rounded-lg cursor-pointer hover:bg-primary-hover transition-colors"
            >
              选择文件
            </label>
            {fileName && (
              <span className="text-on-surface-variant truncate max-w-[300px]">
                {fileName}
              </span>
            )}
          </div>
          {errors.upload && (
            <p className="text-error text-sm">{errors.upload}</p>
          )}
        </div>
      )}

      {/* 预览按钮 */}
      <div className="flex justify-between items-center mb-6">
        <IconButton
          onClick={handlePreview}
          disabled={!(uploadMode === "blob" ? blobSrc : localFileUrl)}
          className="px-4 py-2 bg-tertiary text-on-tertiary rounded-lg hover:bg-tertiary-hover"
          text="预览视频"
        />
      </div>

      {/* 原有表单内容 */}
      <div className="w-full text-2xl text-on-secondary-container">
        完善视频信息
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {/* 标题输入 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-secondary-container">
              标题<span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={handleChange("title")}
              className={`w-full p-3 rounded-lg border ${
                errors.title ? "border-error" : "border-outline"
              } bg-secondary-container text-on-surface`}
              placeholder="请输入视频标题"
            />
            {errors.title && (
              <p className="text-error text-sm">{errors.title}</p>
            )}
          </div>

          {/* 课程选择 */}
          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-on-secondary-container">
              所属课程<span className="text-error">*</span>
            </label>
            <div className="w-full relative flex">
              <input
                type="text"
                value={courseName}
                readOnly
                className={`w-full flex justify-between p-3 rounded-lg text-on-secondary-container border ${
                  errors.cid ? "border-error" : "border-outline"
                } bg-secondary-container`}
                placeholder="选择课程"
              />
              <FontAwesomeIcon
                icon={faArrowDown}
                onClick={() => setCourseDrawerIsOpen(!courseDrawerIsOpen)}
                className="absolute text-on-surface hover:scale-125 transition-all duration-300 top-1/3 right-4 cursor-pointer"
              />
            </div>
            <div
              className={`w-full ${
                courseDrawerIsOpen ? "max-h-[200px]" : "max-h-0"
              } overflow-hidden transition-all duration-300 absolute top-full rounded-xl bg-primary-fixed z-10`}
            >
              <div className="p-3 space-y-2 flex flex-col">
                {courses.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      ChooseCourse(index);
                      setCourseDrawerIsOpen(false);
                    }}
                    className="w-full hover:bg-secondary rounded-xl p-2 cursor-pointer text-on-primary-fixed"
                  >
                    <div className="pl-3 truncate">{item.title}</div>
                  </div>
                ))}
              </div>
            </div>
            {errors.cid && <p className="text-error text-sm">{errors.cid}</p>}
          </div>
        </div>

        {/* 视频简介 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-on-secondary-container">
            视频简介
            <span className="text-xs text-on-primary-container/60 ml-2">
              （最多2048个字符）
            </span>
          </label>
          <textarea
            value={formData.description}
            onChange={handleChange("description")}
            className={`w-full p-3 rounded-lg border ${
              errors.description ? "border-error" : "border-outline"
            } bg-secondary-container text-on-surface resize-none h-32`}
            placeholder="展示在播放页中...."
            maxLength={2048}
          />
          <div className="flex justify-between text-sm">
            {errors.description && (
              <p className="text-error">{errors.description}</p>
            )}
            <span className="text-on-surface-variant ml-auto">
              {formData.description.length}/2048
            </span>
          </div>
        </div>

        {/* 章节名称 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-on-secondary-container">
            章节名称<span className="text-error">*</span>
          </label>
          <input
            type="text"
            value={formData.chapter}
            onChange={handleChange("chapter")}
            className={`w-full p-3 rounded-lg border ${
              errors.chapter ? "border-error" : "border-outline"
            } bg-secondary-container text-on-surface`}
            placeholder="新章节自动创建"
          />
          {errors.chapter && (
            <p className="text-error text-sm">{errors.chapter}</p>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end space-x-4 mt-8">
          <IconButton
            type="button"
            onClick={() => toggleShowModal(false)}
            className="px-6 py-2 rounded-lg text-on-surface-variant hover:bg-inverse-primary"
            text="取消"
          />
          <IconButton
            type="submit"
            className="px-6 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-hover"
            onClick={handleSubmit}
            text={uploadMode === "blob" ? "提交录屏" : "上传文件"}
          />
        </div>
      </div>
    </div>
  );
}

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return [h, m, s]
    .map((v) => v.toString().padStart(2, "0"))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
};
