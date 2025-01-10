<template>
<div id="AmazonAttributeInfo">
  <div class="title">
    <span>属性信息</span>
  </div>
  <div class="content">
    <VueForm
      v-if="schemaData.$id"
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
import { ref, reactive, onMounted, computed, watchPostEffect, toRefs, watch, nextTick } from 'vue'
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
  modelForm: {
    type: Object,
    default: () => {}
  }
});
const emit = defineEmits(['update:modelForm', 'formMounted', 'formValueChange'])
// watch(form, (val, oldVal) => {
//   emit('update:modelForm', val)
// }, {
//   deep: true
// })
let form = ref({});             // 取值对象
let schemaData = ref({});
let formRef = ref(null);
let isComplete = ref(false);     // 是否加载完成
watchPostEffect(() => {
  schemaData.value = props.schemaData
  isComplete.value = false
  console.log('数据变更');
  
});
// form加载完成触发
function formMounted(ref, { formData }) {
  formRef.value = ref;
  isComplete.value = true;
  console.log('jiazaiwancheng');
  
  emit('formMounted', 'attribute');
  // nextTick(() => {
  //   setTimeout(() => {
  //   }, 2000);
  // })
}
let timeout = null
function formChange() {
  console.log('值变更', isComplete.value);
  if (!isComplete.value) return;
  if (timeout) {
    clearTimeout(timeout)
  }
  timeout = setTimeout(() => {
    console.log(JSON.parse(JSON.stringify(form.value)), 'sdgsdg');
    emit('update:modelForm', form.value)
    // emit('formValueChange', 'attribute')
    nextTick(() => {
      emit('formValueChange', 'attribute')
    })
  }, 500);
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
// 更新值
function updateForm(val) {
  Object.keys(form.value).forEach(item => {
    if (val[item]) {
      form.value[item] = val[item]
    }
  })
}
defineExpose({
  formRef,
  save,
  isComplete,
  updateForm
})
</script>
<style lang="less" scoped>

</style>