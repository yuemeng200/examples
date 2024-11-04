<template>
  <div class="layout-settings">
    <div class="settings-section">
      <h3>尺寸比例</h3>
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

    <div class="settings-section">
      <h3>布局设置</h3>
      <div class="settings-group">
        <div class="setting-item">
          <div class="setting-label">
            <span>外边距</span>
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

        <div class="setting-item">
          <div class="setting-label">
            <span>内边距</span>
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

        <div class="setting-item">
          <div class="setting-label">
            <span>模糊强度</span>
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

        <div class="setting-item">
          <div class="setting-label">
            <span>背景透明度</span>
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
    </div>
  </div>
</template>

<script setup>
import { useCardStore } from '../store/card';

const store = useCardStore();

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
</script>

<style lang="less" scoped>
.layout-settings {
  display: flex;
  flex-direction: column;
  gap: @spacing-large;
  width: 300px;
}

.settings-section {
  background: white;
  border-radius: @border-radius-base;
  padding: @spacing-base;
  box-shadow: @box-shadow;

  h3 {
    margin: 0 0 @spacing-base;
    color: @primary-color;
    font-size: 16px;
  }
}

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

.settings-group {
  display: flex;
  flex-direction: column;
  gap: @spacing-base;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: @spacing-small;
}

.setting-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: @secondary-color;
  font-size: 14px;
}

.setting-value {
  color: @primary-color;
  font-weight: 500;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #eee;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: @primary-color;
    cursor: pointer;
    transition: all @transition-duration;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 0 0 4px rgba(44, 62, 80, 0.1);
    }
  }
}
</style> 