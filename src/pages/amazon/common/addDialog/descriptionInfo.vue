<template>
<div id="AmazonDescriptionInfo">
  <div class="title">
    <span>详细信息</span>
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
import VueForm from '@/assets/library/jsonScheam_v3_ant/vue3-form-ant.esm.min.js';
import { ref, reactive, onMounted, computed, watchPostEffect, nextTick } from 'vue';
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
  modelForm: {
    type: Object,
    default: () => {}
  }
});
const emit = defineEmits(['update:modelForm', 'formMounted', 'formValueChange'])
let form = ref({});             // 取值对象
let schemaData = ref({});
let formRef = ref(null);
let isComplete = ref(false);     // 是否加载完成
// form加载完成触发
function formMounted(ref, { formData }) {
  formRef.value = ref;
  
  nextTick(() => {
    setTimeout(() => {
      isComplete.value = true;
      emit('formMounted', 'description');
    }, 2000);
  })
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
let timeout = null
function formChange() {
  if (timeout) {
    clearTimeout(timeout)
  }
  timeout = setTimeout(() => {
    emit('update:modelForm', form.value)
    nextTick(() => {
      emit('formValueChange', 'description')
    })
  }, 500);
}
// 更新值
function updateForm(val) {
  console.log({val}, 'sdfgsfsde');
  
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
watchPostEffect(() => {
  schemaData.value = props.schemaData
  isComplete.value = false
});
</script>
<style lang="less" scoped>

</style>