<template>
<div id="AmazonBaseInfo">
  <div class="title">
    <span>基本信息</span>
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
import VueForm from '@/assets/library/jsonScheam_v3_ant/vue3-form-ant.esm.min.js';
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
defineOptions({
  name: "AmazonBaseInfo"
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
.title {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #e8e8e8;
  color: #434649;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  span {
    font-size: 20px;
    font-weight: 700;
    margin-left: 15px;
  }
}
.content {
  width: 100%;
  // height: 500px;
}
</style>