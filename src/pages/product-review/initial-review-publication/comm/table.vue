<template>
  <div class="product-review-table">
    <!-- 表格为空时显示 -->
    <div v-if="!(!loading && tableData.length === 0)" class="empty-state">
      <a-empty description="暂无符合条件的数据" />
      <div style="margin-top: 16px;">
        <a-button type="link" @click="onReset">清空筛选条件</a-button>
      </div>
    </div>

    <!-- 表格数据 -->
    <a-table v-else :row-selection="rowSelection" :columns="processedColumns"  :data-source="tableData"
      :rowKey="(row) => row?.productOrderNo || row" bordered :pagination="false" :scroll="{ y: 400 }" :loading="loading"
      :row-class-name="tableRowClassName">
      <template #bodyCell="{ column, record }">
        <!-- 审核状态列自定义渲染 -->
        <template v-if="column.key === 'auditStatus'">
          <a-tag :color="getStatusColor(record.auditStatus)">
            {{ getStatusText(record.auditStatus) }}
          </a-tag>
        </template>

        <!-- 创建时间格式化 -->
        <template v-else-if="column.key === 'createTime'">
          {{ formatDateTime(record.createTime) }}
        </template>

        <!-- 操作列自定义渲染 -->
        <template v-else-if="column.key === 'action'">
          <a-button type="link" @click="handleSingleAudit(record)" size="small" :disabled="!!record.auditStatus">
            审核
          </a-button>
        </template>
      </template>

    </a-table>

    <!-- 分页 -->
    <a-pagination style="margin-top: 20px; text-align: right;" 
      :show-total="(total, range) => `共 ${total} 条记录，当前显示 ${range[0]}-${range[1]} 条`" v-model:current="pages.pageNum"
      v-model:pageSize="pages.pageSize" :total="pages.total" class="pages" :defaultPageSize="50" :showSizeChanger="true"
      :pageSizeOptions="['50', '100', '200']" @change="handlePageChange" @showSizeChange="handlePageSizeChange" />
  </div>
</template>

<script setup name="ProductReviewTable">
import { ref, reactive, computed, watch } from "vue";
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
const props = defineProps({
  // 表格列定义
  columns: {
    type: Array,
    required: true
  },
  // 数据获取API
  api: {
    type: Function,
    required: true
  },
  // 搜索参数
  searchParams: {
    type: Object,
    default: () => ({})
  },
  // 导出数据API
  exportApi: {
    type: Function,
    default: null
  }
});

const emit = defineEmits(['audit', 'reset', 'loading-change']);

// 表格相关
const loading = ref(false);
const tableData = ref([]);
const selectedRowKeys = ref([]);
const exportLoading = ref(false);
const pages = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0
});

/**
 * 监听loading状态变化，通知父组件
 */
watch(loading, (newValue) => {
  emit('loading-change', newValue);
});

/**
 * 监听exportLoading状态变化，通知父组件
 */
watch(exportLoading, (newValue) => {
  emit('export-loading-change', newValue);
});

/**
 * 处理后的列配置（添加操作列和展开功能）
 */
const processedColumns = computed(() => {
  // 深拷贝原始列配置，避免直接修改
  const processed = JSON.parse(JSON.stringify(props.columns));
  console.log('processedColumns', processed);
  
  // 添加操作列
  // processed.push({
  //   title: '操作',
  //   dataIndex: 'action',
  //   width: '100px',
  //   align: 'center',
  //   fixed: 'right',
  // });

  return processed;
});

/**
 * 表格行选择配置
 */
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    selectedRowKeys.value = selectedRows;
  },
  getCheckboxProps: (record) => ({
    disabled: !!record.auditStatus, // 已审核的商品不可选
  })
};


/**
 * 获取产品列表数据
 */
