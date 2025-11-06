<template>
  <div v-loading="subLoading" loading-full="true" class="pending-editing-container ml-16 mr-16">
    <a-form ref="formRef"  layout="inline" :model="formState" :label-col="labelCol" :rules="storeTemplateRules"
      @finish="handleFinish" @finishFailed="handleFinishFailed">
      <!-- 店铺编号单独占一整行 -->
      <a-form-item label="店铺账号" name="account" class="block-item">
        <a-select :disabled="isDesable" style="width: 300px" v-model:value="formState.account" show-search :filterOption="filterOption" :placeholder="`请选择店铺账号`" allow-clear
          :fieldNames="{ label: 'simpleName', value: 'account'}" :options="accountList" />
      </a-form-item>

      <!-- 其他表单字段保持内联布局 -->
      <a-form-item label="模板名称" name="shopTemplateName">
        <a-input :disabled="isDesable" style="width: 400px" allow-clear v-model:value="formState.shopTemplateName" placeholder="请输入模板名称" />
      </a-form-item>

      <a-form-item label="状态" name="status">
        <a-radio-group :disabled="isDesable" v-model:value="formState.status">
          <a-radio :value="0">默认</a-radio>
          <a-radio :value="1">备用</a-radio>
        </a-radio-group>
      </a-form-item>
      <span class="borderTop"></span>
      <div class="module-item">
        <div class="module-item-label">产品模板</div>
        <div class="module-item-content">
          <a-form-item label="添加方式" name="productDescAddType">
            <a-select :disabled="isDesable" style="width: 150px" v-model:value="formState.productDescAddType" :placeholder="`请选择添加方式`" allow-clear
           :options="productDescAddTypeList" />
          </a-form-item>
          <a-form-item label="添加内容" name="productDescAddContent" class="wInput100">
            <a-textarea :disabled="isDesable" :rows="4" :maxlength="255" allow-clear show-count style="width: 100%"
              v-model:value="formState.productDescAddContent" placeholder="请输入添加内容,最大255个字符" />
          </a-form-item>
        </div>
      </div>
      <span class="borderTop"></span>
      <div class="module-item">
        <div class="module-item-label">定价模板</div>
        <div class="module-item-content flex flexItem180">
          <a-form-item label="首重物流费" name="firstPriorityLogisticFee">
            <a-input-number :disabled="isDesable" class="w40" :controls="false" v-model:value="formState.firstPriorityLogisticFee" allow-clear
              placeholder="请输入首重物流费" />
          </a-form-item>
          <a-form-item label="定价利润率" name="profitRate">
            <a-input-number :disabled="isDesable" class="w40" :controls="false" allow-clear v-model:value="formState.profitRate"
              placeholder="请输入定价利润率" />&nbsp%
          </a-form-item>
          <a-form-item label="折损率" name="lossRate">
            <a-input-number :disabled="isDesable" class="w40" :controls="false" allow-clear v-model:value="formState.lossRate"
              placeholder="请输入折损率" />&nbsp%
          </a-form-item>
          <a-form-item label="提现手续费" name="withdrawalFeeRate">
            <a-input-number :disabled="isDesable" class="w40" :controls="false" allow-clear v-model:value="formState.withdrawalFeeRate"
              placeholder="请输入提现手续费" />&nbsp%
          </a-form-item>
          <a-form-item label="物流佣金(RUB)" name="logisticCommissionRate">
            <a-input-number :disabled="isDesable" class="w40" :controls="false" allow-clear v-model:value="formState.logisticCommissionRate"
              placeholder="请输入物流佣金(RUB)" />
          </a-form-item>
          <a-form-item label="平台佣金" name="platformCommissionRate">
            <a-input-number :disabled="isDesable" class="w40" :controls="false" allow-clear v-model:value="formState.platformCommissionRate"
              placeholder="请输入平台佣金" />&nbsp%
          </a-form-item>
          <a-form-item label="原价折扣" name="originalDiscountRate">
            <a-input-number :disabled="isDesable" class="w40" :controls="false" allow-clear v-model:value="formState.originalDiscountRate"
              placeholder="请输入原价折扣" />&nbsp%
          </a-form-item>
          <a-form-item label="续重物流费" name="continuedLogisticFee">
            <a-input-number :disabled="isDesable" class="w40" :controls="false" allow-clear v-model:value="formState.continuedLogisticFee"
              placeholder="请输入续重物流费" />
          </a-form-item>
          <a-form-item label="折扣率" name="discountRate">
            <a-input-number :disabled="isDesable" class="w40" :controls="false" allow-clear v-model:value="formState.discountRate"
              placeholder="请输入折扣率" />&nbsp%
          </a-form-item>
        </div>
      </div>
      <span class="borderTop"></span>
      <div class="module-item">
        <div class="module-item-label">富文本模板</div>
        <div class="module-item-content">
          <a-form-item name="richTextTemplate" class="wInput100">
            <jsonEditor ref="jsonEditorRef"   :is-modules="false" :is-intelligentize="true"
              :json-content="formState.jsonEditorImgIndex" json-width="100%" json-height="400px" :shop="!isDesable"
              @clear="formState.jsonEditorImgIndex = ''" @back-result="backResult" />
          </a-form-item>
        </div>
      </div>
      <span class="borderTop"></span>
      <div class="module-item">
        <div class="module-item-label">水印模板</div>
        <div class="module-item-content">
          <a-form-item name="richTextTemplate" class="wInput100">
            <watermarkTable ref="watermarkTableRef" :disabled="isDesable" />
          </a-form-item>
        </div>
      </div>
      <!-- 操作按钮 -->
      <div class="form-actions mt-24">
        <a-button :disabled="isDesable" type="primary" @click="submitForm">提交</a-button>
        <a-button :disabled="isDesable" style="margin-left: 10px" @click="resetForm">重置</a-button>
      </div>
    </a-form>
  </div>
