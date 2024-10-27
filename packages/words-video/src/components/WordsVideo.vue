<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import ImageUploader from './ImageUploader.vue';
import { getWordExamples } from '@/utils/chat.js';

const props = defineProps({
  theme: {
    type: String,
    default: ''
  }
});
const words = ref([]);
const currentWordIndex = ref(0);
const isPlaying = ref(false);
const backgroundColor = ref('rgb(200, 200, 200)'); // 默认灰色
const rotationAngle = ref(0);
const targetRotation = ref(0);
const animationProgress = ref(0);
const currentTheme = ref({});
const isLoading = ref(false);
const inputTheme = ref('');
const countdownTime = ref(0);
const showCountdown = ref(false);

// 计算高亮颜色
const highlightColor = computed(() => {
  // 使用背景色作为高亮色，但增加不透明度
  return backgroundColor.value.replace('rgb', 'rgba').replace(')', ', 0.9)');
});

// 计算文字颜色
const textColor = computed(() => {
  // 简单的亮度计算来决定文字颜色
  const rgb = backgroundColor.value.match(/\d+/g).map(Number);
  const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  return brightness > 128 ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)';
});

// 添加一个新的计算属性来决定非高亮单词的不透明度
const nonHighlightedOpacity = computed(() => {
  const rgb = backgroundColor.value.match(/\d+/g).map(Number);
  const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  return brightness > 128 ? 0.6 : 0.4; // 根据背景度调整不透明度
});

// 添加一个新的计算属性来决定音标的颜色
const phoneticColor = computed(() => {
  const rgb = backgroundColor.value.match(/\d+/g).map(Number);
  // 使用背景色的互补色作为音标颜色
  return `rgb(${255 - rgb[0]}, ${255 - rgb[1]}, ${255 - rgb[2]})`;
});

const mockData = [
  { word: "Mock", phonetic: "/mɒk/", zh: "模拟", themeZh: "模拟数据" },
  { word: "Test", phonetic: "/test/", zh: "测试" },
  { word: "Data", phonetic: "/ˈdeɪtə/", zh: "数据" },
  { word: "Example", phonetic: "/ɪɡˈzæmpəl/", zh: "例子" },
  { word: "Sample", phonetic: "/ˈsæmpəl/", zh: "样本" },
  { word: "Dummy", phonetic: "/ˈdʌmi/", zh: "虚拟的" },
  { word: "Fake", phonetic: "/feɪk/", zh: "假的" },
  { word: "Simulate", phonetic: "/ˈsɪmjuleɪt/", zh: "模拟" },
  { word: "Prototype", phonetic: "/ˈprəʊtətaɪp/", zh: "原型" },
  { word: "Placeholder", phonetic: "/ˈpleɪshəʊldə/", zh: "占位符" },
  { word: "Stub", phonetic: "/stʌb/", zh: "存根" },
  { word: "Mimic", phonetic: "/ˈmɪmɪk/", zh: "模仿" }
];

const loadWords = async () => {
  isLoading.value = true;
  try {
    if (inputTheme.value.toLowerCase() === 'mock') {
      // 使用 mock 数据
      words.value = mockData;
      currentTheme.value = { theme: 'Mock', zh: '模拟数据' };
    } else {
      // 正常调用 API
      words.value = await getWordExamples(inputTheme.value);
      currentTheme.value = { 
        theme: inputTheme.value, 
        zh: words.value[0].themeZh || inputTheme.value 
      };
    }
    console.log('Loaded words:', words.value);
    if (words.value.length > 0) {
      positionWords();
    } else {
      throw new Error('No words returned');
    }
  } catch (error) {
    console.error('Error loading words:', error);
    alert('Failed to load words. Please try again.');
  } finally {
    isLoading.value = false;
  }
};

const positionWords = () => {
  const totalWords = words.value.length;
  words.value.forEach((word, index) => {
    const angle = (index / totalWords) * 2 * Math.PI;
    const radius = 42; // 调整半径以适应更大的卡片
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);

    word.style = {
      left: `${x}%`,
      top: `${y}%`,
      transform: `translate(-50%, -50%)`,
    };
    word.angle = angle; // 存储每个单词的角度
  });
};

