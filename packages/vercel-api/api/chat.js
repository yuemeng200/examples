import axios from 'axios';

let cachedToken = null;
let tokenExpireTime = 0;

const AK = process.env.QIANFAN_ACCESS_KEY;
const SK = process.env.QIANFAN_SECRET_KEY;

/**
 * 获取 Access Token
 */
async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpireTime) {
    console.log("使用缓存的 Access Token");
    return cachedToken;
  }

  const options = {
    method: 'POST',
    url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${AK}&client_secret=${SK}`,
  };

  try {
    const response = await axios(options);
    cachedToken = response.data.access_token;
    const expiresIn = response.data.expires_in;
    tokenExpireTime = Date.now() + expiresIn * 1000 - 5 * 60 * 1000;
    return cachedToken;
  } catch (error) {
    console.error("获取 Access Token 失败:", error.message);
    throw error;
  }
}

/**
 * Vercel Function：chatWithErnie
 */
export default async function handler(req, res) {
  const { prompt, model = 'ernie-speed-128k' } = req.query;

  try {
    const accessToken = await getAccessToken();
    const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${model}?access_token=${accessToken}`;
    const response = await axios.post(
      url,
      { messages: [{ role: 'user', content: prompt }], temperature: 0.99 },
      { headers: { 'Content-Type': 'application/json' }, timeout: 300000 }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("调用 chatWithErnie 失败:", error.message);
    res.status(500).json({ error: "调用 chatWithErnie 失败", details: error.message });
  }
}