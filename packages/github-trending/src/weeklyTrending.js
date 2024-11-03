const axios = require('axios');
const cheerio = require('cheerio');

// 直接爬取 GitHub Trending 页面获取周趋势
async function getTopWeeklyStarredRepos(limit = 5) {
  try {
    const response = await axios.get('https://github.com/trending?since=weekly', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const repos = [];

    $('article.Box-row').each((i, elem) => {
      if (i >= limit) return false;

      const $elem = $(elem);
      const title = $elem.find('h2.h3').text().trim().replace(/\s+/g, ' ');
      const [author, name] = title.split('/').map(s => s.trim());
      
      const description = $elem.find('p.my-1').text().trim();
      
      const starsText = $elem.find('a.Link--muted[href$="/stargazers"]').text().trim();
      const stars = parseInt(starsText.replace(/,/g, '')) || 0;
      
      const weeklyStarsText = $elem.find('span.d-inline-block.float-sm-right').text().trim();
      const weeklyStars = parseInt(weeklyStarsText.replace(/,|\s.+$/g, '')) || 0;

      const language = $elem.find('[itemprop="programmingLanguage"]').text().trim();

      repos.push({
        name: `${author}/${name}`,
        description,
        stars,
        weeklyStars,
        language,
        url: `https://github.com/${author}/${name}`
      });
    });

    return repos;
  } catch (error) {
    console.error('Error fetching GitHub trending:', error.message);
    return [];
  }
}

module.exports = getTopWeeklyStarredRepos; 