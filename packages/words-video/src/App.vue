<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import WordsVideo from './components/WordsVideo.vue';

const showThemeInput = ref(false);
const themeInputValue = ref('');
const themeInputRef = ref(null);

const toggleThemeInput = () => {
  showThemeInput.value = !showThemeInput.value;
  if (showThemeInput.value) {
    // 在下一个 tick 聚焦输入框
    setTimeout(() => themeInputRef.value?.focus(), 0);
  }
};

const handleKeydown = (event) => {
  // 检查是否按下 Command+K (Mac) 或 Ctrl+K (Windows/Linux)
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault(); // 阻止默认行为
    toggleThemeInput();
  }
  // 如果输入框可见且按下 Esc 键，则隐藏输入框
  if (showThemeInput.value && event.key === 'Escape') {
    showThemeInput.value = false;
  }
};

const handleThemeSubmit = () => {
  if (themeInputValue.value.trim()) {
    // 这里你可以处理主题提交的逻辑
    console.log('New theme submitted:', themeInputValue.value);
    // 重置输入框并隐藏
    themeInputValue.value = '';
    showThemeInput.value = false;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div id="app">
    <WordsVideo :theme="themeInputValue" />
    <div v-if="showThemeInput" class="theme-input-overlay" @click="showThemeInput = false">
      <div class="theme-input-container" @click.stop>
        <input 
          ref="themeInputRef"
          v-model="themeInputValue" 
          @keyup.enter="handleThemeSubmit"
          placeholder="Enter new theme"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.theme-input-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.theme-input-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  input {
    width: 300px;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;

    &:focus {
      border-color: #2ecc71;
    }
  }
}
</style>