</template>
<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import jsonEditor from "@/pages/ozon/config/component/json/index.vue";
import watermarkTable from "./comm/watermarkTable.vue";
import {
  createShopTemplate,
  updateShopTemplate,
  getShopTemplateDetails,
  getShopList,
} from "@/pages/product-review/store-template/api.js";
import { storeTemplateRules } from "./validationRules.js";
import { message } from "ant-design-vue";

// 路由相关 - 不需要响应式
const route = useRoute();
const query = ref(route.query);
const labelCol = { style: { width: "110px" } };
// 表单引用
const formRef = ref();
const watermarkTableRef = ref();
const accountList = reactive([]);
let timer = null;
// 提交全局loading状态
const subLoading = ref(false);

// 产品描述添加方式列表 - 不需要响应式
const productDescAddTypeList = [
  {
    value: 0,
    label: "在产品描述前",
  },
  {
    value: 1,
    label: "在产品描述后",
  },
];

// 表单数据
const formState = reactive({
  // 店铺模板名称
  shopTemplateName: null,
  // 店铺简称
  simpleName: null,
  // 店铺id
  account: null,
  // 状态：0 默认，1 备选
  status: null,
  // 产品描述添加内容
  productDescAddContent: null,
  // 产品描述添加方式：0 在产品描述前，1 在产品描述后
  productDescAddType: null,
  // 首重物流费
  firstPriorityLogisticFee: 2.8,
  // 续重物流费
  continuedLogisticFee: 0.032,
  // 定价利润率，单位%
  profitRate: 23,
  // 折损率，单位%
  lossRate: 2,
  // 提现手续费率，单位%
  withdrawalFeeRate: 2,
  // 物流佣金（RUB）
  logisticCommissionRate: 15,
  // 平台佣金费率，单位%
  platformCommissionRate: 12,
  // 原价折扣率，单位%
  originalDiscountRate: 60,
  // 折扣率，单位%
  discountRate: 3,
  // 富文本模版图片位置：例如standard,1,2,3,4
  jsonEditorImgIndex: "standard,1,2,3,4,5",
  // 主图水印模版id
  mainImgWmTemplateId: null,
  // 副图水印模版id
  subImgWmTemplateId: null,
  // 富文本水印模版id
  editorImgWmTemplateId: null,
});

