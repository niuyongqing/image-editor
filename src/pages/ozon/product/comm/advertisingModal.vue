<template>
  <a-modal
    :width="800"
    :open="open"
    :title="props.type === 'click' ? '加入点击付费广告' : '加入订单付费广告'"
    @ok="handleOk"
    @cancel="handleCancel"
    @update:open="handleVisibleChange"
  >
    <template #footer>
      <div class="modal-footer">
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleOk">确定</a-button>
      </div>
    </template>
    <div class="advertising-modal-content">
      <!-- 搜索区域 -->
      <div class="search-section">
        <div class="search-item">
          <span class="label">店铺账号：</span>
          <a-select
            disabled
            v-model:value="simpleName"
            style="width: 280px"
            placeholder="自动带出"
          >
          </a-select>
        </div>
        <div class="search-item" v-if="props.type === 'click'">
          <span class="label">广告活动：</span>
          <a-select
            v-model:value="selectedActivityId"
            style="width: 280px"
            placeholder="请选择广告活动"
          >
            <a-select-option
              v-for="item in activityList"
              :key="item.id"
              :value="item.id"
              >{{ item.title }}</a-select-option
            >
          </a-select>
        </div>
      </div>
      <a-card>
        <!-- 计算竞价区域 -->
        <div class="calculate-section" v-if="props.type === 'order'">
          <a-select v-model:value="calculateType" style="width: 127px">
            <a-select-option value="add">加</a-select-option>
            <a-select-option value="subtract">减</a-select-option>
            <a-select-option value="multiply">乘</a-select-option>
            <a-select-option value="divide">除</a-select-option>
            <a-select-option value="percentAdd">百分比加</a-select-option>
            <a-select-option value="percentSubtract">百分比减</a-select-option>
          </a-select>
          <a-input
            v-model:value="calculateValue"
            style="width: 127px; margin: 0 10px"
            placeholder="输入数字"
          />
          <a-button type="primary" @click="calculateBid">计算竞价</a-button>
          <span>选择产品：{{ localProductsList.length }}/500</span>
        </div>
        <!-- 产品列表 -->
        <div class="product-list">
          <a-table
            :columns="columns"
            :data-source="localProductsList"
            :pagination="false"
            :scroll="{ y: 400 }"
            row-key="id"
            :locale="{ emptyText: '暂无产品' }"
          >
            <!-- 自定义表头渲染 -->
            <template #headerCell="{ column }">
              <template v-if="column.key === 'action'">
                <span class="remove-all-header" @click="removeAll">
                  移除全部
                </span>
              </template>
              <template v-else>
                {{ column.title }}
              </template>
            </template>

            <!-- 自定义列渲染 -->
            <template #bodyCell="{ column, record }">
              <!-- 图片列 -->
              <template v-if="column.key === 'image'">
                <div class="product-image">
                  <a-image
                    style="width: 60px; height: 60px"
                    :src="
                      processImageSource(
                        (record.primaryImage?.length > 0 &&
                          record.primaryImage[0]) ||
                          (record.images?.length > 0 && record.images[0]) ||
                          ''
                      )
                    "
                  />
                </div>
              </template>
              <!-- 产品标题/产品ID列 -->
              <template v-else-if="column.key === 'info'">
                <div class="product-title">
                  <a-tooltip class="item">
                    <template #title>
                      <span>{{ record.name }}</span>
                    </template>
                    <div>{{ record.name }}</div>
                  </a-tooltip>
                  <a-tooltip placement="top">
                    <template #title>
                      <span class="cursor-pointer" @click="copyText(record.sku)"
                        >复制</span
                      >
                    </template>
                    <a
                      class="text-[#1677ff]"
                      href="#"
                      @click="jumpTo(record.sku)"
                      >{{ record.sku }}</a
                    >
                  </a-tooltip>
                </div>
              </template>
              <!-- 产品价格列 -->
              <template v-else-if="column.key === 'price'">
                <span>{{ record.currencyCode }} {{ record.price }}</span>
              </template>
              <!-- 竞价列 -->
              <template v-else-if="column.key === 'bid'">
                <a-input-number
                  v-model:value="record.bid"
                  :min="0"
                  :step="0.01"
                  style="width: 120px"
                  @change="onBidChange(record.id, $event)"
                />
              </template>
              <!-- 操作列 -->
              <template v-else-if="column.key === 'action'">
                <a-button type="text" danger @click="removeProduct(record.id)"
                  >移除</a-button
                >
              </template>
            </template>
          </a-table>
        </div>
      </a-card>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch, shallowRef } from "vue";
