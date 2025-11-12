<template>
  <a-modal
    :open="visible"
    @update:open="handleUpdateOpen"
    :title="title"
    :width="width"
    destroyOnClose
    @ok="handleCancel"
    @cancel="handleCancel"
  >
    <div class="log-modal-container">
      <!-- 搜索和筛选区域 -->
      <div class="log-filter-section" v-if="showFilter">
        <a-row :gutter="[16, 16]">
          <a-col :span="12">
            <a-input
              v-model:value="searchText"
              placeholder="搜索日志内容"
              allowClear
              @change="handleSearch"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-col>
          <a-col :span="12">
            <a-range-picker
              v-model:value="dateRange"
              @change="handleDateRangeChange"
              style="width: 100%"
              :placeholder="['开始日期', '结束日期']"
            />
          </a-col>
        </a-row>
      </div>

      <!-- 日志列表 -->
      <div class="log-list">
        <div v-if="loading" class="log-loading">
          <a-spin tip="加载中..." />
        </div>
        <div v-else-if="filteredLogs.length === 0" class="log-empty">
          <a-empty description="暂无日志记录" />
        </div>
        <div v-else class="log-timeline">
          <!-- 时间轴线 -->
          <div class="timeline-line"></div>

          <!-- 日志节点 -->
          <div
            v-for="(log, index) in paginatedLogs"
            :key="log.id ? `log-${log.id}-${index}` : `log-index-${index}`"
            class="log-timeline-item"
          >
            <!-- 节点圆点 -->
            <div class="timeline-node"></div>
            <!-- 日志内容 -->
            <div class="log-timeline-content">
              <div class="log-item-header">
                <div class="log-info">
                  <div class="log-type">
                    提交类型: {{ getSubmitTypeText(log.submitType) }}
                  </div>
                  <div class="log-submitter">
                    提交人: {{ log.submitName || "Unknown User" }}
                  </div>
                  <div class="log-time">
                    提交时间: {{ formatTime(log.createTime) }}
                  </div>
                  <!-- <div class="log-time">
                    更新时间: {{ formatTime(log.updateTime) }}
                  </div> -->
                </div>
                <a-tooltip
                  overlayClassName="log-detail-tooltip"
                  placement="right"
                  color="#fff"
                >
                  <template #title>
                    <div v-if="currentLogDetail">
                      <div
                        class="log-detail-item"
                        v-for="(value, key) in getLogDetails(currentLogDetail)"
                        :key="`detail-${key}`"
                      >
                        <span class="log-detail-label"
                          >{{ getDetailFieldLabel(key) }}:</span
                        >
                        <span class="log-detail-value">{{
                          formatLogValue(key, value)
                        }}</span>
                      </div>
                    </div>
                  </template>
                  <a-button
                    type="link"
                    class="log-detail-btn"
                    @mouseenter="showLogDetails(log)"
                    >详情</a-button
                  >
                </a-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="filteredLogs.length > 0" class="log-pagination">
        <a-pagination
          v-model:current="currentPage"
          v-model:pageSize="pageSize"
          :total="filteredLogs.length"
          showSizeChanger
          showQuickJumper
          :showTotal="
            (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`
          "
          @change="handlePageChange"
          @showSizeChange="handleSizeChange"
        />
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import dayjs from "dayjs";

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "操作日志",
  },
  width: {
    type: Number,
    default: 800,
  },
  logData: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  fieldLabels: {
    type: Object,
    default: () => ({}),
  },
  excludeFields: {
    type: Array,
    default: () => ["id", "updateTime"],
  },
  showFilter: {
    type: Boolean,
    default: true,
  },
});

// Emits
const emit = defineEmits(["update:visible", "cancel", "open"]);

// 响应式数据
const searchText = ref("");
const dateRange = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const currentRecord = ref(null);
const detailVisible = ref(false);
const currentLogDetail = ref(null);

// 计算属性：过滤后的日志数据
const filteredLogs = computed(() => {
  let logs = [...props.logData];

  // 按搜索文本过滤
  if (searchText.value) {
    const searchLower = searchText.value.toLowerCase();
    logs = logs.filter((log) =>
      Object.values(log).some((value) =>
        String(value).toLowerCase().includes(searchLower)
      )
    );
  }

  // 按时间范围过滤
  if (dateRange.value && dateRange.value.length === 2) {
    const startDate = dateRange.value[0].startOf("day");
    const endDate = dateRange.value[1].endOf("day");
    logs = logs.filter((log) => {
      if (!log.createTime) return false;
      const logDate = dayjs(log.createTime);
      return logDate.isAfter(startDate) && logDate.isBefore(endDate);
    });
  }

  // 按时间降序排序
  return logs.sort((a, b) => {
    const dateA = a.createTime ? new Date(a.createTime).getTime() : 0;
    const dateB = b.createTime ? new Date(b.createTime).getTime() : 0;
    return dateB - dateA;
  });
});

// 计算属性：分页后的日志数据
const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredLogs.value.slice(start, end);
});

// 方法
const handleCancel = () => {
  emit("update:visible", false);
  emit("cancel");
};

const handleSearch = () => {
  currentPage.value = 1;
};

const handleDateRangeChange = () => {
  currentPage.value = 1;
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

const handleSizeChange = (_, size) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const resetFilters = () => {
  searchText.value = "";
  dateRange.value = [];
  currentPage.value = 1;
  pageSize.value = 10;
};

const formatTime = (time) => {
  return time ? dayjs(time).format("YYYY-MM-DD HH:mm:ss") : "";
};

const getFieldLabel = (fieldName) => {
  return props.fieldLabels[fieldName] || fieldName;
};

// 详情弹窗中使用的字段标签映射
const getDetailFieldLabel = (fieldName) => {
  const fieldLabelMap = {
    ...props.fieldLabels,
    productId: "商品ID",
    titleRule: "标题规则",
    mainRule: "主图规则",
    imageRule: "副图规则",
    insufficientType: "资料不足时",
    publishType: "刊登模式",
    simpleName: "刊登店铺",
    shopIntervalTime: "同店铺不同商品间隔时间",
    productIntervalTime: "同商品不同店铺间隔时间",
  };
  return fieldLabelMap[fieldName] || fieldName;
};

const formatLogValue = (fieldName, value) => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "object") return JSON.stringify(value, null, 2);

  // 处理重复次数相关字段 (titleRule, mainRule, imageRule)
  if (["titleRule", "mainRule", "imageRule"].includes(fieldName)) {
    switch (value) {
      case 0:
        return "不允许重复";
      case -1:
        return "不限制重复次数";
      default:
        return `允许重复${value}次`;
    }
  }

  // 处理资料不足时策略
  if (fieldName === "insufficientType") {
    const strategies = {
      1: "优先刊登排序靠前的店铺",
      2: "优先刊登排序靠后的店铺",
      3: "随机刊登店铺",
      4: "允许重复产品刊登多个店铺",
    };
    return strategies[value] || String(value);
  }

  // 处理提交类型（已有getSubmitTypeText，但这里也可以保持一致性）
  if (fieldName === "submitType" || fieldName === "publishType") {
    return value === 1 ? "按钮提交" : `类型: ${value}`;
  }

  // 处理时间间隔字段，添加单位
  if (["shopIntervalTime", "productIntervalTime"].includes(fieldName)) {
    return `${value} 分钟`;
  }

  return String(value);
};

// 获取提交类型文本
const getSubmitTypeText = (type) => {
  const typeMap = {
    1: "按钮提交",
  };
  return typeMap[type] || `类型: ${type}`;
};

const getLogDetails = (log) => {
  const details = {};
  Object.keys(log).forEach((key) => {
    if (
      !props.excludeFields.includes(key) &&
      key !== "submitName" &&
      key !== "createTime" &&
      key !== "submitType"
    ) {
      details[key] = log[key];
    }
  });
  return details;
};

// 显示日志详情
const showLogDetails = (log) => {
  currentLogDetail.value = log;
};

// 打开弹窗方法
const openModal = (record) => {
  currentRecord.value = record;
  emit("update:visible", true);
  emit("open", record);
  resetFilters();
};

// 监听visible变化，重置分页和筛选
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      currentPage.value = 1;
    }
  }
);
const handleUpdateOpen = (value) => {
  emit("update:visible", value);
  if (!value) {
    resetFilters();
    detailVisible.value = false;
    currentLogDetail.value = null;
  }
};

// 暴露方法给父组件
defineExpose({
  openModal,
});
</script>
<style scoped lang="less">
.log-filter-section {
  margin-bottom: 16px;
}

.log-list {
  flex: 1;
  overflow-y: auto;
  max-height: 900px;
}

.log-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.log-empty {
  padding: 40px 0;
}

/* 线性时间轴样式 */
.log-timeline {
  position: relative;
  padding-left: 32px;
}

/* 时间轴线 */
.timeline-line {
  position: absolute;
  left: 4px;
  top: 16px;
  bottom: 0;
  width: 2px;
  background-color: #f0f0f0;
  z-index: 0;
}

/* 时间轴节点 */
.log-timeline-item {
  position: relative;
  margin-bottom: 24px;
  display: flex;
  z-index: 1;
}

/* 节点圆点 */
.timeline-node {
  position: absolute;
  left: -32px;
  top: 16px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #1890ff;
  border: 2px solid #e6f7ff;
  z-index: 2;
}

/* 最后一个节点不需要连接线 */
.log-timeline-item:last-child {
  margin-bottom: 0;
}

/* 节点内容 */
.log-timeline-content {
  flex: 1;
  background-color: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

.log-timeline-content:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: #d9d9d9;
}

.log-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.log-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.log-type {
  font-weight: 500;
  color: #262626;
}

.log-submitter {
  color: #595959;
}

.log-time {
  color: #8c8c8c;
  font-size: 12px;
}

.log-detail-btn {
  color: #1890ff;
  font-size: 14px;
}

/* 详情弹窗样式 */
.log-detail-content {
  background: #fff;
  padding: 12px;
  border-radius: 4px;
  width: 300px;
  max-width: 400px;
  max-height: 1000px;
  overflow-y: auto;
}

.log-detail-item {
  display: flex;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}
.log-detail-item:first-child {
  margin-top: 12px;
}

.log-detail-item:last-child {
  border-bottom: none;
  margin-bottom: 12px;
  padding-bottom: 0;
}

.log-detail-label {
  color: #262626;
  // font-weight: 600;
  font-size: 13px;
  padding-right: 8px;
}

.log-detail-value {
  color: #262626;
  font-size: 13px;
  line-height: 1.4;
}

.log-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>

<style lang="less">
// .log-detail-tooltip是外层样式 避免影响全局
.log-detail-tooltip {
  .ant-tooltip-content {
    min-width: 280px !important;
  }
  .ant-tooltip-inner {
    min-width: 280px !important;
    padding: 6px 16px;
  }
}
</style>
