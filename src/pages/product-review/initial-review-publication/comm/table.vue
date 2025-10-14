<template>
  <div class="product-review-table">
    <!-- 表格为空时显示 -->
    <div v-if="!loading && tableData.length === 0" class="empty-state">
      <a-empty description="暂无符合条件的数据" />
      <div style="margin-top: 16px">
        <a-button type="link" @click="onReset">清空筛选条件</a-button>
      </div>
    </div>

    <!-- 表格数据 -->
    <a-table
      v-else
      :row-selection="rowSelection"
      :columns="processedColumns"
      :customRow=customRow
      :data-source="tableData"
      :rowKey="(row) => row?.productOrderNo || row"
      :pagination="false"
      :scroll="{ y: 980 }"
      :loading="loading"
      :row-class-name="tableRowClassName"
    >
      <template #bodyCell="{ column, record, index }">
        <!-- 索引列 -->
        <template v-if="column.key === 'index'">
          {{ index + 1 }}
        </template>
        <!-- 主图列自定义渲染 -->
        <template v-else-if="column.key === 'artMainImage'">
          <a-image
            class="image-cell"
            :src="record.artMainImage"
            :fallback="EmptyImg"
            height="80px"
            width="80px"
          />
        </template>
        <!-- 审核状态列自定义渲染 -->
        <template v-else-if="column.key === 'auditStatus'">
          <a-tag :color="getStatusColor(record.auditStatus)">
            {{ getStatusText(record.auditStatus) }}
          </a-tag>
        </template>
        <!-- 市场方向列自定义渲染 -->
        <template v-else-if="column.key === 'devAttributableMarket'">
          {{
            MarketDirection.find(
              (item) => item.value === record.devAttributableMarket
            )?.label || ""
          }}
        </template>
        <!-- SKU列表列自定义渲染 -->
        <template v-else-if="column.key === 'skuList'">
          {{ getSkuListFun(record.skuList) }}
        </template>
        <!-- 仓储类别列自定义渲染 -->
        <template v-else-if="column.key === 'meansKeepGrain'">
          <template
            v-for="(item, index) in record.meansKeepGrain?.split(',') || []"
            :key="index"
          >
            <template v-if="props.meansKeepGrainOptions.find((opt) => opt.value === item)">
              <a-tag style="margin-right: 3px" color="processing">
                {{ props.meansKeepGrainOptions.find((opt) => opt.value === item)?.label }}
              </a-tag>
            </template>
            <template v-else>
              <span>{{  }}</span>
            </template> 
          </template>
        </template>
        <!-- 分类列自定义渲染 -->
        <template v-else-if="column.key === 'classify'">
          <a-tag
            v-if="record.classify"
            style="margin-right: 3px"
            color="#87d068"
          >
            {{ getCommodityTypeLabelFun(record.classify) }}
          </a-tag>
        </template>
        <!-- 创建时间格式化 -->
        <template v-else-if="column.key === 'createTime'">
          {{ formatDateTime(record.createTime) }}
        </template>

        <!-- 其他列默认渲染 -->
        <template v-else>
          {{ record[column.key] }}
        </template>
      </template>
    </a-table>

    <!-- 分页 -->
    <a-pagination
      style="margin-top: 20px; text-align: right"
      :show-total="
        (total, range) =>
          `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
      "
      v-model:current="pages.pageNum"
      v-model:pageSize="pages.pageSize"
      :total="pages.total"
      class="pages"
      :defaultPageSize="50"
      :showSizeChanger="true"
      :pageSizeOptions="['50', '100', '200']"
      @change="handlePageChange"
      @showSizeChange="handlePageSizeChange"
    />
  </div>
</template>

<script setup name="ProductReviewTable">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { message } from "ant-design-vue";
  import EmptyImg from '@/assets/images/aliexpress/empty.png'
import dayjs from "dayjs";
import {
  getCommodityTypeLabel,
  getSkuList,
} from "~@/pages/product-review/config/untils.js";
const props = defineProps({
  // 表格列定义
  columns: {
    type: Array,
    required: true,
  },
  // 数据获取API
  api: {
    type: Function,
    required: true,
  },
  // 搜索参数
  searchParams: {
    type: Object,
    default: () => ({}),
  },
  // 导出数据API
  exportApi: {
    type: Function,
    default: null,
  },
  // 开发属性可分配市场列表
  MarketDirection: {
    type: Array,
    default: () => [],
  },
  // 仓储类别列表
  meansKeepGrainOptions: {
    type: Array,
    default: () => [],
  },
  // 商品类型列表
  commodityTypeList: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["audit", "reset", "loading-change"]);

// 表格相关
const loading = ref(false);
const tableData = ref([]);
const selectedRowKeys = ref([]);
const exportLoading = ref(false);
const pages = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0,
});

/**
 * 监听loading状态变化，通知父组件
 */
watch(loading, (newValue) => {
  emit("loading-change", newValue);
});

/**
 * 监听exportLoading状态变化，通知父组件
 */
watch(exportLoading, (newValue) => {
  emit("export-loading-change", newValue);
});

/**
 * 处理后的列配置（添加操作列和展开功能）
 */
const processedColumns = computed(() => {
  // 深拷贝原始列配置，避免直接修改
  const processed = JSON.parse(JSON.stringify(props.columns));
  console.log("processedColumns", processed);

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
  selectedRowKeys,
  onChange: (_, selectedRows) => {
    selectedRowKeys.value = selectedRows;
    emit("selection-change", selectedRowKeys.value);
    console.log("selectedRowKeys", selectedRowKeys.value);
  },
  // getCheckboxProps: (record) => ({
  //   disabled: !!record.auditStatus, // 已审核的商品不可选
  // })
};

/**
 * 仓储类别
 * @param {string} val - 仓储类别值
 * @returns {string} - 仓储类别名称
 */
function getMeansKeepGrainOptions(val) {
  let Aname1;
  if (props.meansKeepGrainOptions.value?.length > 0) {
    props.meansKeepGrainOptions.value.forEach((item) => {
      if (item.value == val) {
        Aname1 = item.label;
      }
    });
  }
  console.log("getMeansKeepGrainOptions", props.meansKeepGrainOptions);

  return Aname1;
}

/**
 * 处理SKU列表，返回格式化后的字符串
 * @param {string} e - 逗号分隔的SKU字符串
 * @returns {string} - 格式化后的SKU字符串
 */
function getSkuListFun(e) {
  return getSkuList(e);
}

/**
 * 商品类型
 * @param {string} val - 商品类型值
 * @returns {string} - 商品类型名称
 */
function getCommodityTypeLabelFun(val) {
  return getCommodityTypeLabel(val);
}

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
      params.devAttributableMarket = params.devAttributableMarket.join(",");
    }
    // 提交人处理
    if (Array.isArray(params.selectUserId)) {
      params.selectUserId = params.selectUserId.join(",");
    }
    if(params.selectUserId === ""){
      params.selectUserId = params.selectAll.join(",");
    }
    delete params.selectAll;

    // 分类处理
    if (Array.isArray(params.classify)) {
      params.classify = params.classify.join(",");
    }

    // 安全处理日期范围参数
    if (
      Array.isArray(params.createTimeList) &&
      params.createTimeList.length >= 2
    ) {
      // 使用与原始代码相同的参数名，确保与后端API兼容性
      params.startTime = dayjs(params.createTimeList[0])
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      params.endTime = dayjs(params.createTimeList[1])
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
    }

    // 删除原始的createTime参数，避免混淆
    delete params.createTimeList;
    const res = await props.api(params);
    tableData.value = JSON.parse(JSON.stringify(res?.rows || []));
    // 处理主图URL
    tableData.value.forEach((item) => {
      if (item.artMainImage && item.artMainImage.length > 0) {
        try {
          // 尝试解析JSON字符串
          const parsedData = JSON.parse(item.artMainImage);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            item.artMainImage = parsedData[0]?.url || "";
          } else {
            item.artMainImage = "";
          }
        } catch (error) {
          // 解析失败时将主图地址置空
          console.error("解析 artMainImage JSON 失败:", error);
          item.artMainImage = "";
        }
      }
    });
    pages.total = res?.total || 0;
    // 清除选中状态
    selectedRowKeys.value = [];
  } catch (error) {
    console.error("获取产品列表失败:", error);
    message.error("获取产品列表失败");
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
  console.log("clearSelection", selectedRowKeys.value);
  emit("selection-change", selectedRowKeys.value);
};

/**
 * 获取当前选中的商品
 */
const getCurrentSelectedProducts = () => {
  return selectedRowKeys.value
};

/**
 * 自定义行点击事件
 */
const customRow = (record) => {
  return {
    // 点击行
    onDblclick: (event) => {
      console.log("双击行:", record);
      // 触发自定义事件，将选中的商品传递给父组件
      emit("edit-product", record);
    },
    style: {
      height: "80px",
    }
  };
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
  return index % 2 === 0 ? "even-row" : "odd-row";
};

/**
 * 根据状态获取文本
 */
const getStatusText = (status) => {
  const statusMap = {
    1: "已通过",
    2: "已驳回",
    "": "待审核",
  };
  return statusMap[status] || "未知";
};

/**
 * 根据状态获取颜色
 */
const getStatusColor = (status) => {
  const colorMap = {
    1: "success",
    2: "error",
    "": "default",
  };
  return colorMap[status] || "default";
};

/**
 * 格式化日期时间
 */
const formatDateTime = (dateTime) => {
  if (!dateTime) return "";
  return dayjs(dateTime).format("YYYY-MM-DD HH:mm:ss");
};

/**
 * 导出数据
 */
const exportData = async () => {
  if (!props.exportApi) {
    message.warning("导出功能未实现");
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
      window.open(res.url, "_blank");
      message.success("导出成功");
    } else {
      message.warning("暂无数据可导出");
    }
  } catch (error) {
    console.error("导出失败:", error);
    message.error("导出失败，请重试");
  } finally {
    exportLoading.value = false;
  }
};

/**
 * 重置表格
 */
const onReset = () => {
  emit("reset");
};

// /**
//  * 组件挂载时获取列表数据
//  */
// onMounted(() => {
//   getList();
// });

/**
 * 暴露方法给父组件
 */
defineExpose({
  getList,
  clearSelection,
  exportData,
  getCurrentSelectedProducts,
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
