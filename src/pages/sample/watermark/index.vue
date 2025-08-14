<!-- 水印管理 列表 -->
<template>
  <div class="text-left">
    <a-button
      type="primary"
      class="float-right mb-4"
      size="middle"
      @click="add"
      >创建模版</a-button
    >

    <a-table
      bordered
      row-key="id"
      :columns="COLUMNS"
      :data-source="tableData"
      :loading="loading"
      :pagination="false"
    >
      <template #bodyCell="{ record, column }">
        <template v-if="column.title === '水印内容'">
          <a-image
            v-if="record.type === 1"
            :src="record.content"
            :width="60"
            class="object-contain"
          />
          <span v-else>{{ record.content }}</span>
        </template>
        <template v-else-if="column.title === '类型'">
          <span>{{ record.type === 1 ? '图片' : '文字' }}</span>
        </template>
        <template v-else-if="column.title === '操作'">
          <a-button
            type="link"
            @click="edit(record.id)"
            >编辑</a-button
          >
          <a-popconfirm
            title="确定删除吗?"
            @confirm="del(record.id)"
          >
            <a-button
              type="link"
              danger
              >删除</a-button
            >
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
  import { watermarkListApi, watermarkDelApi } from './api'

  /** 表格 */
  const COLUMNS = [
    {
      title: '模版名称',
      key: 'title',
      dataIndex: 'title'
    },
    {
      title: '水印内容',
      key: 'content'
    },
    {
      title: '类型',
      key: 'type'
    },
    {
      title: '操作',
      key: 'operation',
      width: 150
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

  /** 跳转 创建/编辑 页 */
  function add() {
    window.open('/platform/dev/sample/watermark/edit')
  }

  function edit(id) {
    window.open(`/platform/dev/sample/watermark/edit?id=${id}`)
  }

  /** 删除 */
  function del(id) {
    watermarkDelApi(id).then(res => {
      getList()
    })
  }
</script>
