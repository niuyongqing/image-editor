<template>
  <div>
    <a-modal title="选择类目" :open="selectVisible" :maskClosable="false" @cancel="handleClose" :width="'35%'"
      :keyboard="false">
      <div>
        <!-- @change="getAttributes" filterable -->
        <a-cascader style="width: 80%; margin-bottom: 5px" clearable v-model:value="attributesValue" :options="categoryTreeList"
          ref="cascaderNode" showSearch @change="getAttributes" :fieldNames="{
            value: 'descriptionCategoryId',
            label: 'categoryName',
            children: 'children',
          }"></a-cascader>
      </div>
      <template #footer>
        <a-button @click="handleClose">取 消</a-button>
        <a-button type="primary" @click="submit">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup name="editStoreDialog">
import { message } from "ant-design-vue";

const props = defineProps({
  selectVisible: Boolean,
  categoryTreeList: Array,
});
const emit = defineEmits(["getAttributesID", "handleEditClose"]);
const loading = ref(false)
const attributesValue = ref([])
const categoryId = ref({})
const selectedNodeName = ref({})

// 关闭弹窗
const handleClose = () => {
  emit("handleEditClose");
  categoryId.value = {};
  attributesValue.value = [];
}
const submit = () => {
  if (attributesValue.value.length == 0) {
    message.error("请先选则分类")
    return
  }
  console.log('categoryId',categoryId.value);
  
  emit("getAttributesID", categoryId.value);
  handleClose()
}
const getAttributes = (value, selectedOptions) => {
  categoryId.value = {
    label: selectedOptions[2].categoryName,
    value: selectedOptions[2].descriptionCategoryId,
    secondCategoryId: selectedOptions[1].descriptionCategoryId,
  };
  // console.log('e', value, selectedOptions);
}
</script>

<style lang="less" scoped></style>