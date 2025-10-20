<template>
  <div id="configAccountCont">
    <!-- 搜索筛选区域 -->
    <a-card>
      <a-form
        :model="formData"
        layout="inline"
        ref="formRef"
        class="search-form"
        :wrapper-col="wrapperCol"
        :label-col="labelCol"
      >
        <a-form-item label="模糊查询:">
          <a-space size="middle">
            <a-input
              v-model:value="formData.tradeName"
              placeholder="请输入产品名称"
              allowClear
            />
            <a-input
              v-model:value="formData.sku"
              placeholder="请输入产品sku名称"
              allowClear
            />
          </a-space>
        </a-form-item>

        <a-form-item label="分类:">
          <a-cascader
            placeholder="请选择分类"
            allowClear
            v-model:value="formData.classify"
            :options="commodityTypeList"
            :allow-clear="true"
            :field-names="{
              label: 'label',
              value: 'value',
              children: 'children',
            }"
          />
        </a-form-item>
        <a-form-item
          label="提交人"
        >
          <a-select
            v-model:value="formData.selectUserId"
            allow-clear
            show-search
            placeholder="请选择提交人"
            :options="getAccountUserArr"
            mode="multiple"
            :maxTagCount="2"
            :filter-option="filterOption"
            :fieldNames="userLabels"
          ></a-select>
        </a-form-item>

        <a-form-item
          :label="
            props.Source === 'publicationRejected' ? '审核时间:' : '提交时间:'
          "
        >
          <a-range-picker
            v-model:value="formData.createTimeList"
            format="YYYY-MM-DD"
            allow-clear
            :presets="datePresets"
          />
        </a-form-item>
        <a-form-item label="市场方向:">
          <a-select
            v-model:value="formData.devAttributableMarket"
            :options="MarketDirection"
            mode="multiple"
            :maxTagCount="2"
            placeholder="请选择市场方向"
            allowClear
          />
        </a-form-item>
        <a-form-item class="form-actions">
          <a-button
            v-has-permi="permissionList"
            type="primary"
            @click="searchList"
            :loading="tableLoading"
            >查询</a-button
          >
          <a-button
            @click="resetForm"
            :loading="tableLoading"
            >重置</a-button
          >
          <!-- <a-button style="margin-left: 10px" @click="exportData" :loading="exportLoading">导出</a-button> -->
        </a-form-item>
      </a-form>
    </a-card>
    <!-- 数据展示区域 -->
    <a-card style="margin-top: 0.75rem">
      <div class="table-header-actions">
        
        <a-button
          v-if="props.Source !== 'publicationRejected'"
          v-has-permi="permissionSource"
          @click="handleAudit('audit')"
          type="primary"
          :disabled="selectedCount === 0 || tableLoading"
          tooltip="批量审核选中的商品"
        >
          审核
        </a-button>
        <template v-else>
          <a-button
            :disabled="selectedCount !== 1 || tableLoading"
            @click="handleSee"
            type="primary"
            tooltip="批量审核选中的商品"
          >
            查看
          </a-button>
          <a-button
            @click="handleAudit('submit')"
            type="primary"
            :disabled="selectedCount === 0 || tableLoading"
            tooltip="再次提交选中的商品"
          >
            再次提交
          </a-button>
        </template>

        <span style="margin-left: 16px; color: #666">
          已选择 {{ selectedCount }} 项
        </span>

        <a-button
          type="default"
          @click="clearSelection"
          :disabled="selectedCount === 0"
        >
          清空选择
        </a-button>
      </div>

      <div class="table-container" style="margin-top: 20px">
        <!-- 使用封装的表格组件 -->
        <ProductReviewTable
          ref="productReviewTableRef"
          :columns="columns"
          :api="commodityList"
          :searchParams="formData"
          @reset="resetForm"
          @edit-product="handleEditProduct"
          @loading-change="handleLoadingChange"
          :MarketDirection="MarketDirection"
          @selection-change="handleSelectionChange"
          :meansKeepGrainOptions="meansKeepGrainOptions"
        />
      </div>
    </a-card>
    <!-- 审核弹窗 -->
    <a-modal
      :centered="true"
      v-model:open="auditOpen"
      title="批量商品审核:"
      @ok="handleOk('audit')"
      @cancel="handleCancel('audit')"
      :confirm-loading="auditLoading"
      okText="确认"
      cancelText="取消"
      :width="600"
    >
      <!-- 显示正在审核的商品信息 -->
      <div
        v-if="currentAuditingProducts.length > 0"
        class="auditing-products-info"
      >
        <div class="auditing-products-title">审核商品：</div>
        <div class="auditing-products-list">
          <div
            v-for="(product, index) in currentAuditingProducts"
            :key="index"
            class="auditing-product-item"
          >
            产品名称：{{ product.commodityName }}
          </div>
        </div>
      </div>

      <a-form :model="auditFormData" ref="auditFormRef">
        <a-form-item name="auditStatus">
          <a-radio-group v-model:value="auditFormData.auditStatus">
            <a-radio :value="stateOptions[props.Source][0].value" style="margin-right: 16px">审核通过</a-radio>
            <a-radio :value="stateOptions[props.Source][1].value">审核驳回</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          name="remark"
          :rules="[
            {
              required: auditFormData.auditStatus === stateOptions[props.Source][1].value,
              message: '请输入审核备注',
              trigger: 'blur',
            },
          ]"
        >
          <div style="margin-bottom: 8px">备注:</div>
          <a-textarea
            v-model:value="auditFormData.remark"
            :rows="4"
            placeholder="请输入审核备注（驳回时必填）"
            allowClear
            style="width: 100%"
            :maxlength="255"
            show-count
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 再次提交弹窗 -->
    <a-modal
      :centered="true"
      v-model:open="submitOpen"
      title="批量商品再次提交:"
      @ok="handleSubmitOk"
      @cancel="handleCancel('submit')"
      :confirm-loading="submitLoading"
      okText="确认"
      cancelText="取消"
      :width="600"
    >
      <!-- 显示正在审核的商品信息 -->
      <div
        v-if="currentAuditingProducts.length > 0"
        class="auditing-products-info"
      >
        <div class="auditing-products-title">提交商品:</div>
        <div class="auditing-products-list">
          <div
            v-for="(product, index) in currentAuditingProducts"
            :key="index"
            class="auditing-product-item"
          >
            产品名称:{{ product.commodityName }}
          </div>
        </div>
      </div>

      <a-form :model="submitFormData" ref="submitFormRef">
        <a-form-item name="remark">
          <div style="margin-bottom: 8px">备注:</div>
          <a-textarea
            v-model:value="submitFormData.remark"
            :rows="4"
            placeholder="请输入备注"
            allowClear
            style="width: 100%"
            :maxlength="255"
            show-count
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup name="initialReviewPublication">
import {
  commodityList,
  firstAudit,
  lastAudit,
  rejectAudit,
} from "~@/pages/product-review/config/api/product-review";
import commodityTypeList from "@/utils/commodityType";
import { ref, reactive, onMounted, computed, watch } from "vue";
import tableHeaderInitial from "~@/pages/product-review/config/table-config/initialReviewPublication";
import tableHeaderPublicationRejected from "~@/pages/product-review/config/table-config/publicationRejected";
import tableHeaderPending from "~@/pages/product-review/config/table-config/pendingFinalReview";
import { getClassList } from "@/components/classificationTree/api.js";
import { DownOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import ProductReviewTable from "./comm/table.vue";
import { getAccountUser } from "~@/pages/product-review/config/api/product-review";
import { meansKeepGrains,MarketDirection } from "@/utils/productReview";
const router = useRouter();

const props = defineProps({
  Source: {
    type: String,
    default: "initialReviewPublication",
  },
});
// 组件引用
const productReviewTableRef = ref(null);
const meansKeepGrainOptions = ref(meansKeepGrains);
// 搜索表单相关
const formRef = ref(null);
// 定义表单初始状态常量，便于重置
const INITIAL_FORM_DATA = {
  sku: "", // 产品sku名称
  classify: "", //分类
  meansKeepGrain: "", //仓储类别
  devAttributableMarket: [], // 市场方向
  createTimeList: [], // 创建时间范围
  selectUserId: [], //提交人
  selectAll: [], //是否选中所有用户
  tradeName: "", //商品标题
  auditStatus:
    props.Source === "initialReviewPublication"
      ? 10
      : props.Source === "publicationRejected"
        ? 20
        : 50, // 审核状态：10 待初审，20 待编辑，30 申请重拍，40 资料员审核，50 待终审，60 终审完成，70 运营驳回 (例初审列表查询传10, 驳回列表查询传70,终审列表查询传50)
};
const formData = reactive({ ...INITIAL_FORM_DATA });

// 表格相关
const tableLoading = ref(false);
const selectedCount = ref(0);
const exportLoading = ref(false);
const columns = computed(() => {
  console.log(props.Source);
  if (props.Source === "initialReviewPublication") {
    return tableHeaderInitial;
  }
  if (props.Source === "publicationRejected") {
    return tableHeaderPublicationRejected;
  }
  return tableHeaderPending;
});

// 审核提交权限字符串
const permissionSource = computed(() => {
  if (props.Source === "initialReviewPublication") {
    console.log("platform:ozon:intelligent:first:audit");
    return ["platform:ozon:intelligent:first:audit"];
  }
  // if (props.Source === "publicationRejected") {
  //   console.log("platform:ozon:intelligent:reject:audit");
  //   return ["platform:ozon:intelligent:reject:audit"];
  // }
  if (props.Source === "pendingFinalReview") {
    console.log("platform:ozon:intelligent:last:audit");
    return ["platform:ozon:intelligent:last:audit"];
  }


});

// 查询权限字符串
const permissionList = computed(() => {
  if (props.Source === "initialReviewPublication") {
    return ["platform:ozon:intelligent:list"];
  }
  if (props.Source === "publicationRejected") {
    return ["platform:ozon:intelligent:list"];
  }
  if (props.Source === "pendingFinalReview") {
    return ["platform:ozon:intelligent:list"];
  }
});

// 审核接口映射
const APIEDIT = {
  initialReviewPublication: firstAudit,
  publicationRejected: rejectAudit,
  pendingFinalReview: lastAudit,
};
// 详情页面路由映射
const detailPagePath = {
  initialReviewPublication: "/platform/product-review/preliminary-review-detail",// 初审详情
  publicationRejected: "/platform/product-review/reject-review-detail",// 驳回详情
  pendingFinalReview: "/platform/product-review/pending-final-review-detail",//终审详情
};

// 再次提交
const submitOpen = ref(false);
const submitLoading = ref(false);
const submitFormRef = ref(null);
const submitFormData = reactive({
  auditStatus: 10, //提交固定20
  commodityId: "", //commodityId
  remark: "", //remark
});

const stateOptions = ref({
 // 初审
 initialReviewPublication: [
    {
      label: "审核通过",
      value: 20,
    },
    {
      label: "审核驳回",
      value: 70,
    },
  ],
  // 终审
  pendingFinalReview: [
    {
      label: "审核通过",
      value: 60,
    },
     {
      label: "审核驳回",
      value: 20,
    },
  ],
})
// 审核相关
const auditOpen = ref(false);
const auditLoading = ref(false);
const auditFormRef = ref(null);
const auditFormData = reactive({
  auditStatus: 20, //10 驳回，20 通过
  commodityId: "", //commodityId
  remark: "", //remark
});
const currentAuditingProducts = ref([]);
const isSingleAudit = ref(false);
const labelCol = ref({
  style: {
    width: "100px",
  },
});
const wrapperCol = ref({
  style: {
    width: "305px",
  },
});

/**
 * 日期选择预设
 */
const datePresets = computed(() => [
  {
    label: "最近一周",
    value: [dayjs().subtract(6, "days"), dayjs()],
  },
  {
    label: "最近一月",
    value: [dayjs().subtract(29, "days"), dayjs()],
  },
  {
    label: "最近三月",
    value: [dayjs().subtract(89, "days"), dayjs()],
  },
]);

/**
 * 用户选择
 */
const userLabels = ref({
  label: "userName",
  value: "userId",
});
const getAccountUserArr = ref([]);
const getAccountUserList = async () => {
  try {
    // 发起请求获取用户列表
    const res = await getAccountUser();
    // 检查响应是否存在且包含 data 属性，并且 data 是数组
    if (res && res.data && Array.isArray(res.data)) {
      // 更新用户列表
      getAccountUserArr.value = res.data;
      if (res.data.length > 0 && res.data[0].hasOwnProperty("userId")) {
        // 初始化默认选中所有用户
        formData.selectAll = res.data.map((item) => item.userId);
        formData.selectUserId = formData.selectAll;
      }
    }
  } catch (error) {
    console.error("获取用户列表失败:", error);
  }

  // 调用表格获取列表方法
  await productReviewTableRef?.value?.getList();
};

/**
 * 过滤用户选项
 */
const filterOption = (input, option) => {
  return option.userName.indexOf(input) >= 0;
};

/**
 * 清除分类选择
 */
const clearCategorySelection = () => {
  formData.classify = "";
  formData.nodeName = "";
};

/**
 * 清除表格选择
 */
const clearSelection = () => {
  if (productReviewTableRef.value) {
    productReviewTableRef.value.clearSelection();
  }
};

/**
 * 处理批量审核操作
 */
const handleAudit = (type) => {
  if (productReviewTableRef.value) {
    currentAuditingProducts.value =
      productReviewTableRef.value.getCurrentSelectedProducts();
    if (currentAuditingProducts.value.length === 0) {
      message.warning("请选择要审核的商品");
      return;
    }
    handleProductAudit(currentAuditingProducts.value, type);
  }
};

/**
 * 处理产品审核（从组件触发）
 */
const handleProductAudit = (products, type) => {
  currentAuditingProducts.value = products;
  selectedCount.value = products.length;
  resetAuditForm();
  // let isfirstAuditResulted = products.some(
  //   (product) => product.firstAuditResult === 1
  // );
  // if (isfirstAuditResulted) {
  //   message.warning("存在已初审商品，不能通过审核");
  //   return;
  // }
  if (type === "audit") {
    auditOpen.value = true;
  } else {
    submitOpen.value = true;
  }
};

/**
 * 处理表格行选择变化
 */
const handleSelectionChange = (selectedRows) => {
  selectedCount.value = selectedRows.length;
  currentAuditingProducts.value = selectedRows;
  console.log("currentAuditingProducts", currentAuditingProducts.value);
};

/**
 * 重置审核表单
 */
const resetAuditForm = () => {
  if (auditFormRef.value) {
    auditFormRef.value.resetFields();
  }
  auditFormData.auditStatus = 20;
  auditFormData.commodityId = "";
  auditFormData.remark = "";
};

/**
 * 重置提交表单
 */
const resetSubmitForm = () => {
  if (submitFormRef.value) {
    submitFormRef.value.resetFields();
  }
  submitFormData.commodityId = "";
  submitFormData.remark = "";
};

/**
 * 取消提交
 */
const handleCancel = () => {
  resetSubmitForm();
  resetAuditForm();
  submitOpen.value = false;
  auditOpen.value = false;
  currentAuditingProducts.value = [];
  selectedCount.value = 0;
  clearSelection();
};

/**
 * 处理审核确认
 */
const handleOk = () => {
  auditFormRef.value
    .validate()
    .then(() => {
            // 确保currentAuditingProducts.value存在
      const products = currentAuditingProducts.value || [];
      if (products.length === 0) {
        message.warning("请选择要审核的商品");
        return;
      }
      auditLoading.value = true;
      // 根据不同的来源准备参数
      let auditPromise;
      // 提取公共参数
      let commonParams;

      console.log("props.Source", props.Source);
      if(props.Source === "initialReviewPublication"){
        commonParams = {
          id: products.length > 0 ? products.map(({ id }) => id).join(',') : '',
          auditStatus: auditFormData.auditStatus,
          remark: auditFormData.remark,
        };
      } else {
        // 循环 将每个商品的参数添加到 commonParams 数组中
        commonParams = products.map(({ id, auditStatus, remark }) => ({
          id,
          auditStatus: auditFormData.auditStatus,
          remark: auditFormData.remark,
          commodityId: id,
        }));
      }

      // 根据来源选择不同的审核接口
      auditPromise = APIEDIT[props.Source](commonParams);
      auditPromise
        .then((result) => {
          // 实际根据后端接口返回格式调整判断逻辑
          if (result?.code === 200) {
            message.success(
              `成功审核 ${currentAuditingProducts.value.length} 个商品`
            );
            if (productReviewTableRef.value) {
              productReviewTableRef.value.getList();
            }
            resetAuditForm();
            currentAuditingProducts.value = [];
            selectedCount.value = 0;
          } else {
            message.error("审核失败，请重试");
            console.error("审核失败:", result?.message || "未知错误");
          }
          auditLoading.value = false;
           auditOpen.value = false;
        })
        .catch((error) => {
          auditLoading.value = false;
          auditOpen.value = false;
          message.error("审核失败，请重试");
          console.error("审核失败:", error);
        })
    })
    .catch((error) => {
      console.error("表单验证失败:", error);
    });
};

/**
 * 处理提交确认
 */
const handleSubmitOk = () => {
  if (currentAuditingProducts.value.length === 0) {
    message.warning("请选择要提交的商品");
    return;
  }

  submitLoading.value = true;
  // 根据不同的来源准备参数
  let submitPromise;
  // 提取公共参数
  const commonParams = {
    id: currentAuditingProducts.value
      .map((product) => product.id)
      ?.join(","),
    auditStatus: submitFormData.auditStatus,
    remark: submitFormData.remark,
  };
  // 根据来源选择不同的提交接口
  submitPromise = APIEDIT[props.Source](commonParams);
  submitPromise
    .then((result) => {
      // 实际根据后端接口返回格式调整判断逻辑
      if (result?.code === 200) {
        message.success(
          `成功提交 ${currentAuditingProducts.value.length} 个商品`
        );
        if (productReviewTableRef.value) {
          productReviewTableRef.value.getList();
        }
        resetSubmitForm();
        currentAuditingProducts.value = [];
        selectedCount.value = 0;
      } else {
        message.error("提交失败，请重试");
        console.error("提交失败:", result?.message || "未知错误");
      }
      submitLoading.value = false;
      submitOpen.value = false;
    })
    .catch((error) => {
      submitLoading.value = false;
      submitOpen.value = false;
      message.error("提交失败，请重试");
      console.error("提交失败:", error);
    })
    
};

/**
 * 处理查看操作
 */
const handleSee = () => {
  handleEditProduct(currentAuditingProducts?.value[0]);
};

/**
 * 处理编辑查看单据操作
 */
const handleEditProduct = (product) => {
  console.log(product);
  const urlData = router.resolve({
    path: detailPagePath[props.Source],
    query: {
      id: product.id,
      commodityId: product.commodityId,
    },
  });
  window.open(urlData.href, "_blank");
};



/**
 * 导出数据
 */
const exportData = async () => {
  if (productReviewTableRef.value) {
    productReviewTableRef.value.exportData();
  }
};

/**
 * 提交搜索表单
 */
const searchList = () => {
  if (productReviewTableRef.value) {
    productReviewTableRef.value.getList();
  }
};

/**
 * 重置搜索表单
 */
const resetForm = () => {
  // 使用初始状态常量重置表单，更简洁且易于维护
  Object.keys(INITIAL_FORM_DATA).forEach((key) => {
    if(key !== "selectAll"){
      formData[key] = JSON.parse(JSON.stringify(INITIAL_FORM_DATA[key]));
    }
  });

  // 重置分类相关状态
  clearCategorySelection();
  if (productReviewTableRef.value) {
    productReviewTableRef.value.getList();
  }
};

/**
 * 处理表格加载状态变化
 */
const handleLoadingChange = (loading) => {
  tableLoading.value = loading;
};


/**
 * 初始化
 */
onMounted(() => {
  getAccountUserList();
});

/**
 * 监听审核后的跨窗口通信
 */
window.addEventListener('message', receiveMessage)

onBeforeUnmount(() => {
  window.removeEventListener('message', receiveMessage)
})

function receiveMessage(event) {
  if (event.origin === window.location.origin && event.data === 'refresh') {
    productReviewTableRef.value.getList();
  }
}
</script>

<style scoped lang="less">
@import "@/assets/styles/com-list.less";
</style>
