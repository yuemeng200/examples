<template>
  <div class="container">
    <div class="left-panel">
      <config-editor class="editor" />
    </div>
    <div class="center-panel">
      <card-preview class="card-ready" />
    </div>
    <div class="right-panel">
      <layout-settings />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import CardPreview from './components/CardPreview.vue';
import ConfigEditor from './components/ConfigEditor.vue';
import LayoutSettings from './components/LayoutSettings.vue';
import { useCardStore } from './store/card';

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

.left-panel, .right-panel {
  position: sticky;
  top: @spacing-large;
}

.center-panel {
  display: flex;
  flex-direction: column;
  gap: @spacing-large;
  align-items: center;
  flex: 1;
}

.ratio-selector {
  width: 100%;
  max-width: 600px;
}
</style> 