const getList = async () => {
  try {
    // 先设置loading状态为true
    loading.value = true;
    
    // 构建请求参数，确保分页参数优先
    const params = {
      // 先解构搜索参数
      ...props.searchParams,
      // 然后覆盖分页参数
      pageNum: pages.pageNum,
      pageSize: pages.pageSize,
    };
    
    // 安全处理数组类型参数
    if (Array.isArray(params.devAttributableMarket)) {
      params.devAttributableMarket = params.devAttributableMarket.join(',');
    }
    // 提交人处理
    if (Array.isArray(params.selectUserName)) {
      params.selectUserName = params.selectUserName.join(',');
    }
    
    // 分类处理
    if (Array.isArray(params.classify)) {
      params.classify = params.classify.join(',');
    }

    // 安全处理日期范围参数
    if (Array.isArray(params.createTime) && params.createTime.length >= 2) {
      // 使用与原始代码相同的参数名，确保与后端API兼容性
      params.startTime = dayjs(params.createTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
      params.endTime = dayjs(params.createTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
    }
    
    // 删除原始的createTime参数，避免混淆
    delete params.createTime;
    const res = await props.api(params);
    tableData.value = res?.data || [];
    pages.total = res?.total || 0;

    // 清除选中状态
    selectedRowKeys.value = [];
  } catch (error) {
    console.error('获取产品列表失败:', error);
    message.error('获取产品列表失败');
    tableData.value = [];
    pages.total = 0;
  } finally {
    loading.value = false;
  }
};

/**
 * 清除表格选择
 */
const clearSelection = () => {
  selectedRowKeys.value = [];
};

/**
 * 处理单个商品审核
 */
const handleSingleAudit = (record) => {
  emit('audit', [record], true);
};

/**
 * 处理批量审核操作
 */
const handleAudit = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请选择要审核的商品');
    return;
  }

  emit('audit', [...selectedRowKeys.value], false);
};

/**
 * 处理页码变化
 */
const handlePageChange = (page) => {
  pages.pageNum = page;
  getList();
};

/**
 * 处理每页条数变化
 */
const handlePageSizeChange = (current, pageSize) => {
  // 确保pageSize是数字类型
  pages.pageSize = Number(pageSize);
  pages.pageNum = 1;
};

/**
 * 表格行样式
 */
const tableRowClassName = (record, index) => {
  return index % 2 === 0 ? 'even-row' : 'odd-row';
};


/**
 * 根据状态获取文本
 */
const getStatusText = (status) => {
  const statusMap = {
    '1': '已通过',
    '2': '已驳回',
    '': '待审核'
  };
  return statusMap[status] || '未知';
};

/**
 * 根据状态获取颜色
 */
const getStatusColor = (status) => {
  const colorMap = {
    '1': 'success',
    '2': 'error',
    '': 'default'
  };
  return colorMap[status] || 'default';
};

/**
 * 格式化日期时间
 */
const formatDateTime = (dateTime) => {
  if (!dateTime) return '';
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss');
};

/**
 * 导出数据
 */
const exportData = async () => {
  if (!props.exportApi) {
    message.warning('导出功能未实现');
    return;
  }

  try {
    exportLoading.value = true;

    const params = {
      ...props.searchParams,
    };

    const res = await props.exportApi(params);

    // 处理文件下载
    if (res && res.url) {
      window.open(res.url, '_blank');
      message.success('导出成功');
    } else {
      message.warning('暂无数据可导出');
    }
  } catch (error) {
    console.error('导出失败:', error);
    message.error('导出失败，请重试');
  } finally {
    exportLoading.value = false;
  }
};

/**
 * 重置表格
 */
const onReset = () => {
  emit('reset');
};


/**
 * 暴露方法给父组件
 */
defineExpose({
  getList,
  clearSelection,
  handleAudit,
  exportData
});
</script>

<style scoped>
.product-review-table {
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

.expanded-content {
  padding: 16px;
  background: #fafafa;
}

.expanded-item {
  margin-bottom: 12px;
}

.expanded-label {
  font-weight: 600;
  margin-right: 8px;
}

.expanded-value {
  display: inline-block;
  white-space: pre-wrap;
  word-break: break-all;
  background: #fff;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
  max-width: 100%;
}

/* 响应式布局 */
@media screen and (max-width: 1400px) {
  .ant-table {
    zoom: 0.95;
  }
}

@media screen and (max-width: 768px) {
  .ant-table {
    zoom: 0.9;
  }
}

/* 增加分页组件下拉列表宽度，确保文字完全显示 */
.pages :deep(.ant-pagination-options-size-changer) {
  min-width: 100px;
}
</style>