<script setup>
import { ref } from 'vue';
import WordsVideo from './components/WordsVideo.vue';
import themeWords from '@/assets/themeWords.js';

const selectedTheme = ref('travel');
const themes = Object.keys(themeWords);
</script>

<template>
  <div>
    <select v-model="selectedTheme">
      <option v-for="theme in themes" :key="theme" :value="theme">
        {{ theme }}
      </option>
    </select>
    <WordsVideo :theme="selectedTheme" />
  </div>
</template>

<style lang="less">

</style>
