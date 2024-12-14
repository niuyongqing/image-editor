<template>
<div id="AmazonOfferInfo">
  <div class="title">
    <span>价格信息</span>
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
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
defineOptions({
  name: "AmazonOfferInfo"
})
const props = defineProps({
  // 属性数据
  schemaData: {
    type: Object,
    required: true,
    default: () => {}
  },
  offerForm: {
    type: Object,
    default: () => {}
  }
});
watchPostEffect(() => {
  schemaData.value = props.schemaData;
});
const emit = defineEmits(['update:offerForm'])
let form = ref({});             // 取值对象
let schemaData = ref({});
let formRef = ref(null)
function formMounted(ref, { formData }) {
  // console.log(ref, { formData });
  formRef.value = ref
}
function formChange(val) {
  emit('update:productForm', form.value)
}
// 校验，暴露数据
async function save() {
  let obj = {
    result: false,
    params: form.value
  }
  try {
    let res = await formRef.value.validateFields()
    obj.result = true
  } catch (error) {
    console.log({error});
    
  }
  return obj
}
defineExpose({
  formRef,
  save
})
</script>
<style lang="less" scoped>

</style>