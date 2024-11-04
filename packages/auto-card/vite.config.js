import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "${resolve(__dirname, 'src/styles/variables.less')}";`,
        javascriptEnabled: true
      }
    }
  },
  server: {
    port: 3000
  }
}); 