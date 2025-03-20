import STS from "@alicloud/sts-sdk";
import express from 'express';
import next from 'next';
import { createProxyMiddleware } from 'http-proxy-middleware'; 

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const aliAccountId="1411100645229421"
app.prepare().then(() => {
    const server = express();

    // STS临时凭证接口
    server.get('/api/sts-token', async (req, res) => {
        const sts = new STS({
            accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
            accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
            endpoint: 'sts.aliyuncs.com'
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
        }
    });

    // API代理
    server.use('/api', createProxyMiddleware({
        target: 'http://localhost:8888',
        changeOrigin: true,
    }));

    // Next.js路由
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    const port = process.env.PORT || 3001;
    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});