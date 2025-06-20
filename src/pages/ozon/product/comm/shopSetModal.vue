<template>
  <a-modal :open="shopSetVisible" :maskClosable="false" @cancel="handleCancel" :width="'40%'" :keyboard="false"
    title="店铺设置" destroy-on-close>
    <a-table bordered :columns="HeaderList" :loading="loading" :scroll="{ y: 500 }" :data-source="tableData"
      :pagination="false">
      <template #headerCell="{ column }">
        <template v-if="column.dataIndex === 'warehouseList'">
          <span>{{ column.title }}</span>
          <a-tooltip>
            <template #title>仅同步在活跃状态的仓库</template>
            <AsyncIcon icon="QuestionCircleOutlined" class="ml-2.5" />
          </a-tooltip>
          <AsyncIcon icon="SyncOutlined" @click="getWarehouse" class="ml-2.5 cursor-pointer" />
        </template>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'currency'">
          <a-select v-model:value="record.currency" class="w-50" :options="options"></a-select>
        </template>
        <template v-if="column.dataIndex === 'warehouseList'">
          <span>{{ record.warehouseList.join(',') }}</span>
        </template>
      </template>
    </a-table>
    <div class="mt-5">
      <a-tag color="green">说明</a-tag><span>请选择与平台店铺设置相同的币种，否则会影响产品发布！</span>
    </div>
    <template #footer>
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" :loading="loading" @click="onSubmit">确定</a-button>
    </template>
  </a-modal>
</template>

<script setup name='shopSetModal'>

import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import { warehouse } from '../../config/api/storeManagement';
import { updateCurrency } from "../../config/api/product"
import { message } from "ant-design-vue";
const props = defineProps({
  shopSetVisible: Boolean,
  shopCurryList: Array
});
const emit = defineEmits(["handleShopSetClose", "refreshShopSet"]);
const loading = ref(false)
const HeaderList = [
  {
    title: '店铺',
    dataIndex: 'simpleName',
    align: "center"
  },
  {
    title: '币种',
    dataIndex: 'currency',
    align: "center"
  },
  {
    title: '仓库',
    dataIndex: 'warehouseList',
  }
]
const tableData = ref([])
const options = ref([
  {
    label: "CNY",
    value: "CNY"
  },
  {
    label: "RUB",
    value: "RUB"
  },
  {
    label: "BYN",
    value: "BYN"
  },
  {
    label: "KZT",
    value: "KZT"
  },
  {
    label: "EUR",
    value: "EUR"
  },
  {
    label: "USD",
    value: "USD"
  }
])
const handleCancel = () => {
  emit("handleShopSetClose")
  // tableData.value = []
}

const onSubmit = () => {
  let tList = tableData.value.filter(item => item.currency).map(item => ({
    account: item.simpleName,
    currency: item.currency
  }));
  loading.value = true
  updateCurrency(tList).then(res => {
    message.success(res.msg)
    emit("handleShopSetClose")
  }).finally(() => {
    loading.value = false
  })
}

watch(() => props.shopCurryList, val => {
  if (val.length > 0) {
    tableData.value = val
  }
})

const getWarehouse = () => {
  loading.value = true
  warehouse().then(res => {
    message.success('同步成功！')
    emit("refreshShopSet")
  }).finally(() => {
    loading.value = false
  })
}
</script>
<style lang="less" scoped></style>