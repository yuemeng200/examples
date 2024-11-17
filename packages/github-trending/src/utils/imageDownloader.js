const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

async function downloadImages(repoFullName, readme, baseDir) {
  // 创建图片保存目录
  const imagesDir = path.join(baseDir, 'images');
  fs.ensureDirSync(imagesDir);

  // 匹配 Markdown 中的图片链接
  const imageRegex = /!\[.*?\]\((.*?)\)/g;
  const htmlImageRegex = /<img.*?src="(.*?)".*?>/g;
  
  const imageUrls = new Set();
  
  // 收集 Markdown 格式的图片
  let match;
  while ((match = imageRegex.exec(readme)) !== null) {
    imageUrls.add(match[1]);
  }
  
  // 收集 HTML 格式的图片
  while ((match = htmlImageRegex.exec(readme)) !== null) {
    imageUrls.add(match[1]);
  }

  const imageMapping = {};
  let index = 0;

  for (const imageUrl of imageUrls) {
    try {
      // 处理相对路径
      const fullUrl = imageUrl.startsWith('http') 
        ? imageUrl 
        : `https://raw.githubusercontent.com/${repoFullName}/${defaultBranch}/${imageUrl.replace(/^\.?\//, '')}`;

      // 处理查询参数
      const cleanUrl = fullUrl.split('?')[0]; // 移除 URL 中的查询参数
      const ext = path.extname(cleanUrl) || '.png';
      const filename = `image_${index}${ext}`;
      const filePath = path.join(imagesDir, filename);

      // 下载图片
      const response = await axios({
        method: 'GET',
        url: fullUrl,
        responseType: 'stream',
        validateStatus: status => status === 200,
        headers: {
          'Accept': 'image/*'
        }
      });

      // 检查 Content-Type
      const contentType = response.headers['content-type'];
      if (!contentType?.startsWith('image/')) {
        throw new Error(`Invalid content type: ${contentType}`);
      }

      // 保存图片
      await new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // 记录图片映射关系
      imageMapping[imageUrl] = {
        originalUrl: imageUrl,
        savedPath: `images/${filename}`,
        fullUrl
      };

      console.log(`Downloaded: ${imageUrl} -> ${filePath}`);
      index++;
      
      // 添加延时避免请求过快
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to download image ${imageUrl}:`, error.message);
    }
  }

  return imageMapping;
}

module.exports = downloadImages; 