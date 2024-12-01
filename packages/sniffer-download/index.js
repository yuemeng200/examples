// 实现一个脚本，对文本中出现的所有图片链接进行下载

const fs = require('fs')
const path = require('path')
const axios = require('axios')

const text = fs.readFileSync(path.join(__dirname, 'temp/text.txt'), 'utf8')

const imgUrls = text.match(/https?:\/\/\S+\.png/g)

console.log(imgUrls)

// 确保 imgs 目录存在
if (!fs.existsSync('./imgs')) {
  fs.mkdirSync('./imgs')
}

// 对每个图片链接进行下载
imgUrls.forEach(async (url, index) => {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'  // 设置响应类型为 arraybuffer
    })
    const fileName = url.split('/').pop()
    fs.writeFileSync(
      `./imgs/${index}.png`, 
      Buffer.from(response.data), // 将 arraybuffer 转换为 Buffer
      'binary'
    )
    console.log(`成功下载: ${fileName}`)
  } catch (error) {
    console.log(`下载 ${url} 失败:`, error.message)
  }
})
