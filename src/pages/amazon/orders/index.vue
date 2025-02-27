<template>
  <div account="ordersCont">
    <a-card style="margin: 10px 0">
      <a-tabs v-model:activeKey="activeKey" type="card" @change="handleTabchange">
        <a-tab-pane :key="1" tab="120天内订单"></a-tab-pane>
        <a-tab-pane :key="2" tab="历史订单"></a-tab-pane>
      </a-tabs>
      <a-form :model="formState">
        <a-form-item label="店铺账号：">
          <div class="accountForm" v-if="account.length > 0">
            <a-button @click="selectAll" :type="isAllSelected ? 'primary' : ''">全部</a-button>
            <a-button @click="selectItem(index, item)" :type="selectedIndex === index ? 'primary' : ''"
              v-for="(item, index) in account" :key="item.id">{{ item.simpleName }}</a-button>
          </div>
          <!-- <selectComm style="margin-left: 10px" :options="account" :fieldObj="shopObj" @backSelectAll="selectAll"
            @backSelectItem="selectItem"></selectComm> -->
        </a-form-item>
        <a-form-item>
          <div style="
              display: flex;
              flex-direction: column;
              align-items: flex-start;
            ">
            <div style="display: flex; margin-bottom: 24px">
              <span style="margin-right: 10px; white-space: nowrap">订单状态：</span>
              <selectComm :options="orderType" :fieldObj="orderObj" @backSelectAll="orderSelectAll"
                @backSelectItem="orderSelectItem"></selectComm>
            </div>
            <div style="display: flex; margin-bottom: 24px">
              <span style="margin-right: 10px; white-space: nowrap">国家区域：</span>
              <selectComm v-if="areaList.length > 0" :options="areaList" :fieldObj="areaObj"
                @backSelectAll="areaSelectAll" @backSelectItem="areaSelectItem"></selectComm>
            </div>
            <div style="display: flex">
              <span style="margin-right: 10px; white-space: nowrap">物流方式：</span>
              <selectComm :options="materialflowType" :fieldObj="materialflowObj" @backSelectAll="materialflowSelectAll"
                @backSelectItem="materialflowSelectItem"></selectComm>
            </div>
          </div>
        </a-form-item>
        <a-form-item label="排序方式：">
          <div class="stor-box">
            <a-button v-for="item in strList" :key="item.prop" :type="item.prop === active.prop ? 'primary' : ''"
              @click="storChange(item)">
              <span>{{ item.label }}</span>
              <AsyncIcon icon="CaretUpOutlined" v-if="item.prop === active.prop && active.type == 'bottom'" />
              <AsyncIcon icon="CaretDownOutlined" v-if="item.prop === active.prop && active.type == 'top'" />
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card>
      <div style="display: flex;">
        <a-button type="primary" :loading="asyncOrderLoading" style="margin-right: 10px;"
          @click="asyncOrderModal = true">同步订单数据</a-button>
        <a-dropdown>
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item :key="1">按时间导出</a-menu-item>
              <a-menu-item :key="2">导出勾选的订单</a-menu-item>
              <a-menu-item :key="3">导出全部页订单</a-menu-item>
            </a-menu>
          </template>
          <a-button>
            导出订单
            <AsyncIcon icon="DownOutlined" />
          </a-button>
        </a-dropdown>
      </div>
      <div>
        <a-pagination style="margin: 20px 0 10px 0; text-align: right" :show-total="(total) => `共 ${total} 条`"
          v-model:current="paginations.pageNum" v-model:pageSize="paginations.pageSize" :total="paginations.total"
          class="pages" :show-quick-jumper="true" @change="queryList" :showSizeChanger="true"
          :pageSizeOptions="[50, 100, 200]" />
        <a-table bordered :columns="columns" :data-source="data" :scroll="{ x: 2000 }" :expand-column-width="0"
          :defaultExpandAllRows="true" :loading="tableLoading" :rowKey="(record) => record.key" :pagination="false"
          :row-selection="{
            selectedRowKeys,
            onChange,
          }">
          <template #bodyCell="{ column }">
            <template v-if="column.key === 'amount'">
              <span></span>
            </template>
            <template v-if="column.key === 'district'">
              <span></span>
            </template>
            <template v-if="column.key === 'orderNumber'">
              <span></span>
            </template>
            <!-- <template v-if="column.key === 'time'">
              <span></span>
            </template> -->
            <template v-if="column.key === 'logisticsmode'">
              <span></span>
            </template>
            <template v-if="column.key === 'orderStatus'">
              <span></span>
            </template>
            <!-- <template v-if="column.key === 'typeStatus'">
              <span></span>
            </template> -->
          </template>
          <template #expandedRowRender="{ record }">
            <a-row>
              <a-col :span="3" style="margin-right:50px; ">
                <div class="flex">
                  <div>
                    <a-popover placement="right">
                      <template #content>
                        <div>
                          <AsyncIcon icon="SearchOutlined"></AsyncIcon>
                          <span style="color: #a0a3a6;">找货源</span>
                          <a-button @click="toJump" style="margin:0 0 10px 10px;">1688</a-button>
                        </div>
                        <img style="width: 100px;height: 100px;" :src="record.pImg" alt="">
                      </template>
                      <img style="width: 50px;height: 50px;" :src="record.pImg" alt="">
                    </a-popover>
                  </div>
                  <div class="flex flex-col ml-[10px]">
                    <span>{{ record.sku }}</span><span>{{ record.currency }}:{{ record.itemPrice }}</span>
                  </div>
                </div>
              </a-col>
              <a-col :span="3">{{ record.totaMmoney }}</a-col>
              <a-col :span="3">{{ record.district }}</a-col>
              <a-col :span="3">{{ record.amazonOrderId }}</a-col>
              <a-col :span="3">
                <div>
                  <div>{{ record.sTime }}</div>
                  <div>{{ record.fTime }}</div>
                  <div>{{ record.sdTime }}</div>
                </div>
              </a-col>
              <a-col :span="3">{{ record.logisticsmode }}</a-col>
              <a-col :span="2" style="margin-right:100px; ">{{ record.status }}</a-col>
              <a-col :span="2">
                <a @click="openDetailsModal = true">详情</a>
              </a-col>
            </a-row>
          </template>
        </a-table>
        <a-pagination style="margin-top: 10px; text-align: right" :show-total="(total) => `共 ${total} 条`"
          v-model:current="paginations.pageNum" v-model:pageSize="paginations.pageSize" :total="paginations.total"
          class="pages" :show-quick-jumper="true" :showSizeChanger="true" @change="queryList"
          :pageSizeOptions="[50, 100, 200]" />
      </div>
    </a-card>
    <exportModal v-model:openExModal="openExModal" @backRefresh="backRefresh" :isTimes="isTimes"
      :selectedRowKeys="selectedRowKeys" :exportWay="exportWay" :incomingForm="formState"></exportModal>
    <detailsModal v-model:openDetailsModal="openDetailsModal"></detailsModal>
    <a-modal :open="asyncOrderModal" @ok="handleOk" title="同步时间选择" @cancel="asyncOrderModal = false" :width="'20%'"
      :maskClosable="false" :keyboard="false">
      <a-range-picker @change="onRangeChange" v-model:value="asyncObj.asyncTime" style="margin: 20px 0;" />
    </a-modal>
  </div>
