"use client"

import {createContext, useContext, useRef, useState} from "react";
import OSS from 'ali-oss';
import {useNotification} from "./notification-provider.tsx";
const OssContext=createContext(undefined)

export function OssUploaderProvider({children}){
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(false);
    var {showNotification} = useNotification();

    const clientCache = useRef(new Map());

    // 获取临时凭证
    const getSTSCredentials = async () => {
        const res = await fetch('/api/sts-token');
        return await res.json();
    };
    
    const initOSSClient = async (bucket) => {
        
        const cached = clientCache.current.get(bucket);// 检查缓存是否存在且未过期（5分钟）
        if (cached && Date.now() - cached.lastRenew < 300000) {
            return cached.client;
        }
        
        const credentials = await getSTSCredentials();

        const newClient = OSS({
            region: 'oss-cn-beijing', 
            accessKeyId: credentials.AccessKeyId,
            accessKeySecret: credentials.AccessKeySecret,
            stsToken: credentials.SecurityToken,
            bucket: bucket, // 你的 OSS Bucket 名称
            refreshSTSToken: async () => {
                // Token 过期时自动刷新
                const newCredentials = await getSTSCredentials();
                return {
                    accessKeyId: newCredentials.AccessKeyId,
                    accessKeySecret: newCredentials.AccessKeySecret,
                    stsToken: newCredentials.SecurityToken
                };
            },
            refreshSTSTokenInterval: 300000 // 5 分钟刷新一次
        });
        // 更新缓存
        clientCache.current.set(bucket, {
            client: newClient,
            lastRenew: Date.now()
        });

        return newClient;
        
    };
    
    
    const handleUploadFile=async (file,fileName,bucket)=>{
        if (!file) return;
        setLoading(true);
        try {
            var client = await initOSSClient(bucket);

            var result = await client.put(fileName,file,{
                headers: {
                    'Content-Disposition': 'inline', // 强制浏览器内联显示
                    'Content-Type': file.type        // 确保 MIME 类型正确
                }
            });
            showNotification({
                    title:"上传成功",
                    content: "视频已上传",
                    type: "success",
                }
            )
            
        }catch (err){
            showNotification({
                title:"上传失败",
                content: `${err}`,
                type: "error",
            })
        }finally {
            setLoading(false)
        }
        
    }

    const generateSignedUrl = async (fileName, bucket, expires = 36000) => {
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
                content: `${err}`,
                type: "error"
            });
            throw err;
        }
    };
    
    
    
    return(
        <OssContext.Provider value={{handleUploadFile,generateSignedUrl}}>
            {children}
        </OssContext.Provider>
    )
    
}
export const useOss=()=>{
    const context = useContext(OssContext);
    if (!context) {
        throw new Error('useOss必须在OssContext内使用');
    }
    return context;


}