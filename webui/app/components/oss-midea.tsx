"use client"

import React, {useEffect, useState} from "react";
import {useNotification} from "@/context/notification-provider";
import {useOss} from "@/context/oss-uploader-provider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTruckLoading} from "@fortawesome/free-solid-svg-icons";


const parseOssUrl = (url?: string | null): { bucket?: string; fileName?: string } => {
    if (!url) return {bucket: undefined, fileName: undefined};

    const parts = url.split('/').filter(Boolean); // 过滤空字符串
    if (parts.length < 2) return {bucket: undefined, fileName: undefined};

    return {
        bucket: parts[0],
        fileName: parts.slice(1).join('/')
    };
};

interface OssVideoProps {
    url: string;
    className: string
}

export function OssVideo(props: OssVideoProps) {
    const {className = "", url} = props;
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const {showNotification} = useNotification();
    const {generateSignedUrl} = useOss();

    const {bucket, fileName} = parseOssUrl(url);

    useEffect(() => {
        const fetchVideo = async () => {

            if (!url) {
                showNotification({
                    title: "参数缺失",
                    content: "必须提供OSS资源地址",
                    type: "error"
                });
                return;
            }

            if (!bucket || !fileName) {
                if (url !== "null") {
                    showNotification({
                        title: "地址格式错误",
                        content: `无效的OSS地址格式: ${url}`,
                        type: "error"
                    });
                }
                return;
            }
            try {
                const url = await generateSignedUrl(fileName, bucket);
                if (!url) return;

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`视频加载失败，状态码：${response.status}`);
                }

                const blob = await response.blob();
                const videoUrl = URL.createObjectURL(blob);
                setBlobUrl(videoUrl);
            } catch (error) {
                const errorMessage = error instanceof Error
                    ? error.message
                    : "未知错误发生";

                showNotification({
                    title: "获取视频失败",
                    content: errorMessage,
                    type: "error"
                });
            }
        };

        fetchVideo();

        return () => {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };

    }, [url]);



    return (
        <div className={className}>
            {blobUrl ? (
                <video
                    controls
                    src={blobUrl}
                    className="w-full h-full object-cover"
                />
            ) : (
                <p>视频加载中...</p>
            )}
        </div>
    );
}

interface OssImageProps {
    className?: string;
    url: string;
    alt?: string;
}

export function OssImage({
                             className = "",
                             url,
                             alt = "OSS存储图片",
                         }: OssImageProps) {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const {showNotification} = useNotification();
    const {generateSignedUrl} = useOss();
    const {bucket, fileName} = parseOssUrl(url);

    useEffect(() => {

        if (!url) {
            showNotification({
                title: "参数缺失",
                content: "必须提供OSS资源地址",
                type: "error"
            });
            return;
        }

        if (!bucket || !fileName) {
            if (url !== "null") showNotification({
                title: "地址格式错误",
                content: `无效的OSS地址格式: ${url}`,
                type: "error"
            });
            return;
        }

        const fetchImage = async () => {
            try {
                const url = await generateSignedUrl(fileName, bucket);
                if (!url) return;

                const response = await fetch(url);
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onload = () => setBlobUrl(reader.result as string);
                reader.readAsDataURL(blob);
                const objectUrl = URL.createObjectURL(blob);
                setBlobUrl(objectUrl);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "未知错误";
                showNotification({
                    title: "获取图片失败",
                    content: errorMessage,
                    type: "error",
                });

            }
        };

        fetchImage();

        return () => {
            if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
    },[url])


    const handleImageError = () => {
        showNotification({
            title: "图片渲染失败",
            content: "无法加载图片资源",
            type: "error",
        });
    };

    return blobUrl ? (
        <img
            src={blobUrl}
            alt={alt || "OssImage"}
            className={`${className ? className : ``}  object-cover`} // 直接使用传入的 className
            onError={handleImageError}
        />
    ) : (
        <div
            className={` ${className ? className : ``}  flex flex-col min-w-max  transition-all duration-300 space-x-6 items-center justify-center`}>
            <FontAwesomeIcon className={`w-full animate-spin transition-all duration-300`}
                             icon={faTruckLoading}></FontAwesomeIcon>
            <div className={`w-full`}>Loading...</div>
        </div>
    );
}


export function OssVideoCover(props: { className?: string; url: string; onClick?: () => void }) {
    const {className = "", url, onClick} = props;
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const {showNotification} = useNotification();
    const {generateSignedUrl} = useOss();
    const {bucket, fileName} = parseOssUrl(url);

    useEffect(() => {
        if (!url || !bucket || !fileName || url === "null") return;

        // 1. 创建 AbortController 用于取消请求
        const abortController = new AbortController();

        // 2. 获取视频前 512KB 数据（按需调整范围）
        const fetchPartialVideo = async () => {
            try {
                const signedUrl = await generateSignedUrl(fileName, bucket);
                const response = await fetch(signedUrl, {
                    headers: {Range: "bytes=0-524288"}, // 仅请求前 512KB
                    signal: abortController.signal,
                });

                if (!response.ok) {
                    showNotification({
                        content: "",
                        type: "error",
                        title: "生成封面失败"
                    })
                }

                // 3. 生成 Blob 并创建临时 URL
                const blob = await response.blob();
                const videoUrl = URL.createObjectURL(blob);

                // 4. 使用隐藏 video 元素截取首帧
                const video = document.createElement("video");
                video.crossOrigin = "anonymous";
                video.preload = "metadata";
                video.src = videoUrl;

                // 5. 等待元数据加载完成
                await new Promise<void>((resolve, reject) => {
                    video.onloadedmetadata = () => resolve();
                    video.onerror = () => reject(new Error("视频元数据加载失败"));
                });

                // 6. 定位到首帧（兼容性处理）
                video.currentTime = 0.1;
                await new Promise<void>((resolve) => {
                    video.onseeked = () => resolve();
                });

                // 7. 绘制到 Canvas 生成预览图
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(video, 0, 0);

                // 8. 转换为 DataURL 并更新状态
                setPreviewUrl(canvas.toDataURL("image/jpeg", 0.8));

                // 9. 清理临时资源
                URL.revokeObjectURL(videoUrl);
                video.remove();
            } catch (err) {
                console.log(err)
                // showNotification({
                //     title: "封面生成失败",
                //     content: err instanceof Error ? err.message : "未知错误",
                //     type: "error",
                // });
            }
        };

        fetchPartialVideo();

        // 10. 组件卸载时中止请求
        return () => {
            abortController.abort();
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [url]);

    return (
        <div className={className} onClick={() => {
            onClick?.()
        }}>
            {previewUrl ? (
                <img
                    src={previewUrl}
                    alt="视频封面"
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="animate-pulse bg-gray-100 h-full w-full"/>
            )}
        </div>
    );
}
