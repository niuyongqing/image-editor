<template>
  <div id="configAccountCont">
    <!-- 搜索筛选区域 -->
    <a-card>
      <a-form
        :model="formData"
        class="search-form"
        layout="inline"
        ref="formRef"
        :wrapper-col="wrapperCol"
        :label-col="labelCol"
      >
        <!-- 店铺账号 -->
        <a-form-item
          label="店铺账号:"
          class="form-item-radio"
          :wrapper-col="wrapperColItem"
        >
          <a-radio-group v-model:value="formData.account" name="account">
            <a-radio
              :value="item.account"
              v-for="item in accountList"
              :key="item.account"
              >{{ item.simpleName }}</a-radio
            >
          </a-radio-group>
        </a-form-item>
        <!-- 状态 -->
        <a-form-item label="状态:">
          <a-radio-group v-model:value="formData.status" name="status">
            <a-radio
              :value="item.value"
              v-for="item in statusOptions"
              :key="item.value"
              >{{ item.label }}</a-radio
            >
          </a-radio-group>
        </a-form-item>
        <!-- 模板查询 -->
        <a-form-item label="模糊查询:" :wrapper-col="wrapperColItem">
          <a-space size="middle">
            <a-input
              v-model:value="formData.shopTemplateName"
              placeholder="请输入模板名称进行搜索"
              allowClear
            />
            <a-input
              v-model:value="formData.createUserName"
              placeholder="请输入创建人姓名进行搜索"
              allowClear
            />
          </a-space>
        </a-form-item>
        <a-form-item class="form-actions">
          <a-button type="primary" @click="getList" :disabled="loading"
            >查询</a-button
          >
          <a-button
            @click="resetForm"
            :disabled="loading"
            >重置</a-button
          >
        </a-form-item>
      </a-form>
    </a-card>
    <!-- 数据展示区域 -->
    <a-card class="mt-2">
      <div class="table-header-actions">
        <a-button :disabled="selectedCount !== 0" @click="handleEdit('add', {})" type="primary" title="创建新的店铺模板">
          新增
        </a-button>
        <a-button
          :disabled="selectedCount !== 1 || loading"
          @click="handleStopOrUsed(0)"
          type="primary"
          title="将选中的模板设为默认模板"
        >
          设为默认
        </a-button>
        <a-button
          :disabled="selectedCount !== 1 || loading"
          @click="handleStopOrUsed(1)"
          type="primary"
          title="停用选中的模板，使其不再作为默认模板"
        >
          停用
        </a-button>
        <a-button
          :disabled="selectedCount !== 1 || loading"
          @click="handleCopy"
          type="primary"
          title="复制选中的模板到其他店铺"
        >
          复制
        </a-button>
        <a-button
          :disabled="selectedCount !== 1 || loading"
          @click="handleEdit('edit', currentSelectRow[0])"
          type="primary"
          title="编辑选中的模板信息"
        >
          编辑
        </a-button>
        <a-button
          @click="handleSubmit"
          type="primary"
          :disabled="selectedCount === 0 || loading"
          title="为选中的模板添加备注信息"
        >
          添加备注
        </a-button>
        <span class="ml-4 text-sm text-gray-500">
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

      <div class="table-container mt-4">
        <!-- 使用封装的表格组件 -->
        <uTable
          :scrollConfig="{ y: 500 }"
          ref="uTableRef"
          :dataSource="tableData"
          :columns="columns"
          :loading="loading"
          @reset="resetForm"
          :pagination="pagination"
          @row-dblclick="(record) => handleEdit('doubleClick', record)"
          @loading-change="handleLoadingChange"
          @selection-change="handleSelectionChange"
          @page-change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        />
      </div>
    </a-card>

    <!-- 添加备注弹窗 -->
    <a-modal
      :centered="true"
      v-model:open="submitOpen"
      title="添加备注"
      @ok="handleSubmitOk"
      @cancel="handleModalCancel('submit')"
      :confirm-loading="submitLoading"
      okText="下一步"
      cancelText="取消"
      :width="500"
      class="common-modal"
    >
      <!-- 显示要添加备注的模板信息 -->
      <div v-if="currentSelectRow.length > 0" class="modal-info">
        <div class="modal-info-title">已选择的模板 ({{ currentSelectRow.length }}个):</div>
        <div class="modal-info-list">
          <div
            v-for="(template, index) in currentSelectRow"
            :key="index"
            class="modal-info-item"
          >
            {{ index + 1 }}. {{ template.shopTemplateName || "未命名模板" }}
          </div>
        </div>
      </div>

      <a-form :model="submitFormData" ref="submitFormRef">
        <a-form-item name="remark">
          <div class="form-label">备注内容:</div>
          <a-textarea
            v-model:value="submitFormData.remark"
            :rows="4"
            placeholder="请输入备注内容，例如：模板用途、使用说明等"
            allowClear
            class="form-input"
            :maxlength="255"
            show-count
          />
          <div class="form-tip">
            提示：备注信息将显示给所有用户，请确保内容准确、清晰
          </div>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 复制模板弹窗 -->
    <a-modal
      :centered="true"
      v-model:open="copyOpen"
      title="复制模板"
      @ok="handleCopyOk"
      @cancel="handleCopyCancel"
      :confirm-loading="copyLoading"
      okText="确认"
      cancelText="取消"
      :width="500"
      class="common-modal"
    >
      <!-- 显示要复制的模板信息 -->
      <div v-if="currentSelectRow.length > 0" class="modal-info">
        <div class="modal-info-title">当前选择的模板:</div>
        <div class="modal-info-list">
          <div class="modal-info-item">
            模板名称: {{ currentSelectRow[0].shopTemplateName || "未命名模板" }}
          </div>
          <div class="modal-info-item">
            所属店铺: {{ currentSelectRow[0].simpleName || currentSelectRow[0].account || "未知" }}
          </div>
        </div>
      </div>

      <a-form :model="copyFormData" ref="copyFormRef">
        <a-form-item
          name="targetAccount"
          :rules="[{ required: true, message: '请选择目标店铺账号' }]"
        >
          <div class="form-label">目标店铺账号:</div>
          <a-select
            v-model:value="copyFormData.targetAccount"
            placeholder="请选择要复制到的店铺账号"
            class="form-input"
            allowClear
          >
            <a-select-option
              v-for="item in accountList.filter((item) => item.account !== '')"
              :key="item.account"
              :value="item.account"
            >
              {{ item.simpleName }}
            </a-select-option>
          </a-select>
          <div class="form-tip">
            提示：选择目标店铺后，将在新页面中打开模板编辑器，您可以修改模板信息后保存
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, h } from "vue";
import { useRouter } from "vue-router";
import {
  message,
  Modal as aModal,
  Input as aInput,
  Form as aForm,
  FormItem as aFormItem,
  Textarea as aTextarea,
  Select as aSelect,
  SelectOption as aSelectOption,
} from "ant-design-vue";
import uTable from "@/components/uTable/index.vue";
import tableColumns from "@/pages/product-review/config/table-config/storeTemplateTable.js";
import {
  getStoreTemplateList,
  getShopList,
  stopShopTemplate,
  addRemarkShopTemplate,
} from "@/pages/product-review/store-template/api.js";

