<template>
<div id="AmazonDescriptionInfo">
  <div class="title">
    <span>详细信息</span>
  </div>
  <div class="content">
    <VueForm
      v-model="form"
      :schema="schemaData"
      class="sechma-form"
      :form-footer="{
        show: false
      }"
      @form-mounted="formMounted"
      @change="formChange"
    ></VueForm>
  </div>
</div>
</template>

<script setup>
import VueForm from '@/assets/library/jsonScheam_v3_ant/vue3-form-ant.esm.min.js';
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue';
defineOptions({
  name: "AmazonDescriptionInfo"
});
const props = defineProps({
  // 属性数据
  schemaData: {
    type: Object,
    required: true,
    default: () => {}
  },
  descriptionForm: {
    type: Object,
    default: () => {}
  }
});
const emit = defineEmits(['update:descriptionForm'])
let form = ref({});             // 取值对象
let schemaData = ref({});
let formRef = ref(null)
function formMounted(ref, { formData }) {
  // console.log(ref, { formData });
  formRef.value = ref
};
// 校验，暴露数据
async function save() {
  let obj = {
    result: false,
    params: form.value
  }
  try {
    let res = await formRef.value.validateFields()
    obj.result = true
  } catch (error) {}
  return obj
};
function formChange(val) {
  emit('update:descriptionForm', form.value)
};
defineExpose({
  formRef,
  save
});
watchPostEffect(() => {
  schemaData.value = props.schemaData
});
</script>
<style lang="less" scoped>

</style>