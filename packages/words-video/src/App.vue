<script setup>
import { ref, onMounted } from 'vue';
import WordsVideo from './components/WordsVideo.vue';

const theme = ref('travel'); // 默认主题

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const themeParam = urlParams.get('theme');
  if (themeParam) {
    theme.value = themeParam;
  }
});
</script>

<template>
  <div id="app">
    <WordsVideo :theme="theme" />
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
</style>
