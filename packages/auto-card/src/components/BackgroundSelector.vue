<template>
  <div class="background-selector">
    <div class="theme-group">
      <div class="theme-title">浅色主题</div>
      <div v-for="group in lightThemeGroups" :key="group.type" class="bg-group">
        <div class="group-title">{{ group.title }}</div>
        <div class="bg-options">
          <div
            v-for="bg in group.options"
            :key="bg.value"
            class="bg-option"
            :class="[{ active: modelValue === bg.value }, group.type]"
            @click="$emit('update:modelValue', bg.value)"
          >
            <div 
              class="bg-preview" 
              :class="bg.value"
              :style="bg.style"
            >
              <span v-if="group.type === 'image'" class="bg-label">{{ bg.label }}</span>
            </div>
            <div class="bg-tooltip">{{ bg.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="theme-group">
      <div class="theme-title">深色主题</div>
      <div v-for="group in darkThemeGroups" :key="group.type" class="bg-group">
        <div class="group-title">{{ group.title }}</div>
        <div class="bg-options">
          <div
            v-for="bg in group.options"
            :key="bg.value"
            class="bg-option"
            :class="[{ active: modelValue === bg.value }, group.type]"
            @click="$emit('update:modelValue', bg.value)"
          >
            <div 
              class="bg-preview" 
              :class="bg.value"
              :style="bg.style"
            >
              <span v-if="group.type === 'image'" class="bg-label">{{ bg.label }}</span>
            </div>
            <div class="bg-tooltip">{{ bg.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
});

defineEmits(['update:modelValue']);

const lightThemeGroups = [
  {
    type: 'gradient',
    title: '渐变背景',
    options: [
      { label: '清新灰', value: 'gradient-1', style: { background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' } },
      { label: '薄荷青', value: 'gradient-2', style: { background: 'linear-gradient(120deg, #e0f5ef 0%, #b7e9f7 100%)' } },
      { label: '温暖橙', value: 'gradient-3', style: { background: 'linear-gradient(120deg, #ffecd2 0%, #fcb69f 100%)' } },
      { label: '淡雅紫', value: 'gradient-4', style: { background: 'linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)' } },
      { label: '晨光粉', value: 'gradient-5', style: { background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)' } },
      { label: '天空蓝', value: 'gradient-6', style: { background: 'linear-gradient(120deg, #e0f7fa 0%, #b2ebf2 100%)' } }
    ]
  },
  {
    type: 'solid',
    title: '纯色背景',
    options: [
      { label: '纯白', value: 'solid-white', style: { background: '#ffffff' } },
      { label: '暖灰', value: 'solid-warm', style: { background: '#f5f5f5' } },
      { label: '浅米', value: 'solid-beige', style: { background: '#faf6f1' } },
      { label: '浅青', value: 'solid-mint', style: { background: '#e8f5e9' } }
    ]
  }
];

const darkThemeGroups = [
  {
    type: 'gradient',
    title: '渐变背景',
    options: [
      { label: '深邃蓝', value: 'gradient-dark-1', style: { background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' } },
      { label: '暗夜紫', value: 'gradient-dark-2', style: { background: 'linear-gradient(120deg, #30cfd0 0%, #330867 100%)' } },
      { label: '墨黑绿', value: 'gradient-dark-3', style: { background: 'linear-gradient(120deg, #0f2027 0%, #203a43 100%)' } },
      { label: '深邃红', value: 'gradient-dark-4', style: { background: 'linear-gradient(135deg, #434343 0%, #000000 100%)' } }
    ]
  },
  {
    type: 'solid',
    title: '纯色背景',
    options: [
      { label: '深色', value: 'solid-dark', style: { background: '#2c3e50' } },
      { label: '靛青', value: 'solid-indigo', style: { background: '#1a237e' } },
      { label: '深绿', value: 'solid-forest', style: { background: '#1b5e20' } },
      { label: '深紫', value: 'solid-purple', style: { background: '#311b92' } }
    ]
  }
];
</script>

<style lang="less" scoped>
.background-selector {
  display: flex;
  flex-direction: column;
  gap: @spacing-large;
}

.theme-group {
  display: flex;
  flex-direction: column;
  gap: @spacing-base;
  padding: @spacing-base;
  background: #fff;
  border-radius: @border-radius-base;
  box-shadow: @box-shadow;
}

.theme-title {
  font-size: 16px;
  font-weight: bold;
  color: @primary-color;
  padding-bottom: @spacing-small;
  border-bottom: 1px solid @border-color;
}

.bg-group {
  display: flex;
  flex-direction: column;
  gap: @spacing-small;
}

.group-title {
  font-size: 14px;
  color: @secondary-color;
}

.bg-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.bg-option {
  position: relative;
  cursor: pointer;
}

.bg-option.gradient .bg-preview,
.bg-option.solid .bg-preview {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: transform @transition-duration;
}

.bg-preview {
  border: 2px solid transparent;
  box-shadow: @box-shadow;
}

.bg-option.active .bg-preview {
  border-color: @primary-color;
  transform: scale(1.1);
}

.bg-tooltip {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: @secondary-color;
  white-space: nowrap;
  opacity: 0;
  transition: opacity @transition-duration;
  pointer-events: none;
}

.bg-option:hover .bg-tooltip {
  opacity: 1;
}
</style> 