const dayjs = require('dayjs');
const weekOfYear = require('dayjs/plugin/weekOfYear');
const isoWeek = require('dayjs/plugin/isoWeek');

// 添加周数插件
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

function getCurrentYearAndWeek() {
  const now = dayjs();
  return {
    year: now.year(),
    week: now.isoWeek(), // 使用 ISO 周数（每周从周一开始）
    // 额外提供一些有用的信息
    weekStart: now.startOf('isoWeek').format('YYYY-MM-DD'),
    weekEnd: now.endOf('isoWeek').format('YYYY-MM-DD')
  };
}

module.exports = {
  getCurrentYearAndWeek
}; 