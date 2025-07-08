<!-- 认领弹窗 -->
<template>
  <a-modal :open="open" :title="`选择店铺-认领到${claimType === 'acquisition' ? '采集箱' : '待发布'}`" width="50%"
    @cancel="handleCancel">
    <div class="flex">
      <span class="mt-2 mr-3">平台渠道:</span>
      <a-tabs v-model:activeKey="activeKey" class="flex-1">
        <a-tab-pane v-for="item in tabs" :key="item" :tab="item"></a-tab-pane>
      </a-tabs>
    </div>
    <!-- FIXME: del -->
    <div class="flex h-120">
      <!-- LEFT -->
      <a-card class="flex-[3] mr-4 overflow-auto">
        <div v-for="item in filteredShopList" :key="item.platformType" class="mb-4">
          <div class="bg-gray-100 p-2 mb-2">
            <span class="mr-2">{{ item.platformType || '--' }}</span>
            <a-checkbox v-model:checked="item.checkAll" :indeterminate="item.indeterminate" disabled
              @change="e => onCheckAllChange(e, item)">
              全选
            </a-checkbox>
          </div>
          <div>
            <a-checkbox-group v-model:value="item.innerCheckedList"
              @change="checkedValue => checkboxChange(checkedValue, item)">
              <a-checkbox v-for="shop in item.platformShopList" :key="shop.shopId" :value="shop.shopId"
                :title="shop.simpleName">
                <span class="inline-block w-30 align-middle truncate" :title="shop.simpleName">{{ shop.simpleName
                }}</span>
              </a-checkbox>
            </a-checkbox-group>
          </div>
        </div>
      </a-card>

      <!-- RIGHT -->
      <a-card class="flex-[1]">
        <div class="flex justify-between mb-2">
          <span>已选 ({{ checkedList.length }})</span>
          <a-button danger type="link" @click="reset">重置</a-button>
        </div>
        <div class="h-105 overflow-auto">
          <div v-for="item in checkedList" :key="item.value" class="flex justify-between p-1 hover:bg-gray-50 group">
            <div class="w-40 truncate" :title="item.simpleName">
              {{ item.simpleName }}
            </div>
            <a-button danger type="link" class="invisible group-hover:visible" @click="remove(item)">移除</a-button>
          </div>
        </div>
      </a-card>
    </div>

    <template #footer>
      <div class="flex justify-between">
        <a-checkbox v-model:checked="repeatReceiveFlag">已认领至相同店铺的产品不再认领</a-checkbox>
        <span>
          <a-button @click="handleCancel">取消</a-button>
          <a-button type="primary" @click="handleOk">确定</a-button>
        </span>
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { shopListApi } from '@/api/common/platform'
import { message } from 'ant-design-vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  claimType: {
    type: String,
    default: 'acquisition'
  }
})

const emit = defineEmits(['update:open', 'draft'])
const editCategoryModalRef = ref(null)
/** tabs */
const activeKey = ref('全部')
const tabs = ref([])

/** 店铺 */
const shopList = ref([])

// 过滤后的店铺列表(展示的)
const filteredShopList = computed(() => {
  if (activeKey.value === '全部') {
    return shopList.value
  } else {
    return shopList.value.filter(item => item.platformType === activeKey.value)
  }
})

// 已选的店铺列表(所有平台集合)
const checkedList = computed(() => {
  const list = []
  shopList.value.forEach(item => {
    const checkedShopList = item.platformShopList.filter(shop => item.innerCheckedList.includes(shop.shopId))

    list.push(...checkedShopList)
  })

  return list
})

getShopList()
function getShopList() {
  shopListApi().then(res => {
    shopList.value = res.data || []
    shopList.value.forEach(item => {
      item.checkAll = false
      item.indeterminate = false
      item.innerCheckedList = []
    })
    tabs.value = shopList.value.map(item => item.platformType)
    tabs.value.unshift('全部')
  })
}

// 全选效果
function onCheckAllChange(e, item) {
  item.innerCheckedList = e.target.checked ? item.platformShopList.map(el => el.shopId) : []
  item.indeterminate = false
}

// 回应全选效果
function checkboxChange(checkedValue, item) {
  const checkedValueLength = checkedValue.length
  item.indeterminate = checkedValueLength > 0 && checkedValueLength < item.platformShopList.length
  item.checkAll = checkedValueLength === item.platformShopList.length
}

function reset() {
  shopList.value.forEach(item => {
    item.checkAll = false
    item.indeterminate = false
    item.innerCheckedList = []
  })
}

function remove(item) {
  // 找到对应的平台
  const platform = shopList.value.find(el => el.platformShopList.findIndex(shop => shop.shopId === item.shopId) > -1)
  platform.checkAll = false
  platform.innerCheckedList = platform.innerCheckedList.filter(id => id !== item.shopId)
  const checkedValueLength = platform.innerCheckedList.length
  platform.indeterminate = checkedValueLength > 0 && checkedValueLength < platform.platformShopList.length
}

// 已认领至相同店铺的产品不再认领
const repeatReceiveFlag = ref(true)

/** 弹窗 footer */
function handleCancel() {
  activeKey.value = '全部'
  reset()
  emit('update:open', false)
}

function handleOk() {
  if (props.claimType === 'acquisition') {
    // 采集箱
    if (!checkedList.value.length) {
      message.error('请至少选择一个店铺')
      return
    }

    const params = {
      repeatReceiveFlag: repeatReceiveFlag.value,
      checkedList: checkedList.value
    }
    emit('draft', params)
  } else {
    // 待发布
  }

  handleCancel()
}
</script>
