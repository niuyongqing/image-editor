<template>
  <div class="editor-container">
    <!-- 左侧面板 -->
    <div class="left-panel">
      <!-- 组件库 -->
      <div class="component-library">
        <h4>组件库</h4>
        <div v-for="(comp, index) in componentTypes" :key="index" class="component-item" draggable="true"
          @dragstart="handleDragStart($event, comp)">
          <component :is="comp.icon" />
          <span>{{ comp.label }}</span>
        </div>
      </div>

      <!-- 已添加组件列表 -->
      <div class="added-components">
        <h4>已添加组件</h4>
        <draggable v-model="components" item-key="id" @end="handleSortEnd">
          <template #item="{ element }">
            <div class="component-item">
              <AsyncIcon icon="MenuOutlined" />
              <span>{{ element.label }}</span>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- 中间画布 -->
    <div class="canvas-panel" @dragover.prevent @drop="handleDrop">
      <div v-for="(comp, index) in components" :key="comp.id" class="canvas-component"
        :class="{ active: activeIndex === index }" @click="selectComponent(index)">

        <!-- 文字类型 -->
        <div v-if="comp.type === 'text'">
          <a-textarea v-model:value="comp.title" placeholder="点击输入标题" :style="comp.styles" class="titleAreas"
            :auto-size="{ minRows: 1, maxRows: 3 }" />
          <a-textarea v-model:value="comp.content" placeholder="点击输入内容" :style="comp.styles" class="areas"
            :auto-size="{ minRows: 1 }" />
        </div>

        <!-- 图片类型 -->
        <div v-if="comp.type === 'image'">
          <div>
            <div v-if="!comp.content" class="flex flex-col items-center">
              <AsyncIcon icon="PictureOutlined" size="45px"/>
              <span>文件格式为 JPEG、JPG、PNG，大小不能超过10MB</span>
            </div>
            <img :src="comp.content" v-if="comp.content" alt="图片" :style="comp.styles" />
          </div>
        </div>

        <!-- 图文类型 -->
        <div v-if="comp.type === 'imageText'">
          <div>
            <div v-if="!comp.content" class="flex flex-col items-center">
              <AsyncIcon icon="PictureOutlined" size="45px"/>
              <span>文件格式为 JPEG、JPG、PNG，大小不能超过10MB</span>
            </div>
            <img :src="comp.content" v-if="comp.content" alt="图片" :style="comp.styles" />
          </div>
          <a-textarea v-model:value="comp.title" placeholder="点击输入标题" :style="comp.styles" class="titleAreas"
            :auto-size="{ minRows: 1, maxRows: 3 }" />
          <a-textarea v-model:value="comp.content" placeholder="点击输入内容" :style="comp.styles" class="areas"
            :auto-size="{ minRows: 1 }" />
        </div>
      </div>
    </div>

    <!-- 右侧设置面板 -->
    <div class="right-panel" v-if="activeComponent">
      <a-form layout="vertical">
        <!-- 文字设置 -->
        <template v-if="activeComponent.type !== 'image'">
          <a-form-item label="文字内容">
            <a-input v-model:value="activeComponent.content" />
          </a-form-item>
          <a-form-item label="文字大小">
            <a-select v-model:value="activeComponent.styles.fontSize">
              <a-select-option value="12px">小</a-select-option>
              <a-select-option value="16px">中</a-select-option>
              <a-select-option value="20px">大</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="文字颜色">
            <!-- <color-picker v-model:value="activeComponent.styles.color" /> -->
          </a-form-item>
          <a-form-item label="对齐方式">
            <a-radio-group v-model:value="activeComponent.styles.textAlign">
              <a-radio-button value="left">左对齐</a-radio-button>
              <a-radio-button value="center">居中</a-radio-button>
              <a-radio-button value="right">右对齐</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </template>

        <!-- 图片设置 -->
        <template v-if="activeComponent.type === 'image'">
          <a-form-item label="上传图片">
            <div>
              <a-upload v-model:file-list="fileList" name="avatar" list-type="picture-card" class="avatar-uploader"
                :show-upload-list="false" action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                :before-upload="beforeUpload" @change="handleChange">
                <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                <div v-else>
                  <loading-outlined v-if="loading"></loading-outlined>
                  <plus-outlined v-else></plus-outlined>
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
            </div>
          </a-form-item>
          <a-form-item label="图片宽度">
            <a-input-number v-model:value="activeComponent.styles.width" />
          </a-form-item>
          <a-form-item label="图片高度">
            <a-input-number v-model:value="activeComponent.styles.height" />
          </a-form-item>
        </template>
      </a-form>
    </div>

    <!-- 导出按钮 -->
    <div class="export-btn">
      <a-button type="primary" @click="handleExport">导出JSON</a-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import { PictureOutlined, FontSizeOutlined, AreaChartOutlined } from '@ant-design/icons-vue'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import { title } from 'process';

