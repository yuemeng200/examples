<template>
  <div class="github-card" :style="cardStyle">
    <div class="github-card-inner">
      <!-- Header -->
      <div class="card-header">
        <div class="repo-owner">
          <img :src="packageInfo.owner.avatarUrl" class="avatar" />
          <span>{{ packageInfo.owner.name }}</span>
        </div>
        <a :href="packageInfo.url" target="_blank" class="repo-name">
          {{ packageInfo.name }}
        </a>
      </div>

      <!-- Description -->
      <div class="card-description">
        {{ packageInfo.description }}
      </div>

      <!-- Stats -->
      <div class="card-stats">
        <div class="stat-item">
          <div class="stat-icon">⭐</div>
          <span>{{ formatNumber(packageInfo.stars) }}</span>
        </div>
        <div class="stat-item">
          <div class="stat-icon">🔱</div>
          <span>{{ formatNumber(packageInfo.forks) }}</span>
        </div>
        <div class="stat-item">
          <div class="stat-icon">👀</div>
          <span>{{ formatNumber(packageInfo.watchers) }}</span>
        </div>
      </div>

      <!-- Languages -->
      <div class="card-languages">
        <div class="language-item" v-for="lang in packageInfo.languages" :key="lang">
          <span class="language-dot" :style="{ background: getLanguageColor(lang) }"></span>
          {{ lang }}
        </div>
      </div>

      <!-- Topics -->
      <div class="card-topics">
        <span class="topic-tag" v-for="topic in packageInfo.topics" :key="topic">
          {{ topic }}
        </span>
      </div>

      <!-- Footer -->
      <div class="card-footer">
        <span>Created {{ formatDate(packageInfo.createdAt) }}</span>
        <a :href="packageInfo.url" target="_blank" class="github-link">
          View on GitHub
          <svg height="16" viewBox="0 0 16 16" width="16">
            <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCardStore } from '../../store/card';

const store = useCardStore();

const props = defineProps({
  packageInfo: {
    type: Object,
    required: true,
    validator: (obj) => {
      return obj.owner && 
             typeof obj.owner.name === 'string' && 
             typeof obj.owner.avatarUrl === 'string';
    }
  }
});

const cardStyle = computed(() => ({
  padding: `${store.config.padding}px`,
  background: store.config.bg,
}));

// 语言颜色映射
const languageColors = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Vue: '#41b883',
  React: '#61dafb',
  // 添加更多语言颜色...
};

const getLanguageColor = (language) => {
  return languageColors[language] || '#858585';
};

const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>

<style scoped lang="less">
.github-card {
  width: 50vw;
  aspect-ratio: 3 / 4;
  border-radius: 16px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

.github-card-inner {
  height: 100%;
  padding: 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.repo-owner {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #57606a;
  font-size: 14px;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.repo-name {
  font-size: 24px;
  font-weight: 600;
  color: #24292f;
  text-decoration: none;
  
  &:hover {
    color: #0969da;
  }
}

.card-description {
  font-size: 16px;
  color: #57606a;
  line-height: 1.5;
  flex-grow: 1;
}

.card-stats {
  display: flex;
  gap: 24px;
  padding: 16px 0;
  border-top: 1px solid #d0d7de;
  border-bottom: 1px solid #d0d7de;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #24292f;
  font-size: 14px;
}

.stat-icon {
  font-size: 16px;
}

.card-languages {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.language-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #57606a;
}

.language-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.card-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.topic-tag {
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 20px;
  background: #ddf4ff;
  color: #0969da;
  
  &:hover {
    background: #b6e3ff;
  }
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  font-size: 12px;
  color: #57606a;
}

.github-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #0969da;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-top: -2px;
  }
}
</style>