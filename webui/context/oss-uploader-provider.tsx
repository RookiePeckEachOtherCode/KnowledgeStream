"use client"

import { createContext, useContext, useRef, useState, ReactNode } from "react";
import OSS from 'ali-oss';
import { useNotification } from "./notification-provider.tsx";

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

export function OssUploaderProvider({ children }: ProviderProps) {
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();
    const clientCache = useRef<Map<string, CacheEntry>>(new Map());

    const getSTSCredentials = async (): Promise<STSCredentials> => {
        const res = await fetch('/api/sts-token');
        return await res.json();
    };

    const initOSSClient = async (bucket: string): Promise<OSS> => {
        const cached = clientCache.current.get(bucket);
        if (cached && Date.now() - cached.lastRenew < 300000) {
            return cached.client;
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

        return newClient;
    };

    const ossHandleUploadFile = async (file: Blob, fileName: string, bucket: string): Promise<boolean> => {
        if (!file) return;
        setLoading(true);
        let success=true
        try {
            const client = await initOSSClient(bucket);
            const result = await client.put(fileName, file, {
                headers: {
                    'Content-Disposition': 'inline',
                    'Content-Type': file.type
                }
            });

            showNotification({
                title: "上传成功",
                content: "文件已上传",
                type: "success",
            });
        } catch (err) {
            showNotification({
                title: "上传失败",
                content: `${err instanceof Error ? err.message : String(err)}`,
                type: "error",
            });
            success=false
        } finally {
            setLoading(false);
        }
        return success
        
    };

    const generateSignedUrl = async (
        fileName: string,
        bucket: string,
        expires: number = 36000
    ): Promise<string> => {
        try {
            const client = await initOSSClient(bucket);
            return client.signatureUrl(fileName, {
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
        <OssContext.Provider value={{ ossHandleUploadFile, generateSignedUrl }}>
            {children}
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

export const OssBuckets={
    Video:"ks-video",
    UserAvatar:"ks-user-avatar",
    CourseCover:"ks-course-cover"
}