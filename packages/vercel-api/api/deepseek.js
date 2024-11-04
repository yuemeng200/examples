import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

export default async function handler(req, res) {
  const { prompt, message } = req.body;

  const response = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [{
      role: "system", content: "请总结以下 GitHub 仓库的信息，包括仓库名称、功能总结（100字左右）、关键词（3个左右），并以 JSON 格式返回结果。{title, summary, keywords}",
      role: "user", content: message
    }],
    temperature: 1.0
  });
  res.status(200).json({
    message: response.choices[0].message.content
  });
}
