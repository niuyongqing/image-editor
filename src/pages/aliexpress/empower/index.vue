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
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.title === '过期时间'">
            <a-tag
              :bordered="false"
              :color="getExpireInfo(text).color"
              >{{ getExpireInfo(text).text }}</a-tag
            >
          </template>
          <template v-if="column.title === '品类'">
            <a-select
              v-model:value="record.classify"
              allow-clear
              class="w-full"
              placeholder="请选择"
              :options="CLASSIFY_OPTIONS"
              @change="editShopTable($event, 'classify', record)"
            ></a-select>
          </template>
          <template v-if="column.title === '禁售属性'">
            <a-select
              v-model:value="record.forbidSale"
              class="w-full"
              allow-clear
              mode="multiple"
              placeholder="请选择"
              :options="forbidSaleOptions"
              :field-names="{ label: 'attributes', value: 'id' }"
              :filter-option="(input, option) => option.attributes.toLowerCase().indexOf(input.toLowerCase()) >= 0"
              @change="editShopTable($event, 'forbidSale', record)"
            ></a-select>
          </template>
          <template v-if="column.title === '自动刊登'">
            <a-switch
              v-model:checked="record.autoPublish"
              checked-value="1"
              un-checked-value="2"
              @change="editShopTable($event, 'autoPublish', record)"
            />
          </template>
          <template v-if="column.title === '仓库'">
            <a-select
              v-model:value="record.meansKeepGrain"
              allow-clear
              class="w-full"
              placeholder="请选择"
              :options="WAREHOUSE_LIST"
              @change="edit('meansKeepGrain', record)"
            ></a-select>
          </template>
          <template v-if="column.title === '简称'">
            <a-input
              v-model:value="record.simpleName"
              placeholder="请输入"
              @blur="edit('simpleName', record)"
            />
          </template>
          <template v-if="column.title === '别名'">
            <a-input
              v-model:value="record.alias"
              placeholder="请输入"
              @blur="edit('alias', record)"
            />
          </template>
          <template v-if="column.title === '备注'">
            <a-input
              v-model:value="record.remark"
              placeholder="请输入"
              @blur="edit('remark', record)"
            />
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
  import {
    forbidSaleApi,
    shopListApi,
    editSimpleNameApi,
    editAliasApi,
    empowerApi,
    meansKeepGrainApi,
    exportApi,
    remarkApi,
    shopUrlApi,
    editClassifyApi,
    editForbidSaleApi,
    editAutoPublishApi
  } from '../apis/empower.js'
  import { DEFAULT_TABLE_COLUMN, CLASSIFY_OPTIONS, WAREHOUSE_LIST } from './config.js'
  import dayjs from 'dayjs'
  import { message } from 'ant-design-vue'

  onMounted(() => {
    getList()
    getForbidSale()
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
  function search() {
    pageParams.value.pageNum = 1
    getList()
  }
  function reset() {
    pageParams.value.pageNum = 1
    searchFormRef.value.resetFields()
    getList()
  }

  // 列表数据
  const tableData = ref([])
  const total = ref(0)
  const loading = ref(false)
  function getList() {
    loading.value = true
    const params = {
      ...searchForm.value,
      ...pageParams.value
    }
    shopListApi(params)
      .then(res => {
        const list = res.rows || []
        list.forEach(item => {
          item.forbidSale = item.forbidSale ? item.forbidSale.split(',').map(id => Number(id)) : []
        })
        tableData.value = list
        total.value = res.total
      })
      .finally(() => {
        loading.value = false
      })
  }

  // 禁售属性
  const forbidSaleOptions = ref([])
  function getForbidSale() {
    forbidSaleApi().then(res => {
      const list = res.data || []
      list.forEach(item => {
        item.disabled = false
      })
      forbidSaleOptions.value = list
    })
  }

  // 获取过期时间信息
  function getExpireInfo(expireTime) {
    let text = '',
      color = ''
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

  const apiEnum = {
    classify: editClassifyApi,
    forbidSale: editForbidSaleApi,
    autoPublish: editAutoPublishApi
  }
  // 编辑 品类, 禁售属性, 是否自动刊登
  function editShopTable(val, prop, record) {
    const params = {
      account: record.account,
      sellerId: record.userId,
      [prop]: val
    }
    if (prop === 'forbidSale') {
      params[prop] = val.join(',')
    }
    apiEnum[prop](params)
      .then(_ => {
        message.success('修改成功')
      })
      .catch(err => {
        message.warning('失败' + err)
      })
  }

  // 修改 [仓库, 简称, 别名, 备注] old school
  const editApiEnum = {
    meansKeepGrain: meansKeepGrainApi,
    simpleName: editSimpleNameApi,
    alias: editAliasApi,
    remark: remarkApi
  }
  function edit(prop, record) {
    const params = {
      sellerId: record.sellerId,
      [prop]: record[prop]
    }
    editApiEnum[prop](params)
      .then(res => {
        if (res.code === 200) {
          message.success('修改成功')
        } else {
          console.log('error')
        }
      })
      .catch(err => {
        message.warning('失败' + err)
        getList()
      })
  }
</script>