</template>

<script setup name='orders'>
import selectComm from "~/components/select-unwrap/selectComm.vue";
import { ref, reactive, onMounted, computed, watchPostEffect } from "vue";
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import exportModal from "./common/exportModal.vue";
import detailsModal from "./common/detailsModal.vue";
import { asyncOrder, queryShop, queryAreaName, orderList, historyOrderList } from "../js/api/order"


const activeKey = ref(1); // 默认120天内订单
const isAllSelected = ref(true);
const selectedIndex = ref(null);
const asyncOrderModal = ref(false);
const asyncOrderLoading = ref(false);
const tableLoading = ref(false);
const exportWay = ref(null);
const asyncObj = reactive({
  asyncTime: [],
  startTime: "",
  endTime: ""
})
const areaList = ref([]);
const formState = reactive({
  shopId: [],
  marketId: [],
  orderType: [],
  materialFlowType: [],
  sortType: "",
  sortName: "",
});
const tableData = ref([]);
const paginations = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0,
});
const sortObj = reactive({
  sortField: "orderDate",
  sortType: "ASC"
})
const openExModal = ref(false);
const openDetailsModal = ref(false);
const isTimes = ref(false);

const orderObj = ref({
  fieldKey: "status",
  fieldLabel: "name",
});
const areaObj = ref({
  fieldKey: "marketplaceId",
  fieldLabel: "countryZhName",
});
const materialflowObj = ref({
  fieldKey: "val",
  fieldLabel: "name",
});
const active = ref({
  label: "按下单时间",
  value: "orderDate",
  type: "bottom",
  prop: 2,
  isDefault: true,
}); // 默认按下单时间查询
const strList = ref([
  {
    label: "按产品SKU",
    value: "sku",
    type: "top",
    prop: 1,
    isDefault: false,
  },
  {
    label: "按下单时间",
    type: "bottom",
    value: "orderDate",
    prop: 2,
    isDefault: true,
  },
  // {
  //   label: "按剩余发货时间",
  //   type: "top",
  //   prop: 3,
  //   isDefault: false,
  // },
  {
    label: "按付款时间",
    value: "orderPostedDate",
    type: "top",
    prop: 4,
    isDefault: false,
  },
  // {
  //   label: "按提交时间",
  //   type: "top",
  //   prop: 5,
  //   isDefault: false,
  // },
  // {
  //   label: "按订单金额",
  //   type: "top",
  //   prop: 6,
  //   isDefault: false,
  // },
]);
const account = ref([]);
const orderType = ref([
  {
    name: "未付款",
    status: 1,
  },
  {
    name: "风控中",
    status: 2,
  },
  {
    name: "待审核",
    status: 3,
  },
  {
    name: "待处理",
    status: 4,
  },
  {
    name: "已处理",
    status: 5,
  },
  {
    name: "待打单（有货）",
    status: 6,
  },
  {
    name: "待打单（缺货）",
    status: 7,
  },
  {
    name: "待打单（有异常）",
    status: 8,
  },
  {
    name: "已交运",
    status: 9,
  },
  {
    name: "已退款",
    status: 10,
  },
  {
    name: "已忽略",
    status: 11,
  },
  {
    name: "已完成",
    status: 12,
  },
]);
const materialflowType = ref([
  {
    name: "亚马逊官方",
    val: "1",
  },
  {
    name: "卖家自定义",
    val: "2",
  },
]);