// 添加缺失的变量定义
const submitFormRef = ref(null);
const submitFormData = ref({
  remark: "",
});
const copyFormRef = ref(null);
const copyFormData = ref({
  targetAccount: null,
});
const router = useRouter();
const uTableRef = ref(null);
const loading = ref(false); //表格加载状态
const submitOpen = ref(false); // 再次提交弹窗是否打开
const submitLoading = ref(false); // 再次提交弹窗loading状态
const copyOpen = ref(false); // 复制弹窗是否打开
const copyLoading = ref(false); // 复制弹窗loading状态
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

// 分页配置
const pagination = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0,
});

const columns = reactive(tableColumns);
const INITIAL_FORM_DATA = {
  account: "", // 店铺账号
  status: "", // 状态
  shopTemplateName: "", // 模板名称
  createUserName: "", //创建人
  pageNum: 1, // 页码
  pageSize: 50, // 每页条数
};
const formData = reactive({ ...INITIAL_FORM_DATA });

// 状态选项
const statusOptions = ref([
  {
    label: "全部",
    value: "",
  },
  {
    label: "默认",
    value: 0,
  },
  {
    label: "备选",
    value: 1,
  },
]);

/**
 * 处理停用或使用
 */
const handleStopOrUsed = (type) => {
  if (!currentSelectRow.value || currentSelectRow.value.length === 0) {
    message.warning("请选择要操作的模板");
    return;
  }

  // 使用confirm对话框确认操作
  aModal.confirm({
    title: type === 1 ? "停用模板" : "设为默认",
    content: () => {
      const templateName = currentSelectRow.value?.[0]?.shopTemplateName || "该模板";
      return h("div", { style: { padding: "20px" } }, [
        h(
          "p",
          { style: "color: #f5222d; margin-bottom: 10px;" },
          type === 1 
            ? `确定要停用模板"${templateName}"吗？停用后该模板将不再作为默认模板使用。` 
            : `确定要将模板"${templateName}"设为默认吗？设为默认后，该模板将作为首选模板使用。`
        ),
        h(
          "p",
          { style: "color: #666; font-size: 12px;" },
          "此操作将立即生效，请确认是否继续。"
        ),
      ]);
    },
    okText: "确认",
    cancelText: "取消",
    async onOk() {
      try {
        const templateId = currentSelectRow.value?.[0]?.id;
        const account = currentSelectRow.value?.[0]?.account;
        // 构建请求参数
        const requestData = {
          id: templateId,
          account: account,
          status: type === 0 ? 0 : 1, // 0默认 1使备选
        };

        await stopShopTemplate(requestData);
        message.success(type === 1 ? "模板停用成功" : "已设为默认模板");
        // 重新获取列表数据
        getList();
        // 清空选中状态
        clearSelection();
      } catch (error) {
        message.error(
          type === 0
            ? "设为默认失败：" + (error.message || "未知错误")
            : "模板停用失败：" + (error.message || "未知错误")
        );
        // 阻止对话框关闭
        return Promise.reject();
      }
    },
  });
};

