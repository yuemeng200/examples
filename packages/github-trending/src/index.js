const getTopWeeklyStarredRepos = require('./weeklyTrending');
const getTopNewRepos = require('./newRepos');
const getRepoDetail = require('./repoDetail');
const { getCurrentYearAndWeek } = require('./utils/dateHelper');
const fs = require('fs-extra');
const glob = require('glob');
const axios = require('axios');
const downloadImages = require('./utils/imageDownloader');
const { cleanupSvgFiles } = require('./utils/imageDownloader');
const path = require('path');

module.exports = {
  getTopWeeklyStarredRepos,
  getTopNewRepos,
  getRepoDetail,
  getCurrentYearAndWeek
};

async function getCurrentRawData() {
  const { year, week, weekStart, weekEnd } = getCurrentYearAndWeek();
  console.log(`当前是 ${year} 年第 ${week} 周`);
  console.log(`本周开始日期：${weekStart}`);
  console.log(`本周结束日期：${weekEnd}`);
  const dirName = `${year}-${week}`;
  if (fs.existsSync(`./data/${dirName}/hot`) && fs.existsSync(`./data/${dirName}/new`)) {
    console.log(`${dirName} 目录已存在，跳过获取数据`);
    return;
  }
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
      try {
        const details = await getRepoDetail(repo.name);
        if (!details) {
          return;
        }
        const fileName = repo.name.replace('/', '_');
        fs.ensureDirSync(`./data/${dirName}/${group.type}/${fileName}`);
        fs.writeFileSync(`./data/${dirName}/${group.type}/${fileName}/information.json`, JSON.stringify(details, null, 2));
        console.log(`已保存 ${fileName} 的详细信息`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`获取 ${repo.name} 的详细信息失败: ${error}`);
      }
    });
  });
}

async function summaryReposInfo() {
  const url = 'https://api-amonduul.vercel.app/api/chat'
  const prompt = `你是一个专业的编程专家，请对该代码仓库进行最简介的功能总结，不要超过100字`
  // 使用 glob 对本周的 hot 和 new 目录下的所有 json 文件进行遍历
  const { year, week } = getCurrentYearAndWeek();
  const files = glob.sync(`./data/${year}-${week}/**/*.json`);
  let errorFlag = false;
  files.forEach(async (file) => {
    if (errorFlag) {
      return;
    }
    const content = fs.readFileSync(file, 'utf8');
    const details = JSON.parse(content);
    const description = details.description;
    const readme = details.readme;
    const response = await axios.post(url, {
      prompt: prompt + `\n\n${description}\n\n${readme}`
    });
    if (response.data.error) {
      console.error(`API 调用失败: ${response.data.error}`);
      errorFlag = true;
      return;
    }
    const summary = response.data.result;
    fs.writeFileSync(`${file}`, JSON.stringify({ ...details, summary }, null, 2));
    console.log(`已保存 ${file} 的总结信息`);
    await new Promise(resolve => setTimeout(resolve, 3000));
  });
}

// 对于readme里出现的所有图片，下载到本地，保存到该仓库的images目录下，注意图片的url可能是相对路径，也可能是绝对路径
async function downloadAllImages(repoName) {
  const { year, week } = getCurrentYearAndWeek();
  const dirName = `${year}-${week}`;
  const baseDir = `./data/${dirName}`;
  const files = glob.sync(`${baseDir}/**/information.json`);
  files.forEach(async (file) => {
    const content = fs.readFileSync(file, 'utf8');
    const details = JSON.parse(content);
    const repoName = details.name;
    const readme = details.readme;
    const packageBaseDir = file.replace('information.json', '');
    await downloadImages(repoName, readme, packageBaseDir);
  });
}

async function cleanupExistingSvgs() {
  const imagesDirs = glob.sync('**/images/', { cwd: __dirname });
  imagesDirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    cleanupSvgFiles(fullPath);
  });
}

async function main() {
  await cleanupExistingSvgs();
  await getCurrentRawData();
  await downloadAllImages();
  await summaryReposInfo();
}

main();