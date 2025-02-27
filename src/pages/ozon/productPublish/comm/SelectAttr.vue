<template>
  <a-modal title="选择变种属性" :open="attrVisible" :maskClosable="false" @cancel="handleClose" :width="'35%'"
    :keyboard="false">
    <div>
      <a-input v-model:value="attributeName" @change="filteredAttr" clearable style="width: 80%"
        placeholder="搜索属性名称"></a-input>
    </div>
    <a-table ref="multipleTable" class="mt-2.5 w-full" :scroll="{ y: 500 }" :columns="headerList" :data-source="newList"
      bordered :pagination="false" :rowKey="(row) => row"
      :row-selection="{ selectedRowKeys, onChange: onSelectChange }">
    </a-table>
    <template #footer>
      <a-button @click="handleClose">取消</a-button>
      <a-button type="primary" @click="submit">确定</a-button>
    </template>
  </a-modal>
</template>

<script setup name=''>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'

const props = defineProps({
  attrVisible: Boolean,
  custAttr: Array,
  newAttribute: Array
});
const emit = defineEmits(["handleStatsModalClose", "selectAttrList"]);
const selectAttrs = ref([])
const attributeName = ref("")
const selectedRowKeys = ref([])
const newList = ref(props.custAttr)
const headerList = [
  {
    title: '属性',
    dataIndex: "name",
    key: 'name',
    align: "center",
  },
]

const filteredAttr = (e) => {
  newList.value = attributeName.value ? props.custAttr.filter((attribute) =>
    attribute.name.includes(attributeName.value)
  ) : props.custAttr
}

const handleClose = () => {
  emit("handleStatsModalClose")
  selectedRowKeys.value = [];
}

const submit = () => {
  emit("selectAttrList", selectAttrs.value);
  emit("handleStatsModalClose")
}

const onSelectChange = (selection, row) => {
  selectAttrs.value = selection;
  selectedRowKeys.value = selection
}

watch(() => props.custAttr, val => {
  if (val) {
    newList.value = val
  }
})

watch(() => props.newAttribute, val => {
  if (val.length > 0) {
    selectedRowKeys.value = val
  }
})
</script>
<style lang="less" scoped></style>