<template>
<div id="AmazonProductInfo">
  <div class="title">
    <span>产品信息</span>
  </div>
  <div class="content">
    <VueForm
      v-model="form"
      :schema="schemaData"
      class="sechma-form"
      :form-footer="{
        show: false
      }"
      @change="formChange"
      @form-mounted="formMounted"
    ></VueForm>
  </div>
</div>
</template>

<script setup>
import VueForm, {globalOptions, createVue3Core} from '@/assets/library/jsonScheam_v3_ant/vue3-form-ant.esm.min.js';
import { ref, reactive, onMounted, computed, watchPostEffect, nextTick } from 'vue'
defineOptions({
  name: "AmazonProductInfo"
})
const props = defineProps({
  // 属性数据
  schemaData: {
    type: Object,
    required: true,
    default: () => { }
  },
  modelForm: {
    type: Object,
    default: () => {}
  }
});
let _this = null
onMounted(() => {
  let aa = createVue3Core(globalOptions);
  let { proxy } = getCurrentInstance()
  _this = proxy
  // console.log({VueForm, aa, _this});
})
const emit = defineEmits(['update:modelForm', 'formMounted', 'formValueChange'])
let form = ref({});             // 取值对象
let schemaData = ref({});
let formRef = ref(null);
let isComplete = ref(false);     // 是否加载完成
watchPostEffect(() => {
  schemaData.value = JSON.parse(JSON.stringify(props.schemaData))
  isComplete.value = false
});
watch(props.modelForm, () => {
  console.log('5555');
  
},{
  deep: true,
})
// form加载完成触发
function formMounted(ref, { formData }) {
  formRef.value = ref;
  
  nextTick(() => {
    setTimeout(() => {
      isComplete.value = true;
      emit('formMounted', 'product');
    }, 2000);
  })
}
let timeout = null
function formChange() {
  if (timeout) {
    clearTimeout(timeout)
  }
  timeout = setTimeout(() => {
    emit('update:modelForm', form.value)
    nextTick(() => {
      emit('formValueChange', 'product')
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