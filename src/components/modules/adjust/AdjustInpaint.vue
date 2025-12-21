<template>
  <div class="adjust-inpaint">
    <div class="panel-title">智能消除笔</div>

    <div class="mode-tabs">
      <div class="tab-item" :class="{ active: drawMode === 'brush' }" @click="drawMode = 'brush'">
        🖌️ 画笔涂抹
      </div>
      <div class="tab-item" :class="{ active: drawMode === 'rect' }" @click="drawMode = 'rect'">
        🔲 框选区域
      </div>
    </div>

    <div class="control-group" v-if="drawMode === 'brush'">
      <div class="label-row">
        <span>画笔大小</span>
        <span class="value-text">{{ brushSize }}px</span>
      </div>
      <input type="range" v-model.number="brushSize" min="5" max="100" class="slider-input" />
    </div>

    <div class="tips-box" v-else>
      在画面上拖拽鼠标，框选您想消除的区域。
    </div>

    <div class="action-row">
      <button class="btn-primary" @click="handleInpaint">
        ✨ 开始消除
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCanvasInpaint } from './useCanvasInpaint';

// 对接两个状态：drawMode 和 brushSize
const { brushSize, drawMode, handleInpaint } = useCanvasInpaint();
</script>

<style scoped>
/* ...原有样式保持不变... */
.adjust-inpaint {
  padding: 16px;
  color: #333;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
}

.control-group {
  margin-bottom: 24px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
  color: #666;
}

.slider-input {
  width: 100%;
}

/* 新增 Tab 样式 */
.mode-tabs {
  display: flex;
  background-color: #e0e0e0;
  border-radius: 6px;
  padding: 4px;
  margin-bottom: 20px;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 8px 0;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  color: #666;
}

.tab-item.active {
  background-color: #ffffff;
  color: #007bff;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tips-box {
  margin-bottom: 24px;
  padding: 12px;
  background-color: #eef6ff;
  border: 1px dashed #b8daff;
  border-radius: 4px;
  font-size: 12px;
  color: #004085;
  text-align: center;
}

.action-row {
  display: flex;
  justify-content: center;
}

.btn-primary {
  width: 100%;
  padding: 10px 0;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>