<template>
  <div id="productListCont">
    <a-modal :open="addProdVis" :maskClosable="false" @cancel="handleCancel" @ok="handleCancel" :width="'65%'" :keyboard="false"
      title="添加产品">
      <a-card title="活动产品搜索" class="text-left">
        <a-form layout="horizontal" ref="ruleForm" :model="formData" class="form-padding" laba-width="100px">
          <a-form-item class="flex" label="搜索类型">
            <a-button @click="selectItem(index)" class="mr-2.5" :type="selectedIndex === index ? 'primary' : ''"
              v-for="(item, index) in options" :key="item.value">{{
                item.label }}</a-button>

          </a-form-item>
          <a-form-item name="productId" label="搜索内容">
            <div class="flex">
              <a-input allow-clear v-if="selectedIndex == 0" v-model:value="formData.productId" style="width: 300px"
                placeholder="多个产品ID用英文逗号隔开"></a-input>
              <a-input allow-clear v-if="selectedIndex == 1" v-model:value="formData.productName" style="width: 300px"
                placeholder="请输入产品标题"></a-input>
              <a-input allow-clear v-if="selectedIndex == 2" v-model:value="formData.sku" style="width: 300px"
                placeholder="多个产品SKU用英文逗号隔开"></a-input>
              <div class="ml-2.5 flex">
                <a-button type="primary" @click="onSubmit">查询</a-button>
                <a-button @click="resetForm" class="ml-2.5">重置</a-button>
              </div>
            </div>
          </a-form-item>
        </a-form>
      </a-card>
      <a-card title="活动产品列表" class="text-left mt-5">
        <a-button type="primary" @click="batchAdd" :disabled="selectList.length == 0">批量添加</a-button>
        <a-pagination style="margin-top: 20px;text-align: right;" :show-total="(total) => `共 ${total} 条`"
          :total="paginations.total" show-quick-jumper v-model:current="paginations.pageNum"
          v-model:pageSize="paginations.pageSize" :defaultPageSize="50" :showSizeChanger="true" @change="getList"
          :pageSizeOptions="[50, 100, 200]"></a-pagination>
        <a-table :data-source="activeList" bordered stripe ref="promotionTable" v-loading="addProdLoading"
          :row-selection="rowSelection" :rowKey="(row) => row.productId" :pagination="false"
          style="width: 100%; margin-top: 10px" :columns="dropCol">
          <template #headerCell="{ column }">
            <template v-if="column.dataIndex === 'actionActivityCount'">
              <span>{{ column.title }}</span>
              <a-tooltip class="item" effect="dark"
                title="如果您添加的商品已参与其他类型的促销活动，则两个折扣都将应用于该商品。第二次促销的商品价格将按照第一次促销中销售商品的价格计算。" placement="top">
                <AsyncIcon icon="QuestionCircleOutlined"></AsyncIcon>
              </a-tooltip>

            </template>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'imageUrl'">
              <img style="width: 70px; height: 70px" v-if="record.imageUrl" :src="record.imageUrl.split(',')[0]"
                alt="" />
            </template>
            <template v-if="column.dataIndex === 'productName'">
              <div>{{ record.productName }}</div>
              <div style="color: #428bca">{{ record.productId }}</div>
            </template>
            <template v-if="column.dataIndex === 'sku'">
              <div>{{ record.sku }}</div>
            </template>
            <template v-if="column.dataIndex === 'salePrice'">
              <div>
                <span>{{ record.salePrice }}</span><span class="ml-2.5">CNY</span>
              </div>
            </template>
            <template v-if="column.dataIndex === 'discount'">
              <div>
                <span>{{ record.discount }}</span>
                <span class="ml-2.5">%</span>
              </div>
            </template>
            <template v-if="column.dataIndex === 'discountPrice'">
              <div>
                <span>{{ record.discountPrice }}</span>
                <span class="ml-2.5">CNY</span>
              </div>
            </template>
            <template v-if="column.dataIndex === 'actionActivityCount'">
              <div>
                <span>{{ record.actionActivityCount }}</span><span v-show="record.actionActivityCount">个</span>
              </div>
            </template>
            <template v-if="column.dataIndex === 'option'">
              <a-button @click="batchAdd(record)" type="text">添加</a-button>
            </template>
          </template>
        </a-table>
        <a-pagination style="margin-top: 20px;text-align: right;" :show-total="(total) => `共 ${total} 条`"
          :total="paginations.total" show-quick-jumper v-model:current="paginations.pageNum"
          v-model:pageSize="paginations.pageSize" :defaultPageSize="50" :showSizeChanger="true" @change="getList"
          :pageSizeOptions="[50, 100, 200]"></a-pagination>
      </a-card>
    </a-modal>
  </div>
</template>

<script setup name='productList'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import hearders from "../../config/tabColumns/promotionAddList"
import { candidates,addProducts } from "../../config/api/promotion"
import { message } from 'ant-design-vue'
const props = defineProps({
  addProdVis: Boolean,

});
const emit = defineEmits(["closeModal", "addPordFun"]);
const isAllSelected = ref(true)
const addProdLoading = ref(true)
const ruleForm = ref(null)
const selectedIndex = ref(0)
const rowId = ref("")
const rowAccount = ref("");
const selectList = ref([])
const activeList = ref([])
const dropCol = hearders
const formData = reactive({
  productId: "",
  productName: "",
  sku: "",
})
// const searchVal = ref(1)
const options = [
  {
    label: "产品ID",
    value: 1
  },
  {
    label: "产品名称",
    value: 2
  },
  {
    label: "SKU",
    value: 3
  }
]
const paginations = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 50,
})
const rowSelection = {
  onChange: (selectedRow) => {
    selectList.value = selectedRow;
  },
};
const selectItem = (index) => {
  if (isAllSelected.value) {
    isAllSelected.value = false;
  }
  selectedIndex.value = index;
};
const onSubmit = () => {
  getList()
}
const resetForm = () => {
  formData.productId = ""
  formData.productName = ""
  formData.sku = ""
  selectedIndex.value = 0
  getList()
}
const handleCancel = () => {
  emit("closeModal")
}

const getList = () => {
  const { productId, productName, sku, skuId } = formData;
  let params = {
    account: rowAccount.value,
    activityId: rowId.value,
    pageNum: paginations.pageNum,
    pageSize: paginations.pageSize,
    productId,
    productName,
    sku,
    skuId,
  };
  addProdLoading.value = true
  candidates(params)
    .then((res) => {
      activeList.value = res?.rows ?? [];
      paginations.total = res?.total ?? 0;
    }).finally(() => {
      addProdLoading.value = false
    });
}

const batchAdd = (row = {}) => {
  let products = []
  if (JSON.stringify(row) != "{}") {
    products.push(row);
  } else {
    products = selectList.value;
  }

  let params = {
    products,
    account: rowAccount.value,
    actionId: rowId.value, //活动ID
  };
  addProdLoading.value = true
  addProducts(params)
    .then((res) => {
      message.success("添加成功");
      emit("addPordFun")
      handleCancel()
    }).finally(() => {
      addProdLoading.value = false
    });
}

watch(() => props.addProdVis, val => {
  val && getList()
})

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  rowId.value = urlParams.get('id');
  rowAccount.value = urlParams.get('account');
})
</script>
<style lang="less" scoped></style>