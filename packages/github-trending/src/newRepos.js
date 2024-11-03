const axios = require('axios');

// 使用 GitHub API 获取最近创建的热门项目
async function getTopNewRepos(limit = 5, token = null) {
  try {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    const lastWeek = date.toISOString().split('T')[0];

    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Mozilla/5.0'
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    const query = new URLSearchParams({
      q: `created:>${lastWeek}`,
      sort: 'stars',
      order: 'desc'
    }).toString();

    const response = await axios.get(`https://api.github.com/search/repositories?${query}`, { headers });

    return response.data.items.slice(0, limit).map(repo => ({
      name: repo.full_name,
      description: repo.description,
      stars: repo.stargazers_count,
      language: repo.language,
      url: repo.html_url
    }));
  } catch (error) {
    console.error('Error fetching new GitHub repos:', error.message);
    return [];
  }
}

module.exports = getTopNewRepos; 