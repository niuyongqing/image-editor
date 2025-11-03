<template>
  <div class="watermark-table">
    <div class="button-container">
      <a-button
        type="primary"
        class="create-button"
        size="middle"
        @click="addWatermark"
      >创建模版</a-button>
    </div>
    
    <a-table
      :columns="COLUMNS"
      :data-source="dataSource"
      :pagination="false"
      :loading="loading"
      bordered
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'content'">
          <div class="watermark-content">
            <img
              v-if="record.type === 1"
              :src="record.content"
              alt="水印图片"
              class="watermark-image"
            />
            <span v-else>{{ record.content }}</span>
          </div>
        </template>
        <template v-else-if="column.key === 'type'">
          {{ WATERMARK_TYPE_MAP[record.type] }}
        </template>
        <template v-else-if="column.key === 'operation'">
          <a-space>
            <a-button type="link" @click="changeWatermark(record)">更换</a-button>
            <a-button type="link" @click="editWatermark(record)">编辑</a-button>
            <a-popconfirm
            title="确定删除吗?"
            @confirm="delWatermark(record.id)"
          >
            <a-button
              type="link"
              danger
              >删除</a-button
            >
          </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:open="submitOpen"
      title="更换水印模板"
      @ok="handleSubmitOk"
      @cancel="handleModalCancel"
      :ok-button-props="{ disabled: !hasValidSelection }"
    >
      <div class="modal-content">
        <div class="form-item">
          <label>选择水印模板：</label>
          <a-select
            v-model:value="submitFormData.shopTemplateId"
            placeholder="请选择水印模板"
            style="width: 100%"
          >
            <a-select-option
              v-for="item in tableData"
              :key="item.id"
              :value="item.id"
            >
              {{ item.title }}
            </a-select-option>
          </a-select>
        </div>
        <div class="form-item">
          <label>预览：</label>
          <div class="preview-content">
            <div v-if="hasValidSelection" class="watermark-preview">
              <img
                v-if="getSelectedWatermarkType() === 1"
                :src="getSelectedWatermarkContent()"
                alt="水印预览"
                class="preview-image"
              />
              <span v-else class="preview-text">{{ getSelectedWatermarkContent() }}</span>
            </div>
            <div v-else class="preview-placeholder">请选择水印模板查看预览</div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeUnmount, onMounted, nextTick, computed } from "vue";
import {
  watermarkListApi,
  watermarkDelApi,
} from "@/pages/sample/watermark/api.js";
import { message } from "ant-design-vue";

const emit = defineEmits([]);

// ==================== 响应式数据 ====================
// 使用ref创建响应式数组，而不是reactive
const dataSource = ref([]);

// 水印列表数据
const tableData = ref([]);
// 加载状态
const loading = ref(false);
// 弹窗显示状态
const submitOpen = ref(false);
// 表单数据
const submitFormData = reactive({
  shopTemplateId: null,
});
// 当前选中行
const currentSelectRow = ref({});

// ==================== 常量定义 ====================
// 表格列配置 - 不需要响应式
const COLUMNS = [
  {
    title: "",
    key: "imageName",
    align: "center",
    dataIndex: "imageName",
  },
  {
    title: "模版名称",
    key: "title",
    align: "center",
    dataIndex: "title",
  },
  {
    title: "水印内容",
    align: "center",
    key: "content",
  },
  {
    title: "类型",
    align: "center",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "操作",
    width: 300,
    align: "center",
    key: "operation",
  },
];

// 水印类型映射 - 不需要响应式
const WATERMARK_TYPE_MAP = {
  1: "图片",
  2: "文字"
};

// 水印名称映射 - 不需要响应式
const WATERMARK_NAME_MAP = {
  0: "主图水印",
  1: "副图水印"
};

// ==================== 工具函数 ====================
/**
 * 创建空水印模板的工厂函数
 * @param {string|number} id - 水印ID
 * @param {number} index - 水印索引（0:主图, 1:副图）
 * @returns {object} 空水印模板对象
 */
const createEmptyWatermarkTemplate = (id, index) => ({
  id: id || '',
  imageName: WATERMARK_NAME_MAP[index],
  title: "",
  content: "",
  type: '',
});

/**
 * 防抖函数
 * @param {Function} func - 需要防抖的函数
 * @param {number} wait - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
const debounce = (func, wait) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

/**
 * 更新数据源中的指定项
 * @param {string|number} id - 要更新的项的ID
 * @param {object} newData - 新数据
 * @param {number|null} index - 可选的索引，如果提供则直接使用
 * @returns {boolean} 是否更新成功
 */
