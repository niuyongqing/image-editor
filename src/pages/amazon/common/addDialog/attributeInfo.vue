<template>
<div id="AmazonAttributeInfo">
  <div class="title">
    <span>属性信息</span>
  </div>
  <div class="content" style="overflow-y: auto; max-height: 500px;">
    <sechmaForm 
      :sechma="props.schemaData"
      v-model:formState="form.formState"
      ref="sechmaFormRef"
    ></sechmaForm>
  </div>
</div>
</template>

<script setup>
import sechmaForm from '@/pages/amazon/common/sechma/index.vue'
import { ref, reactive, onMounted, computed, watchPostEffect, toRefs, watch, nextTick } from 'vue'
defineOptions({
  name: "AmazonAttributeInfo"
})
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