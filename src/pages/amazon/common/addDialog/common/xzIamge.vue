<template>
<div id="xzIamge">
  <div class="img-item">
    <a-image
      :width="200"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    />
    <div class="image-item-foot">
      <a-checkbox v-model:checked="imageData.checked" @change="checkedChecked"></a-checkbox>
      <a-tooltip>
        <template #title>{{ data.name }}</template>
        <div class="image-name">{{ data.name }}</div>
      </a-tooltip>
      <DeleteOutlined @click="delImage"/>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
defineOptions({ name: "xzIamge" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:check'])
const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  },
  checked: Boolean,
})
const imageData = reactive({
  checked: false,
})
function checkedChecked(e) {
  
}
function delImage() {

}
</script>
<style lang="less" scoped>
.img-item {
  width: 200px;
  height: 240px;
  margin: 0 15px 15px 0;
  .image-item-foot {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    align-items: center;
    border: 1px solid #dcdfe6;
    .image-name {
      padding: 0 10px;
      width: calc(100% - 50px);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>