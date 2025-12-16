<template>
  <div class="puzzle-module">
    <!-- 主面板 -->
    <div
      v-if="!showGridTemplates"
      class="puzzle-main"
    >
      <!-- 选项卡 -->
      <div class="puzzle-tabs">
        <div
          class="tab-item"
          :class="{ active: activeTab === 'grid' }"
          @click="activeTab = 'grid'"
        >
          网格
        </div>
        <div
          class="tab-item"
          :class="{ active: activeTab === 'join' }"
          @click="activeTab = 'join'"
        >
          拼接
        </div>
      </div>

      <!-- 操作内容 -->
      <div>
        <!-- 网格选项卡内容 -->
        <button
          v-if="activeTab === 'grid'"
          class="select-btn"
          @click="showGridTemplates = true"
        >
          <span class="plus-icon">+</span> 选择网格
        </button>

        <!-- 拼接选项卡内容 -->
        <button
          v-else
          class="select-btn"
        >
          <span class="plus-icon">+</span> 选择拼接
        </button>
      </div>
    </div>

    <!-- 网格模板选择面板 -->
    <div
      v-else
      class="grid-templates"
    >
      <!-- 返回按钮 -->
      <div
        class="back-header"
        @click="backToMain"
      >
        <span class="back-icon">‹</span> 网格
      </div>

      <!-- 图片数量选择 -->
      <div class="image-count-selector">
        <label>图片数量</label>
        <select v-model="selectedImageCount">
          <option v-for="item in countOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
        </select>
      </div>

      <!-- 网格模板列表 -->
      <div class="grid-list">
        <div
          v-for="(group, count) in filteredTemplates"
          :key="count"
          class="grid-group"
        >
          <!-- 图片数量标题 -->
          <div class="grid-group-title">{{ count }}</div>

          <!-- 该数量下的所有模板 -->
          <div class="grid-templates-row">
            <div
              v-for="template in group"
              :key="template.id"
              :style="template.wrapStyle"
              class="grid-template"
              @click="selectTemplate(template)"
            >
              <div
                v-for="(gridArea, i) in template.gridAreas"
                :key="i"
                class="grid-cell"
                :style="`grid-area: ${gridArea};`"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { gridTemplates } from './config.js';

  // 状态管理
  const showGridTemplates = ref(false);
  const selectedImageCount = ref('all');
  const activeTab = ref('grid');

  // 图片数量下拉
  const countOptions = [
    { value: 'all', label: '全部' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
  ];

  // 过滤显示的网格模板
  const filteredTemplates = computed(() => {
    if (selectedImageCount.value === 'all') {
      return gridTemplates;
    } else {
      const curCount = parseInt(selectedImageCount.value);
      const result = {};
      for (const count in gridTemplates) {
        if (parseInt(count) === curCount) {
          result[count] = gridTemplates[count];
        }
      }
      return result;
    }
  });

  // 返回上一级
  const backToMain = () => {
    showGridTemplates.value = false;
    selectedImageCount.value = 'all';
  };

  // 选择网格模板
  const selectTemplate = (template) => {
    console.log('Selected grid template:', template);
    // 这里可以添加选择模板后的逻辑
    showGridTemplates.value = false;
  };
</script>

<style scoped>
  .puzzle-module {
    width: 100%;
    height: 100%;
    background-color: #fff;
  }

  /* 主面板样式 */
  .puzzle-main {
    padding: 20px;
  }

  .puzzle-tabs {
    display: flex;
  }

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    color: #606266;
  }

  .tab-item.active {
    background-color: #409eff;
    color: #fff;
  }

  .select-btn {
    display: inline-flex;
    align-items: center;
    padding: 20px;
    border: none;
    border-radius: 4px;
    width: 100%;
    cursor: pointer;
    font-size: 14px;
    color: #606266;
    transition: all 0.3s;
  }

  .select-btn:hover {
    border-color: #409eff;
    color: #409eff;
  }

  .plus-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #409eff;
    color: #fff;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    margin-right: 8px;
    font-weight: bold;
  }

  /* 网格模板选择面板样式 */
  .grid-templates {
    padding: 20px 12px 20px;
  }

  .back-header {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 20px;
    cursor: pointer;
  }

  .back-icon {
    font-size: 20px;
    margin-right: 8px;
    color: #606266;
  }

  .image-count-selector {
    margin-bottom: 20px;
  }

  .image-count-selector label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #606266;
  }

  .image-count-selector select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-size: 14px;
  }

  .grid-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .grid-group {
    border-radius: 4px;
    overflow: hidden;
  }

  .grid-group-title {
    padding: 10px 15px;
    background-color: #f5f7fa;
    font-size: 14px;
    font-weight: 500;
    color: #606266;
  }

  .grid-templates-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 12px 4px;
  }

  .grid-template {
    width: 120px;
    height: 120px;
    display: grid;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;
  }

  .grid-template:hover {
    border-color: #409eff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .grid-cell {
    height: 100%;
    background-color: #f0f0f0;
    border: 1px solid #fff;
  }
</style>
