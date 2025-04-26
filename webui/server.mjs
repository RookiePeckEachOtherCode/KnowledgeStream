import STS from "@alicloud/sts-sdk";
import express from 'express';
import next from 'next';
import { createProxyMiddleware } from 'http-proxy-middleware';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const aliAccountId = "1411100645229421";

app.prepare().then(() => {
    const server = express();

    // STS临时凭证接口（保持不变）
    server.get('/api/sts-token', async (req, res) => {
        const sts = new STS({
            accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
            accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
            endpoint: 'sts.aliyuncs.com',
        });

        try {
            const result = await sts.assumeRole(
                `acs:ram::${aliAccountId}:role/KsFrontSide`,
                `FrontSideOss`,
                ``,
                3600
            );
            res.status(200).json(result.Credentials);
        } catch (error) {
            res.status(500).json({ error: error.message });
            console.error('STS Error Details:', error);
        }
    });

    // API代理（保持不变）
    server.use('/api', createProxyMiddleware({
        target: process.env.BACK_FONT_ADDRESS || `http://localhost:8888`,
        changeOrigin: true,
    }));

    // Next.js路由（保持不变）
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    const port = process.env.PORT || 3001;
    
    // 关键修改点：监听 IPv6 地址
    server.listen(port, '::', (err) => {  // '::' 表示监听所有 IPv6 地址（兼容 IPv4）
        if (err) throw err;
        
        // 获取实际监听的 IPv6 地址
        const serverAddress = server.address();
        const ipv6Address = 
            serverAddress && typeof serverAddress === 'object' 
            ? `[${serverAddress.address}]` 
            : '[::]';

        console.log(`> Ready on http://${ipv6Address}:${port}`);
        console.log(`> Send to ${process.env.BACK_FONT_ADDRESS || 'http://localhost:8888'}`);
        console.log(`Key Id : ${process.env.ALIYUN_ACCESS_KEY_ID}`);
        console.log(`Key Secret : ${process.env.ALIYUN_ACCESS_KEY_SECRET}`);
    });
});