const selectedRowKeys = ref([]);
const onChange = (selecteds) => {
  console.log('selecteds', selecteds);

  selectedRowKeys.value = selecteds;
};
const columns = [
  {
    title: "商品信息",
    dataIndex: "name",
    key: "name",
    fixed: true,
  },
  {
    title: "订单金额",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "收件人「国家/地区」",
    dataIndex: "district",
    key: "district",
  },
  {
    title: "订单号",
    dataIndex: "orderTypes",
    key: "orderTypes",
  },
  {
    title: "时间",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "物流方式",
    dataIndex: "logisticsmode",
    key: "logisticsmode",
  },
  {
    title: "状态",
    dataIndex: "orderStatus",
    key: "orderStatus",
  },
  {
    title: "操作",
    dataIndex: "typeStatus",
    key: "typeStatus",
  },
];

const data = [
  {
    key: 1,
    name: "XMBH0RFN52667",
    age: 32,
    address: "New York No. 1 Lake Park",
    currency: "USD",
    itemPrice: "1.99",
    sku: "zjsad/*1",
    pImg: "https://www.xzerp.com/file/wish/upload/2024-12-25/2024/12/25/3_20241225105710A001.jpg",
    description:
      "这里是商品信息",
    totaMmoney: "EUR 2.99",
    district: "Marijana Subjak 「克罗地亚」",
    amazonOrderId: "303-3004939-9140321",
    time: "买家指定： Standard",
    sTime: "下单：2017-07-25 04:30",
    fTime: "发货：2017-07-27 05:59",
    sdTime: "送达：2017-08-22 05:59",
    logisticsmode: "WishPost「83882179897」",
    status: "已发货",
    orderTypes: "支付: 货到付款(CASH_ON_DELIVERY)",
    typeStatus: "[全托管]"
  },
  {
    key: 2,
    name: "XMBH0RFN67432",
    age: 42,
    address: "London No. 1 Lake Park",
    currency: "EUR",
    itemPrice: "1.99",
    pImg: "https://www.xzerp.com/file/wish/upload/2024-12-25/2024/12/25/3_20241225105710A001.jpg",
    sku: "zjsad/*2",
    description:
      "My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.",
    amount: "EUR 2.49",
    district: "Ginevra Angelelli 「意大利」",
    orderNumber: "302-5650913-5525965",
    time: "买家指定： Standard",
    sTime: "下单：2017-07-25 04:30",
    fTime: "发货：2017-07-27 05:59",
    sdTime: "送达：2017-08-22 05:59",
    logisticsmode: "WishPost「86514181187」",
    status: "已退款",
  },
  {
    key: 3,
    name: "XMBH0RFP17429",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    currency: "USD",
    itemPrice: "1.99",
    pImg: "https://www.xzerp.com/file/wish/upload/2024-12-25/2024/12/25/3_20241225105710A001.jpg",
    sku: "zjsad/*3",
    description:
      "My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.",
    amount: "USD 5",
    district: "Joan Abad Marin 「西班牙」",
    orderNumber: "5a3e2bbc927efb43cb3e0010",
    time: "买家指定： Standard",
    sTime: "下单：2017-07-25 04:30",
    fTime: "发货：2017-07-27 05:59",
    sdTime: "送达：2017-08-22 05:59",
    logisticsmode: "WishPost「SFC1WU2492806200355」",
    status: "已忽略",
  },
];

