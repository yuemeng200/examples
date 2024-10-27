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
    <div v-else class="image-container">
      <img 
        :src="imageUrl" 
        :alt="props.theme" 
        class="uploaded-image" 
        ref="imageElement"
        @load="extractColorPalette"
        crossorigin="anonymous"
      >
    </div>
  </div>
</template>

<style scoped lang="less">
.image-uploader {
  height: 20vmin; // 固定高度
  max-height: 150px; // 最大高度
  width: auto; // 宽度自适应
  min-width: 200px; // 最小宽度
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2vmin auto;
  border-radius: 8px;
}

.upload-prompt {
  text-align: center;
  padding: 2vmin;
  color: #666;
  font-size: 2vmin;
  background-color: #f0f0f0;
  border: 2px solid #ddd;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.uploaded-image {
  height: 100%; // 图片高度 100%
  width: auto; // 宽度自适应
  object-fit: contain; // 确保整个图片可见
}

@media (max-width: 768px) {
  .image-uploader {
    width: 80vw; // 在移动设备上使用视口宽度的 80%
    height: 40vw; // 高度设置为宽度的一半，保持 2:1 的宽高比
    max-height: none; // 移除最大高度限制
  }

  .upload-prompt {
    font-size: 3vmin;
  }
}
</style>
