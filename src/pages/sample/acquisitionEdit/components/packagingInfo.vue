<template>
<div id="packagingInfo" class="packagingInfo">
  <a-card style="text-align: left;">
    <template #title>
      包装运输
    </template>
    <a-form :model="formData" ref="ERPformRef" :label-col="{ span: 3 }">
      <a-form-item label="重量" name="weight">
        <a-input-number :min="0" v-model:value="formData.weight" placeholder="请输入重量，示例:0.001">
          <template #addonAfter>kg</template>
        </a-input-number>
      </a-form-item>
      <a-form-item label="尺寸" name="size">
        <a-form-item-rest>
          <div class="size-box">
            <a-input-number :min="0" v-model:value="formData.length" placeholder="长">
              <template #addonAfter>CM</template>
            </a-input-number>
            <a-input-number :min="0" v-model:value="formData.width" placeholder="宽">
              <template #addonAfter>CM</template>
            </a-input-number>
            <a-input-number :min="0" v-model:value="formData.height" placeholder="高">
              <template #addonAfter>CM</template>
            </a-input-number>
          </div>
        </a-form-item-rest>
      </a-form-item>
    </a-form>
  </a-card>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
defineOptions({ name: "packagingInfo" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:packagingInfoData'])
const props = defineProps({
  packagingInfoData: {
    type: Object,
    default: () => {},
  },
  productData: {
    type: Object,
    default: () => { },
  }
})
const formData = reactive({
  length: undefined, // 长
  width: undefined, // 宽
  height: undefined,  // 高
  weight: undefined,  // 重量
})
watch(() => props.productData?.id, (val) => {
  // console.log(111);
  openFn()
})
watch(() => formData, (val) => {
  // console.log({ val });
  let obj = { ...val };
  emit('update:packagingInfoData', obj)
}, {
  deep: true
})
// 页面赋值
function openFn() {
  
}
</script>
<style lang="less" scoped>
.size-box {
  width: 100%;
  display: flex;
}
:deep(.ant-input-number-group-wrapper) {
  width: 230px;
  margin-right: 20px;
}
</style>