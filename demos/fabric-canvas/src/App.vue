<template>
  <CustomCanvas />
</template>

<script lang="ts" setup>
import CustomCanvas from './components/CustomCanvas.vue'
</script>

<style>
/* 重置默认样式 */
* {
  margin: 0;
  
  padding: 0;
  box-sizing: border-box;
}

/* 禁止页面滚动和回弹 */
html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: fixed;
  touch-action: none;
  -webkit-overflow-scrolling: none;
}
</style>
