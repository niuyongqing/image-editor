<!-- 店铺授权 -->
<template>
  <div class="empower text-left">
    <a-card>
      <a-form
        ref="searchFormRef"
        layout="inline"
        :model="searchForm"
      >
        <a-form-item
          label="店铺ID: "
          name="id"
        >
          <a-input
            v-model:value="searchForm.id"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item
          label="别名: "
          name="alias"
        >
          <a-input
            v-model:value="searchForm.alias"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item
          label="简称: "
          name="simpleName"
        >
          <a-input
            v-model:value="searchForm.simpleName"
            placeholder="请输入"
          />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            :loading="loading"
            @click="search"
            >查询</a-button
          >
          <a-button
            class="ml-[10px]"
            :loading="loading"
            @click="reset"
            >重置</a-button
          >
        </a-form-item>
      </a-form>
    </a-card>

    <!-- v-has-permi="['system:platform:tiktok:accredit']" -->
    <a-space class="my-4">
      <a-button
        type="primary"
        @click="empower"
        >授权</a-button
      >
      <a-popconfirm
        title="确定刷新全部授权吗?"
        @confirm="refreshAllToken"
      >
        <a-button
          type="primary"
          :loading="refreshAllTokenLoading"
          >刷新全部授权</a-button
        >
      </a-popconfirm>
      <a-button
        type="primary"
        @click="simpleNameModalOpen = true"
        >批量修改简称</a-button
      >
      <a-button
        type="primary"
        @click="storeModalOpen = true"
        >批量修改仓库</a-button
      >
      <a-button
        type="primary"
        @click="exportFile"
        >导出</a-button
      >
    </a-space>

    <a-card>
      <a-pagination
        v-model:current="pageParams.pageNum"
        v-model:pageSize="pageParams.pageSize"
        class="text-right mb-2"
        :total="total"
        :default-page-size="50"
        show-size-changer
        show-quick-jumper
        :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
        @change="getList"
      />
      <a-table
        :data-source="tableData"
        :columns="DEFAULT_TABLE_COLUMN"
        :loading="loading"
        stripe
        bordered
        row-key="id"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
      >
        <template #bodyCell="{ column, record, text }">
          <!-- <template v-if="column.title === '过期时间'">
            <a-tag
              :bordered="false"
              :color="getExpireInfo(text).color"
              >{{ getExpireInfo(text).text }}</a-tag
            >
          </template> -->
          <template v-if="column.title === '是否填充账号密码'">
            <a-tag
              v-if="text === 0"
              :bordered="false"
              color="warning"
              >未填充</a-tag
            >
            <a-tag
              v-if="text === 1"
              :bordered="false"
              color="success"
              >已填充</a-tag
            >
          </template>
          <template v-if="column.title === '品类'">
            <a-select
              v-model:value="record.category"
              v-if="hasPermi"
              allow-clear
              class="w-full"
              placeholder="请选择"
              :options="CATEGORY_OPTIONS"
              @change="editShopRecord(record)"
            />
            <span v-else>{{ text }}</span>
          </template>
          <template v-if="column.title === '禁售属性'">
            <a-select
              v-model:value="record.prohibitedProperties"
              v-if="hasPermi"
              class="w-full"
              allow-clear
              mode="multiple"
              placeholder="请选择"
              :max-tag-count="5"
              :options="prohibitedPropertiesOptions"
              :field-names="{ label: 'attributes', value: 'id' }"
              option-filter-prop="label"
              @change="editShopRecord(record)"
            />
            <span v-else>{{ text && text.map(id => prohibitedPropertiesOptions.find(item => item.id === id)?.attributes).join() }}</span>
          </template>
          <template v-if="column.title === '自动刊登'">
            <a-switch
              v-model:checked="record.automaticPublish"
              :disabled="!hasPermi"
              :checked-value="1"
              :un-checked-value="0"
              @change="editShopRecord(record)"
            />
          </template>
          <template v-if="column.title === '仓库'">
            <a-select
              v-model:value="record.store"
              v-if="hasPermi"
              allow-clear
              class="w-full"
              placeholder="请选择"
              :options="WAREHOUSE_LIST"
              @change="editShopRecord(record)"
            />
            <span v-else>{{ text && WAREHOUSE_LIST.find(item => item.value === text).label }}</span>
          </template>
          <template v-if="column.title === '简称'">
            <a-input
              v-model:value="record.simpleName"
              v-if="hasPermi"
              placeholder="请输入"
              @blur="editShopRecord(record)"
            />
            <span v-else>{{ text }}</span>
          </template>
          <template v-if="column.title === '别名'">
            <a-input
              v-model:value="record.alias"
              v-if="hasPermi"
              placeholder="请输入"
              @blur="editShopRecord(record)"
            />
            <span v-else>{{ text }}</span>
          </template>
          <template v-if="column.title === '备注'">
            <a-input
              v-model:value="record.remark"
              v-if="hasPermi"
              placeholder="请输入"
              @blur="editShopRecord(record)"
            />
            <span v-else>{{ text }}</span>
          </template>
          <template v-if="column.title === '店铺类型'">
            <span>{{ text === 'CROSS_BORDER' ? '跨境' : '本土' }}</span>
          </template>
        </template>
      </a-table>
      <a-pagination
        v-model:current="pageParams.pageNum"
        v-model:pageSize="pageParams.pageSize"
        class="text-right mt-2"
        :total="total"
        :default-page-size="50"
        show-size-changer
        show-quick-jumper
        :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
        @change="getList"
      />
    </a-card>

    <!-- 批量修改简称弹窗 -->
    <a-modal
      title="批量修改简称"
      v-model:open="simpleNameModalOpen"
      :confirm-loading="simpleNameConfirmLoading"
      :after-close="handleSimpleNameModalClose"
      @ok="simpleNameOk"
    >
      <div>示例:</div>
      <div class="content">
        <a-table
          :columns="[{ title: '店铺ID' }, { title: '店铺简称' }]"
          :data-source="Array.from({ length: 4 }, (_, i) => i + 1)"
          :pagination="false"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.title === '店铺ID'">{{ '100' + record }}</template>
            <template v-if="column.title === '店铺简称'">{{ 'tiktok-0' + record }}</template>
          </template>
        </a-table>
        <div class="mt-4">上传文件:</div>
        <a-upload
          :file-list="fileList"
          accept=".xlsx, .xlsm, .xls"
          :before-upload="beforeUpload"
        >
          <a-button>
            <UploadOutlined />
            选择 Excel
          </a-button>
        </a-upload>
      </div>
    </a-modal>

    <!-- 批量修改仓库弹窗 -->
    <a-modal
      title="批量修改仓库类型"
      v-model:open="storeModalOpen"
      :confirm-loading="storeConfirmLoading"
      :after-close="handleStoreModalClose"
      @ok="storeOk"
    >
      <div>示例:</div>
      <div class="content">
        <a-table
          :columns="[{ title: '店铺ID' }, { title: '仓库类型' }]"
          :data-source="Array.from({ length: 4 }, (_, i) => i + 1)"
          :pagination="false"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.title === '店铺ID'">{{ '100' + record }}</template>
            <template v-if="column.title === '仓库类型'">{{ ['总仓', '馨拓靓仓(配饰,服饰类)', '菲律宾本土仓', '馨拓美仓(美妆类)'][index] }}</template>
          </template>
        </a-table>
        <div class="mt-4">上传文件:</div>
        <a-upload
          :file-list="fileList"
          accept=".xlsx, .xlsm, .xls"
          :before-upload="beforeUpload"
        >
          <a-button>
            <UploadOutlined />
            选择 Excel
          </a-button>
        </a-upload>
      </div>
    </a-modal>

    <!-- 即将过期账号列表弹窗 -->
    <!-- <a-modal
      title="请及时给以下账号重新授权"
      v-model:open="expireAccountModalOpen"
      :footer="null"
    >
      <a-table
        :columns="EXPIRE_TABLE_COLUMN"
        :data-source="expireList"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.title === '过期时间'">
            <a-tag
              :bordered="false"
              :color="getExpireInfo(record.expireTime).color"
              >{{ getExpireInfo(record.expireTime).text }}</a-tag
            >
          </template>
        </template>
      </a-table>
    </a-modal> -->
  </div>
