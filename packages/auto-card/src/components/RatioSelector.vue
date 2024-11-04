<template>
  <div class="ratio-selector">
    <div class="current-ratio">当前比例: {{ modelValue }}</div>
    <div class="ratio-options">
      <div
        v-for="ratio in ratioOptions"
        :key="ratio.value"
        class="ratio-option"
        :class="{ active: modelValue === ratio.value }"
        @click="$emit('update:modelValue', ratio.value)"
      >
        <div class="ratio-preview" :style="getRatioStyle(ratio)">
          <span class="ratio-label">{{ ratio.label }}</span>
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

<style scoped>
.ratio-selector {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.current-ratio {
  font-size: 14px;
  color: #666;
  padding: 4px 12px;
  background: #f8f9fa;
  border-radius: 4px;
}

.ratio-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.ratio-option {
  cursor: pointer;
  padding: 4px;
  border: 2px solid transparent;
  border-radius: 4px;
  transition: all 0.3s;
}

.ratio-option.active {
  border-color: #2c3e50;
  background: #f8f9fa;
}

.ratio-preview {
  background: #e9ecef;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ratio-label {
  font-size: 12px;
  color: #666;
}
</style> 