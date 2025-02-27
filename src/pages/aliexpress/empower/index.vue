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

    <a-space
      v-has-permi="['system:platform:aliexpress:accredit']"
      class="my-4"
    >
      <a-button
        type="primary"
        @click="empower"
        >授权</a-button
      >
      <a-button
        type="primary"
        @click="simpleNameModalOpen = true"
        >批量修改简称</a-button
      >
      <a-button
        type="primary"
        @click="meansKeepGrainModalOpen = true"
        >批量修改仓库</a-button
      >
      <a-button
        type="primary"
        @click="exportFile"
        >导出</a-button
      >
    </a-space>

    <a-card>
      <a-table
        :data-source="tableData"
        :columns="DEFAULT_TABLE_COLUMN"
        :loading="loading"
        stripe
        bordered
        row-key="sellerId"
        :pagination="{ defaultPageSize: 50, hideOnSinglePage: true }"
        :scroll="{ x: 'max-content' }"
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
              v-if="hasPermi"
              allow-clear
              class="w-full"
              placeholder="请选择"
              :options="CLASSIFY_OPTIONS"
              @change="editShopTable($event, 'classify', record)"
            ></a-select>
            <span v-else>{{ text }}</span>
          </template>
          <template v-if="column.title === '禁售属性'">
            <a-select
              v-model:value="record.forbidSale"
              v-if="hasPermi"
              class="w-full"
              allow-clear
              mode="multiple"
              placeholder="请选择"
              :options="forbidSaleOptions"
              :field-names="{ label: 'attributes', value: 'id' }"
              :filter-option="(input, option) => option.attributes.toLowerCase().indexOf(input.toLowerCase()) >= 0"
              @change="editShopTable($event, 'forbidSale', record)"
            ></a-select>
            <span v-else>{{ text && text.map(id => forbidSaleOptions.find(item => item.id === id)?.attributes).join() }}</span>
          </template>
          <template v-if="column.title === '自动刊登'">
            <a-switch
              v-model:checked="record.autoPublish"
              :disabled="!hasPermi"
              checked-value="1"
              un-checked-value="2"
              @change="editShopTable($event, 'autoPublish', record)"
            />
          </template>
          <template v-if="column.title === '是否推送库存'">
            <a-switch
              v-model:checked="record.isPushStock"
              :disabled="!hasPermi"
              checked-value="1"
              un-checked-value="0"
              @change="editStockPush(record)"
            />
          </template>
          <template v-if="column.title === '库存推送比例'">
            <a-input-number
              v-model:value="record.stockPushRatio"
              v-if="hasPermi"
              :precision="0"
              :min="1"
              :max="100"
              :controls="false"
              placeholder="1 ~ 100"
              :disabled="record.isPushStock !== '1'"
              @blur="editStockPush(record)"
            />
            <span v-else>{{ text || '--' }}</span>
          </template>
          <template v-if="column.title === '仓库'">
            <a-select
              v-model:value="record.meansKeepGrain"
              v-if="hasPermi"
              allow-clear
              class="w-full"
              placeholder="请选择"
              :options="WAREHOUSE_LIST"
              @change="edit('meansKeepGrain', record)"
            ></a-select>
            <span v-else>{{ text && WAREHOUSE_LIST.find(item => item.value === text).label }}</span>
          </template>
          <template v-if="column.title === '简称'">
            <a-input
              v-model:value="record.simpleName"
              v-if="hasPermi"
              placeholder="请输入"
              @blur="edit('simpleName', record)"
            />
            <span v-else>{{ text }}</span>
          </template>
          <template v-if="column.title === '别名'">
            <a-input
              v-model:value="record.alias"
              v-if="hasPermi"
              placeholder="请输入"
              @blur="edit('alias', record)"
            />
            <span v-else>{{ text }}</span>
          </template>
          <template v-if="column.title === '备注'">
            <a-input
              v-model:value="record.remark"
              v-if="hasPermi"
              placeholder="请输入"
              @blur="edit('remark', record)"
            />
            <span v-else>{{ text }}</span>
          </template>
        </template>
      </a-table>
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
            <template v-if="column.title === '店铺简称'">{{ 'AliExpress-0' + record }}</template>
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
      v-model:open="meansKeepGrainModalOpen"
      :confirm-loading="meansKeepGrainConfirmLoading"
      :after-close="handleMeansKeepGrainModalClose"
      @ok="meansKeepGrainOk"
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
    <a-modal
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
    </a-modal>
  </div>
</template>

<script setup>
  import { checkPermi, checkRole } from '~/utils/permission/component/permission.js'
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
    editAutoPublishApi,
    editSimpleNameBatchApi,
    editMeansKeepGrainBatchApi,
    editStockPushApi
  } from '../apis/empower.js'
  import { DEFAULT_TABLE_COLUMN, CLASSIFY_OPTIONS, WAREHOUSE_LIST } from './config.js'
  import dayjs from 'dayjs'
  import { message } from 'ant-design-vue'
  import download from '@/api/common/download'
  import { UploadOutlined } from '@ant-design/icons-vue'

  // 授权后重定向到本页, 接收路由参数
  const route = useRoute()
  const router = useRouter()
  const code = route.query.code

  if (code) {
    empowerApi({ code })
      .then(res => {
        message.success('授权成功')
        getList()
        router.push({ query: {} })
      })
      .catch(() => {
        message.error('授权失败')
      })
  }

  onMounted(() => {
    getList(true)
    getForbidSale()
  })

  const hasPermi = computed(() => checkPermi(['system:platform:aliexpress:accredit']) || checkRole('admin'))

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
          item.forbidSale = item.forbidSale ? item.forbidSale.split(',').map(id => Number(id)) : []
        })
        tableData.value = list
        total.value = res.total

        // 初次进入授权页面校验一下是否有即将过期的账号(有则弹窗提示)
        if (validateExpire) {
          expireList.value = list.filter(item => dayjs(item.expireTime).diff(dayjs(), 'day') < 15)
          if (expireList.value.length) {
            expireAccountModalOpen.value = true
          }
        }
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
        message.warning(err)
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
        message.warning(err)
        getList()
      })
  }

  // 修改推送库存
  function editStockPush(record) {
    const params = {
      account: record.account,
      sellerId: record.userId,
      isPushStock: record.isPushStock,
      stockPushRatio: record.stockPushRatio
    }
    editStockPushApi(params)
      .then(res => {
        message.success('修改成功')
      })
      .catch(err => {
        message.warning(err)
        getList()
      })
  }

  /** 授权 */
  function empower() {
    shopUrlApi().then(res => {
      // window.open(res.msg)
      location.href = res.msg
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
  const meansKeepGrainModalOpen = ref(false)
  const meansKeepGrainConfirmLoading = ref(false)

  function handleMeansKeepGrainModalClose() {
    fileList.value = []
    meansKeepGrainModalOpen.value = false
  }

  function meansKeepGrainOk() {
    if (fileList.value.length === 0) {
      message.warning('请上传文件')
      return
    }

    // 手动上传
    meansKeepGrainConfirmLoading.value = true
    const formData = new FormData()
    fileList.value.forEach(file => {
      formData.append('file', file)
    })
    editMeansKeepGrainBatchApi(formData)
      .then(res => {
        getList()
      })
      .finally(() => {
        meansKeepGrainConfirmLoading.value = false
      })
    handleMeansKeepGrainModalClose()
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
    { title: '店铺ID', dataIndex: 'sellerId' },
    { title: '过期时间', dataIndex: 'expireTime' },
    { title: '账号', dataIndex: 'account' },
    { title: '简称', dataIndex: 'simpleName' }
  ])
</script>
