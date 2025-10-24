<template>
  <div class="pending-editing-container ml-16 mr-16">
    <a-form
      ref="formRef"
      layout="inline"
      :model="formState"
      :label-col="labelCol"
      :rules="rules"
      @finish="handleFinish"
      @validate="handleValidate"
      @finishFailed="handleFinishFailed"
    >
      <!-- 店铺编号单独占一整行 -->
      <a-form-item label="店铺编号" name="shopId" class="block-item">
        <a-select
          style="width: 190px"
          v-model:value="formState.shopId"
          allow-clear
          placeholder="请选择店铺编号"
        >
          <!-- 这里可以根据实际需要添加选项 -->
        </a-select>
      </a-form-item>

      <!-- 其他表单字段保持内联布局 -->
      <a-form-item label="模板名称" name="templateName">
        <a-input
          style="width: 400px"
          allow-clear
          v-model:value="formState.templateName"
          placeholder="请输入模板名称"
        />
      </a-form-item>

      <a-form-item label="状态" name="status">
        <a-radio-group v-model:value="formState.status">
          <a-radio value="default">默认</a-radio>
          <a-radio value="standby">备用</a-radio>
        </a-radio-group>
      </a-form-item>
      <span class="borderTop"></span>
      <div class="module-item">
        <div class="module-item-label">产品模板</div>
        <div class="module-item-content">
          <a-form-item label="添加方式" name="templateName">
            <a-input
              style="width: 150px"
              allow-clear
              v-model:value="formState.templateName"
              placeholder="请输入添加方式"
            />
          </a-form-item>
          <a-form-item
            label="添加内容"
            name="templateContent"
            class="wInput100"
          >
            <a-textarea
              rows="6"
              :maxlength="255"
              allow-clear
              v-model:value="formState.templateContent"
              placeholder="请输入添加内容,最大255个字符"
            />
          </a-form-item>
        </div>
      </div>
      <span class="borderTop"></span>
      <div class="module-item">
        <div class="module-item-label">定价模板</div>
        <div class="module-item-content flex flexItem180">
          <a-form-item label="首重物流费" name="templateName">
            <a-input-number
              class="w40"
              :controls="false"
              v-model:value="formState.templateName"
              allow-clear
              placeholder="请输入首重物流费"
            />
          </a-form-item>
          <a-form-item label="定价利润率" name="pricingMargin">
            <a-input-number
              class="w40"
              :controls="false"
              allow-clear
              v-model:value="formState.pricingMargin"
              placeholder="请输入定价利润率"
              suffix="%"
            />
          </a-form-item>
          <a-form-item label="折损率" name="lossRate">
            <a-input-number
              class="w40"
              :controls="false"
              allow-clear
              v-model:value="formState.lossRate"
              placeholder="请输入折损率"
              suffix="%"
            />
          </a-form-item>
          <a-form-item label="提现手续费" name="withdrawalFee">
            <a-input-number
              class="w40"
              :controls="false"
              allow-clear
              v-model:value="formState.withdrawalFee"
              placeholder="请输入提现手续费"
              suffix="%"
            />
          </a-form-item>
          <a-form-item label="物流佣金(RUB)" name="logisticsCommission">
            <a-input-number
              class="w40"
              :controls="false"
              allow-clear
              v-model:value="formState.logisticsCommission"
              placeholder="请输入物流佣金(RUB)"
            />
          </a-form-item>
          <a-form-item label="平台佣金" name="platformCommission">
            <a-input-number
              class="w40"
              :controls="false"
              allow-clear
              v-model:value="formState.platformCommission"
              placeholder="请输入平台佣金"
            />
          </a-form-item>
          <a-form-item label="原价折扣" name="originalPriceDiscount">
            <a-input-number
              class="w40"
              :controls="false"
              allow-clear
              v-model:value="formState.originalPriceDiscount"
              placeholder="请输入原价折扣"
            />
          </a-form-item>
          <a-form-item label="续重物流费" name="additionalWeightLogisticsFee">
            <a-input-number
              class="w40"
              :controls="false"
              allow-clear
              v-model:value="formState.additionalWeightLogisticsFee"
              placeholder="请输入续重物流费"
            />
          </a-form-item>
        </div>
      </div>
      <span class="borderTop"></span>
      <div class="module-item">
        <div class="module-item-label">富文本模板</div>
        <div class="module-item-content">
          <a-form-item
            name="richTextTemplate"
            class="wInput100"
          >
            <jsonEditor
              ref="jsonEditorRef"
              :is-show-edit-json="true"
              :is-modules="false"
              :is-intelligentize="true"
              :json-content="formState.jsons"
              json-width="100%"
              shop="没用的字段"
              @clear="formState.jsons = ''"
              @back-result="backResult"
            />
          </a-form-item>
        </div>
      </div>
            <span class="borderTop"></span>
      <div class="module-item">
        <div class="module-item-label">富文本模板</div>
        <div class="module-item-content">
          <a-form-item
            name="richTextTemplate"
            class="wInput100"
          >
            <watermarkTable
              ref="watermarkTableRef"
              :dataSource="watermarkTableData"
            />
          </a-form-item>
        </div>
      </div>
      <!-- 操作按钮 -->
      <div class="form-actions mt-24">
        <a-button type="primary" html-type="submit">提交</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
      </div>
    </a-form>
  </div>
</template>
<script setup>
import { reactive, ref, computed } from "vue";
import { useRoute } from "vue-router";
import jsonEditor from "@/pages/ozon/config/component/json/index.vue";
import watermarkTable from "./comm/watermarkTable.vue";
// 导入表单验证规则
import { generateRules } from "./utils/rule.js";

// 路由相关
const route = useRoute();
const id = ref(route.query.id);
const labelCol = { style: { width: "100px" } };
// 表单引用
const formRef = ref();
// 水印表格
const watermarkTableData = ref([])
// 表单数据
const formState = reactive({
  shopId: "",
  templateName: "",
  status: "default", // 默认选中"默认"选项
});

// 计算属性：根据表单状态和引用生成验证规则
const rules = computed(() => generateRules(formState, formRef));

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

// 表单验证处理
const handleValidate = (...args) => {
  console.log(args);
};

/** JSON 富文本 */
const backResult = (jsonContent) => {
  formState.jsons = JSON.stringify(jsonContent);
};
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
