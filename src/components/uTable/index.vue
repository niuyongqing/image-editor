<template>
  <div class="u-table">
    <!-- 表格为空时显示 -->
    <div v-if="loading && dataSource.length === 0" class="empty-state">
      <a-empty :description="emptyText" />
      <div v-if="showResetButton" style="margin-top: 16px">
        <a-button type="link" @click="handleReset">清空筛选条件</a-button>
      </div>
    </div>

    <!-- 表格数据 -->
    <a-table
      v-else
      :row-selection="enableSelection ? rowSelection : null"
      :columns="columns"
      :customRow="customRowHandler"
      :data-source="dataSource"
      :rowKey="rowKey"
      :scroll="scrollConfig"
      :loading="loading"
      :rowClassName="rowClassName"
      @resizeColumn="handleResizeColumn"
    >
      <template #bodyCell="{ column, record, index }">
        <!-- 索引列 -->
        <template v-if="column.key === 'index'">
          {{ index + 1 + (pagination.pageNum - 1) * pagination.pageSize }}
        </template>
        <!-- 图片类字段 -->
        <template v-else-if="column.type === 'image'">
          <a-image
            class="image-cell"
            :src="record[column.dataIndex || column.key]"
            :fallback="EmptyImg"
            :height="column.imgHeight || 80"
            :width="column.imgWidth || 80"
          />
        </template>
        <!-- 时间类字段 -->
        <template v-else-if="column.type === 'datetime'">
          {{ formatDateTime(record[column.dataIndex || column.key], column.format) }}
        </template>
        <!-- tag 类字段 -->
        <template v-else-if="column.type === 'tag'">
          <a-tag :color="column.tagColor[record[column.dataIndex || column.key]] || 'default'">
            {{ record[column.dataIndex || column.key] }}
          </a-tag>
        </template>
        <!-- 自定义渲染 -->
        <template v-else-if="column.customRender">
          <!-- 允许通过scoped slot自定义渲染 -->
          <slot :name="`cell-${column.dataIndex || column.key}`" :record="record" :column="column" :index="index">
            <!-- 默认使用函数渲染 -->
            <template v-if="typeof column.customRender === 'function'">
              {{ column.customRender(record, column, index) }}
            </template>
          </slot>
        </template>
        <!-- 操作列 -->
        <template v-else-if="column.key === 'action'">
          <slot name="action" :record="record" :column="column" :index="index">
            <!-- 如果有配置按钮，则使用配置的按钮 -->
              <a-space>
                <template v-for="(action, actionIndex) in column.actions" :key="actionIndex">
                  <!-- 普通按钮 -->
                  <a-button 
                    v-if="!action.danger && !action.popconfirm"
                    type="link" 
                    size="small" 
                    @click="handleActionClick(action.eventName, record)"
                    :disabled="action.disabled && action.disabled(record)"
                  >
                    {{ action.label }}
                  </a-button>
                  
                  <!-- 危险按钮 -->
                  <a-button 
                    v-else-if="action.danger && !action.popconfirm"
                    type="link" 
                    size="small" 
                    danger
                    @click="handleActionClick(action.eventName, record)"
                    :disabled="action.disabled && action.disabled(record)"
                  >
                    {{ action.label }}
                  </a-button>
                  
                  <!-- 带确认的普通按钮 -->
                  <a-popconfirm
                    v-else-if="!action.danger && action.popconfirm"
                    :title="action.popconfirm.title || '确定执行此操作吗？'"
                    :ok-text="action.popconfirm.okText || '确定'"
                    :cancel-text="action.popconfirm.cancelText || '取消'"
                    @confirm="handleActionClick(action.eventName, record)"
                  >
                    <a-button 
                      type="link" 
                      size="small"
                      :disabled="action.disabled && action.disabled(record)"
                    >
                      {{ action.label }}
                    </a-button>
                  </a-popconfirm>
                  
                  <!-- 带确认的危险按钮 -->
                  <a-popconfirm
                    v-else-if="action.danger && action.popconfirm"
                    :title="action.popconfirm.title || '确定要删除这条记录吗？'"
                    :ok-text="action.popconfirm.okText || '确定'"
                    :cancel-text="action.popconfirm.cancelText || '取消'"
                    @confirm="handleActionClick(action.eventName, record)"
                  >
                    <a-button 
                      type="link" 
                      size="small" 
                      danger
                      :disabled="action.disabled && action.disabled(record)"
                    >
                      {{ action.label }}
                    </a-button>
                  </a-popconfirm>
                </template>
              </a-space>
          </slot>
        </template>
        <!-- 其他列默认渲染 -->
        <template v-else>
          {{ record[column.dataIndex || column.key] }}
        </template>

      </template>
    </a-table>

    <!-- 分页 -->
    <a-pagination
      v-if="showPagination"
      style="margin-top: 20px; text-align: right"
      :show-total="(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`"
      v-model:current="pagination.pageNum"
      v-model:pageSize="pagination.pageSize"
      :total="pagination.total"
      class="pages"
      :defaultPageSize="pagination.pageSize"
      :showSizeChanger="showSizeChanger"
      :pageSizeOptions="pageSizeOptions"
      @change="handlePageChange"
    />
  </div>
