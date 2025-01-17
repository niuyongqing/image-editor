<template>
  <div id="activityListCont">
    <a-card title="活动信息" class="text-left">
      <a-descriptions class="margin-top" :column="2">
        <a-descriptions-item label="活动名称">{{
          activeInfo.title
        }}</a-descriptions-item>
        <a-descriptions-item label="店铺名称">{{
          activeInfo.sellerId
        }}</a-descriptions-item>
        <a-descriptions-item label="促销活动时间">{{
          activeInfo.dateStart
        }}</a-descriptions-item>
        <a-descriptions-item label="报名截止时间"> </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card title="促销产品" class="text-left mt-5">
      <div class="mb-2.5 ml-6">
        <a-form layout="inline" ref="ruleForm" :model="formData" class="form-padding" laba-width="100px">
          <a-form-item class="flex">
            <a-select v-model:value="searchVal" style="width: 120px" :options="options"></a-select>
          </a-form-item>
          <a-form-item name="productId" v-if="searchVal == 1">
            <a-input allow-clear v-model:value="formData.productId" style="width: 400px"
              placeholder="多个产品ID用英文逗号隔开"></a-input>
          </a-form-item>
          <a-form-item name="productName" v-if="searchVal == 2">
            <a-input allow-clear v-model:value="formData.productName" style="width: 400px"
              placeholder="请输入产品标题"></a-input>
          </a-form-item>
          <a-form-item name="sku" v-if="searchVal == 3">
            <a-input allow-clear v-model:value="formData.sku" style="width: 400px"
              placeholder="多个产品SKU用英文逗号隔开"></a-input>
          </a-form-item>
          <a-form-item name="description">
            <a-button type="primary" @click="onSubmit">查询</a-button>
            <a-button @click="resetForm" class="ml-2.5">重置</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="ml-5 mt-5">
        <a-button @click="addProdVis = true" v-has-permi="[`platform:ozon:activity:save:product`]">添加产品</a-button>
        <a-button type="primary" class="mx-2.5" v-has-permi="[`platform:ozon:activity:delete:product`]" @click="del()"
          :disabled="selectList.length == 0">批量移除</a-button>
        <a-button type="primary" v-has-permi="[`platform:ozon:activity:save:product`]" @click="save()"
          :disabled="selectList.length == 0">批量保存</a-button>

        <a-table :data-source="activeData" bordered stripe ref="promotionTable" v-loading="addProdLoading"
          :row-selection="rowSelection" :pagination="false" :rowKey="(row) => row.productId"
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
                <span>{{ record.salePrice }}</span><span style="margin-left: 10px">CNY</span>
              </div>
            </template>
            <template v-if="column.dataIndex === 'discount'">
              <div>
                <a-input style="width: 80%" @input="editDiscount(record)" v-model:value="record.discount"></a-input>
                <span style="margin-left: 10px">%</span>
              </div>
            </template>
            <template v-if="column.dataIndex === 'discountPrice'">
              <div>
                <a-input style="width: 80%" v-model:value="record.discountPrice" @input="changeVal(record)"></a-input>
                <span style="margin-left: 10px">CNY</span>
              </div>
            </template>
            <template v-if="column.dataIndex === 'actionActivityCount'">
              <div>
                <span>{{ record.actionActivityCount }}</span><span v-show="record.actionActivityCount">个</span>
              </div>
            </template>
            <template v-if="column.dataIndex === 'stock'">
              <a-input v-model:value="record.stock" style="width: 70%"></a-input>
            </template>
            <template v-if="column.dataIndex === 'option'">
              <a-button type="text" v-has-permi="[`platform:ozon:activity:delete:product`]"
                @click="del(record)">移除</a-button>
              <a-button type="text" v-has-permi="[`platform:ozon:activity:save:product`]"
                @click="save(record)">保存</a-button>
            </template>
          </template>
        </a-table>
        <a-pagination style="margin-top: 20px;text-align: right;" :show-total="(total) => `共 ${total} 条`"
          :total="paginations.total" show-quick-jumper v-model:current="paginations.pageNum"
          v-model:pageSize="paginations.pageSize" :defaultPageSize="50" :showSizeChanger="true"
          @change="getPromotionProdList" :pageSizeOptions="[50, 100, 200]"></a-pagination>
      </div>
    </a-card>
    <productList :addProdVis="addProdVis" @closeModal="addProdVis = false" @addPordFun="getPromotionProdList">
    </productList>
  </div>