// 通用弹窗处理函数
const handleModalCancel = (type) => {
  if (type === "submit") {
    submitOpen.value = false;
    submitFormData.remark = "";
  } else if (type === "copy") {
    copyOpen.value = false;
    copyFormData.value.targetAccount = null;
    if (copyFormRef.value) {
      copyFormRef.value.resetFields();
    }
  }
};

// 通用表单验证函数
const validateForm = async (formRef) => {
  try {
    await formRef.validate();
    return true;
  } catch (error) {
    console.log("表单验证失败:", error);
    // 获取第一个错误字段的信息
    const firstError = Object.values(error)[0];
    if (firstError && firstError.length > 0) {
      message.error(firstError[0].message || "表单验证失败，请检查输入内容");
    } else {
      message.error("表单验证失败，请检查输入内容");
    }
    return false;
  }
};

// 通用API调用处理函数
const handleApiCall = async (apiCall, successMessage, errorMessage) => {
  try {
    await apiCall();
    message.success(successMessage);
    return true;
  } catch (error) {
    console.error(errorMessage, error);
    // 尝试从错误响应中获取更详细的错误信息
    const errorMsg = error?.response?.data?.message || error?.message || errorMessage;
    message.error(errorMsg);
    return false;
  }
};

/**
 * 处理复制
 */
const handleCopy = () => {
  if (!currentSelectRow.value || currentSelectRow.value.length === 0) {
    message.warning("请选择要复制的商品");
    return;
  }
  // 打开复制弹窗
  copyOpen.value = true;
  // 重置表单数据
  copyFormData.value.targetAccount = null;
};

/**
 * 处理复制确认
 */
const handleCopyOk = async () => {
  const isValid = await validateForm(copyFormRef.value);
  if (!isValid) return;
  
  try {
    copyOpen.value = false;
    copyLoading.value = true;
    const params = {
      id: currentSelectRow.value?.[0]?.id,
      status: "1",
      account: copyFormData.value.targetAccount,
      type: "copy",
    };
    copyLoading.value = false;
    const urlData = router.resolve({
      path: "/platform/product-review/store-template-detail",
      query: params,
    });
    window.open(urlData.href, "_blank");
    message.success("正在打开模板编辑页面...");
  } catch (error) {
    message.error("复制模板失败：" + (error.message || "未知错误"));
    copyLoading.value = false;
    return Promise.reject();
  }
};

/**
 * 处理复制弹窗取消
 */
/**
 * 处理复制弹窗取消
 */
