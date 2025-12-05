<template>
  <div id="configAccountCont">
    <!-- 搜索筛选区域 -->
    <appTableForm
      @formHeightChange="handleFormHeightChange"
      @onSubmit="getList()"
      resetSetMenu="store-template"
      v-model:formData="formData"
    >
      <template #formItemRow>
        <!-- 店铺账号 -->
        <a-form-item
          label="店铺账号:"
          class="form-item-radio"
          name="account"
          :wrapper-col="wrapperColItem"
        >
        <appCardSelect
            :multiple="false"
            :options="accountList"
            @selectItem="getList()"
            :fieldObj="{
              value: 'account',
              label: 'simpleName',
            }"
            v-model:account="formData.account"
          ></appCardSelect>
        </a-form-item>
        <!-- 状态 -->
        <a-form-item label="状态:" name="status">
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
        <a-form-item label="模糊查询:" name="shopTemplateName">
          <a-space size="middle">
            <a-input
              v-model:value="formData.shopTemplateName"
              placeholder="请输入模板名称进行搜索"
              allowClear
            />
            <a-form-item-rest>
              <a-input
                v-model:value="formData.createUserName"
                placeholder="请输入创建人姓名进行搜索"
                allowClear
              />
            </a-form-item-rest>
          </a-space>
        </a-form-item>
      </template>
    </appTableForm>
    <AppTableBox
      :dataSource="tableData"
      :tableHeader="columns"
      :scroll="{ y: 2100 }"
      resetSetMenu="ozon_publicationDatabase"
      @rowDoubleClick="(record) => handleEdit('view', record)"
      rowKey="id"
      :rowSelection="{
        selectedRowKeys: filterSelectedRows,
        onChange: handleSelectionChange,
      }"
    >
      <template #leftTool>
        <a-button
          :disabled="selectedCount !== 0"
          @click="handleEdit('add', {})"
          type="primary"
          title="创建新的店铺模板"
        >
          新增
        </a-button>
        <a-button
          @click="handleSubmit"
          type="primary"
          :disabled="selectedCount === 0 || tableLoading"
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
      </template>

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
          {{
            formatDateTime(
              record[column.dataIndex || column.key],
              column.format
            )
          }}
        </template>
        <!-- tag 类字段 -->
        <template v-else-if="column.type === 'tag'">
          <a-tag
            :color="
              column.tagColor[record[column.dataIndex || column.key]] ||
              'default'
            "
          >
            {{ record[column.dataIndex || column.key] }}
          </a-tag>
        </template>
        <!-- 自定义渲染 -->
        <template v-else-if="column.customRender">
          <!-- 允许通过scoped slot自定义渲染 -->
          <slot
            :name="`cell-${column.dataIndex || column.key}`"
            :record="record"
            :column="column"
            :index="index"
          >
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
              <template
                v-for="(action, actionIndex) in column.actions"
                :key="actionIndex"
              >
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
                <!-- <a-button v-else-if="action.danger && !action.popconfirm" type="link" size="small" danger
                  @click="handleActionClick(action.eventName, record)"
                  :disabled="action.disabled && action.disabled(record)">
                  {{ action.label }}
                </a-button> -->

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
                <!-- <a-popconfirm v-else-if="action.danger && action.popconfirm"
                  :title="action.popconfirm.title || '确定要删除这条记录吗？'" :ok-text="action.popconfirm.okText || '确定'"
                  :cancel-text="action.popconfirm.cancelText || '取消'"
                  @confirm="handleActionClick(action.eventName, record)">
                  <a-button type="link" size="small" danger :disabled="action.disabled && action.disabled(record)">
                    {{ action.label }}
                  </a-button>
                </a-popconfirm> -->
              </template>
            </a-space>
          </slot>
        </template>
        <!-- 其他列默认渲染 -->
        <template v-else>
          {{ record[column.dataIndex || column.key] }}
        </template>
      </template>

      <template #pagination>
        <appTablePagination
          @pageNumChange="handlePageChange"
          @pageSizeChange="handlePageSizeChange"
          v-model:current="pagination.pageNum"
          v-model:pageSize="pagination.pageSize"
          :total="pagination.total"
        />
      </template>

      <!-- 使用封装的表格组件 -->
      <!-- <uTable
        :scrollConfig="{ y: uTableHeight }"
        ref="uTableRef"
        :dataSource="tableData"
        :columns="columns"
        :loading="tableLoading"
        @reset="resetForm"
        :pagination="pagination"
        @loading-change="handleLoadingChange"
        @selection-change="handleSelectionChange"
        @page-change="handlePageChange"
        @edit="(record) => handleEdit('edit', record)"
        @view="(record) => handleEdit('view', record)"
        @row-dblclick="(record) => handleEdit('view', record)"
        @copy="handleCopy"
        @used="handleUsed"
      >
      </uTable> -->
    </AppTableBox>

    <!-- 添加备注弹窗 -->
    <a-modal
      :centered="true"
      v-model:open="submitOpen"
      title="添加备注"
      @ok="handleSubmitOk"
      @cancel="handleModalCancel('submit')"
      :confirm-loading="submitLoading"
      okText="确认"
      cancelText="取消"
      :width="500"
      class="common-modal"
    >
      <!-- 显示要添加备注的模板信息 -->
      <div v-if="currentSelectRow.length > 0" class="modal-info">
        <div class="modal-info-title">
          已选择的模板 ({{ currentSelectRow.length }}个):
        </div>
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
            placeholder="请输入备注内容"
            allowClear
            class="form-input"
            :maxlength="255"
            show-count
          />
          <div class="form-tip">
            提示：备注信息将显示给所有能看到该模板的用户，请确保内容准确清晰
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
            所属店铺:
            {{
              currentSelectRow[0].simpleName ||
              currentSelectRow[0].account ||
              "未知"
            }}
          </div>
        </div>
      </div>

      <a-form :model="copyFormData" ref="copyFormRef">
        <a-form-item
          name="targetAccount"
          :rules="[{ required: true, message: '请选择目标店铺账号' }]"
        >
          <div class="form-label">目标店铺账号:</div>
          <!-- 
          <a-select v-model:value="copyFormData.targetAccount" show-search :filterOption="filterOption" :placeholder="`请选择要复制到的店铺账号`" allow-clear
          :fieldNames="{ label: 'simpleName', value: 'account'}" :options="accountList" /> -->

          <a-select
            v-model:value="copyFormData.targetAccount"
            placeholder="请选择要复制到的店铺账号"
            class="form-input"
            show-search
            :fieldNames="{ label: 'simpleName', value: 'account' }"
            :filterOption="filterOption"
            :options="accountList"
            allowClear
          >
          </a-select>
          <div class="form-tip">
            提示：选择目标店铺后，将在新页面中打开模板编辑页面，您可以修改模板信息后保存
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
  delShopTemplate,
} from "@/pages/product-review/store-template/api.js";
import appTableForm from "@/components/common/appTableForm.vue";
import AppTableBox from "@/components/common/appTableBox.vue";
import appTablePagination from "@/components/common/appTablePagination.vue";
import appCardSelect from "~@/components/common/appCardSelect.vue";
const formRef = ref(null);
const searchCardFormRef = ref(null);

