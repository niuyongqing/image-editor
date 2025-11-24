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
import { watch, reactive, toRefs } from 'vue'

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

const { current, pageSize } = toRefs(props)

const paginations = reactive({
  pageNum: current.value,
  pageSize: pageSize.value,
});

// 监听外部current变化，同步到内部状态
watch(current, (newVal) => {
  paginations.pageNum = newVal
}, { immediate: true })

// 监听外部pageSize变化，同步到内部状态
watch(pageSize, (newVal) => {
  paginations.pageSize = newVal
}, { immediate: true })

// 分页变化
function pageNumChange(val) {
  paginations.pageNum = val
  emit('update:current', val)
  emit('pageNumChange', val)
}

function pageSizeChange(val) {
  paginations.pageSize = val
  emit('update:pageSize', val)
  emit('pageSizeChange', val)
}

function onChange(page, pageSize) {
  const validPage = page === 0 ? 1 : page;
  emit('change', { validPage, pageSize });
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