// 时间切换
const onRangeChange = (value, dateString) => {
  asyncObj.startTime = dateString[0];
  asyncObj.endTime = dateString[1];
};

// 店铺全选和单选
const selectAll = () => {
  isAllSelected.value = true;
  selectedIndex.value = null;
  formState.shopId = account.value.map(item => item.id)
  queryAreaNameList({ areaAames: account.value.map(item => item.areaEnName) })
  queryList();
};
const selectItem = (index, item) => {
  if (isAllSelected.value) {
    isAllSelected.value = false;
  }
  selectedIndex.value = index;
  formState.shopId = [item.id]
  queryAreaNameList({ areaAames: [item.areaEnName] })
  queryList();
};


const toJump = () => {
  const url = 'https://air.1688.com/app/1688-global/main-site-channel/landing-page.html';
  window.open(url, "_blank");
}

// 订单状态全选和单选
const orderSelectAll = () => {
  console.log("1");
};
const orderSelectItem = (val) => {
  console.log("2", val);
  //   formState.shopId = account;
};

// 站点全选和单选
const areaSelectAll = () => {
  formState.marketId = areaList.value.map(item => item.marketplaceId)
  queryList();
};
const areaSelectItem = (val) => {
  formState.marketId = [val]
  queryList();
};


// 物流全选和单选
const materialflowSelectAll = () => {
  console.log("1");
};
const materialflowSelectItem = (val) => {
  console.log("2", val);
  //   formState.shopId = account;
};
// 排序方式
const storChange = (val) => {
  val.type = val.type === "top" ? "bottom" : "top";
  active.value = val;
  sortObj.sortField = val.sortField
  sortObj.sortType = val.type === "top" ? "ASC" : "DESC"
  queryList();
};

// 同步订单
const handleOk = () => {
  const { shopId, marketId } = formState;
  asyncOrderLoading.value = true
  let params = {
    shopId,
    marketId,
    orderStatuses: "",
    startTime: asyncObj.startTime,
    endTime: asyncObj.endTime
  }
  asyncOrder(params).then(res => {

  }).finally(() => {
    asyncOrderLoading.value = false;
    asyncOrderModal.value = false
    queryList();
  })
}
// 查询店铺
const queryShopList = () => {
  queryShop().then(res => {
    account.value = res?.data ?? [];
    formState.shopId = res?.data?.map(item => item.id)
    if (isAllSelected.value) {
      queryAreaNameList({ areaAames: account.value.map(item => item.areaEnName) })
    }
  })
}
// 根据店铺区域查站点
const queryAreaNameList = (list) => {
  queryAreaName(list).then(res => {
    areaList.value = res?.data ?? [];
  }).finally(() => {
    if (account.value.length > 0 && areaList.value.length > 0) {
      formState.marketId = areaList.value.map(item => item.marketplaceId)
      queryList();
    }
  })
}
// tab切换
const handleTabchange = (activeKey) => {
  queryList()
}

//导出后刷新页面（防止表格选中后，没法清空）
const backRefresh = () => {
  queryList()
}


// 120天内订单数据
const queryList = () => {
  const { shopId, marketId } = formState;
  tableLoading.value = true
  let params = {
    shopId,
    marketId,
    orderStatus: "订单状态",
    pageSize: paginations.pageSize,
    pageNum: paginations.pageNum,
    sortField: sortObj.sortField,  //排序字段
    sortType: sortObj.sortType   //排序方式
  }

  if (activeKey.value == 1) {
    orderList(params).then(res => {
      tableData.value = res?.rows ?? []
      paginations.total = res?.total ?? 0
    }).finally(() => {
      tableLoading.value = false
    })
  } else {
    historyOrderList(params).then(res => {
      tableData.value = res?.rows ?? []
      paginations.total = res?.total ?? 0
    }).finally(() => {
      tableLoading.value = false
    })
  }
}

// 导出方式
const handleMenuClick = (e) => {
  openExModal.value = true;
  isTimes.value = e.key === 1 ? true : false;
  exportWay.value = e.key
};

onMounted(() => {
  queryShopList();

});
</script>
<style lang="less" scoped>
:deep(.ant-form) {
  .ant-form-item {
    .ant-form-item-control-input-content {
      display: flex;
      align-items: flex-start;

      .stor-box {
        width: 100%;
        display: flex;

        .ant-btn {
          margin: 0 10px;
        }
      }
    }
  }
}

.shopItem {
  display: flex;

  div {
    border-right: 1px solid #ccc;
  }
}

.accountForm {
  display: flex;
  flex-wrap: wrap;

  .ant-btn {
    margin: 0 5px 10px 0;
  }
}
</style>