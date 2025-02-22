<template>
<div id="AmazonProductInfo">
  <div class="title">
    <span>产品信息</span>
  </div>
  <div class="content">
    <sechmaForm 
      :sechma="props.schemaData"
      v-model:formState="form.formState"
      @proactivelyChange="emit('formValueChange', 'product')"
      ref="sechmaFormRef"
    ></sechmaForm>
  </div>
</div>
</template>

<script setup>
import sechmaForm from '@/pages/amazon/common/sechma/index.vue'
import { ref, reactive, onMounted, computed, watchPostEffect, nextTick } from 'vue'
defineOptions({ name: "AmazonProductInfo" });
const { proxy: _this } = getCurrentInstance();
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
const form = reactive({
  formState: {}
})  // 表单
onMounted(() => { })
const emit = defineEmits(['update:modelForm', 'formMounted', 'formValueChange'])
// 更新表单值
watch(() => form.formState, (val, oldVal) => {
  nextTick(() => {
    console.log(55);
    emit('update:modelForm', val)
  })
}, {
  deep: true,
  // immediate: true
})
watch(props.modelForm, () => {
  console.log('5555');
  
},{
  deep: true,
})
// 校验，暴露数据
async function save() {
  let obj = {
    result: false,
    params: JSON.parse(JSON.stringify(form.formState))
  }
  try {
    obj.result = await _this.$refs.sechmaFormRef.resetFieldsFn()
  } catch (error) {}
  return obj
}
defineExpose({
  save,
})
</script>
<style lang="less" scoped>

</style>