"use client"

import {createContext, useContext, useRef, useState, ReactNode} from "react";
import OSS from 'ali-oss';
import {useNotification} from "@/context/notification-provider";
import React from "react";
import {preconnect} from "react-dom";

type OssContextType = {
    ossHandleUploadFile: (file: Blob, fileName: string, bucket: string) => Promise<boolean>;
    generateSignedUrl: (fileName: string, bucket: string, expires?: number) => Promise<string>;
};

const OssContext = createContext<OssContextType | undefined>(undefined);

type ProviderProps = {
    children: ReactNode;
};

type CacheEntry = {
    client: OSS;
    lastRenew: number;
};

type STSCredentials = {
    AccessKeyId: string;
    AccessKeySecret: string;
    SecurityToken: string;
};

interface initOssClientBack {
    client: OSS;
    stsToken: string
}

export function OssUploaderProvider({children}: ProviderProps) {
    const [loading, setLoading] = useState(false);
    const {showNotification} = useNotification();
    const clientCache = useRef<Map<string, CacheEntry>>(new Map());
    const [uploadProgress, setUploadProgress] = useState(0);
    const getSTSCredentials = async (): Promise<STSCredentials> => {
        const res = await fetch('/api/sts-token');
        return await res.json();
    };
    const [stsToken, setStsToken] = useState("")

    const initOSSClient = async (bucket: string): Promise<initOssClientBack> => {
        const cached = clientCache.current.get(bucket);
        if (cached && Date.now() - cached.lastRenew < 300000) {
            return {
                client: cached.client,
                stsToken: stsToken
            };
        }

        const credentials = await getSTSCredentials();

        const newClient = new OSS({
            region: 'oss-cn-beijing',
            accessKeyId: credentials.AccessKeyId,
            accessKeySecret: credentials.AccessKeySecret,
            stsToken: credentials.SecurityToken,
            bucket: bucket,
            refreshSTSToken: async () => {
                const newCredentials = await getSTSCredentials();
                setStsToken(newCredentials.SecurityToken)
                return {
                    accessKeyId: newCredentials.AccessKeyId,
                    accessKeySecret: newCredentials.AccessKeySecret,
                    stsToken: newCredentials.SecurityToken
                };
            },
            refreshSTSTokenInterval: 300000
        });

        clientCache.current.set(bucket, {
            client: newClient,
            lastRenew: Date.now()
        });

        return {client: newClient, stsToken: credentials.SecurityToken};
    };

    const ossHandleUploadFile = async (file: Blob, fileName: string, bucket: string): Promise<boolean> => {
        if (!file) return false;
        setLoading(true);
        let success = true;
        try {
            const {client} = await initOSSClient(bucket);
            const partSize = 1024 * 1024; // 建议提取为常量

            const result = await client.multipartUpload(fileName, file, {
                headers: {
                    'Content-Disposition': 'inline',
                    'Content-Type': file.type,
                },
                parallel: 4,
                partSize,
                progress: (p: number, checkpoint: OSS.Checkpoint | null) => { // 允许null类型
                    const safeCheckpoint = checkpoint || {doneParts: []};
                    const totalParts = Math.ceil(file.size / partSize);

                    const donePartsCount = safeCheckpoint.doneParts?.length || 0;
                    const percent = totalParts > 0
                        ? Math.min(100, Math.round((donePartsCount / totalParts) * 100))
                        : 0;

                    setUploadProgress(percent);
                }
            });

            showNotification({title: "上传成功", type: "success", content: ""});
            return true;
        } catch (err) {
            // 增强错误处理

            console.log(err)
            showNotification({
                title: "上传失败",
                content: `请重试`,
                type: "error"
            });

            success = false;
        } finally {
            setLoading(false);
        }
        return success;
    };
    const generateSignedUrl = async (
        fileName: string,
        bucket: string,
        expires: number = 36000
    ): Promise<string> => {
        try {
            // console.log(bucket, fileName)
            const ossClientBack = await initOSSClient(bucket);
            return ossClientBack.client.signatureUrl(fileName, {
                expires,
                response: {
                    'content-disposition': 'inline'
                }
            });
        } catch (err) {
            showNotification({
                title: "生成链接失败",
                content: `${err instanceof Error ? err.message : String(err)}`,
                type: "error"
            });
            throw err;
        }
    };

    return (
        <OssContext.Provider value={{ossHandleUploadFile, generateSignedUrl}}>
            {children}
            {loading && (
                <div
                    className="fixed bottom-4 right-4 z-50 p-4 w-64 bg-on-surface rounded-lg shadow-lg border-outline ">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-surface-variant">
                            上传进度...
                        </span>
                        <span className="text-sm text-surface-variant">
                            {uploadProgress}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-tertiary h-2 rounded-full transition-all duration-300"
                            style={{width: `${uploadProgress}%`}}
                        />
                    </div>
                </div>
            )}
        </OssContext.Provider>
    );
}

export const useOss = (): OssContextType => {
    const context = useContext(OssContext);
    if (!context) {
        throw new Error('useOss必须在OssContext内使用');
    }
    return context;
};

export const OssBuckets = {
    Video: "ks-video",
    UserAvatar: "ks-user-avatar",
    CourseCover: "ks-course-cover",
    NotificationAnnex: "ks-notification-annex"

}