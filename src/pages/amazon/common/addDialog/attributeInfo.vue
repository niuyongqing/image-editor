<template>
<div id="AmazonAttributeInfo">
  <div class="title">
    <span>属性信息</span>
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
// import sechmaData from './sechma/TrainSets - 副本.json'
// import sechmaData from './sechma/TrainSets.json'
import VueForm from '@/assets/library/jsonScheam_v3_ant/vue3-form-ant.esm.min.js';
import { ref, reactive, onMounted, computed, watchPostEffect, toRefs, watch } from 'vue'
defineOptions({
  name: "AmazonAttributeInfo"
})
const props = defineProps({
  // 属性数据
  schemaData: {
    type: Object,
    required: true,
    default: () => {}
  },
  attributeForm: {
    type: Object,
    default: () => {}
  }
});
const emit = defineEmits(['update:attributeForm'])
// watch(form, (val, oldVal) => {
//   emit('update:attributeForm', val)
// }, {
//   deep: true
// })
watchPostEffect(() => {
  schemaData.value = props.schemaData
});
let form = ref({});             // 取值对象
let schemaData = ref({});
let formRef = ref(null)
function formMounted(ref, { formData }) {
  // console.log(ref, { formData });
  formRef.value = ref
}
function formChange() {
  emit('update:attributeForm', form.value)
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
  } catch (error) {}
  return obj
}
defineExpose({
  formRef,
  save
})
</script>
<style lang="less" scoped>

</style>