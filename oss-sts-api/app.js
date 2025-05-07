require('dotenv').config();
import express from 'express';
import STS from '@alicloud/sts-sdk';
import OSS from 'ali-oss';

const app = express();
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const aliAccountId="1411100645229421"
// 生成临时凭证端点
app.get('/sts-token', async (req, res) => {

        const sts = new STS({
            accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
            accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
            endpoint: 'sts.aliyuncs.com',
        });

        try {
            console.log('[STS] 开始请求凭证');
            const result = await sts.assumeRole(
                `acs:ram::${aliAccountId}:role/KsFrontSide`,
                `FrontSideOss`,
                ``,
                3600
            );

            // console.log('[STS] 完整响应:', JSON.stringify(result, null, 2));

            if (!result.Credentials) {
                throw new Error('凭证数据不存在于响应');
            }

            res.status(200).json(result.Credentials);
        } catch (error) {
            console.error('[STS] 完整错误:', {
                message: error.message,
                stack: error.stack,
                code: error.code
            });
            res.status(500).json({
                error: 'STS服务不可用',
                detail: error.message
            });
        }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
