<template>
  <div class="container">
    <!-- 左侧图标栏 -->
    <div class="left-panel">
      <div 
        v-for="(item, index) in components" 
        :key="index"
        class="drag-item"
        draggable="true"
        @dragstart="handleDragStart($event, item)"
      >
      <AsyncIcon :icon="item.icon" />
        <span>{{ item.label }}</span>
      </div>
    </div>

    <!-- 中间画布 -->
    <div 
      class="center-panel"
      @dragover.prevent
      @drop="handleDrop"
    >
      <div 
        v-for="(component, index) in canvasComponents"
        :key="index"
        class="canvas-component"
        :class="{ active: activeIndex === index }"
        @click="selectComponent(index)"
      >
        <h1 :style="component.styles">{{ component.content }}</h1>
      </div>
    </div>

    <!-- 右侧属性栏 -->
    <div class="right-panel" v-if="activeComponent">
      <a-form laba-width="80px">
        <a-form-item label="标题内容">
          <a-input v-model="activeComponent.content" />
        </a-form-item>
        <a-form-item label="字体大小">
          <a-input-number 
            v-model="activeComponent.styles.fontSize"
            :min="12"
            :max="72"
          />
        </a-form-item>
        <a-form-item label="字体颜色">
          <!-- <a-color-picker v-model="activeComponent.styles.color" /> -->
        </a-form-item>
        <a-form-item label="对齐方式">
          <a-select v-model="activeComponent.styles.textAlign">
            <a-select-option label="左对齐" value="left" />
            <a-select-option label="居中" value="center" />
            <a-select-option label="右对齐" value="right" />
          </a-select>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
// 左侧组件列表
const components = ref([
  { type: 'text', label: '文本', icon: 'FontSizeOutlined' }
])

// 画布组件数据
const canvasComponents = ref([])
const activeIndex = ref(-1)

// 当前激活的组件
const activeComponent = computed(() => {
  return canvasComponents.value[activeIndex.value]
})

// 处理拖拽开始
const handleDragStart = (e, item) => {
  e.dataTransfer.setData('componentType', item.type)
}

// 处理拖拽放置
const handleDrop = (e) => {
  const type = e.dataTransfer.getData('componentType')
  addComponent(type)
}

// 添加组件到画布
const addComponent = (type) => {
  const newComponent = {
    type,
    content: '新建标题',
    styles: {
      fontSize: '24px',
      color: '#333',
      textAlign: 'left'
    }
  }
  canvasComponents.value.push(newComponent)
  selectComponent(canvasComponents.value.length - 1)
}

// 选择组件
const selectComponent = (index) => {
  activeIndex.value = index
}
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}

.left-panel {
  width: 200px;
  padding: 20px;
  border-right: 1px solid #eee;
}

.drag-item {
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: move;
  display: flex;
  align-items: center;
  gap: 8px;
}

.center-panel {
  flex: 1;
  padding: 20px;
  min-height: 300px;
  border: 2px dashed #ccc;
}

.canvas-component {
  margin: 20px;
  padding: 10px;
  border: 1px solid transparent;
}

.canvas-component.active {
  border-color: #409eff;
  box-shadow: 0 0 8px rgba(64, 158, 255, 0.3);
}

.right-panel {
  width: 300px;
  padding: 20px;
  border-left: 1px solid #eee;
}
</style>