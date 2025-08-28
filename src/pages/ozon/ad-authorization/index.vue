<!-- 广告管理 列表 -->
<template>
  <div class="text-left">
    <a-table
      bordered
      row-key="id"
      :columns="COLUMNS"
      :data-source="tableData"
      :loading="loading"
      :pagination="pagination"
    >
      <template #bodyCell="{ record, column }">
        <template v-if="column.title === '操作'">
          <a-button
            type="link"
            @click="edit(record)"
            >编辑</a-button
          >
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:open="open"
      title="编辑Ozon广告API授权"
      width="650px"
      @cancel="cancel"
    >
      <a-form
        ref="formRef"
        :model="formState"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-item
          label="店铺名称"
          name="simpleName"
          required
        >
          <a-input
            v-model:value="formState.simpleName"
            disabled
          />
        </a-form-item>
        <a-form-item
          label="Client ID"
          name="advertisementClientId"
          required
        >
          <a-input v-model:value="formState.advertisementClientId" />
        </a-form-item>
        <a-form-item
          label="Client Secret"
          name="advertisementSecret"
          required
        >
          <a-input v-model:value="formState.advertisementSecret" />
        </a-form-item>
      </a-form>

      <template #footer>
        <a
          href="https://help.dianxiaomi.com/article/productManagement/118"
          target="_blank"
          class="float-left"
          >查看授权帮助</a
        >
        <a-button @click="cancel">取消</a-button>
        <a-button
          type="primary"
          :loading="okLoading"
          @click="ok"
          >授权</a-button
        >
      </template>
    </a-modal>
  </div>
</template>

<script setup>
  import { message } from 'ant-design-vue'
  import { list, adAuthorizeApi } from '../config/api/empower'

  /** 表格 */
  const COLUMNS = [
    {
      title: '店铺名称',
      key: 'simpleName',
      dataIndex: 'simpleName'
    },
    {
      title: 'Client ID',
      key: 'advertisementClientId',
      dataIndex: 'advertisementClientId'
    },
    {
      title: '授权时间',
      key: 'updateTime',
      dataIndex: 'updateTime'
    },
    {
      title: '操作',
      key: 'operation',
      width: 150
    }
  ]
  const tableData = ref([])
  const pageParams = reactive({
    pageNum: 1,
    pageSize: 50,
    total: 0
  })
  const pagination = computed(() => ({
    total: pageParams.total,
    current: pageParams.pageNum,
    pageSize: pageParams.pageSize,
    showTotal: total => `共 ${total} 条`,
    onChange: (page, pageSize) => {
      pageParams.pageNum = page
      pageParams.pageSize = pageSize

      getList()
    }
  }))

  const loading = ref(false)
  getList()
  function getList() {
    loading.value = true
    const params = { ...pageParams }
    delete params.total
    list(params)
      .then(res => {
        tableData.value = res.rows || []
        pageParams.total = res.total || 0
      })
      .finally(() => {
        loading.value = false
      })
  }

  /** 新增和编辑弹窗 */
  const open = ref(false)
  const okLoading = ref(false)
  const formRef = ref()
  const formState = reactive({
    account: '', // 店铺 ID, 不体现在表单中
    simpleName: '',
    advertisementClientId: '',
    advertisementSecret: ''
  })

  function edit(record) {
    formState.account = record.account
    formState.simpleName = record.simpleName
    formState.advertisementClientId = record.advertisementClientId
    formState.advertisementSecret = record.advertisementSecret

    open.value = true
  }

  function cancel() {
    formRef.value.resetFields()
    open.value = false
  }

  function ok() {
    formRef.value
      .validate()
      .then(_ => {
        const params = {
          account: formState.account,
          advertisementClientId: formState.advertisementClientId,
          advertisementSecret: formState.advertisementSecret
        }
        okLoading.value = true
        adAuthorizeApi(params)
          .then(res => {
            message.success('编辑Ozon广告API授权成功')
            cancel()
          })
          .finally(() => {
            okLoading.value = false
          })
      })
      .catch(err => {
        console.log(err)
      })
  }
</script>
