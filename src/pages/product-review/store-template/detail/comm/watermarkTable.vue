<!-- 水印管理 列表 -->
<template>
  <div class="text-left">
    <a-table bordered row-key="id" :columns="COLUMNS" :data-source="dataSource" center :loading="loading" :pagination="false">
      <template #bodyCell="{ record, column }">
        <template v-if="column.title === '水印内容'">
          <a-image v-if="record.type === 1" :src="record.content" :width="60" class="object-contain" />
          <span v-else>{{ record.content }}</span>
        </template>
        <template v-else-if="column.title === '类型'">
          <span>{{ record.type === 1 ? '图片' : '文字' }}</span>
        </template>
        <template v-else-if="column.title === '操作'">
          <a-button type="link" @click="change(record.id)">更换</a-button>
          <a-button type="link" @click="edit(record.id)">编辑</a-button>
          <a-popconfirm title="确定删除吗?" @confirm="del(record.id)">
            <a-button type="link" danger>删除</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { watermarkListApi, watermarkDelApi } from '@/pages/sample/watermark/api.js'
const emit = defineEmits(['waterMarkTableDataItem'])
defineProps({
  dataSource: {
    type: Array,
    default: () => []
  }
})
/** 表格 */
const COLUMNS = [
  {
    title: '',
    key: 'imageName',
    align: 'center',
    dataIndex: 'imageName'
  },
  {
    title: '模版名称',
    key: 'title',
    align: 'center',
    dataIndex: 'title'
  },
  {
    title: '水印内容',
    align: 'center',
    key: 'content'
  },
  {
    title: '类型',
    align: 'center',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: '操作',
    width: 300,
    align: 'center',
    key: 'operation',
  }
]
const tableData = ref([])

const loading = ref(false)
getList()
function getList() {
  loading.value = true
  // 没分页, 没入参
  watermarkListApi()
    .then(res => {
      tableData.value = res.data || []
    })
    .finally(() => {
      loading.value = false
    })
}

function edit(id) {
  window.open(`/platform/dev/sample/watermark/edit?id=${id}`)
}

/** 更换 */
function change(id) {
  window.open(`/platform/dev/sample/watermark/change?id=${id}`)
}

/** 删除 */
function del(id) {
  watermarkDelApi(id).then(res => {
    getList()
  })
}

/** 监听编辑页保存后的跨窗口通信 */
window.addEventListener('message', receiveMessage)

onBeforeUnmount(() => {
  window.removeEventListener('message', receiveMessage)
})



function receiveMessage(event) {
  if (event.origin === window.location.origin && event.data.type === 'params') {
    console.log('event.data', event.data)
    emit('waterMarkTableDataItem', event.data.params)
  }
}


</script>

<style scoped lang="less">
.text-left {
  width: 100%;
  margin-bottom: 20px;
}
</style>
