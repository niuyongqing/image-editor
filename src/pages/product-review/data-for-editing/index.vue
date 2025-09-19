<!-- 资料待编辑 列表 -->
<template>
  <div class="text-left">
    <!-- 搜索区 -->
    <a-card class="mb-3">
      <a-form
        :model="searchForm"
        ref="searchFormRef"
        layout="inline"
      >
        <a-form-item label="模糊查询">
          <a-space>
            <a-input
              v-model:value="searchForm.name"
              placeholder="请输入产品名称"
              allow-clear
            />
            <a-input
              v-model:value="searchForm.sku"
              placeholder="请输入产品SKU"
              allow-clear
            />
          </a-space>
        </a-form-item>
        <a-form-item
          label="分类"
          name="categoryId"
        >
          <a-select
            v-model:value="searchForm.categoryId"
            :options="categoryOptions"
            placeholder="请选择分类"
            allow-clear
            class="w-40!"
          />
        </a-form-item>
        <a-form-item
          label="市场方向"
          name="market"
        >
          <a-select
            v-model:value="searchForm.market"
            :options="marketOptions"
            placeholder="请选择市场方向"
            allow-clear
            class="w-40!"
          />
        </a-form-item>
        <a-form-item
          label="提交人"
          name="submiter"
        >
          <a-select
            v-model:value="searchForm.submiter"
            :options="submiterOptions"
            placeholder="请选择提交人"
            allow-clear
            class="w-40!"
          />
        </a-form-item>
        <a-form-item
          label="提交时间"
          name="submitTime"
        >
          <a-range-picker
            v-model:value="searchForm.submitTime"
            :disabled-date="cur => cur && cur > Date.now()"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            class="mr-2"
            @click="search"
            >查询</a-button
          >
          <a-button @click="reset">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- table 区 -->
    <a-card>
      <a-pagination
        v-model:current="tableParams.pageNum"
        v-model:pageSize="tableParams.pageSize"
        :total="total"
        :default-page-size="50"
        show-size-changer
        show-quick-jumper
        :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
        class="mb-4 float-right"
        @change="getList"
      />

      <a-table
        :columns="DEFAULT_TABLE_COLUMN"
        :data-source="tableData"
        :loading="loading"
        stripe
        row-key="id"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'">
            <a-popover placement="right">
              <template #content>
                <img
                  :src="record.image || EmptyImg"
                  width="400"
                  height="400"
                />
              </template>
              <a-image
                :src="record.image || EmptyImg"
                :width="80"
                :height="80"
                :fallback="EmptyImg"
                class="object-contain border border-solid border-gray-200"
              />
            </a-popover>
          </template>
          <template v-else-if="column.key === 'market'"></template>
          <template v-else-if="column.key === 'options'">
            <a-space>
              <a-button type="link">编辑</a-button>
              <a-button type="link">提交拍照</a-button>
              <a-button type="link">添加备注</a-button>
              <a-popconfirm
                title="请确定是否删除"
                @confirm="del(record)"
              >
                <a-button
                  type="link"
                  danger
                  >删除</a-button
                >
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>

      <a-pagination
        v-model:current="tableParams.pageNum"
        v-model:pageSize="tableParams.pageSize"
        :total="total"
        :default-page-size="50"
        show-size-changer
        show-quick-jumper
        :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
        class="float-right"
        @change="getList"
      />
    </a-card>
  </div>
</template>

<script setup>
  import EmptyImg from '@/assets/images/aliexpress/empty.png'
  import { DEFAULT_TABLE_COLUMN } from './config'
  import dayjs from 'dayjs'
  import { message } from 'ant-design-vue'

  /** search */
  const searchForm = reactive({
    name: '',
    sku: '',
    categoryId: undefined,
    market: undefined,
    submiter: undefined,
    submitTime: [null, null]
  })
  const searchFormRef = ref()

  const options = [
    { label: 'label', value: 'value' },
    { label: 'label2', value: 'value2' }
  ]
  const categoryOptions = ref([])
  categoryOptions.value = options

  const marketOptions = ref([])
  marketOptions.value = options

  const submiterOptions = ref([])
  submiterOptions.value = options

  function search() {
    tableParams.pageNum = 1
    getList()
  }

  function reset() {
    searchForm.name = ''
    searchForm.sku = ''
    searchFormRef.value.resetFields()
  }

  /** table */
  const loading = ref(false)
  const tableParams = reactive({
    pageNum: 1,
    pageSize: 50
  })
  const tableData = ref([])
  const total = ref(0)

  getList()
  function getList() {
    tableData.value = [
      {
        id: '1',
        image: 'https://cdn.jsdelivr.net/gh/lynch-07/images@main/20220720202820.jpg',
        market: '欧美',
        sku: 'skuId123',
        storage: '馨拓',
        category: '小怪兽',
        submiter: 'Lynch',
        reviewer: '我',
        submitTime: '2025年9月16日14:12:23',
        reviewTime: '2025年9月16日14:12:37',
        reason: '我就想选, 咋滴'
      }
    ]
  }

  function del(record) {}
</script>
