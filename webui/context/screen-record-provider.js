"use client"

import {createContext, useContext, useEffect, useRef, useState} from "react";
import {useNotification} from "@/context/notification-provider";

// const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined';

const ScreenRecordContext = createContext(undefined);

export const ScreenRecordProvider = ({children}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false)
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [liveStream, setLiveStream] = useState(null);
    const mediaRecorderRef = useRef(null);
    const combinedStreamRef = useRef(null);
    const audioContextRef = useRef(null);
    const {showNotification} = useNotification();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const createCombinedStream = async () => {
        // if (!isBrowser) return null;

        try {
            const [screenStream, micStream] = await Promise.all([
                navigator.mediaDevices.getDisplayMedia({video: true, audio: true}),
                navigator.mediaDevices.getUserMedia({audio: true})
            ]);

            const audioContext = new AudioContext();
            const destination = audioContext.createMediaStreamDestination();

            [screenStream, micStream].forEach(stream => {
                if (stream.getAudioTracks().length > 0) {
                    const source = audioContext.createMediaStreamSource(stream);
                    source.connect(destination);
                }
            });

            const getSafeTracks = (stream, type) => {
                try {
                    return type === 'video'
                        ? [...(stream?.getVideoTracks() || [])]
                        : [...(destination.stream?.getAudioTracks() || [])];
                } catch {
                    return [];
                }
            };

            const previewStream = new MediaStream([...screenStream.getVideoTracks()]);
            setLiveStream(previewStream);

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
        // if (!isBrowser) return;

        try {
            const combinedStream = await createCombinedStream();

            if (!combinedStream || combinedStream.getTracks().length < 1) {
                throw new Error('无法获取有效的媒体轨道');
            }

            const recorder = new MediaRecorder(combinedStream, {
                mimeType: 'video/webm; codecs=vp9'
            });

            const chunks = [];
            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            recorder.onstop = () => {
                setRecordedBlob(new Blob(chunks, {type: 'video/webm'}));
                audioContextRef.current?.close();
            };

            mediaRecorderRef.current = recorder;
            combinedStreamRef.current = combinedStream;

            recorder.start(1000);
            setIsRecording(true);
            showNotification("success", "屏幕录制已启动");

        } catch (err) {
            console.error('录制失败:', err);
            cleanupResources();
            setIsRecording(false);
            showNotification("error", err instanceof Error ? err.message : "屏幕录制权限被拒绝");
        }
    };

    const cleanupResources = () => {
        mediaRecorderRef.current?.stop();
        combinedStreamRef.current?.getTracks().forEach(track => track.stop());
        audioContextRef.current?.close();
    };

    const stopRecording = () => {
        if (isRecording) {
            cleanupResources();
            setIsRecording(false);
            showNotification("info", "视频录制已停止");
        }
    };

    const pauseRecording = () => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.pause();
            showNotification("info", "录制已暂停");
        }
        setIsPaused(true)
    };

    const resumeRecording = () => {
        if (mediaRecorderRef.current?.state === 'paused') {
            mediaRecorderRef.current.resume();
            showNotification("success", "录制已恢复");
        }
        setIsPaused(false)
    };

    const clearRecordedData = () => {
        setRecordedBlob(null);
        showNotification("info", "已清除录制数据");
    };

    useEffect(() => {
        return () => {
            if (isRecording) cleanupResources();
        };
    }, [isRecording]);

    // if (!isBrowser) return null;

    return (
        <ScreenRecordContext.Provider
            value={{
                isRecording,
                isPaused,
                startRecording,
                stopRecording,
                pauseRecording,
                resumeRecording,
                clearRecordedData,
                recordedBlob,
                liveStream
            }}
        >
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