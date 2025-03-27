"use client"

import React, {useEffect, useState} from "react";
import {useNotification} from "@/context/notification-provider";
import {useOss} from "@/context/oss-uploader-provider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTruckLoading} from "@fortawesome/free-solid-svg-icons";


const parseOssUrl = (url?: string | null): { bucket?: string; fileName?: string } => {
    if (!url) return { bucket: undefined, fileName: undefined };

    const parts = url.split('/').filter(Boolean); // 过滤空字符串
    if (parts.length < 2) return { bucket: undefined, fileName: undefined };

    return {
        bucket: parts[0],
        fileName: parts.slice(1).join('/')
    };
};

interface OssVideoProps {
    url: string;
    className:string
}

export function OssVideo(props: OssVideoProps) {
    const { className = "", url } = props;
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const {showNotification} = useNotification();
    const { generateSignedUrl } = useOss();

    const { bucket, fileName } = parseOssUrl(url);

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
                showNotification({
                    title: "地址格式错误",
                    content: `无效的OSS地址格式: ${url}`,
                    type: "error"
                });
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

                console.error("视频加载错误:", error);
            }
        };

        fetchVideo();

        return () => {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [fileName, bucket]);

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
    const { generateSignedUrl } = useOss();
    const { bucket, fileName } = parseOssUrl(url);

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
            showNotification({
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
                console.error("图片加载错误:", error);
            }
        };

        fetchImage();

        return () => {
            if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
    }, [fileName, bucket]);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        showNotification({
            title: "图片渲染失败",
            content: "无法加载图片资源",
            type: "error",
        });
        console.error("图片加载错误", e);
    };
    
    return blobUrl ? (
        <img
            src={blobUrl}
            alt={alt || "OssImage"}
            className={`${className?className:``}  object-cover`} // 直接使用传入的 className
            onError={handleImageError}
        />
    ) : (
        <div className={` ${className?className:``}  flex flex-col min-w-max  transition-all duration-300 space-x-6 items-center justify-center`}>
            <FontAwesomeIcon className={`w-full animate-spin transition-all duration-300`} icon={faTruckLoading}></FontAwesomeIcon>
            <div className={`w-full`}>Loading...</div>
        </div>
    );
}