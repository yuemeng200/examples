<template>
  <div class="github-card">
    <div class="github-card-inner">
      <!-- Header -->
      <div class="card-header">
        <div class="repo-owner">
          <img :src="packageInfo.owner.avatarUrl" class="avatar" />
          <span>{{ packageInfo.owner.name }}</span>
        </div>
        <div class="repo-name">{{ packageInfo.name }}</div>
      </div>

      <!-- Description -->
      <div class="card-description">
        {{ packageInfo.description }}
      </div>

      <!-- Picture -->
      <div class="card-picture">
        <img src="./image.png" />
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
        <div
          class="language-item"
          v-for="lang in languageList"
          :key="lang.name">
          <span class="language-dot" :style="{ background: lang.color }"></span>
          {{ lang.name }}
        </div>
      </div>

      <!-- Topics -->
      <div class="card-topics">
        <span
          class="topic-tag"
          v-for="topic in packageInfo.topics.slice(0, 4)"
          :key="topic">
          {{ topic }}
        </span>
      </div>

      <!-- Footer -->
      <div class="card-footer">
        <div class="footer-info">
          <span class="github-link">{{ packageInfo.url }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCardStore } from '../../store/card'

const store = useCardStore()

const props = defineProps({
  packageInfo: {
    type: Object,
    required: true,
    validator: obj => {
      return (
        obj.owner &&
        typeof obj.owner.name === 'string' &&
        typeof obj.owner.avatarUrl === 'string'
      )
    },
  },
})

const languageList = computed(() => {
  // 语言颜色映射
  const languageColors = {
    JAVASCRIPT: '#f1e05a',
    TYPESCRIPT: '#3178c6',
    PYTHON: '#3572A5',
    JAVA: '#b07219',
    'C++': '#f34b7d',
    RUBY: '#701516',
    PHP: '#4F5D95',
    VUE: '#41b883',
    REACT: '#61dafb',
    GOLANG: '#00ADD8',
    SWIFT: '#ffac45',
    KOTLIN: '#F18E33',
    RUST: '#dea584',
    SCALA: '#c22d40',
    R: '#2b5b84',
    ELIXIR: '#6e4a7e',
    HASKELL: '#5e5086',
    CLOJURE: '#db586d',
    DART: '#00b4ab',
    CSS: '#563d7c',
  }

  const getLanguageColor = language => {
    // 大写匹配颜色
    const upperCaseLanguage = language.toUpperCase()
    return languageColors[upperCaseLanguage] || '#858585'
  }

  return Object.keys(props.packageInfo.languages)
    .map(lang => ({
      name: lang,
      color: getLanguageColor(lang),
    }))
    .slice(0, 3)
})

const formatNumber = num => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num
}
</script>

<style scoped lang="less">
.github-card {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
    sans-serif;
  padding: 16px;
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
}

.card-description {
  font-size: 16px;
  color: #57606a;
  line-height: 1.5;
  flex-grow: 1;
}

.card-picture {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
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
}

.card-footer {
  margin-top: auto;
  font-size: 12px;
  color: #57606a;
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.github-link {
  color: #0969da;
  word-break: break-all;
}
</style>
