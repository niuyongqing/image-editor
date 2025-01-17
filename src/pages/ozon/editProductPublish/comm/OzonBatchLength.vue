<template>
  <div id="OzonBatchLengthCont">
    <a-modal :open="editLengthRangeVis" @cancel="handleCancel" :maskClosable="false" :width="'42%'" :keyboard="false"
      title="修改尺寸">

      <!-- 对话框内容 -->
      <div class="flex pt-2.5">
        <div class="flex w-50 items-start">
          长：
          <a-input-number v-model:value="lengthRange.packageLength" class="w-full" controls-position="right"
            placeholder="长"></a-input-number>
        </div>
        <div class="flex w-50 ml-2.5 items-start">
          宽：
          <a-input-number v-model:value="lengthRange.packageWidth" class="w-full" controls-position="right"
            placeholder="宽"></a-input-number>
        </div>
        <div class="flex w-50 ml-2.5 items-start">
          高：
          <a-input-number v-model:value="lengthRange.packageHeight" class="w-full" controls-position="right"
            placeholder="高"></a-input-number>
        </div>
        <div class="flex w-60 ml-8 items-start">
          <span class="w-15">重量：</span>
          <a-input-number v-model:value="lengthRange.packageWeight" class="w-full" controls-position="right"
            placeholder="重量"></a-input-number>
        </div>
      </div>
      <template #footer>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" :loading="loading" @click="onSubmit">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup name='OzonBatchLength'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'

const props = defineProps({
  editLengthRangeVis: Boolean
})
const loading = ref(false)
const emit = defineEmits(["backCloseBatchLength", "backBatchLength"]);
const lengthRange = reactive({
  packageLength: "",
  packageWidth: "",
  packageHeight: "",
  packageWeight: "",
})

const handleCancel = () => {
  emit("backCloseBatchLength")
  lengthRange.packageLength = ""
  lengthRange.packageWidth = ""
  lengthRange.packageHeight = ""
  lengthRange.packageWeight = ""
}
const onSubmit = () => {
  emit("backBatchLength", lengthRange)
  handleCancel()
}
</script>
<style lang="less" scoped></style>