</template>

<script setup>
  import { checkPermi, checkRole } from '~/utils/permission/component/permission.js'
  import { forbidSaleApi, shopListApi, refreshTokenApi, editApi, empowerApi, exportApi, shopUrlApi } from '../apis/empower.js'
  import { DEFAULT_TABLE_COLUMN, CATEGORY_OPTIONS, WAREHOUSE_LIST } from './config.js'
  import dayjs from 'dayjs'
  import { message } from 'ant-design-vue'
  import download from '@/api/common/download'
  import { UploadOutlined } from '@ant-design/icons-vue'

  // 授权后重定向到本页, 接收路由参数
  const route = useRoute()
  const router = useRouter()
  const code = route.query.code
  const multiTabStore = useMultiTab()

  if (code) {
    const path = route.fullPath
    empowerApi({ code })
      .then(res => {
        message.success('授权成功')
        // 成功后关闭带路由参数的页面
        router.push({}).then(() => {
          multiTabStore.close(path)
        })
        getList()
      })
      .catch(() => {
        message.error('授权失败')
      })
  }

  onMounted(() => {
    getList(true)
    getProhibitedProperties()
  })

  const hasPermi = computed(() => true || checkPermi(['system:platform:tiktok:accredit']) || checkRole('admin'))

  const searchFormRef = ref()
  const searchForm = ref({
    id: undefined,
    alias: undefined, // 别名
    simpleName: undefined // 简称
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
  function getList(validateExpire = false) {
    loading.value = true
    const params = {
      ...searchForm.value,
      ...pageParams.value
    }
    shopListApi(params)
      .then(res => {
        const list = res.rows || []
        list.forEach(item => {
          item.prohibitedProperties = item.prohibitedProperties ? item.prohibitedProperties.split(',').map(Number) : []
        })
        tableData.value = list
        total.value = res.total

        // 初次进入授权页面校验一下是否有即将过期的账号(有则弹窗提示)
        /* if (validateExpire) {
          expireList.value = list.filter(item => dayjs(item.expireTime).diff(dayjs(), 'day') < 15)
          if (expireList.value.length) {
            expireAccountModalOpen.value = true
          }
        } */
      })
      .finally(() => {
        loading.value = false
      })
  }

  // 禁售属性
  const prohibitedPropertiesOptions = ref([])
  function getProhibitedProperties() {
    forbidSaleApi().then(res => {
      const list = res.data || []
      list.forEach(item => {
        item.disabled = false
      })
      prohibitedPropertiesOptions.value = list
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
      const dayDiff = dayjs(expireTime).diff(0, 'day')
      text = `剩余${dayDiff}天`
      if (dayDiff > 30) {
        color = 'green'
      } else if (dayDiff <= 30 && dayDiff > 15) {
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

  /** 授权 */
  function empower() {
    shopUrlApi().then(res => {
      // window.open(res.msg)
      location.href = res.msg
    })
  }

  /** 刷新全部授权 */
  const refreshAllTokenLoading = ref(false)
  function refreshAllToken() {
    refreshAllTokenLoading.value = true
    refreshTokenApi()
      .then(res => {
        getList()
      })
      .finally(() => {
        refreshAllTokenLoading.value = false
      })
  }

  /** 编辑数据 */
  function editShopRecord(record) {
    const params = {
      ...record,
      prohibitedProperties: record.prohibitedProperties.join()
    }
    editApi(params).then(res => {
      message.success('编辑成功')
      getList()
    })
  }

  /** 批量修改简称 */
  const simpleNameModalOpen = ref(false)
  const simpleNameConfirmLoading = ref(false)
  const fileList = ref([])

  function beforeUpload(file, list) {
    fileList.value = list
    return false
  }

  function handleSimpleNameModalClose() {
    fileList.value = []
    simpleNameModalOpen.value = false
  }

  // 确认 上传
  function simpleNameOk() {
    if (fileList.value.length === 0) {
      message.warning('请上传文件')
      return
    }

    // 手动上传
    simpleNameConfirmLoading.value = true
    const formData = new FormData()
    fileList.value.forEach(file => {
      formData.append('file', file)
    })
    editSimpleNameBatchApi(formData)
      .then(res => {
        getList()
      })
      .finally(() => {
        simpleNameConfirmLoading.value = false
      })
    handleSimpleNameModalClose()
  }

  /** 批量修改仓库 */
  const storeModalOpen = ref(false)
  const storeConfirmLoading = ref(false)

  function handleStoreModalClose() {
    fileList.value = []
    storeModalOpen.value = false
  }

  function storeOk() {
    if (fileList.value.length === 0) {
      message.warning('请上传文件')
      return
    }

    // 手动上传
    storeConfirmLoading.value = true
    const formData = new FormData()
    fileList.value.forEach(file => {
      formData.append('file', file)
    })
    editStoreBatchApi(formData)
      .then(res => {
        getList()
      })
      .finally(() => {
        storeConfirmLoading.value = false
      })
    handleStoreModalClose()
  }

  // 导出
  function exportFile() {
    exportApi().then(res => {
      message.success('下载任务已开始！请耐心等待完成')
      download.name(res.msg)
    })
  }

  /** 过期提醒弹窗 */
  const expireAccountModalOpen = ref(false)
  const expireList = ref([])
  const EXPIRE_TABLE_COLUMN = ref([
    { title: '店铺ID', dataIndex: 'id' },
    { title: '过期时间', dataIndex: 'expireTime' },
    { title: '账号', dataIndex: 'account' },
    { title: '简称', dataIndex: 'simpleName' }
  ])
</script>
