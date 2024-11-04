import { defineStore } from 'pinia';

export const useCardStore = defineStore('card', {
  state: () => ({
    config: {
      title: '欢迎使用 Auto Card',
      content: `
## 这是一个自动卡片生成工具

你可以通过传递配置来自定义卡片内容：

- 支持 **Markdown** 语法
- 支持自定义背景样式
- 支持自定义字体
- 支持添加参考链接
- 支持多种预设比例
`,
      reference: 'https://github.com/your-username/auto-card',
      bg: 'gradient-1',
      font: 'LXGW WenKai Light',
      ratio: '3:4',
      padding: 40,
      innerPadding: 30,
      blurStrength: 20,
      bgOpacity: 95
    }
  }),

  actions: {
    updateConfig(newConfig) {
      this.config = { ...this.config, ...newConfig };
    },
    resetConfig() {
      this.config = { ...this.$state.config };
    }
  }
}); 