</template>

<script setup name="uTable">
import { ref, computed } from "vue";
import EmptyImg from "@/assets/images/aliexpress/empty.png";
import dayjs from "dayjs";

// Props定义
const props = defineProps({
  // 表格列定义
  columns: {
    type: Array,
    required: true,
  },
  // 数据源
  dataSource: {
    type: Array,
    default: () => [],
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false,
  },
  // 分页配置
  pagination: {
    type: Object,
    default: () => ({
      pageNum: 1,
      pageSize: 50,
      total: 0,
    }),
  },
  // 是否启用选择功能
  enableSelection: {
    type: Boolean,
    default: true,
  },
  // 是否显示分页
  showPagination: {
    type: Boolean,
    default: true,
  },
  // 是否显示重置按钮
  showResetButton: {
    type: Boolean,
    default: true,
  },
  // 是否显示每页条数选择器
  showSizeChanger: {
    type: Boolean,
    default: true,
  },
  // 每页条数选项
  pageSizeOptions: {
    type: Array,
    default: () => ['1', '50', '100', '200'],
  },
  // 行key字段名
  rowKey: {
    type: [String, Function],
    default: 'id',
  },
  // 表格滚动配置
  scrollConfig: {
    type: Object,
    default: () => ({x: 'max-content', y: 980 }),
  },
  // 空状态文本
  emptyText: {
    type: String,
    default: '暂无符合条件的数据',
  },
  // 行样式类名
  rowClassName: {
    type: [String, Function],
    default: '',
  },
  // 是否启用双击编辑
  enableDblClick: {
    type: Boolean,
    default: true,
  },
});

// 使用固定的事件列表
const emit = defineEmits([
  "reset",
  "selection-change",
  "row-dblclick",
  "page-change",
  "page-size-change",
  "resize-column",
  "edit",
  "delete",
  "copy",
  "view",
  "stop",
  "used"
]);

/**
 * 处理列宽调整事件
 */
const handleResizeColumn = (w, col) => {
  col.width = w;
}

// 表格选择相关
const selectedRowKeys = ref([]);

/**
 * 处理后的列配置
 */
const processedColumns = computed(() => {
  // 深拷贝原始列配置，避免直接修改
  return JSON.parse(JSON.stringify(props.columns));
});

/**
 * 表格行选择配置
 */
const rowSelection = {
  selectedRowKeys,
  onChange: (selectedRowKeysArr, selectedRows) => {
    selectedRowKeys.value = selectedRowKeysArr;
    emit("selection-change", selectedRows);
  },
};

/**
 * 清除选中状态
 */
const clearSelection = () => {
  selectedRowKeys.value = [];
  emit("selection-change", selectedRowKeys.value);
};

/**
 * 获取当前选中的数据
 */
const getSelectedRows = () => {
  return selectedRowKeys.value;
};

/**
 * 自定义行点击事件处理器
 */
const customRowHandler = (record) => {
  const handlers = {};
  
  if (props.enableDblClick) {
    handlers.onDblclick = (event) => {
      emit("row-dblclick", record, event);
    };
  }
  
  return handlers;
};

/**
 * 格式化日期时间
 */
const formatDateTime = (dateTime, format = "YYYY-MM-DD HH:mm:ss") => {
  if (!dateTime) return "";
  return dayjs(dateTime).format(format);
};

/**
 * 处理页码变化
 */
const handlePageChange = (page) => {
  emit("page-change", Number(page));
};


/**
 * 重置表格
 */
const handleReset = () => {
  emit("reset");
};


/**
 * 处理动态操作按钮点击
 */
const handleActionClick = (eventName, record) => {
  if (eventName) {
    emit(eventName, record);
  }
};

/**
 * 暴露方法给父组件
 */
defineExpose({
  getSelectedRows,
  clearSelection,
});
</script>

<style scoped>
.u-table {
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

.image-cell {
  cursor: pointer;
}

/* 响应式布局 */
@media screen and (max-width: 1400px) {
  :deep(.ant-table) {
    zoom: 0.95;
  }
}

@media screen and (max-width: 768px) {
  :deep(.ant-table) {
    zoom: 0.9;
  }
}

/* 增加分页组件下拉列表宽度，确保文字完全显示 */
.pages :deep(.ant-pagination-options-size-changer) {
  min-width: 100px;
}
</style>
