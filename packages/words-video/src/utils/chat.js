import axios from 'axios';

let cachedToken = null;
let tokenExpireTime = 0;

const AK = import.meta.env.VITE_QIANFAN_ACCESS_KEY;
const SK = import.meta.env.VITE_QIANFAN_SECRET_KEY;

const API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY;


console.log(AK, SK, API_KEY);

/**
 * 使用 AK，SK 生成鉴权签名（Access Token）
 * @return {Promise<string>} 鉴权签名信息（Access Token）
 */
async function getAccessToken() {
  // 如果缓存的 Token 还有效，直接返回
  if (cachedToken && Date.now() < tokenExpireTime) {
    console.log("使用缓存的 Access Token");
    return cachedToken;
  }

  const options = {
    'method': 'POST',
    'url': `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${AK}&client_secret=${SK}`,
  };
  try {
    const response = await axios(options);

    cachedToken = response.data.access_token;

    // 检查 expires_in 是否存在
    if ('expires_in' in response.data) {
      const expiresIn = response.data.expires_in;
      tokenExpireTime = Date.now() + (expiresIn * 1000) - (5 * 60 * 1000);
    } else {
      tokenExpireTime = Date.now() + (30 * 24 * 60 * 60 * 1000) - (5 * 60 * 1000);
    }

    return cachedToken;
  } catch (error) {
    console.error("获取 Access Token 失败:", error.message);
    if (error.response) {
      console.error("错误响应数据:", JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

/**
 * 调用文心一言 API 进行对话
 * @param {string} prompt - 用户输入的提示
 * @param {string} model - 使用的模型名称，默认为 'ernie-speed-128k'
 * @return {Promise<object>} API 响应结果
 */
async function chatWithErnie(prompt, model = 'ernie-speed-128k') {
  const accessToken = await getAccessToken();
  const subPaths = {
    'ernie-speed-8k': 'ernie_speed',
    'ernie-speed-128k': 'ernie-speed-128k',
  }
  const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${subPaths[model]}?access_token=${accessToken}`;

  try {
    const response = await axios.post(url, {
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.99,
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 300000
    });

    console.log("API 调用成功");
    return response.data;
  } catch (error) {
    console.error("API 调用失败:", error.message);
    if (error.response) {
      console.error("错误响应数据:", JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

/**
 * 根据主题获取单词示例
 */
async function getWordExamples(theme) {
  console.log('Getting word examples for theme:', theme);
  const prompt = `请根据主题 "${theme}" 生成一个包含20个单词的JSON数组。每个单词对象应包含以下属性：
  1. word: 英文单词
  2. phonetic: 音标（文本表示即可）
  3. zh: 中文翻译
  
  示例格式：
  [
    {"word": "Example", "phonetic": "/ɪɡˈzæmpəl/", "zh": "例子"},
    {"word": "Word", "phonetic": "/wɜːrd/", "zh": "单词"},
    // ... 更多单词 ...
  ]
  
  请确保生成的JSON是有效的，可以直接被 JSON.parse() 解析。不要包含除了 json 数据以外任何无关解释内容`;

  try {
    const response = await chatWithErnie(prompt);
    console.log('API response:', response);

    if (!response.result) {
      throw new Error('No result returned from API');
    }

    const result = response.result.replace('\n', '');
    console.log("🚀 ~ getWordExamples ~ result:", result)

    // 查找 JSON 数组的开始和结束位置
    const jsonStart = result.indexOf('```json');
    const jsonEnd = result.lastIndexOf('```');

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('Invalid response format');
    }

    // 提取 JSON 部分
    const jsonPart = result.slice(jsonStart + 7, jsonEnd).trim();
    console.log("🚀 ~ getWordExamples ~ jsonPart:", jsonPart)

    // 解析 JSON
    const words = JSON.parse(jsonPart);

    console.log('Processed words:', words);

    if (!Array.isArray(words) || words.length === 0) {
      throw new Error('Invalid words data structure');
    }

    return words.slice(0, 16);
  } catch (error) {
    console.error('Error in getWordExamples:', error);
    throw error;
  }
}

export { getWordExamples };
