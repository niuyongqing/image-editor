<template>
<div id="amazonImageInfo">
  <div class="title">
    <span>产品图片</span>
  </div>
  <div class="content">
    <a-form
      :model="formState"
      name="basic"
    >
      <a-form-item-rest
        label="产品图片"
        name="username"
        tooltip="sadasdasdfsd"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <dragFileUpload></dragFileUpload>
      </a-form-item-rest>
    </a-form>
  </div>
</div>
</template>

<script setup>
import dragFileUpload from '../dragFileUpload.vue';
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
defineOptions({
  name: "amazonImageInfo"
})
const formState = reactive({
  username: '',
  password: '',
  remember: true,
});
</script>
<style lang="less" scoped>
#amazonImageInfo {
  .content {
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 0 3px 1px rgba(0, 0, 0, 0.1);
    padding: 10px 15px 5px;
    ::v-deep(.ant-form-item-row .ant-form-item-label) {
      width: 200px;
      height: auto;
      word-break: break-all;
      word-wrap: break-word;
      text-align: right;
      line-height: unset;
      padding-bottom: 0;
    }
  }
}
</style>