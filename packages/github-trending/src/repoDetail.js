const axios = require('axios');

async function getRepoDetail(repoFullName, token = null) {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Mozilla/5.0'
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    // 获取仓库基本信息
    const repoResponse = await axios.get(`https://api.github.com/repos/${repoFullName}`, { headers });
    
    // 获取 README 内容
    const readmeResponse = await axios.get(`https://api.github.com/repos/${repoFullName}/readme`, { headers });
    
    // 获取仓库的编程语言统计
    const languagesResponse = await axios.get(`https://api.github.com/repos/${repoFullName}/languages`, { headers });

    // 解码 README（Base64 格式）
    const readmeContent = Buffer.from(readmeResponse.data.content, 'base64').toString();

    return {
      // 基本信息
      name: repoResponse.data.full_name,
      description: repoResponse.data.description,
      stars: repoResponse.data.stargazers_count,
      forks: repoResponse.data.forks_count,
      watchers: repoResponse.data.watchers_count,
      
      // 技术相关
      mainLanguage: repoResponse.data.language,
      languages: languagesResponse.data,  // 返回所有使用的语言及其代码量
      topics: repoResponse.data.topics,   // 仓库的标签/主题
      
      // 其他详细信息
      readme: readmeContent,
      homepage: repoResponse.data.homepage,
      defaultBranch: repoResponse.data.default_branch,
      hasIssues: repoResponse.data.has_issues,
      hasWiki: repoResponse.data.has_wiki,
      license: repoResponse.data.license?.name,
      
      // 日期信息
      createdAt: repoResponse.data.created_at,
      updatedAt: repoResponse.data.updated_at,
      pushedAt: repoResponse.data.pushed_at,
      
      // URLs
      url: repoResponse.data.html_url,
      gitUrl: repoResponse.data.git_url,
      sshUrl: repoResponse.data.ssh_url,
      
      // 所有者信息
      owner: {
        name: repoResponse.data.owner.login,
        avatarUrl: repoResponse.data.owner.avatar_url,
        url: repoResponse.data.owner.html_url
      }
    };
  } catch (error) {
    console.error(`Error fetching repo details for ${repoFullName}:`, error.message);
    return null;
  }
}

module.exports = getRepoDetail; 