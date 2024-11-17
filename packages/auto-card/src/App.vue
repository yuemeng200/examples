<template>
  <div class="container">
    <div class="left-panel">
      <config-editor class="editor" />
    </div>
    <div class="center-panel">
      <!-- <card-preview class="card-ready" /> -->
      <test-card/>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import CardPreview from './components/CardPreview.vue';
import ConfigEditor from './components/ConfigEditor.vue';
import { useCardStore } from './store/card';
import TestCard from './components/cards/TestCard.vue';

const store = useCardStore();

onMounted(() => {
  // 从 URL 参数获取配置
  const urlParams = new URLSearchParams(window.location.search);
  const config = urlParams.get('config');
  if (config) {
    try {
      store.updateConfig(JSON.parse(decodeURIComponent(config)));
    } catch (e) {
      console.error('Invalid card config:', e);
    }
  }
});
</script>

<style lang="less">
.container {
  min-height: 100vh;
  padding: @spacing-large;
  display: flex;
  gap: @spacing-large * 2;
  align-items: flex-start;
  background: @bg-light;
}

.left-panel {
  position: sticky;
  top: @spacing-large;
  max-height: calc(100vh - @spacing-large * 2);
  overflow-y: auto;
}

.center-panel {
  position: sticky;
  top: @spacing-large;
  display: flex;
  flex-direction: column;
  gap: @spacing-large;
  align-items: center;
  flex: 1;
  height: calc(100vh - @spacing-large * 2);
}

.ratio-selector {
  width: 100%;
  max-width: 600px;
}
</style> 