// 组件类型定义
const componentTypes = ref([
  { type: 'text', label: '文字', icon: FontSizeOutlined },
  { type: 'image', label: '图片', icon: PictureOutlined },
  { type: 'imageText', label: '图文', icon: AreaChartOutlined }
])

// 画布组件数据
const components = ref([])
const activeIndex = ref(-1)

// 当前激活组件
const activeComponent = computed(() => {
  return components.value[activeIndex.value]
})

// 拖拽开始处理
const handleDragStart = (e, component) => {
  e.dataTransfer.setData('componentType', component.type)
}

// 拖拽放置处理
const handleDrop = (e) => {
  const type = e.dataTransfer.getData('componentType')
  addComponent(type)
}

// 添加新组件
const addComponent = (type) => {
  console.log('type', type);

  const newComponent = {
    id: Date.now(),
    type,
    content: '',
    label: '',
    title: '',
    styles: {
      fontSize: '16px',
      color: '#000000',
      textAlign: 'left',
      width: '100%',
      height: '100px',
      marginTop: "20px"
    }
  }

  switch (type) {
    case 'text':
      newComponent.title = ''
      newComponent.content = ''
      newComponent.label = '文字'
      break
    case 'image':
      newComponent.title = ''
      newComponent.content = ''
      newComponent.label = '图片'
      break
    case 'imageText':
      newComponent.title = '点击输入标题'
      newComponent.content = ''
      newComponent.label = '图文'
      break
  }

  components.value.push(newComponent)
  selectComponent(components.value.length - 1)
}

// 图片上传前校验
const handleBeforeUpload = (file) => {
  const isValidType = ['image/jpeg', 'image/png'].includes(file.type)
  const isValidSize = file.size / 1024 / 1024 < 1 // 1MB限制
  return isValidType && isValidSize
}

// 图片上传处理
const handleImageChange = (index, info) => {
  if (info.file.status === 'done') {
    const reader = new FileReader()
    reader.onload = (e) => {
      components.value[index].content = e.target.result
    }
    reader.readAsDataURL(info.file.originFileObj)
  }
}

// 选择组件
const selectComponent = (index) => {
  activeIndex.value = index
}

// 排序处理
const handleSortEnd = () => {
  // 自动更新components顺序
}

// 导出JSON
const handleExport = () => {
  const exportData = components.value.map(comp => ({
    type: comp.type,
    content: comp.content,
    styles: comp.styles
  }))
  console.log(JSON.stringify(exportData, null, 2))
  // 实际使用时可以通过下载方式导出
}
</script>

<style scoped>
.editor-container {
  display: flex;
}

.left-panel {
  width: 250px;
  padding: 20px;
  border-right: 1px solid #e8e8e8;
}

.canvas-panel {
  width: 760px;
  /* padding: 20px; */
  min-height: 500px;
  /* border: 2px dashed #d9d9d9; */
  position: relative;
}

.right-panel {
  width: 300px;
  padding: 20px;
  border-left: 1px solid #e8e8e8;
}

.component-item {
  padding: 8px;
  margin: 8px 0;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: move;
  display: flex;
  align-items: center;
  gap: 8px;
}

.canvas-component {
  margin-top: 10px;
  padding: 10px;
  /* border: 1px solid #00aaff; */
}

.titleAreas {
  height: 50px !important;
  margin-top: 20px;
}

.areas {
  height: 100px !important;
  margin-top: 20px;
}

.canvas-component.active {
  /* border-color: #1890ff; 
  box-shadow: 0 0 8px rgba(24, 144, 255, 0.2); */
  border: 1px solid #00aaff;
}

.export-btn {
  position: fixed;
  bottom: 50%;
  right: 30%;
}
</style>