const speakCurrentWord = () => {
  if (!('speechSynthesis' in window)) {
    console.error('This browser does not support speech synthesis');
    return;
  }

  if (words.value.length > 0) {
    const currentWord = words.value[currentWordIndex.value].word;
    console.log('Attempting to speak:', currentWord);

    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
};

const highlightNextWord = () => {
  if (words.value.length > 0) {
    currentWordIndex.value = (currentWordIndex.value + 1) % words.value.length;
    targetRotation.value = -(words.value[currentWordIndex.value].angle * 180 / Math.PI);
    animationProgress.value = 0;
    animateRotation();
    speakCurrentWord();
  }
};

const animateRotation = () => {
  if (animationProgress.value < 1) {
    animationProgress.value += 0.05;
    rotationAngle.value = rotationAngle.value + (targetRotation.value - rotationAngle.value) * 0.05;
    requestAnimationFrame(animateRotation);
  } else {
    rotationAngle.value = targetRotation.value;
  }
};

let intervalId;

const startPlayback = () => {
  if (!isPlaying.value) {
    isPlaying.value = true;
    countdownTime.value = 0;
    showCountdown.value = true;
    const countdownInterval = setInterval(() => {
      countdownTime.value += 100;
      if (countdownTime.value >= 3000) {
        clearInterval(countdownInterval);
        setTimeout(() => {
          showCountdown.value = false;
        }, 1000); // 等待1秒后隐藏倒计时
        highlightNextWord();
        intervalId = setInterval(highlightNextWord, 3000);
      }
    }, 100);
  }
};

const handleImageUploaded = (imageData) => {
  console.log('Image uploaded');
};

const handleColorExtracted = (color) => {
  backgroundColor.value = color;
};

const handleSubmit = () => {
  if (inputTheme.value.trim()) {
    loadWords();
  }
};

// 监听 props.theme 的变化
watch(() => props.theme, (newTheme) => {
  if (newTheme) {
    inputTheme.value = newTheme;
    loadWords();
  }
});

// 移除 onMounted 钩子，因为我们不再自动加载单词

onUnmounted(() => {
  clearInterval(intervalId);
  window.speechSynthesis.cancel();
});
</script>

<template>
  <div class="words-video" :style="{ backgroundColor: backgroundColor }">
    <div v-if="!words.length" class="theme-input">
      <input v-model="inputTheme" placeholder="Enter a theme" @keyup.enter="handleSubmit">
      <button @click="handleSubmit" :disabled="isLoading">
        {{ isLoading ? 'Loading...' : 'Generate Words' }}
      </button>
    </div>
    <template v-else>
      <div class="title-container">
        <h2 class="theme-title">
          主题：<span :style="{ color: highlightColor }">{{ currentTheme.zh }}</span>
        </h2>
      </div>
      <div class="container">
        <div class="words-container" :style="{ transform: `rotate(${rotationAngle}deg)` }">
          <div v-for="(word, index) in words" :key="word.word" 
               :class="['word', { 'highlighted': index === currentWordIndex }]"
               :style="[
                 word.style, 
                 { 
                   transform: `${word.style.transform} rotate(${-rotationAngle}deg)`,
                   opacity: index === currentWordIndex ? 1 : 1 - animationProgress.value * (1 - nonHighlightedOpacity),
                   scale: index === currentWordIndex ? 1 + animationProgress.value * 0.1 : 1 - animationProgress.value * 0.1
                 }
               ]">
            <div class="word-card" :style="index === currentWordIndex 
              ? { 
                  backgroundColor: highlightColor, 
                  color: textColor,
                  transform: `scale(${1 + animationProgress.value * 0.1})`
                } 
              : {}">
              <div class="word-text">{{ word.word }}</div>
              <div class="phonetic">{{ word.phonetic }}</div>
            </div>
          </div>
        </div>
        <!-- 更新：中心单词显示 -->
        <div class="center-word" v-if="words.length > 0">
          <div class="center-word-text">{{ words[currentWordIndex].word }}</div>
          <div class="center-word-phonetic" :style="{ color: phoneticColor }">
            {{ words[currentWordIndex].phonetic }}
          </div>
          <div class="center-word-zh">{{ words[currentWordIndex].zh }}</div>
        </div>
      </div>
      <div class="theme-image">
        <ImageUploader 
          :theme="props.theme" 
          @imageUploaded="handleImageUploaded"
          @colorExtracted="handleColorExtracted"
        />
      </div>
      <button v-if="!isPlaying" @click="startPlayback" class="control-button start-button">
        Start
      </button>
      <div v-if="isPlaying && showCountdown" class="countdown" :class="{ 'fade-out': countdownTime >= 3000 }">
        {{ Math.ceil((3000 - countdownTime) / 1000) }}
      </div>
    </template>
  </div>
