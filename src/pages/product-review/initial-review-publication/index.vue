<template>
  <div id="configAccountCont">
    <!-- 面包屑导航 -->
    <a-breadcrumb style="margin-bottom: 16px;">
      <a-breadcrumb-item>首页</a-breadcrumb-item>
      <a-breadcrumb-item>产品编审</a-breadcrumb-item>
      <a-breadcrumb-item>刊登初审</a-breadcrumb-item>
    </a-breadcrumb>

    <!-- 搜索筛选区域 -->
    <a-card style="margin-top: 8px;">
      <a-form :model="formData" layout="inline" ref="formRef" class="search-form" :wrapper-col="wrapperCol"
        :label-col="labelCol">
        <a-form-item label="模糊查询:">
          <a-space size="middle">
            <a-input v-model:value="formData.productOrderNo" placeholder="请输入产品订单号" allowClear />
            <a-input v-model:value="formData.productName" placeholder="请输入产品名称" allowClear />
          </a-space>
        </a-form-item>

        <a-form-item label="分类:">
          <div class="category-selector-wrapper">
            <a-dropdown trigger="click" v-model:open="openDropdown" :autoAdjustOverflow="true">
              <a-button
                style="width: 250px; height: 24px; display: flex; align-items: center; justify-content: space-between;"
                @click="openDropdown = true">
                <div v-if="formData.nodeName"
                  style="width: 210px; text-align: left;  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  {{ formData.nodeName }}
                </div>
                <div v-else
                  style="width: 210px; text-align: left; color: rgba(0, 0, 0, 0.3); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  {{ '请选择分类' }}
                </div>
                <DownOutlined />
              </a-button>
              <template #overlay>
                <a-menu style="width: 300px; max-height: 400px; overflow-y: auto;">
                  <typeTree v-model:current-class="formData.currentClass" v-model:node-path="formData.nodePath"
                    :classifyTreeData="treeData" ref="typeTreeRef" :defaultClass="false" platform="ozon" />
                </a-menu>
              </template>
            </a-dropdown>
            <a-button type="link" @click="showCategoryModal">+ 管理分类</a-button>
            <a-button v-if="formData.nodeName" type="link" danger @click="clearCategorySelection"
              style="margin-left: -10px;">清除</a-button>
          </div>
        </a-form-item>
        <a-form-item label="用户:">
          <a-select v-model:value="formData.userId" allow-clear show-search placeholder="请选择用户"
            :options="getAccountUserArr" mode="multiple" :maxTagCount="2" :filter-option="filterOption"
            :fieldNames="userLabels"></a-select>
        </a-form-item>
        <a-form-item label="市场方向:">
          <a-select v-model:value="formData.devAttributableMarket" :options="devAttributableMarketRevertSelect"
            mode="multiple" :maxTagCount="2" placeholder="请输入市场方向" allowClear />
        </a-form-item>
        <a-form-item label="创建时间:">
          <a-range-picker v-model:value="formData.createTime" allow-clear :presets="datePresets" />
        </a-form-item>

        <a-form-item class="form-actions">
          <a-button type="primary" @click="onSubmit" :loading="tableLoading">查询</a-button>
          <a-button style="margin-left: 10px" @click="resetForm" :loading="tableLoading">重置</a-button>
          <!-- <a-button style="margin-left: 10px" @click="exportData" :loading="exportLoading">导出</a-button> -->
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 数据展示区域 -->
    <a-card style="margin-top: 20px;">
      <div class="table-header-actions">
        <a-button @click="handleAudit" type="primary" :disabled="selectedCount === 0 || tableLoading"
          tooltip="批量审核选中的商品">
          审核
        </a-button>
        <span style="margin-left: 16px; color: #666;">
          已选择 {{ selectedCount }} 项
        </span>

        <a-button type="default" style="margin-left: 16px;" @click="clearSelection" :disabled="selectedCount === 0">
          清空选择
        </a-button>
      </div>

      <div class="table-container" style="margin-top: 20px;">
        <!-- 使用封装的表格组件 -->
        <ProductReviewTable ref="productReviewTableRef" :columns="columns" :api="setAccountlist"
          :searchParams="formData" :currentClass="formData.currentClass" :nodePath="formData.nodePath"
          :exportApi="exportProductList" @audit="handleProductAudit" @reset="resetForm"
          @loading-change="handleLoadingChange" @export-loading-change="handleExportLoadingChange" />
      </div>
    </a-card>

    <!-- 分类管理弹窗 -->
    <typeManage v-model:modal-open="typeManageOpen" platform="ozon" @updateTree="updateTree" />

    <!-- 审核弹窗 -->
    <a-modal :centered="true" v-model:open="auditOpen" :title="auditModalTitle" @ok="handleOk" @cancel="handleCancel"
      :confirm-loading="auditLoading" okText="确认" cancelText="取消" :width="600">
      <!-- 显示正在审核的商品信息 -->
      <div v-if="currentAuditingProducts.length > 0" class="auditing-products-info">
        <div class="auditing-products-title">审核商品：</div>
        <div class="auditing-products-list">
          <div v-for="(product, index) in currentAuditingProducts" :key="index" class="auditing-product-item">
            {{ product.productName }}（订单号：{{ product.productOrderNo }}）
          </div>
        </div>
      </div>

      <a-form :model="auditFormData" ref="auditFormRef">
        <a-form-item name="auditStatus">
          <a-radio-group v-model:value="auditFormData.auditStatus">
            <a-radio value="1" style="margin-right: 16px;">审核通过</a-radio>
            <a-radio value="2">审核驳回</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item name="auditRemark" :rules="[{
          required: auditFormData.auditStatus === '2',
          message: '请输入审核备注',
          trigger: 'blur'
        }]">
          <div style="margin-bottom: 8px;">备注:</div>
          <a-textarea v-model:value="auditFormData.auditRemark" :rows="4" placeholder="请输入审核备注（驳回时必填）" allowClear
            style="width: 100%;" :max-length="500" show-count />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup name="initialReviewPublication">
