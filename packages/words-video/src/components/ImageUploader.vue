<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ColorThief from 'colorthief';

const props = defineProps(['theme']);
const emit = defineEmits(['imageUploaded', 'colorExtracted']);

const imageUrl = ref(null);
const fileInput = ref(null);
const dropZone = ref(null);
const imageElement = ref(null);

const handleFileSelect = (file) => {
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrl.value = e.target.result;
      emit('imageUploaded', e.target.result);
    };
    reader.readAsDataURL(file);
  }
};

const extractColorPalette = async () => {
  if (!imageElement.value) return;

  try {
    const colorThief = new ColorThief();
    const dominantColor = await colorThief.getColor(imageElement.value);
    const palette = await colorThief.getPalette(imageElement.value, 8);
    const colorPalette = [dominantColor, ...palette].map(([r, g, b]) => toHex(r, g, b));
    emit('colorExtracted', colorPalette[0]); // 发送主要颜色
  } catch (error) {
    console.error('Error extracting color:', error);
    emit('colorExtracted', '#c8c8c8'); // 默认灰色
  }
};

const toHex = (r, g, b) => {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const onFileInputChange = (event) => {
  const file = event.target.files[0];
  handleFileSelect(file);
};

const onDrop = (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  handleFileSelect(file);
};

const onPaste = (event) => {
  const items = (event.clipboardData || event.originalEvent.clipboardData).items;
  for (let item of items) {
    if (item.type.indexOf('image') === 0) {
      const blob = item.getAsFile();
      handleFileSelect(blob);
      break;
    }
  }
};

const preventDefault = (event) => {
  event.preventDefault();
};

onMounted(() => {
  document.addEventListener('paste', onPaste);
  if (dropZone.value) {
    dropZone.value.addEventListener('dragover', preventDefault);
    dropZone.value.addEventListener('drop', onDrop);
  }
});

onUnmounted(() => {
  document.removeEventListener('paste', onPaste);
  if (dropZone.value) {
    dropZone.value.removeEventListener('dragover', preventDefault);
    dropZone.value.removeEventListener('drop', onDrop);
  }
});
</script>

<template>
  <div class="image-uploader" ref="dropZone">
    <input
      type="file"
      accept="image/*"
      @change="onFileInputChange"
      ref="fileInput"
      style="display: none;"
    >
    <div v-if="!imageUrl" class="upload-prompt" @click="fileInput.click()">
      <p>Click to upload, drag & drop, or paste an image</p>
    </div>
    <img 
      v-else 
      :src="imageUrl" 
      :alt="props.theme" 
      class="uploaded-image" 
      ref="imageElement"
      @load="extractColorPalette"
      crossorigin="anonymous"
    >
  </div>
</template>

<style scoped lang="less">
.image-uploader {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  cursor: pointer;
}

.upload-prompt {
  text-align: center;
  padding: 20px;
  color: #666;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