// 添加dom引用字段
const submitFormRef = ref(null);
const selectCommRef = ref(null);
const submitFormData = ref({
  remark: "",
});
const copyFormRef = ref(null);
const copyFormData = ref({
  targetAccount: null,
});
const router = useRouter();
// const uTableRef = ref(null);
const tableLoading = ref(false); // 表格加载状态
const submitOpen = ref(false); // 再次提交弹窗是否打开
const submitLoading = ref(false); // 再次提交弹窗loading状态
const copyOpen = ref(false); // 复制弹窗是否打开
const copyLoading = ref(false); // 复制弹窗loading状态
const selectedCount = ref(0); // 选中的商品数量
const currentSelectRow = reactive([]); // 当前选中的商品
const filterSelectedRows = ref([]); // 存储选中行的keys，用于表格选择状态同步
const tableData = ref([]);
const accountList = ref([]);

const labelCol = reactive({
  style: {
    width: "100px",
  },
});
const wrapperCol = reactive({
  style: {
    width: "305px",
  },
});
const wrapperColItem = reactive({
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

// 不在这里添加多选列，而是通过rowSelection属性配置多选功能
const columns = reactive(tableColumns);
const INITIAL_FORM_DATA = {
  account: "", // 店铺账号
  status: "", // 状态
  shopTemplateName: "", // 模板名称
  createUserName: "", //创建人
};
const formData = reactive({ ...INITIAL_FORM_DATA });

// 状态选项
const statusOptions = reactive([
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

watch(
  () => formData.account,
  (newVal, oldVal) => {
    if (newVal === "") {
      selectCommRef.value?.selectAll(false);
    }
  }
);

// 过滤选项
const filterOption = (inputValue, option) => {
  console.log(inputValue, option);
  const label = option.simpleName; // 因为你的数据中有 simpleName 字段
  console.log(label);
  return label.toLowerCase().includes(inputValue.toLowerCase());
};

// 处理设为默认或备选模板
const handleUsed = async (record) => {
  try {
    const templateId = record?.id;
    const account = record?.account;
    // 构建请求参数
    const requestData = {
      id: templateId,
      account: account,
    };

    await stopShopTemplate(requestData);
    message.success("已设为默认模板");
    // 重新获取列表数据
    getList();
  } catch (error) {
    message.error("设为默认失败：" + (error.message || "未知错误"));
    // 阻止对话框关闭
    return Promise.reject();
  }
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
    const errorMsg =
      error?.response?.data?.message || error?.message || errorMessage;
    message.error(errorMsg);
    return false;
  }
};

const formHeight = ref(108);
// 处理搜索筛选区域高度变化
const handleFormHeightChange = (val) => {
  formHeight.value = val;
  console.log("搜索筛选区域高度变化:", val);
};

const handleActionClick = (eventName, record) => {
  //eventName 事件名称
  //record 点击的行数据
  if (eventName) {
    console.log(eventName, record);
    if (eventName === "copy") {
      return handleCopy(record);
    }
    if (eventName === "used") {
      return handleUsed(record);
    }
    functionMap[eventName](eventName, record);
  }
};

// 处理复制模板
const handleCopy = (record) => {
  currentSelectRow[0] = record;
  // 打开复制弹窗
  copyOpen.value = true;
  // 重置表单数据
  copyFormData.value.targetAccount = null;
};

// 处理复制模板确认
const handleCopyOk = async () => {
  const isValid = await validateForm(copyFormRef.value);
  if (!isValid) return;

  try {
    copyOpen.value = false;
    copyLoading.value = true;
    const params = {
      copyId: currentSelectRow?.[0]?.id,
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

// 处理复制模板弹窗取消
const handleCopyCancel = () => {
  handleModalCancel("copy");
};

// 处理添加备注弹窗打开
const handleSubmit = () => {
  if (!currentSelectRow || currentSelectRow.length === 0) {
    message.warning("请选择要添加备注的模板");
    return;
  }
  submitOpen.value = true;
  submitFormData.remark = "";
};

// 处理添加备注确认
const handleSubmitOk = async () => {
  if (!currentSelectRow || currentSelectRow.length === 0) {
    message.warning("请选择要添加备注的模板");
    return;
  }

  if (
    !submitFormData.value.remark ||
    submitFormData.value.remark.trim() === ""
  ) {
    message.warning("请输入备注内容");
    return;
  }

  const isValid = await validateForm(submitFormRef.value);
  if (!isValid) return;

  try {
    submitLoading.value = true;
    const apiCall = () =>
      addRemarkShopTemplate({
        ids: currentSelectRow.map((item) => item?.id),
        remark: submitFormData.value.remark,
      });

    const success = await handleApiCall(
      apiCall,
      `成功为 ${currentSelectRow.length} 个模板添加备注`,
      "备注添加失败"
    );

    if (success) {
      submitOpen.value = false;
      submitFormData.remark = "";
      getList();
      resetSubmitForm();
      currentSelectRow.splice(0, currentSelectRow.length); // 清空数组
      selectedCount.value = 0;
    }

    submitLoading.value = false;
  } catch (error) {
    message.error("添加备注失败：" + (error.message || "未知错误"));
    submitLoading.value = false;
    return Promise.reject();
  }
};

const getShopLists = async () => {
  const res = await getShopList();
  if (res.code === 200) {
    accountList.value = res?.data || [];
  }
};

// 表格数据
const getList = async (type = "search") => {
      if (type === "search") {
      pagination.pageNum = 1;
      pagination.pageSize = 50;
    }
  try {
    // 先设置loading状态为true
    tableLoading.value = true;
    // 构建请求参数，确保分页参数优先
    const params = {
      // 先解构搜索参数
      ...formData,
      ...pagination,
    };
    Object.keys(params).forEach((key) => {
      if (typeof params[key] === "string") {
        params[key] = params[key].trim();
      }
    });
    console.log("params", params);
    const res = await getStoreTemplateList(params);
    tableData.value = JSON.parse(JSON.stringify(res?.rows || []));
    // 整体表格数据处理
    tableData.value.forEach((item) => {
      item.simpleName =
        accountList.value.find((account) => account.account === item.account)
          ?.simpleName || item.account;
      item.status_name =
        statusOptions.find((status) => status.value === item.status)?.label ||
        item.status;
    });
    pagination.total = res?.total || 0;
    // 清除选中状态
    clearSelection();
  } catch (error) {
    console.error("获取店铺模板列表失败:", error);
    message.error("获取店铺模板列表失败");
    tableData.value = [];
    pagination.total = 0;
  } finally {
    tableLoading.value = false;
  }
};

// 处理表格加载状态变化
const handleLoadingChange = (loading) => {
  tableLoading.value = loading;
};

// 清除表格选择
const clearSelection = () => {
  // 调用handleSelectionChange传入空数组来清空所有选择状态
  handleSelectionChange([], []);
  // 额外确保filterSelectedRows被清空
  filterSelectedRows.value = [];
  // 确保currentSelectRow数组被清空
  currentSelectRow.splice(0, currentSelectRow.length);
  // 确保选中数量为0
  selectedCount.value = 0;
};

// 重置提交表单
const resetSubmitForm = () => {
  submitFormData.value.remark = "";
  if (submitFormRef.value) {
    submitFormRef.value.resetFields();
  }
};

// 重置搜索表单
const resetForm = () => {
  Object.keys(INITIAL_FORM_DATA).forEach((key) => {
    formData[key] = JSON.parse(JSON.stringify(INITIAL_FORM_DATA[key]));
  });
  // 调用selectCommRef的selectAll方法
  selectCommRef.value.selectAll();
  getList();
};

// 处理页码和条数变化
const handlePageChange = (page) => {
  pagination.pageNum = page;
  getList("handPage");
};

/**
 * 处理每页条数变化
 */
const handlePageSizeChange = (val) => {
  // 确保pageSize是数字类型
  pagination.pageSize = Number(val);
  getList("handPage");
};

// 处理表格行选择变化
const handleSelectionChange = (selectedRowKeys, selectedRows) => {
  // 更新选中数量
  selectedCount.value = selectedRowKeys.length;
  // 更新选中的行数据
  currentSelectRow.splice(0, currentSelectRow.length, ...selectedRows);
  // 更新选中行的keys，用于表格选择状态同步
  filterSelectedRows.value = [...selectedRowKeys];
  console.log("selectedRows", selectedRows);
  console.log("currentSelectRow", currentSelectRow);
};

// 处理编辑和查看单据操作
const handleEdit = (type, product) => {
  const params = {};
  params.type = type;

  if (type === "edit" || type === "view") {
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

/**
 * 处理查看操作
 */
const handleView = (record) => {
  router.push({
    path: "/product-review/store-template/detail",
    query: {
      id: record.id,
      type: "view",
    },
  });
};

/**
 * 处理删除操作
 */
const handleDelete = (record) => {
  delShopTemplate(record.id)
    .then((res) => {
      if (res.code === 200) {
        message.success("删除成功");
        getList(); // 刷新表格数据
      } else {
        message.error(res.msg || "删除失败");
      }
    })
    .catch((error) => {
      console.error("删除失败:", error);
      message.error("删除失败，请稍后重试");
    });
};

// 监听浏览器窗口通信
const channel = new BroadcastChannel("store_template_getList");
channel.onmessage = function (event) {
  if (event.data.action === "refreshList") {
    getList();
  }
};
/**
 * 获取表格高度 - 使用公共方法
 */
const getUTableHeight = () => {
  calculateTableHeight((height) => {
    // 可以在这里添加额外的处理逻辑
    console.log("表格高度计算完成:", height);
  });
};

const functionMap = {
  edit: handleEdit,
  view: handleEdit,
  used: handleUsed,
  copy: handleCopy,
};
onMounted(() => {
  getShopLists();
  getList();
  // getUTableHeight();
});
</script>
<style scoped lang="less">
@import "@/assets/styles/com-list.less";
</style>
