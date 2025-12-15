<template>
  <div class="navbar">
    <div class="logo">
      <slot name="logo">{{ textMap.title }}</slot>
    </div>
    <div class="actions">
      <input type="file" ref="fileInput" @change="onFileSelected" style="display:none" accept="image/*" />

      <button class="ie-btn" @click="handleUpload">
        <svg width="14" height="14" viewBox="0 0 1024 1024" style="margin-right:4px;fill:currentColor">
          <path
            d="M544 253.696V704h-64V247.296L237.248 490.048 192 444.8 512 128l320 316.8-45.248 45.248L544 253.696zM160 832h704a32 32 0 1 1 0 64H160a32 32 0 1 1 0-64z" />
        </svg>
        {{ textMap.upload }}
      </button>

      <span class="ie-divider"></span>

      <button class="ie-btn" style="margin-right:8px;" @click="handleUndo" :disabled="!state.canUndo">撤销</button>
      <button class="ie-btn" style="margin-right:8px;" @click="handleRedo" :disabled="!state.canRedo">重做</button>

      <button class="ie-btn ie-primary" @click="handleSave">{{ textMap.save }}</button>
    </div>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue';
import { useEditorState } from '@/composables/useEditorState'; // 使用新状态
import { Toast } from '@/utils/toast'; // 使用新提示
import { useCanvas } from '@/composables/useCanvas'; // 引入 useCanvas 模块

const { state } = useEditorState();

// 【关键修改】：直接从 useCanvas 实例获取 undo, redo, initImage 等函数
const { undo, redo, initImage } = useCanvas();

// 保持 canvasAPI 注入，仅用于调用 EditorLayout 包装的 save 方法
const canvasAPI = inject('canvasAPI');
const fileInput = ref(null);

const props = defineProps({
  textMap: {
    type: Object,
    default: () => ({}),
  },
});

const handleUpload = () => {
  fileInput.value.click();
};

const onFileSelected = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    if (!initImage) { 
      Toast.error('画布尚未初始化');
      return;
    }
    const url = URL.createObjectURL(file);
    
    // 直接调用从 useCanvas 获取的 initImage
    initImage(url); 
    
    // 清空 value，允许重复选择同一张图片
    e.target.value = '';
  }
};

const handleSave = () => {
  // 保持使用 canvasAPI.save，因为它调用了 EditorLayout 中定义的 handleExport 逻辑
  if (canvasAPI && canvasAPI.save) {
    canvasAPI.save(); // 调用 EditorLayout 中定义的 handleExport
  } else {
    Toast.error('导出功能未实现');
  }
};


const handleUndo = () => {
  // 直接调用导入的 undo 函数
  undo();
};

const handleRedo = () => {
  // 直接调用导入的 redo 函数
  redo();
};
</script>

<style scoped>
.navbar {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.logo {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}
</style>