import { message } from "ant-design-vue";
import { debounce } from "lodash-es";
const { copy } = useClipboard();
import { processImageSource } from "~/pages/ozon/config/commJs/index";
import { getAdvertisingActivityList } from "~/pages/ozon/config/api/product";

// Props
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  productsList: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String,
    default: "click",
  },
});

// Emits
const emit = defineEmits([
  "ok",
  "cancel",
  "update:open",
]);

// 响应式数据
const selectedActivityId = ref(null);
const calculateType = ref("add");
const calculateValue = ref("");
const localProductsList = shallowRef([]);
const simpleName = ref(null); // 店铺名称
const shopId = ref(null); // 店铺ID
const activityList = shallowRef([]); // 广告活动列表

// 监听产品列表变化
watch(
  () => props.productsList,
  (newVal) => {
    if (newVal && Array.isArray(newVal)) {
      localProductsList.value = newVal.map((item) => ({
        ...item,
        bid: item.bid || 0,
      }));

      if (newVal.length > 0) {
        simpleName.value = newVal[0]?.simpleName;
        shopId.value = newVal[0]?.account;

        if (shopId.value) {
          getList(shopId.value);
        }
      }
    }
  },
  { immediate: true, deep: true }
);

// 表格列配置
const columns = computed(() => {
  const baseColumns = [
    {
      title: "图片",
      dataIndex: "id",
      key: "image",
      width: 80,
      align: "center",
    },
    {
      title: "产品标题/产品ID",
      dataIndex: "name",
      key: "info",
    },
    {
      title: "产品价格",
      dataIndex: "price",
      key: "price",
      width: 120,
      align: "right",
    },
  ];

  // 当type等于order时，添加竞价列
  if (props.type === "order") {
    baseColumns.push({
      title: "竞价(RUB)",
      dataIndex: "bid",
      key: "bid",
      width: 150,
      align: "center",
    });
  }

  // 添加操作列
  baseColumns.push({
    title: "移除全部",
    dataIndex: "id",
    key: "action",
    width: 80,
    align: "center",
  });

  return baseColumns;
});

// 复制
const copyText = (text) => {
  if (!text) {
    return;
  }
  copy(text);
  message.success(`复制成功：${text}`);
};

// 商品ID跳转
const jumpTo = (sku) => {
  if (!sku || sku === "sku未创建") {
    return;
  }
  const url = `https://ozon.ru/context/detail/id/${sku}`;
  window.open(url, "_blank");
};


// 方法
const handleOk = () => {
  // 通用验证：检查是否有产品
  if (!validateInput.isEmpty(localProductsList.value, "添加产品")) {
    return;
  }

  // 通用验证：检查商品ID是否存在
  if (!validateInput.validateProductIds()) {
    return;
  }

  let params = null;

  // 点击付费广告处理
  if (props.type === "click") {
    if (!validateInput.isEmpty(selectedActivityId.value, "选择广告活动")) {
      return;
    }

    const productIds = localProductsList.value.map((item) => item.id);
    params = {
      account: shopId.value,
      campaignId: selectedActivityId.value,
      productIds,
    };
  }

  // 订单付费广告处理
  if (props.type === "order") {
    // 检查是否有产品竞价为0
    const hasZeroBid = localProductsList.value.some((item) => item.bid <= 0);
    if (hasZeroBid) {
      message.error("请为所有产品设置竞价（竞价大于0）");
      return;
    }

    params = localProductsList.value.map((item) => ({
      account: shopId.value,
      bid: item.bid,
      productId: item.id,
    }));
  }

  // 统一处理提交和关闭
  if (params) {
    emit("ok", params);
    resetModalData();
    emit("update:open", false);
  }
};

// 重置数据
const resetModalData = () => {
  selectedActivityId.value = null;
  calculateType.value = "add";
  calculateValue.value = "";
  localProductsList.value = [];
  simpleName.value = null;
  shopId.value = null;
  activityList.value = [];
};

const handleCancel = () => {
  resetModalData();
  emit("update:open", false);
};

const handleVisibleChange = (value) => {
  if (!value) {
    resetModalData();
  }
  emit("update:open", value);
};

