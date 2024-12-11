<!-- 店铺授权 -->
<template>
  <div class="empower">
    <a-card>
      <a-form
        ref="searchFormRef"
        layout="inline"
        :model="searchForm"
      >
        <a-form-item
          label="别名: "
          name="alias"
        >
          <a-input v-model:value="searchForm.alias" />
        </a-form-item>
        <a-form-item
          label="简称: "
          name="simpleName"
        >
          <a-input v-model:value="searchForm.simpleName" />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            @click="search"
            >查询</a-button
          >
          <a-button
            class="ml-[10px]"
            @click="reset"
            >重置</a-button
          >
        </a-form-item>
      </a-form>
    </a-card>
    <a-card class="m-2.5 text-left">
      <a-space class="mb-2.5">
        <a-button type="primary">授权</a-button>
        <a-button type="primary">批量修改简称</a-button>
        <a-button type="primary">批量修改仓库</a-button>
        <a-button type="primary">导出</a-button>
      </a-space>

      <a-table
        :data-source="tableData"
        :columns="DEFAULT_TABLE_COLUMN"
        :loading="loading"
        stripe
        bordered
        row-key="sellerId"
        :pagination="{ defaultPageSize: 50, hideOnSinglePage: true }"
      >
        <template #bodyCell="{ column, text }">
          <template v-if="column.title === '过期时间'">
            <a-tag
              :bordered="false"
              :color="getExpireInfo(text).color"
              >{{ getExpireInfo(text).text }}</a-tag
            >
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="js">
  import { forbidSaleApi, shopListApi, editSimpleNameApi, editAliasApi, empowerApi, meansKeepGrainApi, exportApi, remarkApi, shopUrlApi, editClassifyApi, editForbidSaleApi, editAutoPublishApi } from '../apis/empower.js'
  import { DEFAULT_TABLE_COLUMN } from './config.js'
  import dayjs from 'dayjs'

  onMounted(() => {
    getList()
  })

  const searchFormRef = ref()
  const searchForm = ref({
    alias: '', // 别名
    simpleName: '' // 简称
  })
  const pageParams = ref({
    pageNum: 1,
    pageSize: 50
  })
  function search() {}
  function reset() {
    searchFormRef.value.resetFields()
  }

  // 列表数据
  const tableData = ref([])
  const loading = ref(false)
  function getList() {
    loading.value = true
    const params = {
      ...searchForm.value,
      ...pageParams.value
    }
    shopListApi(params).then(res => {
      tableData.value = res.rows || []
    }).finally(() => {
      loading.value = false
    })
  }

  // 获取过期时间信息
  function getExpireInfo(expireTime) {
    let text = '', color = ''
    if (Date.now() > expireTime) {
      text = '已过期'
      color = 'error'
    } else {
      const dayDiff = dayjs(expireTime).diff(dayjs(), 'day')
      text = `剩余${dayDiff}天`
      if (dayDiff > 30) {
        color = 'green'
      } else if (dayDiff <= 30 && dayDiff > 10) {
        color = 'lime'
      } else {
        color = 'warning'
      }
    }

    return {
      text,
      color
    }
  }
</script>
