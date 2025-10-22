<template>
  <div id="configAccountCont">
    <!-- 搜索筛选区域 -->
    <a-card>
      <a-form :model="formData" layout="inline" ref="formRef" class="search-form" :wrapper-col="wrapperCol"
        :label-col="labelCol">
        <!-- 店铺账号 -->
        <a-form-item label="店铺账号:" :wrapper-col="wrapperColItem">
          <a-radio-group v-model:value="formData.storeAccount" name="storeAccount">
            <a-radio :value="item.value" v-for="item in storeAccountOptions" :key="item.value">{{ item.label
              }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <!-- 状态 -->
        <a-form-item label="状态:">
          <a-radio-group v-model:value="formData.status" name="status">
            <a-radio :value="item.value" v-for="item in statusOptions" :key="item.value">{{ item.label }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <!-- 模板查询 -->
        <a-form-item label="模糊查询:">
          <a-space size="middle">
            <a-input v-model:value="formData.temName" placeholder="请输入模板名称" allowClear />
            <a-input v-model:value="formData.createUser" placeholder="请输入创建人" allowClear />
          </a-space>
        </a-form-item>
        <a-form-item class="form-actions">
          <a-button type="primary" @click="getList" :disabled="loading">查询</a-button>
          <a-button style="margin-left: 10px" @click="resetForm" :disabled="loading">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <!-- 数据展示区域 -->
    <a-card style="margin-top: 0.75rem">
      <div class="table-header-actions">
        <a-button  @click="handleEdit('add', {})" type="primary" tooltip="新增">
          新增
        </a-button>
        <a-button :disabled="selectedCount !== 1 || loading" @click="handleSetDefault" type="primary" tooltip="设为默认">
          设为默认
        </a-button>
        <a-button :disabled="selectedCount !== 1 || loading" @click="handleCopy" type="primary" tooltip="复制">
          复制
        </a-button>
        <a-button :disabled="selectedCount !== 1 || loading" @click="handleEdit('edit', currentSelectRow.value[0])"
          type="primary" tooltip="编辑选中的商品">
          编辑
        </a-button>
        <a-button @click="submitOpen = true" type="primary" :disabled="selectedCount === 0 || loading" tooltip="添加备注">
          添加备注
        </a-button>
        <span style="margin-left: 16px; color: #666">
          已选择 {{ selectedCount }} 项
        </span>

        <a-button type="default" @click="clearSelection" :disabled="selectedCount === 0">
          清空选择
        </a-button>
      </div>

      <div class="table-container" style="margin-top: 20px">
        <!-- 使用封装的表格组件 -->
        <uTable ref="uTableRef" :columns="columns" :loading="loading" @reset="resetForm"
          @row-dblclick="(record) => handleEdit('doubleClick', record)" @loading-change="handleLoadingChange"
          @selection-change="handleSelectionChange" @page-change="handlePageChange"
          @page-size-change="handlePageSizeChange" />
      </div>
    </a-card>

    <!-- 添加备注弹窗 -->
    <a-modal :centered="true" v-model:open="submitOpen" title="添加备注" @ok="handleSubmitOk"
      @cancel="handleCancel('submit')" :confirm-loading="submitLoading" okText="确认" cancelText="取消" :width="600">
      <!-- 显示正在审核的商品信息 -->
      <div v-if="currentSelectRow.length > 0" class="auditing-products-info">
        <div class="auditing-products-title">产品:</div>
        <div class="auditing-products-list">
          <div v-for="(product, index) in currentSelectRow" :key="index" class="auditing-product-item">
            产品名称:{{ product.commodityName }}
          </div>
        </div>
      </div>

      <a-form :model="submitFormData" ref="submitFormRef">
        <a-form-item name="remark">
          <div style="margin-bottom: 8px">备注:</div>
          <a-textarea v-model:value="submitFormData.remark" :rows="4" placeholder="请输入备注" allowClear style="width: 100%"
            :max-length="500" show-count />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import uTable from "@/components/uTable/index.vue";
import tableColumns from "@/pages/product-review/config/table-config/storeTemplateTable.js";

// 添加缺失的变量定义
const submitFormRef = ref(null);
const submitFormData = ref({
  remark: '',
  auditStatus: ''
});
const router = useRouter();
const uTableRef = ref(null);
const loading = ref(false); //表格加载状态
const submitOpen = ref(false); // 再次提交弹窗是否打开
const submitLoading = ref(false); // 再次提交弹窗loading状态
const selectedCount = ref(0); // 选中的商品数量
const currentSelectRow = ref([]); // 当前选中的商品

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
const wrapperColItem = ref({
  style: {
    minWidth: "300px",
  },
});

const columns = reactive(tableColumns);
const INITIAL_FORM_DATA = {
  storeAccount: "0", // 店铺账号
  status: "0", // 状态
  temName: "", // 模板名称
  createUser: "", //创建人
  pageNum: 1, // 页码
  pageSize: 50, // 每页条数
};
const formData = reactive({ ...INITIAL_FORM_DATA });

// 店铺账号选项
const storeAccountOptions = ref([
  {
    label: "全部",
    value: "0",
  },
  {
    label: "店铺1",
    value: "1",
  },
  {
    label: "店铺2",
    value: "2",
  },
  {
    label: "店铺3",
    value: "3",
  },
  {
    label: "店铺4",
    value: "4",
  },
  {
    label: "店铺5",
    value: "5",
  },
  {
    label: "店铺6",
    value: "6",
  },
]);

// 状态选项
const statusOptions = ref([
  {
    label: "全部",
    value: "0",
  },
  {
    label: "默认",
    value: "1",
  },
  {
    label: "备选",
    value: "2",
  },
]);

/**
 * 处理设为默认
 */
const handleSetDefault = () => {
  if (currentSelectRow.value.length === 0) {
    message.warning("请选择要设为默认的商品");
    return;
  }
};
/**
 * 处理复制
 */
const handleCopy = () => {
  if (currentSelectRow.value.length === 0) {
    message.warning("请选择要复制的商品");
    return;
  }
};
/**
 * 处理添加备注确认
 */
const handleSubmitOk = () => {
  if (currentSelectRow.value.length === 0) {
    message.warning("请选择要添加备注的商品");
    return;
  }

  submitLoading.value = true;
  
  // 模拟API调用，实际应替换为正确的API调用
  setTimeout(() => {
    submitLoading.value = false;
    message.success(`成功提交 ${currentSelectRow.value.length} 个商品`);
    getList();
    resetSubmitForm();
    submitOpen.value = false;
    currentSelectRow.value = [];
    selectedCount.value = 0;
  }, 500);
};

// 表格数据
const tableData = ref([]);

/**
 * 获取表格数据
 */
const getList = async (pages = {}) => {
  try {
    // 先设置loading状态为true
    loading.value = true;
    // 构建请求参数，确保分页参数优先
    const params = {
      // 先解构搜索参数
      ...formData,
    };
    console.log("params", params);
    // const res = await props.api(params);
    // tableData.value = JSON.parse(JSON.stringify(res?.rows || []));
    // // 整体表格数据处理
    // tableData.value.forEach((item) => {

    // });
    // pages.total = res?.total || 0;
    // 清除选中状态
    uTableRef?.value?.clearSelection();
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
 * 处理表格加载状态变化
 */
const handleLoadingChange = (loading) => {
  loading.value = loading;
};

/**
 * 清除表格选择
 */
const clearSelection = () => {
  if (uTableRef.value) {
    uTableRef.value.clearSelection();
  }
};

/**
 * 处理弹窗取消
 */
const handleCancel = () => {
  submitOpen.value = false;
  resetSubmitForm();
};

/**
 * 重置提交表单
 */
const resetSubmitForm = () => {
  submitFormData.value.remark = '';
  submitFormData.value.auditStatus = '';
  if (submitFormRef.value) {
    submitFormRef.value.resetFields();
  }
};

/**
 * 重置搜索表单
 */
const resetForm = () => {
  // 使用初始状态常量重置表单，更简洁且易于维护
  Object.keys(INITIAL_FORM_DATA).forEach((key) => {
    if (key !== "selectAll") {
      formData[key] = JSON.parse(JSON.stringify(INITIAL_FORM_DATA[key]));
    }
  });
  getList();
};

/**
 * 处理表格加载状态变化
 */
const handlePageChange = (page) => {
  formData.pageNum = page;
  getList();
};

/**
 * 处理每页条数变化
 */
const handlePageSizeChange = (pageSize) => {
  formData.pageSize = pageSize;
  getList();
};

/**
 * 处理表格行选择变化
 */
const handleSelectionChange = (selectedRows) => {
  selectedCount.value = selectedRows.length;
  currentSelectRow.value = selectedRows;
  console.log("currentSelectRow", currentSelectRow.value);
};


/**
 * 处理编辑和查看单据操作
 */
const handleEdit = (type, product) => {
  const params = {};
  params.type = type;

  if (type === "edit" || type === "doubleClick") {
    if (!product || !product.id) {
      console.error('需要有效的 id 属性');
      return;
    }
    params.id = product.id;
  }

  const urlData = router.resolve({
    path: "/platform/product-review/store-template-detail",
    query: params,
  });
  window.open(urlData.href, "_blank");
};
</script>
<style scoped lang="less">
@import "@/assets/styles/com-list.less";
</style>
