"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react";
import {useNotification} from "@/context/notification-provider";

// 添加浏览器环境检查
const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined';

const ScreenRecordContext = createContext(undefined);

export const ScreenRecordProvider = ({ children }) => {
    // 状态初始化增加安全判断
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);//视频缓存
    const [liveStream, setLiveStream] = useState(null); // 实时流状态
    const mediaRecorderRef = useRef(null);//媒体对象引用
    const combinedStreamRef = useRef(null);
    const audioContextRef = useRef(null);
    var {showNotification} = useNotification();

    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true) // 确保仅在客户端执行
    }, [])
    


    // 核心修复：重构媒体流合并逻辑
    const createCombinedStream = async () => {
        if (!isBrowser) return null;

        try {
            // 并行获取媒体流
            const [screenStream, micStream] = await Promise.all([
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }),
                navigator.mediaDevices.getUserMedia({ audio: true })
            ]);

            // 创建音频上下文
            const audioContext = new AudioContext();
            const destination = audioContext.createMediaStreamDestination();

            // 混合音频源
            [screenStream, micStream].forEach(stream => {
                if (stream.getAudioTracks().length > 0) {
                    const source = audioContext.createMediaStreamSource(stream);
                    source.connect(destination);
                }
            });

            // 安全转换轨道类型
            const getSafeTracks = (stream, type) => {
                try {
                    return type === 'video'
                        ? [...(stream?.getVideoTracks() || [])]
                        : [...(destination.stream?.getAudioTracks() || [])];
                } catch {
                    return [];
                }
            };
            const previewStream = new MediaStream([
                ...screenStream.getVideoTracks(),
            ]);
            setLiveStream(previewStream)
            
            return new MediaStream([
                ...getSafeTracks(screenStream, 'video'),
                ...getSafeTracks(destination.stream, 'audio')
            ]);
        } catch (error) {
            console.error('流创建失败:', error);
            return null;
        }
    };

    const startRecording = async () => {
        if (!isBrowser) return;

        try {
            const combinedStream = await createCombinedStream();

            // 强化流验证
            if (!combinedStream || combinedStream.getTracks().length < 1) {
                throw new Error('无法获取有效的媒体轨道');
            }

            // 创建录制器
            const recorder = new MediaRecorder(combinedStream, {
                mimeType: 'video/webm; codecs=vp9'
            });

            const chunks = [];
            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            recorder.onstop = () => {
                setRecordedBlob(new Blob(chunks, { type: 'video/webm' }));
                audioContextRef.current?.close();
            };

            // 保存引用
            mediaRecorderRef.current = recorder;
            combinedStreamRef.current = combinedStream;
            
            recorder.start(1000); // 设置时间切片为1秒
            setIsRecording(true);

            showNotification("success","屏幕录制已启动")
            
        } catch (err) {
            console.error('录制失败:', err);
            cleanupResources();
            setIsRecording(false);
            showNotification("error",err instanceof Error ? err.message :"屏幕录制权限被拒绝"    )
        }
    };

    // 统一清理逻辑
    const cleanupResources = () => {
        mediaRecorderRef.current?.stop();
        combinedStreamRef.current?.getTracks().forEach(track => track.stop());
        audioContextRef.current?.close();
    };

    const stopRecording = () => {
        if (isRecording) {
            cleanupResources();
            setIsRecording(false);
            showNotification("info","视频录制已停止")
        }
    };

    // 组件卸载处理
    useEffect(() => {
        return () => {
            if (isRecording) cleanupResources();
        };
    }, [isRecording]);
    


    // 服务端渲染时返回空内容
    if (!isBrowser) return null;

    return (
        <ScreenRecordContext.Provider value={{ isRecording, startRecording, stopRecording, recordedBlob,liveStream}}>
            {children}
        </ScreenRecordContext.Provider>
    );
};

export const useScreenRecord = () => {
    const context = useContext(ScreenRecordContext);
    if (!context) {
        throw new Error('useScreenRecord必须在ScreenRecordProvider内使用');
    }
    return context;
};