const updateDataSourceItem = (id, newData, index = null) => {
  const newDataSource = [...dataSource.value];
  const itemIndex = index !== null ? index : newDataSource.findIndex(item => item.id === id);
  
  if (itemIndex !== -1) {
    Object.assign(newDataSource[itemIndex], newData);
    dataSource.value = newDataSource;
    return true;
  }
  return false;
};

// ==================== 计算属性 ====================
/**
 * 计算是否有有效的选择项
 */
const hasValidSelection = computed(() => {
  return submitFormData.shopTemplateId && 
         tableData.value.some(item => item.id === submitFormData.shopTemplateId);
});

/**
 * 获取选中水印的类型
 */
const getSelectedWatermarkType = () => {
  const selectedItem = tableData.value.find(
    (item) => item.id === submitFormData.shopTemplateId
  );
  return selectedItem?.type;
};

/**
 * 获取选中水印的内容
 */
const getSelectedWatermarkContent = () => {
  const selectedItem = tableData.value.find(
    (item) => item.id === submitFormData.shopTemplateId
  );
  return selectedItem?.content;
};

// ==================== 数据初始化 ====================
/**
 * 初始化数据源
 * @param {string|number} mainImgWmTemplateId - 主图水印模板ID
 * @param {string|number} subImgWmTemplateId - 副图水印模板ID
 */
const initDataSource = (mainImgWmTemplateId, subImgWmTemplateId) => {
  // 根据props.mainImgWmTemplateId和props.subImgWmTemplateId去水印列表查找对应数据
  const mainImgWmTemplate = tableData.value.find(
    (item) => Number(item.id) === Number(mainImgWmTemplateId)
  );
  const subImgWmTemplate = tableData.value.find(
    (item) => Number(item.id) === Number(subImgWmTemplateId)
  );
  
  console.log("tableData", tableData.value);
  console.log(mainImgWmTemplateId, subImgWmTemplateId);
  console.log(mainImgWmTemplate, subImgWmTemplate);
  
  // 使用新数组替换原数组，确保响应性
  const newDataSource = [];
  
  // 处理主图水印
  if (!mainImgWmTemplate) {
    newDataSource[0] = createEmptyWatermarkTemplate(mainImgWmTemplateId, 0);
  } else {
    newDataSource[0] = { ...mainImgWmTemplate, imageName: WATERMARK_NAME_MAP[0] };
  }

  // 处理副图水印
  if (!subImgWmTemplate) {
    newDataSource[1] = createEmptyWatermarkTemplate(subImgWmTemplateId, 1);
  } else {
    newDataSource[1] = { ...subImgWmTemplate, imageName: WATERMARK_NAME_MAP[1] };
  }
  
  // 一次性更新dataSource，确保响应性
  dataSource.value = newDataSource;
};

// ==================== API调用 ====================
/**
 * 获取水印列表数据
 * @param {string|number} mainImgWmTemplateId - 主图水印模板ID
 * @param {string|number} subImgWmTemplateId - 副图水印模板ID
 */
const getWatermarkList = async (mainImgWmTemplateId, subImgWmTemplateId) => {
  loading.value = true;
  try {
    // 没分页, 没入参
    const res = await watermarkListApi();
    tableData.value = res.data || [];
    // 初始化数据源
    initDataSource(mainImgWmTemplateId, subImgWmTemplateId);
    console.log("tableData.value", tableData.value);
  } catch (error) {
    console.error("获取水印列表失败:", error);
    message.error("获取水印列表失败，请稍后重试");
  } finally {
    loading.value = false;
  }
};

// ==================== 事件处理函数 ====================
/**
 * 通用弹窗处理函数
 */
const handleModalCancel = () => {
  submitOpen.value = false;
  submitFormData.shopTemplateId = null;
};

/**
 * 确认更换水印
 */
const handleSubmitOk = () => {
  // 根据submitFormData.shopTemplateId查找tableData.value中对应的item
  const selectedItem = tableData.value.find(
    (item) => item.id === submitFormData.shopTemplateId
  );
  
  if (!selectedItem) {
    message.error("请选择要更换的水印模板");
    return;
  }
  
  // 更新数据源
  const currentId = currentSelectRow.value.id;
  const currentIndex = dataSource.value.findIndex(item => item.id === currentId);
  
  if (currentIndex !== -1) {
    const updatedData = {
      ...selectedItem,
      imageName: WATERMARK_NAME_MAP[currentIndex] || selectedItem.imageName
    };
    
    updateDataSourceItem(currentId, updatedData, currentIndex);
  }
  
  handleModalCancel();
};

