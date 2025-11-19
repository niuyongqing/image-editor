<template>
<div id="appTablePagination" class="appTablePagination">
  <a-pagination
    :show-total="(total) => `共 ${total} 条`"
    @update:current="pageNumChange"
    @update:page-size="pageSizeChange"
    :current="paginations.pageNum"
    :pageSize="paginations.pageSize"
    :total="props.total"
    class="pages"
    :show-quick-jumper="true"
    :showSizeChanger="true"
    :pageSizeOptions="props.pageSizeOptions"
    @change="onChange"
  />
</div>
</template>

<script setup>
defineOptions({ name: "appTablePagination" })
const emit = defineEmits(['update:current', 'update:pageSize', 'pageNumChange', 'pageSizeChange', 'change'])
const props = defineProps({
  current: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 20
  },
  total: {
    type: Number,
    default: 0
  },
  pageSizeOptions: {
    type: Array,
    default: () => ([20, 50, 100, 200])
  }
})
const paginations = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0,
});
// 分页变化
function pageNumChange(val) {
  paginations.pageNum = val
  emit('update:current', val)
  emit('pageNumChange', val)
};
function pageSizeChange(val) {
  paginations.pageSize = val
  emit('update:pageSize', val)
  emit('pageSizeChange', val)
};
function onChange(page, pageSize) {
  // console.log({ page, pageSize }, 'change');
  const validPage = page === 0 ? 1 : page;
  emit('change', { validPage, pageSize });
  // emit('update:current', page)
  // emit('update:pageSize', pageSize)
}
</script>
<style lang="less" scoped>
.appTablePagination {
  width: 100%;
  margin: 16px 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  :deep(.ant-select-selector) {
    width: 100px !important;
  }
}
</style>