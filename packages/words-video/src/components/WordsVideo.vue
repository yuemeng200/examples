<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import themeWords from '@/assets/themeWords.js';
import ImageUploader from './ImageUploader.vue';

const props = defineProps(['theme']);
const words = ref([]);
const currentWordIndex = ref(0);
const isPlaying = ref(false);
const backgroundColor = ref('rgb(200, 200, 200)'); // 默认灰色
const rotationAngle = ref(0); // 新增：跟踪圆环旋转角度
const targetRotation = ref(0);
const animationProgress = ref(0);

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
  return brightness > 128 ? 0.6 : 0.4; // 根据背景亮度调整不透明度
});

const loadWords = () => {
  words.value = themeWords[props.theme] || [];
  console.log('Loaded words:', words.value);
  positionWords();
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
    highlightNextWord();
    intervalId = setInterval(highlightNextWord, 3000);
  }
};

const stopPlayback = () => {
  isPlaying.value = false;
  clearInterval(intervalId);
  window.speechSynthesis.cancel();
};

const handleImageUploaded = (imageData) => {
  console.log('Image uploaded');
};

const handleColorExtracted = (color) => {
  backgroundColor.value = color;
};

onMounted(() => {
  loadWords();
});

onUnmounted(() => {
  stopPlayback();
});

watch(() => props.theme, loadWords);
</script>

<template>
  <div class="words-video" :style="{ backgroundColor: backgroundColor }">
    <div class="container">
      <div class="center-content">
        <h2 class="theme-title">{{ props.theme }}</h2>
        <ImageUploader 
          :theme="props.theme" 
          @imageUploaded="handleImageUploaded"
          @colorExtracted="handleColorExtracted"
        />
      </div>
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
    </div>
    <button v-if="!isPlaying" @click="startPlayback" class="start-button">
      Start Playback
    </button>
    <button v-else @click="stopPlayback" class="stop-button">
      Stop Playback
    </button>
  </div>
</template>

<style lang="less" scoped>
.words-video {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.5s ease;
}

.container {
  width: 90vmin;
  height: 90vmin;
  position: relative;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  overflow: visible;
  display: flex;
  justify-content: center;
  align-items: center;
}

.center-content {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 10;
}

.theme-title {
  font-size: 28px;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 20px;
  text-transform: capitalize;
}

.words-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transition: transform 0.5s ease; // 添加过渡效果
}

.word {
  position: absolute;
  transition: opacity 0.5s ease, transform 0.5s ease;

  .word-card {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 10px 15px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: all 0.5s ease;
    width: 130px;
    height: 65px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &.highlighted .word-card {
    box-shadow: 0 6px 12px rgba(0,0,0,0.2);
    z-index: 100;
  }
}

.word-text {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  transition: all 0.5s ease;
}

.phonetic {
  font-size: 14px;
  margin-top: 5px;
  text-align: center;
  transition: all 0.5s ease;
}

.start-button, .stop-button {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.start-button {
  background-color: rgba(46, 204, 113, 0.8);
  color: white;

  &:hover {
    background-color: rgba(46, 204, 113, 1);
  }
}

.stop-button {
  background-color: rgba(231, 76, 60, 0.8);
  color: white;

  &:hover {
    background-color: rgba(231, 76, 60, 1);
  }
}
</style>