</template>

<style lang="less" scoped>
.words-video {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background-color 0.5s ease;
  overflow: hidden;
  padding: 10vh 0 0;
}

.title-container {
  text-align: center;
  margin-bottom: 2vh;
}

.theme-title,
.theme-title-zh {
  font-size: 6vmin;
  color: white;
  text-transform: capitalize;
  margin: 0;
  padding: 0.5vh 0;
  text-shadow: 
    -1px -1px 0 #000,  
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000,
    0 0 10px rgba(0,0,0,0.5);
  letter-spacing: 0.1em;
}

.theme-title-zh {
  font-size: 5vmin;
}

.container {
  width: 85vmin;
  height: 85vmin;
  max-width: 85vw;
  max-height: 85vw;
  position: relative;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  overflow: visible;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2vh 0;
}

.theme-image {
  margin-top: 2vh;
}

.words-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transition: transform 0.5s ease;
}

.word {
  position: absolute;
  transition: opacity 0.5s ease, transform 0.5s ease;

  .word-card {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 1.5vmin 2vmin;
    border-radius: 2vmin;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.5s ease;
    width: 20vmin;
    height: 10vmin;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &.highlighted .word-card {
    box-shadow: 0 3px 6px rgba(0,0,0,0.2);
    z-index: 100;
  }
}

.word-text {
  font-size: 2.5vmin;
  font-weight: bold;
  text-align: center;
  transition: all 0.5s ease;
}

.phonetic {
  font-size: 2vmin;
  margin-top: 0.5vmin;
  text-align: center;
  transition: all 0.5s ease;
}

.control-button {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  transition: all 0.3s ease;
  z-index: 1000;
}

.start-button {
  background-color: rgba(46, 204, 113, 0.8);
  color: white;

  &:hover {
    background-color: rgba(46, 204, 113, 1);
  }
}

@media (max-width: 768px) {
  .words-video {
    padding: 5vh 0 0;
  }

  .theme-title {
    font-size: 7vmin;
  }

  .theme-title-zh {
    font-size: 6vmin;
  }

  .container {
    width: 90vw;
    height: 90vw;
  }

  .word .word-card {
    width: 18vw;
    height: 9vw;
  }

  .word-text {
    font-size: 2.8vw;
  }

  .phonetic {
    font-size: 2.2vw;
  }

  .control-button {
    top: 10px;
    right: 10px;
    padding: 8px 16px;
    font-size: 14px;
  }

  .center-word-text {
    font-size: 6vmin;
  }

  .center-word-phonetic {
    font-size: 4vmin;
  }
}

.center-word {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2vmin;
  border-radius: 50%; // 改为圆形
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  transition: all 0.5s ease;
  width: 30vmin; // 减小宽度
  height: 30vmin; // 设置高度与宽度相等
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.center-word-text {
  font-size: 4vmin;
  font-weight: bold;
  color: @text-color;
}

.center-word-phonetic {
  font-size: 2.5vmin;
  margin-top: 0.5vmin;
  // 颜色将由 phoneticColor 计算属性决定
}

.center-word-zh {
  font-size: 3.5vmin;
  color: @text-color;
  margin-top: 0.5vmin;
  font-weight: bold;
}

@media (max-width: 768px) {
  .center-word {
    width: 40vmin; // 在移动设备上稍微增大一些
    height: 40vmin;
  }

  .center-word-text {
    font-size: 5vmin;
  }

  .center-word-phonetic {
    font-size: 3vmin;
  }

  .center-word-zh {
    font-size: 4vmin;
  }
}

.theme-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20vh;

  input {
    width: 300px;
    padding: 10px;
    font-size: 16px;
    margin-bottom: 10px;
  }

  button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: @primary-color;
    color: white;
    border: none;
    border-radius: 5px;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.countdown {
  position: fixed;
  top: 20px;
  right: 20px;
  font-size: 24px;
  font-weight: bold;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 1s ease-out;
  opacity: 1;

  &.fade-out {
    opacity: 0;
  }
}
</style>








