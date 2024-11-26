<template>
  <div class="canvas-container">
    <canvas ref="canvasEl"></canvas>
    <div class="tools">
      <div class="tool-group">
        <button
          v-for="tool in tools"
          :key="tool.type"
          class="tool-btn"
          :class="{ active: currentTool === tool.type }"
          @click="setTool(tool.type)">
          {{ tool.label }}
        </button>
      </div>
      <div class="tool-group">
        <button class="tool-btn" @click="undo" :disabled="!canUndo">
          撤销
        </button>
        <button class="tool-btn" @click="redo" :disabled="!canRedo">
          重做
        </button>
      </div>
      <div class="tool-group">
        <label>线宽</label>
        <input
          type="range"
          v-model="lineWidth"
          min="1"
          max="20"
          step="1"
          class="line-width-slider"
          @change="updateBrush" />
        <span>{{ lineWidth }}px</span>
      </div>
      <div class="tool-group">
        <label>颜色</label>
        <input
          type="color"
          v-model="lineColor"
          class="color-picker"
          @change="updateBrush"
          :disabled="currentTool === 'eraser'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { Canvas, PencilBrush, Path, Object as FabricObject, util } from 'fabric'

type ToolType = 'draw' | 'eraser'

const tools = [
  { type: 'draw' as ToolType, label: '画笔' },
  { type: 'eraser' as ToolType, label: '橡皮擦' },
]

const canvasEl = ref<HTMLCanvasElement | null>(null)
const lineWidth = ref(2)
const lineColor = ref('#000000')
const currentTool = ref<ToolType>('draw')
let canvas: Canvas

// 修改历史记录的数据结构
interface DrawAction {
  type: 'draw'
  object?: FabricObject
}

const undoStack = ref<DrawAction[]>([])
const redoStack = ref<DrawAction[]>([])

// 计算属性：是否可以撤销/重做
const canUndo = computed(() => undoStack.value.length > 0)
const canRedo = computed(() => redoStack.value.length > 0)

// 设置工具
const setTool = (tool: ToolType) => {
  currentTool.value = tool
  if (!canvas) return

  switch (tool) {
    case 'draw':
      canvas.isDrawingMode = true
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = lineColor.value
      }
      break
    case 'eraser':
      canvas.isDrawingMode = true
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = '#ffffff'
      }
      break
  }
}

// 撤销
const undo = () => {
  if (!canUndo.value) return

  const lastAction = undoStack.value.pop()
  if (!lastAction) return

  const objects = canvas.getObjects()
  const lastObject = objects[objects.length - 1]
  if (lastObject) {
    canvas.remove(lastObject)
    redoStack.value.push({
      type: 'draw',
      object: lastObject,
    })
  }

  canvas.requestRenderAll()
}

// 重做
const redo = () => {
  if (!canRedo.value) return

  const lastAction = redoStack.value.pop()
  if (!lastAction || !lastAction.object) return

  canvas.add(lastAction.object)
  undoStack.value.push({
    type: 'draw',
    object: lastAction.object,
  })
  canvas.requestRenderAll()
}

onMounted(() => {
  if (!canvasEl.value) return

  canvas = new Canvas(canvasEl.value, {
    isDrawingMode: true,
    width: window.innerWidth,
    height: window.innerHeight - 100,
    contextOptions: {
      willReadFrequently: true
    }
  })

  canvas.freeDrawingBrush = new PencilBrush(canvas)

  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.width = lineWidth.value
    canvas.freeDrawingBrush.color = lineColor.value
  }

  canvas.selection = false

  // 修改 path:created 事件处理
  canvas.on('path:created', (e: any) => {
    const path = e.path
    path.set({
      selectable: false,
      hoverCursor: 'pointer',
      evented: true,
      hasBorders: false,
      hasControls: false,
    })

    undoStack.value.push({
      type: 'draw',
      object: path,
    })
    redoStack.value = []
  })

  canvas.on('object:added', e => {
    e.target.selectable = false
  })
})

const updateBrush = () => {
  if (!canvas.freeDrawingBrush) return
  canvas.freeDrawingBrush.width = lineWidth.value
  if (currentTool.value !== 'eraser') {
    canvas.freeDrawingBrush.color = lineColor.value
  }
}
</script>

<style lang="less" scoped>
.canvas-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  touch-action: none;

  canvas {
    touch-action: none;
  }
}

.tools {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  gap: 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.tool-group {
  display: flex;
  align-items: center;
  gap: 8px;

  label {
    font-size: 14px;
    color: #666;
  }
}

.tool-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #f5f5f5;
  }

  &.active {
    background: #2c3e50;
    color: white;
    border-color: #2c3e50;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #f5f5f5;
    border-color: #ddd;
    color: #999;
  }
}

.line-width-slider {
  width: 100px;
  height: 4px;
  border-radius: 2px;
  -webkit-appearance: none;
  background: #eee;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #2c3e50;
    cursor: pointer;
  }
}

.color-picker {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
    padding: 0;
  }

  &::-webkit-color-swatch-wrapper {
    border: none;
    border-radius: 4px;
    padding: 0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
