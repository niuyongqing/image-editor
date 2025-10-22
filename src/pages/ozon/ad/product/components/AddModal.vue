<template>
  <a-modal
    :open="open"
    title="加入点击付费广告"
    :width="1200"
    @cancel="cancel"
    @ok="ok"
  >
    <div class="mb-3">
      <span>店铺账号: </span>
      <a-select
        v-model:value="shop"
        :options="shopList"
        :field-names="{ label: 'simpleName', value: 'account' }"
        placeholder="请选择"
        show-search
        option-filter-prop="simpleName"
        class="w-60 mr-4"
        @change="shopChange"
      ></a-select>

      <span>广告活动: </span>
      <a-select
        v-model:value="ad"
        :options="adList"
        placeholder="请选择"
        show-search
        class="w-60"
        @change="adChange"
      ></a-select>
    </div>

    <div class="flex h-160">
      <div class="flex-1 p-3 mr-4 border border-gray-200 border-solid">
        <a-space class="mb-4">
          <a-select
            v-model:value="searchLabel"
            :options="SEARCH_LABEL_OPTIONS"
            class="w-30"
          ></a-select>
          <a-input
            v-model:value="searchContent"
            allow-clear
            placeholder="请输入"
          />
          <a-button
            type="primary"
            @click="search"
            >搜索</a-button
          >
        </a-space>

        <a-table
          :columns="COLUMNS"
          row-key="id"
          :data-source="sourceTableData"
          :pagination="false"
          :loading="loading"
        >
          <template #headerCell="{ column }">
            <template v-if="column.key === 'options'">
              <a-button
                type="link"
                @click="addAll"
                >{{ column.title }}</a-button
              >
            </template>
          </template>

          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'image'">
              <a-image
                :width="40"
                :height="40"
                :src="record.image"
                class="rounded-md object-contain"
              />
            </template>
            <template v-else-if="column.key === 'title'">
              <div>
                <span
                  :title="record.title"
                  class="inline-block w-60 align-middle truncate"
                  >{{ record.title }}</span
                ><a-button
                  type="link"
                  @click="copy(record.title)"
                  ><CopyOutlined
                /></a-button>
              </div>
              <div>
                <a-button
                  type="link"
                  class="p-0!"
                  @click="goOzon(record.id)"
                  >{{ record.id }}</a-button
                ><a-button
                  type="link"
                  @click="copy(record.id)"
                  ><CopyOutlined
                /></a-button>
              </div>
            </template>
            <template v-else-if="column.key === 'price'">{{ `${record.currency}  ${record.price}` }}</template>
            <template v-else-if="column.key === 'options'">
              <a-dropdown>
                <template #overlay>
                  <a-menu @click="({ key }) => handleAdd(key, record)">
                    <a-menu-item key="1">添加变体</a-menu-item>
                    <a-menu-item key="2">添加父体</a-menu-item>
                  </a-menu>
                </template>
                <a-button type="link">添加 <DownOutlined /></a-button>
              </a-dropdown>
            </template>
          </template>
        </a-table>
      </div>

      <div class="flex-1 p-3 mr-4 border border-gray-200 border-solid">
        <div class="float-right mb-4">
          <span>选择产品: 6/500</span>
        </div>

        <a-table
          :columns="COLUMNS"
          row-key="id"
          :data-source="targetTableData"
          :pagination="false"
          :loading="loading"
        >
          <template #headerCell="{ column }">
            <template v-if="column.key === 'options'">
              <a-button
                type="link"
                @click="removeAll"
                >移除全部</a-button
              >
            </template>
          </template>

          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'image'">
              <a-image
                :width="40"
                :height="40"
                :src="record.image"
                class="rounded-md object-contain"
              />
            </template>
            <template v-else-if="column.key === 'title'">
              <div>
                <span
                  :title="record.title"
                  class="inline-block w-60 align-middle truncate"
                  >{{ record.title }}</span
                ><a-button
                  type="link"
                  @click="copy(record.title)"
                  ><CopyOutlined
                /></a-button>
              </div>
              <div>
                <a-button
                  type="link"
                  class="p-0!"
                  @click="goOzon(record.id)"
                  >{{ record.id }}</a-button
                ><a-button
                  type="link"
                  @click="copy(record.id)"
                  ><CopyOutlined
                /></a-button>
              </div>
            </template>
            <template v-else-if="column.key === 'price'">{{ `${record.currency}  ${record.price}` }}</template>
            <template v-else-if="column.key === 'options'">
              <a-button
                type="link"
                @click="remove(record.id)"
                >移除</a-button
              >
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
  import { list } from '@/pages/ozon/config/api/empower'
  import { CopyOutlined, DownOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'
  import { copyText } from '@/utils'

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    }
  })
  const emits = defineEmits(['update:open', 'refresh'])

  /** 店铺账号 */
  const shopList = ref([])
  const shop = ref(undefined)

  getShopList()
  function getShopList() {
    const params = {
      pageNum: 1,
      pageSize: 50
    }

    list(params).then(res => {
      shopList.value = res.rows || []
    })
  }

  function shopChange() {
    getAdList()
    // 清空源数据和目标数据
  }

  /** 广告活动 */
  const adList = ref([])
  const ad = ref(undefined)

  getAdList()
  function getAdList() {
    ad.value = undefined
    adList.value = []

    const params = {
      pageNum: 1,
      pageSize: 50
    }

    // list(params).then(res => {
    //   shopList.value = res.rows || []
    // })
  }

  function adChange() {}

  /** 穿梭框 */
  const searchLabel = ref('title')
  const SEARCH_LABEL_OPTIONS = [
    { label: '产品标题', value: 'title' },
    { label: '产品 ID', value: 'id' },
    { label: 'SKU', value: 'sku' }
  ]
  const searchContent = ref(undefined)

  function search() {}

  // table
  const COLUMNS = [
    { title: '图片', key: 'image', width: 60 },
    { title: '产品标题/产品 ID', key: 'title', width: 250 },
    { title: '产品价格', key: 'price', width: 60 },
    { title: '添加全部', key: 'options', width: 50 }
  ]

  const loading = ref(false)
  const rawTableData = ref([])
  const targetKeys = ref([])

  const sourceTableData = computed(() => {
    return rawTableData.value.filter(item => !targetKeys.value.includes(item.id))
  })
  const targetTableData = computed(() => {
    return rawTableData.value.filter(item => targetKeys.value.includes(item.id))
  })

  getTableData()
  function getTableData() {
    // loading.value = true
    rawTableData.value = [
      {
        id: '1912907837',
        image: 'https://gw.alicdn.com/bao/uploaded/i3/2219215623008/O1CN015XniZW1Y5iOXsfy14_!!2219215623008.jpg',
        title: 'I want you to be the very best version of yourself that you can be!',
        price: '78',
        currency: 'CNY'
      },
      {
        id: '2',
        image: 'https://img.alicdn.com/imgextra/i1/2219215623008/O1CN01xqI7kY1Y5iOZ0UtdE_!!2219215623008.jpg',
        title: 'This is a text edited by Lynch on Earth.',
        price: '78',
        currency: 'CNY'
      }
    ]
    // loading.value = false
  }

  function addAll() {
    sourceTableData.value.forEach(item => {
      targetKeys.value.push(item.id)
    })
  }

  // 跳往 Ozon 后台
  function goOzon(id) {
    window.open(`https://ozon.ru/context/detail/id/${id}`)
  }

  function copy(context) {
    copyText(context)
      .then(() => {
        message.success('已复制')
      })
      .catch(err => {
        message.error(err)
      })
  }

  function handleAdd(key, record) {
    targetKeys.value.push(record.id)
  }

  function removeAll() {
    targetKeys.value = []
  }

  function remove(id) {
    targetKeys.value = targetKeys.value.filter(item => item !== id)
  }

  /** 底部按钮 */
  function cancel() {
    emits('update:open', false)
  }
  function ok() {
    cancel()
  }
</script>
