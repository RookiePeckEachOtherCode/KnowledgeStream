import React, {useEffect, useState} from "react";
import {useNotification} from "@/context/notification-provider";
import {useOss} from "@/context/oss-uploader-provider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTruckLoading} from "@fortawesome/free-solid-svg-icons";


interface OssVideoProps {
    className?: string;
    fileName: string;
    bucket: string;
}

export function OssVideo(props: OssVideoProps) {
    const { className = "", fileName, bucket } = props;
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const {showNotification} = useNotification();
    const { generateSignedUrl } = useOss();

    useEffect(() => {
        const fetchVideo = async () => {
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
    fileName: string;
    bucket: string;
    alt?: string;
}

export function OssImage({
    className = "",
    fileName,
    bucket,
    alt = "OSS存储图片",
}: OssImageProps) {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const {showNotification} = useNotification();
    const { generateSignedUrl } = useOss();

    useEffect(() => {
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
            className={`${className?className:``} w-full h-full object-cover`} // 直接使用传入的 className
            onError={handleImageError}
        />
    ) : (
        <div className="w-full  h-full flex flex-row  transition-all duration-300 space-x-6 items-center justify-center">
            <FontAwesomeIcon className={`animate-spin transition-all duration-300`} icon={faTruckLoading}></FontAwesomeIcon>
            <div>Loading...</div>
        </div>
    );
}