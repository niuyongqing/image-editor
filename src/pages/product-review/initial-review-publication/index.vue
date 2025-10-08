<template>
  <div id="configAccountCont">
    <!-- 面包屑导航 -->
    <a-breadcrumb style="margin-bottom: 16px;">
      <a-breadcrumb-item>首页</a-breadcrumb-item>
      <a-breadcrumb-item>产品编审</a-breadcrumb-item>
      <a-breadcrumb-item v-if="props.Source === 'initialReviewPublication'">刊登初审</a-breadcrumb-item>
      <a-breadcrumb-item v-if="props.Source === 'pendingFinalReview'">刊登终审</a-breadcrumb-item>
      <a-breadcrumb-item v-if="props.Source === 'publicationRejected'">刊登驳回</a-breadcrumb-item>

    </a-breadcrumb>

    <!-- 搜索筛选区域 -->
    <a-card style="margin-top: 8px;">
      <a-form :model="formData" layout="inline" ref="formRef" class="search-form" :wrapper-col="wrapperCol"
        :label-col="labelCol">
        <a-form-item label="模糊查询:">
          <a-space size="middle">
            <a-input v-model:value="formData.tradeName" placeholder="请输入产品名称" allowClear />
            <a-input v-model:value="formData.sku" placeholder="请输入产品sku名称" allowClear />
          </a-space>
        </a-form-item>

        <a-form-item label="分类:">
          <a-cascader placeholder="请选择分类" allowClear v-model:value="formData.classify" :options="commodityTypeList"
            :allow-clear="true" :field-names="{ label: 'label', value: 'value', children: 'children' }" />
        </a-form-item>
        <a-form-item label="提交人:">
          <a-select v-model:value="formData.selectUserName" allow-clear show-search placeholder="请选择提交人"
            :options="getAccountUserArr" mode="multiple" :maxTagCount="2" :filter-option="filterOption"
            :fieldNames="userLabels"></a-select>
        </a-form-item>
        <a-form-item label="市场方向:">
          <a-select v-model:value="formData.devAttributableMarket" :options="devAttributableMarketRevertSelect"
            mode="multiple" :maxTagCount="2" placeholder="请选择市场方向" allowClear />
        </a-form-item>
        <a-form-item label="创建时间:">
          <a-range-picker v-model:value="formData.createTimeList" format="YYYY-MM-DD HH:mm:ss" allow-clear
            :presets="datePresets" />
        </a-form-item>

        <a-form-item class="form-actions">
          <a-button type="primary" @click="searchList" :loading="tableLoading">查询</a-button>
          <a-button style="margin-left: 10px" @click="resetForm" :loading="tableLoading">重置</a-button>
          <!-- <a-button style="margin-left: 10px" @click="exportData" :loading="exportLoading">导出</a-button> -->
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 数据展示区域 -->
    <a-card style="margin-top: 20px;">
      <div class="table-header-actions">
        <a-button v-if="props.Source !== 'publicationRejected'" @click="handleAudit" type="primary"
          :disabled="selectedCount === 0 || tableLoading" tooltip="批量审核选中的商品">
          审核
        </a-button>
        <template v-else>
          <a-button style="margin-left: 16px;" @click="handleSee" type="primary"
            :disabled="selectedCount === 0 || tableLoading" tooltip="批量审核选中的商品">
            查看
          </a-button>
          <a-button style="margin-left: 16px;" @click="handleSub" type="primary"
            :disabled="selectedCount === 0 || tableLoading" tooltip="批量审核选中的商品">
            再次提交
          </a-button>
        </template>

        <span style="margin-left: 16px; color: #666;">
          已选择 {{ selectedCount }} 项
        </span>

        <a-button type="default" style="margin-left: 16px;" @click="clearSelection" :disabled="selectedCount === 0">
          清空选择
        </a-button>
      </div>

      <div class="table-container" style="margin-top: 20px;">
        <!-- 使用封装的表格组件 -->
        <ProductReviewTable ref="productReviewTableRef" :columns="columns" :api="commodityList" :searchParams="formData"
          :exportApi="exportProductList" @audit="handleProductAudit" @reset="resetForm"
          @loading-change="handleLoadingChange" @export-loading-change="handleExportLoadingChange" :devAttributableMarketRevertSelect="devAttributableMarketRevertSelect"
          @selection-change="handleSelectionChange" :meansKeepGrainOptions="meansKeepGrainOptions" />
      </div>
    </a-card>
    <!-- 审核弹窗 -->
    <a-modal :centered="true" v-model:open="auditOpen" :title="auditModalTitle" @ok="handleOk" @cancel="handleCancel"
      :confirm-loading="auditLoading" okText="确认" cancelText="取消" :width="600">
      <!-- 显示正在审核的商品信息 -->
      <div v-if="currentAuditingProducts.length > 0" class="auditing-products-info">
        <div class="auditing-products-title">审核商品：</div>
        <div class="auditing-products-list">
          <div v-for="(product, index) in currentAuditingProducts" :key="index" class="auditing-product-item">
            产品名称：{{ product.commodityName }}
          </div>
        </div>
      </div>

      <a-form :model="auditFormData" ref="auditFormRef">
        <a-form-item name="state">
          <a-radio-group v-model:value="auditFormData.state">
            <a-radio :value="1" style="margin-right: 16px;">审核通过</a-radio>
            <a-radio :value="0">审核驳回</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item name="remark" :rules="[{
          required: auditFormData.state === 0,
          message: '请输入审核备注',
          trigger: 'blur'
        }]">
          <div style="margin-bottom: 8px;">备注:</div>
          <a-textarea v-model:value="auditFormData.remark" :rows="4" placeholder="请输入审核备注（驳回时必填）" allowClear
            style="width: 100%;" :max-length="500" show-count />
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
  exportProductList
} from "@/pages/product-review/config/api/product-review";
import commodityTypeList from "@/utils/commodityType";
import { ref, reactive, onMounted, computed, watch } from "vue";
import tableHeaderInitial from "~@/pages/ozon/config/tabColumns/initialReviewPublication";
import tableHeaderPublicationRejected from "~@/pages/ozon/config/tabColumns/publicationRejected";
import tableHeaderPending from "~@/pages/ozon/config/tabColumns/pendingFinalReview";
import { getClassList } from '@/components/classificationTree/api.js';
import { DownOutlined } from '@ant-design/icons-vue';
import devAttributableMarketRevertSelect from "@/utils/devAttributableMarketRevertSelect";
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import ProductReviewTable from './comm/table.vue';
import { getAccountUser } from "@/pages/ozon/config/api/accountConfig";
import { meansKeepGrains } from '@/utils/devStatusSelect'