import {
  setAccountlist,
  ozonAccount,
  exportProductList
} from "@/pages/ozon/config/api/initialReviewPublication";
import typeManage from '@/components/classificationTree/typeManage.vue';
import { ref, reactive, onMounted, computed, watch } from "vue";
import tableHeaderInitial from "~@/pages/ozon/config/tabColumns/initialReviewPublication";
import tableHeaderPending from "~@/pages/ozon/config/tabColumns/pendingFinalReview";
import { getClassList } from '@/components/classificationTree/api.js';
import { DownOutlined } from '@ant-design/icons-vue';
import devAttributableMarketRevertSelect from "@/utils/devAttributableMarketRevertSelect";
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import ProductReviewTable from './comm/table.vue';
import { getAccountUser } from "@/pages/ozon/config/api/accountConfig";

const props = defineProps({
  Source: {
    type: String,
    default: 'initial-review-publication'
  }
});
// 组件引用
const productReviewTableRef = ref(null);

// 搜索表单相关
const formRef = ref(null);
const formData = reactive({
  productOrderNo: "", // 产品订单号
  productName: "",   // 产品名称
  devAttributableMarket: [], // 市场方向
  createTime: [],     // 创建时间范围
  currentClass: '',   // 当前分类
  nodePath: '',       // 选中的分类路径
  nodeName: ''        // 选中的分类名称
});

// 表格相关
const tableLoading = ref(false);
const selectedCount = ref(0);
const exportLoading = ref(false);
const columns = computed(() => {
  console.log(props.Source);
  if (props.Source === 'initial-review-publication') {
    return tableHeaderInitial;
  }
  return tableHeaderPending;
});

