const getTopWeeklyStarredRepos = require('./src/weeklyTrending');
const getTopNewRepos = require('./src/newRepos');
const getRepoDetail = require('./src/repoDetail');
const { getCurrentYearAndWeek } = require('./src/utils/dateHelper');
const fs = require('fs-extra');

module.exports = {
  getTopWeeklyStarredRepos,
  getTopNewRepos,
  getRepoDetail,
  getCurrentYearAndWeek
};

// 测试代码示例
(async () => {
  const { year, week, weekStart, weekEnd } = getCurrentYearAndWeek();
  console.log(`当前是 ${year} 年第 ${week} 周`);
  console.log(`本周开始日期：${weekStart}`);
  console.log(`本周结束日期：${weekEnd}`);
  const dirName = `${year}-${week}`;
  fs.ensureDirSync(`./data/${dirName}/hot`);
  fs.ensureDirSync(`./data/${dirName}/new`);
  const hotRepos = await getTopWeeklyStarredRepos();
  const newRepos = await getTopNewRepos();
  [
    {
      repos: hotRepos,
      type: 'hot'
    },
    {
      repos: newRepos,
      type: 'new'
    }
  ].forEach(async (group) => {
    group.repos.forEach(async (repo) => {
      const details = await getRepoDetail(repo.name);
      const fileName = repo.name.replace('/', '_');
      fs.writeFileSync(`./data/${dirName}/${group.type}/${fileName}.json`, JSON.stringify(details, null, 2));
      console.log(`已保存 ${fileName} 的详细信息`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    });
  });
})();