const props = defineProps({
  Source: {
    type: String,
    default: 'initialReviewPublication'
  }
});
// 组件引用
const productReviewTableRef = ref(null);
const meansKeepGrainOptions = ref(meansKeepGrains);
// 搜索表单相关
const formRef = ref(null);
// 定义表单初始状态常量，便于重置
const INITIAL_FORM_DATA = {
  sku: "",   // 产品sku名称
  classify: "",  //分类
  meansKeepGrain: "",  //仓储类别
  devAttributableMarket: [], // 市场方向
  createTimeList: [],     // 创建时间范围
  selectUserName: [],    //提交人
  tradeName: "",          //商品标题
  state: props.Source === 'initialReviewPublication' ? 10 : (props.Source === 'publicationRejected' ? 70 : 50), // 审核状态：10 待初审，20 待编辑，30 申请重拍，40 资料员审核，50 待终审，60 终审完成，70 运营驳回 (例初审列表查询传10, 驳回列表查询传70,终审列表查询传50)
};
const formData = reactive({ ...INITIAL_FORM_DATA });

// 表格相关
const tableLoading = ref(false);
const selectedCount = ref(0);
const exportLoading = ref(false);
const columns = computed(() => {
  console.log(props.Source);
  if (props.Source === 'initialReviewPublication') {
    return tableHeaderInitial;
  }
  if (props.Source === 'publicationRejected') {
    return tableHeaderPublicationRejected;
  }
  return tableHeaderPending;
});


// 审核相关
const auditOpen = ref(false);
const auditLoading = ref(false);
const auditFormRef = ref(null);
const auditFormData = reactive({
  state: 0,  //0 未通过，1 通过
  commodityId: "",   //commodityId
  remark: ""         //remark
});
const currentAuditingProducts = ref([]);
const isSingleAudit = ref(false);
const labelCol = ref({
  style: {
    width: '100px'
  }
});
const wrapperCol = ref({
  style: {
    width: '305px'
  }
});

/**
 * 日期选择预设
 */
const datePresets = computed(() => [
  {
    label: '最近一周',
    value: [dayjs().subtract(6, 'days'), dayjs()]
  },
  {
    label: '最近一月',
    value: [dayjs().subtract(29, 'days'), dayjs()]
  },
  {
    label: '最近三月',
    value: [dayjs().subtract(89, 'days'), dayjs()]
  }
]);