/**
 * 编辑水印
 * @param {object} record - 当前行数据
 */
const editWatermark = (record) => {
  currentSelectRow.value = record;
  if(record.id) {
    window.open(`/platform/dev/sample/watermark/edit?id=${record.id}`);
  } else {
    message.error("请先点击更换按钮选择一个水印模板");
  }
};

/**
 * 更换水印
 * @param {object} record - 当前行数据
 */
const changeWatermark = (record) => {
  currentSelectRow.value = record;
  submitOpen.value = true;
};

/**
 * 删除水印
 * @param {string|number} id - 水印ID
 */
const delWatermark = (id) => {
  console.log("删除水印ID:", id);
  
  const currentIndex = dataSource.value.findIndex(item => item.id === id);
  if (currentIndex !== -1) {
    const emptyTemplate = createEmptyWatermarkTemplate('', currentIndex);
    updateDataSourceItem(id, emptyTemplate, currentIndex);
  }
};

/**
 * 跳转创建/编辑页
 */
const addWatermark = () => {
  window.open('/platform/dev/sample/watermark/edit');
};

// ==================== 跨窗口通信 ====================
/**
 * 监听编辑页保存后的跨窗口通信
 * @param {MessageEvent} event - 消息事件
 */
const receiveMessage = (event) => {
  // 验证消息来源和类型
  if (event.origin !== window.location.origin || event.data.type !== "params") {
    return;
  }
  
  console.log("接收到跨窗口消息:", event.data.params);
  
  try {
    // 更新当前选中行数据
    Object.assign(currentSelectRow.value, event.data.params);
    
    // 更新当前选中行在dataSource中的数据
    const currentId = currentSelectRow.value.id;
    const currentIndex = dataSource.value.findIndex(item => item.id === currentId);
    
    if (currentIndex !== -1) {
      const updatedData = {
        ...currentSelectRow.value,
        imageName: WATERMARK_NAME_MAP[currentIndex] || currentSelectRow.value.imageName
      };
      
      updateDataSourceItem(currentId, updatedData, currentIndex);
    }
  } catch (error) {
    console.error("处理跨窗口消息失败:", error);
    message.error("更新水印数据失败");
  }
};

// 防抖处理的消息接收函数
const debouncedReceiveMessage = debounce(receiveMessage, 100);

// ==================== 生命周期钩子 ====================
/**
 * 组件挂载时添加事件监听
 */
onMounted(() => {
  window.addEventListener("message", debouncedReceiveMessage);
});

/**
 * 组件卸载前移除事件监听
 */
onBeforeUnmount(() => {
  window.removeEventListener("message", debouncedReceiveMessage);
});

// ==================== 组件方法 ====================
/**
 * 提取主图/副图水印模板 ID，若数据缺失则返回 null
 * @returns {object} 包含主图和副图水印模板ID的对象
 */
const watermarkTableRefIds = () => {
  return {
    mainImgWmTemplateId: dataSource.value[0]?.id ? Number(dataSource.value[0].id) : null,
    subImgWmTemplateId: dataSource.value[1]?.id ? Number(dataSource.value[1].id) : null,
  };
};

// 暴露方法给父组件
defineExpose({
  watermarkTableRefIds,
  getWatermarkList
});
</script>

<style lang="less" scoped>
.watermark-table {
  width: 100%;
  
  .button-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
    
    .create-button {
      // 保持与原来一致的样式
    }
  }
  
  .watermark-content {
    display: flex;
    justify-content: center;
    align-items: center;
    .watermark-image {
      max-width: 100px;
      max-height: 50px;
      object-fit: contain;
    }
  }
}

.modal-content {
  .form-item {
    margin-bottom: 16px;
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }
  }
  
  .preview-content {
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    padding: 16px;
    text-align: center;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .watermark-preview {
      .preview-image {
        max-width: 200px;
        max-height: 100px;
        object-fit: contain;
      }
      
      .preview-text {
        font-size: 16px;
        color: #666;
      }
    }
    
    .preview-placeholder {
      color: #999;
    }
  }
}
</style>