const handleCopyCancel = () => {
  handleModalCancel("copy");
};

/**
 * 处理添加备注弹窗打开
 */
const handleSubmit = () => {
  if (!currentSelectRow.value || currentSelectRow.value.length === 0) {
    message.warning("请选择要添加备注的模板");
    return;
  }
  submitOpen.value = true;
  submitFormData.remark = "";
};

/**
 * 处理添加备注确认
 */
const handleSubmitOk = async () => {
  if (!currentSelectRow.value || currentSelectRow.value.length === 0) {
    message.warning("请选择要添加备注的模板");
    return;
  }

  if (!submitFormData.value.remark || submitFormData.value.remark.trim() === "") {
    message.warning("请输入备注内容");
    return;
  }

  const isValid = await validateForm(submitFormRef.value);
  if (!isValid) return;

  // 显示确认对话框
  aModal.confirm({
    title: "确认添加备注",
    content: () => {
      const templateNames = currentSelectRow.value.map(item => 
        item?.shopTemplateName || "未命名模板"
      ).join("、");
      
      return h("div", { style: { padding: "20px" } }, [
        h(
          "p",
          { style: "margin-bottom: 10px;" },
          `确定要为以下${currentSelectRow.value.length}个模板添加备注吗？`
        ),
        h(
          "p",
          { style: "color: #1890ff; margin-bottom: 10px; word-break: break-all;" },
          templateNames
        ),
        h(
          "p",
          { style: "margin-bottom: 10px;" },
          `备注内容：${submitFormData.value.remark}`
        ),
        h(
          "p",
          { style: "color: #666; font-size: 12px;" },
          "添加备注后，其他用户可以查看这些备注信息。"
        ),
      ]);
    },
    okText: "确认添加",
    cancelText: "取消",
    async onOk() {
      try {
        submitLoading.value = true;

        const apiCall = () =>
          addRemarkShopTemplate({
            ids: currentSelectRow.value.map((item) => item?.id),
            remark: submitFormData.value.remark,
          });

        const success = await handleApiCall(
          apiCall,
          `成功为 ${currentSelectRow.value.length} 个模板添加备注`,
          "备注添加失败"
        );

        if (success) {
          submitOpen.value = false;
          submitFormData.remark = "";
          getList();
          resetSubmitForm();
          currentSelectRow.value = [];
          selectedCount.value = 0;
        }

        submitLoading.value = false;
      } catch (error) {
        message.error("添加备注失败：" + (error.message || "未知错误"));
        submitLoading.value = false;
        return Promise.reject();
      }
    },
  });
};

const accountList = ref([]);
const getShopLists = async () => {
  const res = await getShopList();
  if (res.code === 200) {
    accountList.value = res?.data || [];
    // 加一个全部的选项
    accountList.value.unshift({
      account: "",
      simpleName: "全部",
    });
  }
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
      ...pagination,
    };
    console.log("params", params);
    const res = await getStoreTemplateList(params);
    tableData.value = JSON.parse(JSON.stringify(res?.rows || []));
    // 整体表格数据处理
    tableData.value.forEach((item) => {
      item.simpleName =
        accountList.value.find((account) => account.account === item.account)
          ?.simpleName || item.account;
      item.status_name =
        statusOptions.value.find((status) => status.value === item.status)
          ?.label || item.status;
    });
    pagination.total = res?.total || 0;
    // 清除选中状态
    uTableRef?.value?.clearSelection();
  } catch (error) {
    console.error("获取产品列表失败:", error);
    message.error("获取产品列表失败");
    tableData.value = [];
    pagination.total = 0;
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
 * 重置提交表单
 */
const resetSubmitForm = () => {
  submitFormData.value.remark = "";
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
  pagination.pageNum = page;
  getList();
};

/**
 * 处理每页条数变化
 */
const handlePageSizeChange = (pageSize) => {
  pagination.pageSize = pageSize;
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
      console.error("需要有效的 id 属性");
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

// 监听浏览器窗口通信
const channel = new BroadcastChannel("store_template_getList");
channel.onmessage = function (event) {
  if (event.data.action === "refreshList") {
    getList();
  }
};

onMounted(() => {
  getShopLists();
  getList();
});
</script>
<style scoped lang="less">
@import "@/assets/styles/com-list.less";
</style>
