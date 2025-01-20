<template>
  <div>
    <a-card bordered>
      <template #title>
        <div class="clearfix">
          <span>产品设置</span>
          <span style="margin-left: 30px; color: #9e9f9e; font-size: 12px">
            带 <span style="color: red">*</span> 为必填项
          </span>
        </div>
      </template>
      <a-form :model="formData" :rules="rules" ref="formRef" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
        <a-form-item label="适用范围：" name="apply">
          <a-radio-group v-model:value="formData.apply">
            <a-radio value="ENTIRE_STORE" v-if="!applyDisable">全店产品</a-radio>
            <a-radio value="SPECIFIC_PRODUCTS">部分商品（请在提交活动后选择商品）</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="Flexi Combo订单总数：" name="orderUsedNumbers">
          <a-input-number v-model:value="formData.orderUsedNumbers" />
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import EventBus from "~/utils/event-bus";
const applyDisable = ref(false);
const formEl = useTemplateRef('formRef');
const formData = ref({
  apply: 'ENTIRE_STORE',
  orderUsedNumbers: undefined,
});

const rules = ref({
  apply: [{ required: true, message: '请选择', trigger: 'change' }],
  orderUsedNumbers: [{ required: true, message: '请输入总数', trigger: 'blur' }],
});

onMounted(() => {
  // 一口价时 隐藏 全店
  EventBus.on('changeType', () => {
    applyDisable.value = true;
    formData.value.apply = 'SPECIFIC_PRODUCTS';
  });

  EventBus.on('changeTypeFalse', () => {
    applyDisable.value = false;
    formData.value.apply = 'ENTIRE_STORE';
  });
});

const baseValidate = async () => {
  const validatePromise = (formRef) =>
    new Promise(async (resolve) => {
      const res = await formRef.validate();
      resolve(res)
    });
  return await validatePromise(formEl.value);
};

const clear = () => {
  formEl.value.resetFields();
}

defineExpose({
  formData,
  clear,
  baseValidate,
})
</script>