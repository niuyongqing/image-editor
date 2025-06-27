<template>
  <div>
    <a-modal title="选择类目" :open="selectVisible" :maskClosable="false" @cancel="handleClose" :width="'53%'"
      :keyboard="false" class="cascaderModal" :footer="null">
      <div class="flex">
        <div class="mt-5" style="margin-bottom: 30%;width: 80%;">
          <!-- @change="getAttributes" filterable -->
          <a-cascader style="width: 100%; margin-bottom: 5px" clearable v-model:value="attributesValue"
            :options="categoryTreeList" ref="cascaderNode" showSearch @change="getAttributes" :fieldNames="{
              value: 'descriptionCategoryId',
              label: 'categoryName',
              children: 'children',
            }" :open="setOpen" popupClassName="popupCascaderModal"></a-cascader>
        </div>
        <div class="mt-5 ml-2.5">
          <a-button @click="handleClose">取 消</a-button>
          <a-button class="ml-2.5" type="primary" @click="submit">确定</a-button>
        </div>
      </div>
      <!-- <template #footer>
        <a-button @click="handleClose">取 消</a-button>
        <a-button type="primary" @click="submit">确定</a-button>
      </template> -->
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
const setOpen = ref(true)

watch(() => props.selectVisible, (val) => {
  if (val) {
    setOpen.value = true
  }
})

// 关闭弹窗
const handleClose = () => {
  emit("handleEditClose");
  // categoryId.value = {};
  setOpen.value = false;
  // attributesValue.value = [];
}
const submit = () => {
  if (attributesValue.value.length == 0) {
    message.error("请先选则分类")
    return
  }
  console.log('categoryId', categoryId.value);

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

<style lang="less">
.popupCascaderModal {
  .ant-cascader-menus .ant-cascader-menu {
    height: 350px !important; // 设置具体高度值

    .ant-cascader-menu-item .ant-cascader-menu-item-content {
      width: 260px !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }
  }
}
</style>