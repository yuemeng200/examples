<template>
  <div class="card-container" :style="containerStyle">
    <div 
      class="card" 
      :class="[store.config.bg || 'gradient-1', getThemeClass(store.config.bg)]"
      :style="cardStyle"
    >
      <div class="card-inner" :style="innerStyle">
        <div class="card-content-wrapper" :style="contentStyle">
          <div class="card-title">{{ store.config.title }}</div>
          <div class="card-content" v-html="renderedContent"></div>
          <div class="card-reference" v-if="store.config.reference">
            <a :href="store.config.reference" target="_blank">{{ store.config.reference }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useCardStore } from '../store/card';

const store = useCardStore();

const renderedContent = computed(() => {
  if (!store.config.content) return '';
  const html = marked(store.config.content);
  return DOMPurify.sanitize(html);
});

const containerStyle = computed(() => {
  if (!store.config.ratio) return {};

  const [width, height] = store.config.ratio.split(':').map(Number);
  return {
    width: '40vw',
    height: `${(height / width) * 40}vw`
  };
});

const cardStyle = computed(() => ({
  fontFamily: store.config.font || 'LXGW WenKai Light',
  padding: `${store.config.padding}px`,
  width: '100%',
  height: '100%'
}));

const innerStyle = computed(() => ({
  '&::before': {
    filter: `blur(${store.config.blurStrength}px)`,
    opacity: store.config.bgOpacity / 100
  }
}));

const contentStyle = computed(() => ({
  padding: `${store.config.innerPadding}px`
}));

const getThemeClass = (bg) => {
  if (!bg) return 'theme-light';
  return bg.includes('dark') ? 'theme-dark' : 'theme-light';
};
</script>

<style lang="less">
.card-container {
  flex-shrink: 0;
}

.card {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  padding: 40px;
  height: 100%;
}

.card-inner {
  position: relative;
  height: 100%;
  border-radius: @border-radius-large;
  background: inherit;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: inherit;
    filter: blur(20px);
    opacity: 0.95;
    margin: -30px;
    transform: scale(1.2);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }
}

.card-content-wrapper {
  position: relative;
  z-index: 1;
  height: 100%;
  padding: 30px;
  display: flex;
  flex-direction: column;
  
  // 深色主题下添加微弱的内发光效果
  .theme-dark & {
    box-shadow: inset 0 0 30px rgba(255, 255, 255, 0.05);
  }
  
  // 浅色主题下添加微弱的内阴影
  .theme-light & {
    box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.03);
  }
}

.card-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  
  .theme-dark & {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}

.card-content {
  font-size: 16px;
  line-height: 1.6;
  flex: 1;
  overflow-y: auto;
  
  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    
    .theme-dark & {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}

.card-reference {
  margin-top: 20px;
  font-size: 14px;
  opacity: 0.8;
  transition: opacity 0.3s;

  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
      opacity: 1;
    }
  }
}

.theme-light {
  color: @text-primary-light;
  
  .card-reference {
    color: @text-secondary-light;
  }
}

.theme-dark {
  color: @text-primary-dark;
  
  .card-reference {
    color: @text-secondary-dark;
  }
}

/* 渐变背景 - 浅色主题 */
.gradient-1 { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); }
.gradient-2 { background: linear-gradient(120deg, #e0f5ef 0%, #b7e9f7 100%); }
.gradient-3 { background: linear-gradient(120deg, #ffecd2 0%, #fcb69f 100%); }
.gradient-4 { background: linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%); }
.gradient-5 { background: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%); }
.gradient-6 { background: linear-gradient(120deg, #e0f7fa 0%, #b2ebf2 100%); }

/* 渐变背景 - 深色主题 */
.gradient-dark-1 { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); }
.gradient-dark-2 { background: linear-gradient(120deg, #30cfd0 0%, #330867 100%); }
.gradient-dark-3 { background: linear-gradient(120deg, #0f2027 0%, #203a43 100%); }
.gradient-dark-4 { background: linear-gradient(135deg, #434343 0%, #000000 100%); }

/* 纯色背景 - 浅色主题 */
.solid-white { background: #ffffff; }
.solid-warm { background: #f5f5f5; }
.solid-beige { background: #faf6f1; }
.solid-mint { background: #e8f5e9; }

/* 纯色背景 - 深色主题 */
.solid-dark { background: #2c3e50; }
.solid-indigo { background: #1a237e; }
.solid-forest { background: #1b5e20; }
.solid-purple { background: #311b92; }

/* 图片背景 */
.image-geometry { background-image: url(...); }
.image-dots { background-image: url(...); }
.image-lines { background-image: url(...); }
</style> 