const isDesable = computed(() => {
  return query.value.type === "view"
})


// 店铺账号筛选
const filterOption = (inputValue, option) => {
  const label = option.simpleName; // 因为你的数据中有 simpleName 字段
  return label.toLowerCase().includes(inputValue.toLowerCase());
}

// 获取店铺列表
const getShopLists = async () => {
  const res = await getShopList();
  if (res.code === 200) {
    accountList.splice(0, accountList.length, ...(res?.data || []));
  }
};

// 表单提交成功处理
const handleFinish = (values) => {
  console.log(values, formState);
};

// 表单提交失败处理
const handleFinishFailed = (errors) => {
  console.log(errors);
};

// 重置表单
const resetForm = () => {
  formRef.value.resetFields();
};


// 提交表单
const submitForm = async () => {
  try { 
    subLoading.value = true;
    // 获取水印模版id
    const watermarkIds = watermarkTableRef.value.watermarkTableRefIds();
    // 合并表单数据
    Object.assign(formState, watermarkIds);
    // 校验表单
    await formRef.value.validate();
    // 校验通过，继续提交表单
    const api = query.value.id ? updateShopTemplate : createShopTemplate;
    if (query.value.copyId) {
      delete formState.id;
    }
    const res = await api(formState);
    if (res.code === 200) {
      message.success(query.value.id ? "更新店铺模板成功" : "创建店铺模板成功");
      // 刷新列表页
      const channel = new BroadcastChannel("store_template_getList");
      channel.postMessage({ action: "refreshList" });
      resetForm();
      // 刷新详情页
      if (!query.value.id) {
        //延迟1秒关闭窗口
        timer = setTimeout(() => {
          window.close()
        }, 1000);
      }else{
        getDetails(query.value.id);
      }
    } else {
      message.error(
        res.msg || (query.value.id ? "更新店铺模板失败" : "创建店铺模板失败")
      );
    }
    subLoading.value = false;
  } catch (error) {
    subLoading.value = false;
    // 校验未通过，显示用户友好的提示信息
    if (error.errorFields) {
      // 表单验证错误
      message.error("表单校验失败，请检查输入内容是否正确");
      console.warn("表单校验失败", error);
    } else {
      // 其他错误
      message.error("提交失败，请稍后重试");
      console.error("提交表单时发生错误", error);
    }
  }
};



/** JSON 富文本 */
const backResult = (jsonContent) => {
  console.log(jsonContent);
  formState.jsonEditorImgIndex = jsonContent.positions.join(",") || "";
};

const getDetails = async (id) => {
  subLoading.value = true;
  const res = await getShopTemplateDetails(id);
  if (res.code === 200) {
    Object.assign(formState, res.data);
    const { mainImgWmTemplateId, subImgWmTemplateId } = res.data;
    // 详情水印表格
    watermarkTableRef.value.getWatermarkList(mainImgWmTemplateId, subImgWmTemplateId);
    console.log('res.data', res.data)
    if (query.value.type === "copy") {
      console.log(query.value);
      formState.status = 1;
      formState.account = query.value.account || "";
    }
  } else {
    message.error(res.msg || "获取店铺模板详情失败");
  }
  subLoading.value = false;
};


onMounted(() => {
  getShopLists();
  // 详情页初始化
  if (query.value.id || query.value.copyId) {
    getDetails(query.value.id || query.value.copyId);
  }else{
    // 新增
    watermarkTableRef.value.getWatermarkList(null, null);
  }

});

onUnmounted(() => {
  // 组件卸载时清除定时器
  if (timer) {
    clearTimeout(timer);
  }
});
</script>

<style scoped lang="less">
@import "@/assets/styles/com-detail.less";

::deep(.ant-input-number) {
  width: 190px !important;
}

/* 调整内联表单的整体样式 */
:deep(.ant-form-inline .ant-form-item) {
  margin-right: 16px;
  margin-bottom: 16px;
}

/* 确保按钮区域也能正确显示 */
:deep(.ant-form-item:last-child) {
  margin-bottom: 0;
}
</style>