</template>

<script setup name='activityList'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import {
  detail,
  candidates,
  addProducts,
  delActProd
} from "../config/api/promotion"
import AsyncIcon from "~/layouts/components/menu/async-icon.vue"
import tableHeaders from "../config/tabColumns/promotionProdList"
import productList from "./comm/productList.vue"
import { message } from 'ant-design-vue';
const formData = reactive({
  productId: "",
  productName: "",
  sku: "",
})
const ruleForm = ref(null)
const activeData = ref([])
const shopId = ref("")
const activityId = ref(null)
const addProdLoading = ref(false)
const addProdVis = ref(false)
const selectList = ref([])
const dropCol = tableHeaders
const searchVal = ref(1)
const rowId = ref("")
const rowAccount = ref("");
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
const activeInfo = reactive({
  title: "",
  sellerId: "",
  dateStart: "",
  shopName: "",
})

const onSubmit = () => { getPromotionProdList() }
const resetForm = () => {
  ruleForm.value.resetFields();
  searchVal.value = 1
  getPromotionProdList()
}
const getPromotionProdList = () => {
  const { productId, productName, sku, skuId } = formData;
  let params = {
    id: rowId.value,
    productId,
    productName,
    sku,
    skuId,
    account: rowAccount.value,
    ...paginations,
  };
  addProdLoading.value = true
  detail(params)
    .then((res) => {
      const { title, sellerId, dateStart, total, id } = res?.data || {};
      activeData.value =
        res?.data?.activityResps?.map((item) => {
          item.discount = (
            ((item.salePrice - item.discountPrice) / item.salePrice) *
            100
          ).toFixed(2);
          return item;
        }) ?? [];
      let obj = {
        title, sellerId, dateStart
      }
      Object.assign(activeInfo, obj);
      paginations.total = total ?? 0;
      shopId.value = sellerId ?? "";
      activityId.value = id ?? "";
    })
    .finally(() => {
      addProdLoading.value = false
    });
}
const rowSelection = {
  onChange: (selectedRow) => {
    selectList.value = selectedRow;
  },
};
const addProd = () => { }

const del = (row = {}) => {
  let productList = [];
  if (JSON.stringify(row) != "{}") {
    productList.push({ productId: row.productId });
  } else {
    productList = selectList.value.map((item) => {
      return {
        productId: item.productId,
      };
    });
  }
  let params = {
    account: rowAccount.value,
    actionId: rowId.value,
    products: productList,
    isEdit: true,
  };
  addProdLoading.value = true
  delActProd(params)
    .then((res) => {
      message.success("操作成功");
      selectList.value = [];
    })
    .finally(() => {
      addProdLoading.value = false
    });
}

// 计算促销折扣
const editDiscount = (row) => {
  if (row.salePrice < row.discountPrice) {
    message.error("促销价格不能大于等于售价");
    return;
  }
  if (row.discount < 0 || row.discount > 100) {
    message.error("促销折扣必须在 0 到 100 之间");
    return;
  }
  row.discountPrice = parseFloat(row.salePrice * (1 - row.discount / 100)).toFixed(2)
}
// 修改促销价格计算促销折扣
const changeVal = (row) => {
  if (row.discountPrice >= row.maxActionPrice) {
    message.error(`不能大于等于最大促销价格${row.maxActionPrice}CYN`);
    return;
  }
  row.discount = (((row.salePrice - row.discountPrice) / row.salePrice) * 100).toFixed(2)
}




const save = (row = {}) => {
  let productList = [];
  if (JSON.stringify(row) != "{}") {
    productList.push({
      productId: row.productId,
      actionPrice: row.discountPrice,
      stock: row.stock,
    });
  } else {
    productList = selectList.value.map((item) => {
      return {
        productId: item.productId,
        actionPrice: item.discountPrice,
        stock: item.stock,
      };
    });
  }
  let params = {
    account: rowAccount.value,
    actionId: rowId.value,
    products: productList,
  };
  addProdLoading.value = true
  addProducts(params)
    .then((res) => {
      message.success("操作成功");
      selectList.value = [];
    })
    .finally(() => {
      addProdLoading.value = false
    });
}


onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  rowId.value = urlParams.get('id');
  rowAccount.value = urlParams.get('account');
  getPromotionProdList()
})
</script>
<style lang="less" scoped></style>