// 分类相关
const typeManageOpen = ref(false);
const treeData = ref([]);
const openDropdown = ref(false);
const typeTreeRef = ref(null);

// 审核相关
const auditOpen = ref(false);
const auditLoading = ref(false);
const auditFormRef = ref(null);
const auditFormData = reactive({
  auditStatus: '1', // 默认为审核通过
  auditRemark: ''
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
  value: "userId",
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
 * 监听nodePath变化，更新节点名称
 */
watch(() => formData.nodePath, (newNodePath, oldNodePath) => {
  if (newNodePath && newNodePath !== oldNodePath) {
    const nodePaths = newNodePath.split(' > ');
    formData.nodeName = nodePaths[nodePaths.length - 1];
    // 选择分类后保持下拉菜单打开
    openDropdown.value = false;
  }
});

/**
 * 清除分类选择
 */
const clearCategorySelection = () => {
  formData.currentClass = '';
  formData.nodeName = '';
  formData.nodePath = '';
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
  auditOpen.value = true;
};

/**
 * 重置审核表单
 */
const resetAuditForm = () => {
  if (auditFormRef.value) {
    auditFormRef.value.resetFields();
  }
  auditFormData.auditStatus = '1';
  auditFormData.auditRemark = '';
};

/**
 * 取消审核
 */
const handleCancel = () => {
  resetAuditForm();
  auditOpen.value = false;
  currentAuditingProducts.value = [];
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

    // 处理多个商品的审核逻辑
    const auditPromises = currentAuditingProducts.value.map(product => {
      return ozonAccount({
        productOrderNo: product.productOrderNo,
        auditStatus: auditFormData.auditStatus,
        auditRemark: auditFormData.auditRemark
      });
    });

    Promise.all(auditPromises)
      .then(results => {
        // 检查是否所有审核都成功
        const allSuccess = results.every(res => !!res);

        if (allSuccess) {
          message.success(`成功审核 ${currentAuditingProducts.value.length} 个商品`);
          if (productReviewTableRef.value) {
            productReviewTableRef.value.getList();
          }
          resetAuditForm();
          auditOpen.value = false;
          currentAuditingProducts.value = [];
          selectedCount.value = 0;
        } else {
          message.error('部分商品审核失败，请重试');
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
 * 更新分类树数据
 */
const updateTree = async () => {
  await getTreeData();
};

/**
 * 打开分类管理弹窗
 */
const showCategoryModal = () => {
  typeManageOpen.value = true;
};

/**
 * 在树结构中根据ID查找节点
 * @param {string} id - 节点ID
 * @param {Array} tree - 树数据
 * @returns {Object|null} 找到的节点或null
 */
const findItemById = (id, tree) => {
  for (let item of tree) {
    if (item.id === id) {
      return item;
    }
    if (item.childList && item.childList.length > 0) {
      const found = findItemById(id, item.childList);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

/**
 * 获取分类树数据
 */
const getTreeData = async () => {
  try {
    const params = {
      platform: 'ozon',
      parentId: '0'
    };
    const res = await getClassList(params);
    const dataRes = res.data || [];
    treeData.value = dataRes;

    // 如果有当前选中的分类ID，则查找并更新节点名称
    if (formData.currentClass) {
      const item = findItemById(formData.currentClass, treeData.value);
      formData.nodeName = item?.name || '';
    }
  } catch (error) {
    console.error('获取分类树数据失败:', error);
    message.error('获取分类树数据失败');
  }
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
const onSubmit = () => {
  if (productReviewTableRef.value) {
    productReviewTableRef.value.getList();
  }
};

/**
 * 重置搜索表单
 */
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
    // 确保表单数据也被重置
    formData.productOrderNo = "";
    formData.productName = "";
    formData.devAttributableMarket = [];
    formData.createTime = [];
  }
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
  getTreeData();
  getAccountUserList();
});
</script>

<style scoped lang="less">
@import '@/assets/styles/com-list.less';
</style>