const removeProduct = (id) => {
  removeProductById(id);
};

const removeAll = () => {
  updateProductsList([]);
};

// 错误处理工具函数
const handleError = (error, defaultMessage = "操作失败") => {
  console.error(defaultMessage, error);
  const errorMessage = error?.message || defaultMessage;
  message.error(errorMessage);
};

// 成功消息处理
const showSuccess = (msg) => {
  message.success(msg);
};

// 验证工具函数
const validateInput = {
  isEmpty: (value, fieldName) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      message.error(`请${fieldName.includes("选择") ? "" : "填写"}${fieldName}`);
      return false;
    }
    return true;
  },
  isPositiveNumber: (value, fieldName) => {
    if (isNaN(value) || value <= 0) {
      message.error(`${fieldName}必须为大于0的数字`);
      return false;
    }
    return true;
  },
  isNonNegativeNumber: (value, fieldName) => {
    if (isNaN(value) || value < 0) {
      message.error(`${fieldName}不能为负数`);
      return false;
    }
    return true;
  },
  validateProductIds: () => {
    const invalidProducts = localProductsList.value.filter((item) => !item.id);
    if (invalidProducts.length > 0) {
      const productNames = invalidProducts.map(item => item.name || '未知商品').join('、');
      message.error(`以下商品的ID不存在: ${productNames}`);
      return false;
    }
    return true;
  }
};

// 通用工具函数
const updateProductsList = (updatedList) => {
  localProductsList.value = updatedList;
};
const removeProductById = (id) => {
  const updatedList = localProductsList.value.filter((item) => item.id !== id);
  updateProductsList(updatedList);
};

// 处理单个产品竞价变化
const onBidChange = (id, value) => {
  const updatedList = localProductsList.value.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        bid: value
      };
    }
    return item;
  });
  updateProductsList(updatedList);
};

// 计算竞价的防抖处理函数
const debouncedCalculateBid = debounce(() => {
  const value = parseFloat(calculateValue.value);
  if (isNaN(value)) {
    message.error("请输入有效的数字");
    return;
  }

  // 验证计算值范围
  if (!validateInput.isNonNegativeNumber(value, "计算值")) {
    return;
  }

  // 验证除法操作的除数
  if (calculateType.value === "divide" && value === 0) {
    message.error("除数不能为0");
    return;
  }

  // 创建新的产品列表副本以避免直接修改
  const updatedProducts = localProductsList.value.map((product) => {
    let newBid = product.bid || 0;

    switch (calculateType.value) {
      case "add":
        newBid += value;
        break;
      case "subtract":
        newBid -= value;
        break;
      case "multiply":
        newBid *= value;
        break;
      case "divide":
        if (value !== 0) {
          newBid /= value;
        }
        break;
      case "percentAdd":
        newBid += newBid * (value / 100);
        break;
      case "percentSubtract":
        newBid -= newBid * (value / 100);
        break;
      default:
        break;
    }

    // 确保竞价不小于0
    newBid = Math.max(0, newBid);
    
    return {
      ...product,
      bid: parseFloat(newBid.toFixed(2)) // 保留两位小数
    };
  });

  // 更新产品列表
  localProductsList.value = updatedProducts;
  
  
  showSuccess("竞价计算完成");
}, 300);

// 计算所有产品的竞价
const calculateBid = () => {
  debouncedCalculateBid();
};

const getList = (account) => {
  // 初始化时获取广告活动列表
  getAdvertisingActivityList({
    account,
  })
    .then((res) => {
      if (res && res.code === 200) {
        // 处理广告活动数据
        activityList.value = res.data || [];
      } else {
        handleError(res, "获取广告活动列表失败");
      }
    })
    .catch((err) => {
      handleError(err, "获取广告活动列表异常");
    });
};
</script>

<style scoped>
.advertising-modal-content {
  padding: 10px 0;
}

.search-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  align-items: center;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  font-size: 14px;
  color: #333;
}

.product-list {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
}

.product-image {
  width: 60px;
  height: 60px;
  margin-right: 16px;
  flex-shrink: 0;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.remove-all-header {
  color: #ff4d4f;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.calculate-section {
  margin-bottom: 4px;

  span {
    font-size: 14px;
    color: #333;
    margin-left: 20px;
    float: right;
  }
}
</style>
