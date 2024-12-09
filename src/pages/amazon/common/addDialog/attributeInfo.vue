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
    ></VueForm>
  </div>
</div>
</template>

<script setup>
// import sechmaData from './sechma/TrainSets - 副本.json'
// import sechmaData from './sechma/TrainSets.json'
import VueForm from '@/assets/library/jsonScheam_v3_ant/vue3-form-ant.esm.min.js';
import { ref, reactive, onMounted, computed, watchPostEffect, toRefs } from 'vue'
defineOptions({
  name: "AmazonAttributeInfo"
})
const props = defineProps({
  // 属性数据
  schemaData: {
    type: Object,
    required: true,
    default: () => {}
  }
})
let form = {};             // 取值对象
let schemaData = props.schemaData
let formRef = ref(null)
function formMounted(ref, { formData }) {
  // console.log(ref, { formData });
  formRef.value = ref
}
defineExpose({
  formRef
})
</script>
<style lang="less" scoped>

</style>