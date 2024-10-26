<script setup>
import { ref, onMounted, watch } from 'vue';
import ColorThief from 'color-thief-browser';

const props = defineProps(['theme']);
const emit = defineEmits(['colorExtracted']);

const imageUrl = ref('https://via.placeholder.com/250?text=Loading...');
const isLoading = ref(false);
const error = ref(null);

const extractColor = (img) => {
  try {
    const colorThief = new ColorThief();
    const color = colorThief.getColor(img);
    return `rgb(${color.join(',')})`;
  } catch (e) {
    console.error('Error extracting color:', e);
    return 'rgb(200, 200, 200)'; // 默认灰色
  }
};

const generateImage = async (theme, retries = 3, delay = 1000) => {
  isLoading.value = true;
  error.value = null;

  const API_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2';
  const API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY;

  const prompt = `A vibrant, colorful cartoon-style icon representing ${theme}. Bright and cheerful colors, simple shapes, comic book style, transparent background.`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt: "realistic, photograph, complex background",
          guidance_scale: 7.5,
          num_inference_steps: 50,
        }
      }),
    });

    if ((response.status === 503 || response.status === 429) && retries > 0) {
      console.log(`Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return generateImage(theme, retries - 1, delay * 2);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    imageUrl.value = url;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      console.log('Image loaded', img);
      const color = extractColor(img);
      emit('colorExtracted', color);
    };
    img.onerror = () => {
      console.error('Error loading image');
      emit('colorExtracted', 'rgb(200, 200, 200)'); // 默认灰色
    };
    img.src = url;

  } catch (e) {
    console.error('Error generating image:', e);
    error.value = 'Failed to generate image. Using placeholder.';
    imageUrl.value = `https://via.placeholder.com/250?text=${encodeURIComponent(theme)}`;
    emit('colorExtracted', 'rgb(200, 200, 200)'); // 默认灰色
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  generateImage(props.theme);
});

watch(() => props.theme, (newTheme) => {
  generateImage(newTheme);
});
</script>

<template>
  <div class="theme-image-container">
    <img v-if="!isLoading && !error" :src="imageUrl" :alt="props.theme" class="theme-image">
    <div v-else-if="isLoading" class="loading">Generating image...</div>
    <div v-else class="error">{{ error }}</div>
  </div>
</template>

<style scoped lang="less">
.theme-image-container {
  width: 250px;
  height: 250px;
  overflow: hidden;
  border-radius: 50%;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}

.theme-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.loading, .error {
  color: #333;
  text-align: center;
  font-size: 18px;
}
</style>
