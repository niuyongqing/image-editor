<!-- 库存弹窗 -->
<template>
  <div>
    <a-modal
      :open="open"
      :title="isSingle ? '修改库存' : '批量修改库存'"
      width="35%"
      @cancel="cancel"
    >
      <a-tag
        color="blue"
        class="h-fit"
        >说明</a-tag
      >
      <span>审核不通过状态下的产品不支持修改库存</span>

      <div class="my-3">
        <a-select
          v-if="isSingle"
          v-model:value="mathType"
          :options="MATH_OPTONS"
          class="w-30 mr-3"
        />
        <template v-else>
          <a-select
            v-model:value="shop"
            :options="shopOptions"
            class="w-45"
          />
          <span> 修改为 </span>
        </template>
        <a-input-number
          v-model:value="stockNum"
          :controls="false"
          :min="0"
          :max="99999"
          :precision="0"
          class="w-50"
        />
        <a-button
          type="primary"
          class="ml-3"
          @click="applyNum"
          >应用</a-button
        >
      </div>

      <a-table
        :data-source="dataSource"
        :columns="columns"
        bordered
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.title === '库存'">
            <a-input-number
              v-model:value="record.stock"
              :controls="false"
              :min="0"
              :max="99999"
              :precision="0"
              class="w-30"
            />
          </template>
        </template>
      </a-table>

      <template #footer>
        <a-button
          class="mr-2"
          @click="cancel"
          >取消</a-button
        >

        <a-dropdown v-if="isSingle">
          <a-button type="primary">确定 <DownOutlined /></a-button>
          <template #overlay>
            <a-menu @click="confirmMenuClick">
              <a-menu-item
                v-for="item in confirmMenuList"
                :key="item.key"
                >{{ item.label }}</a-menu-item
              >
            </a-menu>
          </template>
        </a-dropdown>
        <a-button
          v-else
          type="primary"
          @click="ok"
          >确定</a-button
        >
      </template>
    </a-modal>
  </div>
</template>

<script setup>
  import { DownOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    },
    isSingle: {
      type: Boolean,
      default: false
    },
    accountOptions: {
      type: Array,
      default: () => []
    },
    cookedAttrNameList: {
      type: Array,
      default: () => []
    },
    warehouseTableData: {
      type: Array,
      default: () => []
    },
    singleSKUWarehouseTableData: {
      type: Array,
      default: () => []
    }
  })
  const emits = defineEmits(['update:open', 'update:isSingle', 'ok'])

  // 每次打开弹窗时都将列表里的库存置空
  watch(
    () => props.open,
    open => {
      if (open) {
        props.warehouseTableData.forEach(item => {
          item.stock = null
        })
      }
    }
  )

  const shop = ref('all')
  const stockNum = ref(null)
  const tableData = ref([])

  // 批量 店铺下拉选项
  const shopOptions = computed(() => {
    return [{ label: '全部', value: 'all' }, ...props.accountOptions]
  })

  // 单个 运算下拉选项
  const MATH_OPTONS = [
    { label: '修改为', value: 'assign' },
    { label: '加', value: 'addition' },
    { label: '减', value: 'subtraction' },
    { label: '乘', value: 'multiplication' }
  ]
  const mathType = ref('assign')

  function applyNum() {
    if (stockNum.value === null) {
      message.warning('请输入数字')

      return
    }

    if (props.isSingle) {
      let mathFn

      switch (mathType.value) {
        case 'assign':
          mathFn = function (item) {
            item.stock += stockNum.value
          }
          break
        case 'addition':
          mathFn = function (item) {
            item.stock += stockNum.value
          }
          break
        case 'subtraction':
          mathFn = function (item) {
            item.stock -= stockNum.value
          }
          break
        case 'multiplication':
          mathFn = function (item) {
            item.stock *= stockNum.value
          }
          break

        default:
          break
      }

      props.singleSKUWarehouseTableData.forEach(item => {
        mathFn(item)
      })
    } else {
      props.warehouseTableData.forEach(item => {
        if (shop.value === 'all' || item.account === shop.value) {
          item.stock = stockNum.value
        }
      })
    }

    stockNum.value = null
  }

  const COMMON_COLUMNS = [
    { title: '店铺账号', key: 'shopName', dataIndex: 'shopName' },
    { title: '仓库', key: 'warehouseName', dataIndex: 'warehouseName' },
    { title: '库存', key: 'stock' },
    { title: '总库存', key: 'total', dataIndex: 'stock' }
  ]
  const columns = computed(() => {
    if (props.isSingle) {
      return COMMON_COLUMNS.slice(1)
    } else {
      return COMMON_COLUMNS
    }
  })

  // 批量和单个的 tableData 来源不同
  const dataSource = computed(() => {
    if (props.isSingle) {
      return props.singleSKUWarehouseTableData
    } else {
      return props.warehouseTableData
    }
  })

  /** 弹窗底部按钮 */
  const PERMANENT_LIST = [
    { label: '应用到全部', key: 'applyAll' },
    { label: '应用到当前变种', key: 'applySelf' }
  ]
  const confirmMenuList = computed(() => {
    const cookedAttrNameList = props.cookedAttrNameList.map(name => ({ label: `应用到相同 ${name} 的变种`, key: name }))

    return [...PERMANENT_LIST, ...cookedAttrNameList]
  })

  function cancel() {
    shop.value = 'all'
    mathType.value = 'assign'
    stockNum.value = null

    emits('update:open', false)
    emits('update:isSingle', false)
  }

  function ok() {
    emits('ok')
    cancel()
  }

  function confirmMenuClick({ key }) {
    emits('ok', key)
    cancel()
  }
</script>
