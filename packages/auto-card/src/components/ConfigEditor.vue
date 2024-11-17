<template>
  <div class="config-editor">
    <div class="editor-header">
      <h3>配置编辑器</h3>
      <div class="header-actions">
        <button @click="resetConfig">重置</button>
        <button @click="copyConfig" class="primary">复制配置</button>
      </div>
    </div>

    <div class="editor-content">
      <div class="form-group">
        <label>标题</label>
        <input 
          type="text" 
          v-model="store.config.title"
          placeholder="请输入卡片标题"
        >
      </div>

      <div class="form-group">
        <label>内容 (支持 Markdown)</label>
        <textarea
          v-model="store.config.content"
          placeholder="支持 Markdown 语法"
          rows="12"
        ></textarea>
      </div>

      <div class="form-group">
        <label>参考链接</label>
        <input 
          type="text" 
          v-model="store.config.reference"
          placeholder="请输入参考链接"
        >
      </div>

      <div class="form-group">
        <label>字体</label>
        <select v-model="store.config.font">
          <option 
            v-for="font in fontOptions" 
            :key="font.value"
            :value="font.value"
            :style="{ fontFamily: font.value }"
          >
            {{ font.label }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>尺寸比例</label>
        <div class="ratio-options">
          <div
            v-for="ratio in ratioOptions"
            :key="ratio.value"
            class="ratio-option"
            :class="{ active: store.config.ratio === ratio.value }"
            @click="store.updateConfig({ ratio: ratio.value })"
          >
            <div class="ratio-preview" :style="getRatioStyle(ratio)">
              <span class="ratio-label">{{ ratio.label }}</span>
            </div>
            <div class="ratio-value">{{ ratio.value }}</div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>外边距</label>
        <div class="setting-item">
          <div class="setting-label">
            <span class="setting-value">{{ store.config.padding }}px</span>
          </div>
          <input 
            type="range" 
            v-model.number="store.config.padding" 
            min="20" 
            max="60" 
            step="4"
            class="slider"
          >
        </div>
      </div>

      <div class="form-group">
        <label>内边距</label>
        <div class="setting-item">
          <div class="setting-label">
            <span class="setting-value">{{ store.config.innerPadding }}px</span>
          </div>
          <input 
            type="range" 
            v-model.number="store.config.innerPadding" 
            min="16" 
            max="48" 
            step="4"
            class="slider"
          >
        </div>
      </div>

      <div class="form-group">
        <label>模糊强度</label>
        <div class="setting-item">
          <div class="setting-label">
            <span class="setting-value">{{ store.config.blurStrength }}px</span>
          </div>
          <input 
            type="range" 
            v-model.number="store.config.blurStrength" 
            min="0" 
            max="40" 
            step="2"
            class="slider"
          >
        </div>
      </div>

      <div class="form-group">
        <label>背景透明度</label>
        <div class="setting-item">
          <div class="setting-label">
            <span class="setting-value">{{ store.config.bgOpacity }}%</span>
          </div>
          <input 
            type="range" 
            v-model.number="store.config.bgOpacity" 
            min="50" 
            max="100" 
            step="5"
            class="slider"
          >
        </div>
      </div>

      <div class="form-group">
        <label>背景样式</label>
        <background-selector v-model="store.config.bg" />
      </div>

      <details class="config-preview">
        <summary>配置预览</summary>
        <pre>{{ JSON.stringify(store.config, null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup>
import { useCardStore } from '../store/card';
import BackgroundSelector from './BackgroundSelector.vue';

const store = useCardStore();

const fontOptions = [
  { label: 'LXGW WenKai Light', value: 'LXGW WenKai Light' },
  { label: 'LXGW WenKai', value: 'LXGW WenKai' },
  { label: '思源宋体', value: 'Noto Serif SC' },
  { label: '思源黑体', value: 'Noto Sans SC' }
];

const ratioOptions = [
  { label: '方形', value: '1:1', width: 100, height: 100 },
  { label: '竖卡片', value: '3:4', width: 75, height: 100 },
  { label: '横卡片', value: '16:9', width: 100, height: 56.25 },
  { label: '长图', value: '9:16', width: 56.25, height: 100 },
  { label: '黄金比例', value: '1.618:1', width: 100, height: 61.8 },
  { label: '电影海报', value: '2:3', width: 66.67, height: 100 }
];

const getRatioStyle = (ratio) => {
  return {
    width: '60px',
    height: `${(ratio.height / ratio.width) * 60}px`,
  };
};

const resetConfig = () => {
  store.resetConfig();
  alert('已重置为默认配置');
};

const copyConfig = () => {
  const configStr = JSON.stringify(store.config, null, 2);
  navigator.clipboard.writeText(configStr);
  alert('配置已复制到剪贴板');
};
</script>

<style lang="less" scoped>
.config-editor {
  width: 350px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.editor-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-header h3 {
  margin: 0;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.editor-content {
  padding: 16px;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

input, textarea, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
}

textarea {
  resize: vertical;
  min-height: 120px;
}

button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
}

button.primary {
  background: #2c3e50;
  color: white;
  border: none;
}

button:hover {
  opacity: 0.9;
}

.bg-preview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.bg-preview-item {
  height: 80px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  font-size: 14px;
}

.bg-preview-item.active {
  border-color: #2c3e50;
}

.config-preview {
  margin-top: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 4px;
}

.config-preview pre {
  margin: 8px 0 0;
  font-family: monospace;
  font-size: 12px;
  white-space: pre-wrap;
}

/* 背景样式 */
.gradient-1 {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #2c3e50;
}

.gradient-2 {
  background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
  color: #2c3e50;
}

.solid-white {
  background: #ffffff;
  color: #2c3e50;
  border: 1px solid #eee;
}

.solid-dark {
  background: #2c3e50;
  color: #ffffff;
}

/* 从 LayoutSettings 合并的样式 */
.ratio-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: @spacing-base;
}

.ratio-option {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: @spacing-small;
  padding: @spacing-small;
  border: 2px solid transparent;
  border-radius: @border-radius-small;
  transition: all @transition-duration;

  &.active {
    border-color: @primary-color;
    background: #f8f9fa;
  }
}

.ratio-preview {
  background: #e9ecef;
  border-radius: @border-radius-small;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ratio-label {
  font-size: 12px;
  color: @secondary-color;
}

.ratio-value {
  font-size: 12px;
  color: @secondary-color;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 0;
}

.setting-label {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: @secondary-color;
  font-size: 14px;
}

.setting-value {
  color: @primary-color;
  font-weight: 500;
  min-width: 45px;
  text-align: right;
}

.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  background: #eee;
  border-radius: 2px;
  outline: none;
  margin: 8px 0;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: @primary-color;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 0 0 4px rgba(44, 62, 80, 0.1);
    }
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border: none;
    border-radius: 50%;
    background: @primary-color;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 0 0 4px rgba(44, 62, 80, 0.1);
    }
  }

  &::-ms-thumb {
    width: 16px;
    height: 16px;
    border: none;
    border-radius: 50%;
    background: @primary-color;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 0 0 4px rgba(44, 62, 80, 0.1);
    }
  }

  &::-moz-range-track {
    background: #eee;
    border-radius: 2px;
    height: 4px;
  }

  &::-ms-track {
    width: 100%;
    height: 4px;
    border: none;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
}
</style> 