/**
 * 用户选择
 */
const userLabels = ref({
  label: "userName",
  value: "userName",
});
const getAccountUserArr = ref([]);
const getAccountUserList = () => {
  getAccountUser({ userName: "" }).then((res) => {
    getAccountUserArr.value = res.data;
  });
};

/**
 * 过滤用户选项
 */
const filterOption = (input, option) => {
  return option.userName.indexOf(input) >= 0;
};

/**
 * 审核弹窗标题
 */
const auditModalTitle = computed(() => {
  if (isSingleAudit.value) {
    return '商品审核';
  }
  return `批量审核 (${currentAuditingProducts.value.length} 项)`;
});

/**
 * 清除分类选择
 */
const clearCategorySelection = () => {
  formData.classify = '';
  formData.nodeName = '';
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
const handleAudit = () => {
  if (productReviewTableRef.value) {
    productReviewTableRef.value.handleAudit();
  }
};

/**
 * 处理产品审核（从组件触发）
 */
const handleProductAudit = (products, singleAudit) => {
  isSingleAudit.value = singleAudit;
  currentAuditingProducts.value = products;
  selectedCount.value = products.length;
  resetAuditForm();
    let isfirstAuditResulted = products.some(product => product.firstAuditResult === 1);
    if (isfirstAuditResulted) {
      message.warning('存在已初审商品，不能通过审核');
      return;
    }
  auditOpen.value = true;
};

/**
 * 处理表格行选择变化
 */
const handleSelectionChange = (selectedRows) => {
  selectedCount.value = selectedRows.length;
  currentAuditingProducts.value = selectedRows;
  console.log('currentAuditingProducts', currentAuditingProducts.value);
  
};

/**
 * 重置审核表单
 */
const resetAuditForm = () => {
  if (auditFormRef.value) {
    auditFormRef.value.resetFields();
  }
  auditFormData.state = 0;
  auditFormData.commodityId = '';
  auditFormData.remark = '';
};

/**
 * 取消审核
 */
const handleCancel = () => {
  resetAuditForm();
  auditOpen.value = false;
  currentAuditingProducts.value = [];
  selectedCount.value = 0;
  clearSelection();
};

/**
 * 提交审核
 */
const handleOk = () => {
  auditFormRef.value.validate().then(() => {
    if (currentAuditingProducts.value.length === 0) {
      message.warning('请选择要审核的商品');
      return;
    }
    
  
    auditLoading.value = true;
    // 根据不同的来源准备参数
    let auditPromise;
    // 提取公共参数
    const commonParams = {
      commodityId: currentAuditingProducts.value.map(product => product.commodityId)?.join(','),
      state: auditFormData.state,
      remark: auditFormData.remark
    };
    // 根据来源选择不同的审核接口
    auditPromise = props.Source === 'initialReviewPublication' ? firstAudit(commonParams) : lastAudit(commonParams);

    auditPromise
      .then(result => {
        // 实际根据后端接口返回格式调整判断逻辑
        if (result?.code === 200) {
          message.success(`成功审核 ${currentAuditingProducts.value.length} 个商品`);
          if (productReviewTableRef.value) {
            productReviewTableRef.value.getList();
          }
          resetAuditForm();
          auditOpen.value = false;
          currentAuditingProducts.value = [];
          selectedCount.value = 0;
        } else {
          message.error('审核失败，请重试');
          console.error('审核失败:', result?.message || '未知错误');
        }
      })
      .catch(error => {
        message.error('审核失败，请重试');
        console.error('审核失败:', error);
      })
      .finally(() => {
        auditLoading.value = false;
      });
  }).catch(error => {
    console.error('表单验证失败:', error);
  });
};

/**
 * 处理查看操作
 */
const handleSee = (record) => {
  window.open(`/product-review/initialReviewPublication/detail?tradeName=${record.tradeName}`);
};

/**
 * 处理再次提交操作
 */
const handleSub = (record) => {
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
  Object.keys(INITIAL_FORM_DATA).forEach(key => {
    formData[key] = JSON.parse(JSON.stringify(INITIAL_FORM_DATA[key]));
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
 * 处理导出加载状态变化
 */
const handleExportLoadingChange = (loading) => {
  exportLoading.value = loading;
};


/**
 * 初始化
 */
onMounted(() => {
  getAccountUserList();
});
</script>

<style scoped lang="less">
@import '@/assets/styles/com-list.less';
</style>