<template>
  <div account="ordersCont">
    <appTableForm
      @onSubmit="queryList"
      resetSetMenu="ordersCont"
      v-model:formData="formState"
    >
      <template #formItemRow>
        <a-form-item label="店铺账号：" name="account">
          <appCardSelect
            :multiple="false"
            :options="account"
            :fieldObj="{
              value: 'account',
              label: 'simpleName',
            }"
            v-model:account="formState.account"
          ></appCardSelect>
        </a-form-item>
        <a-form-item label="订单状态：" name="status">
          <div class="flex flex-col items-center">
            <div style="display: flex; margin-bottom: 24px">
              <selectComm
                ref="selectCommRef"
                :options="orderType"
                :fieldObj="orderObj"
                @backSelectAll="orderSelectAll"
                @backSelectItem="orderSelectItem"
              ></selectComm>
            </div>
          </div>
        </a-form-item>
        <a-form-item label="排序方式：" name="order">
          <div class="stor-box">
            <a-button
              v-for="item in strList"
              :key="item.prop"
              :type="item.prop === active.prop ? 'primary' : ''"
              @click="storChange(item)"
            >
              <span>{{ item.label }}</span>
              <AsyncIcon
                icon="CaretUpOutlined"
                v-if="item.prop === active.prop && active.type == 'bottom'"
              />
              <AsyncIcon
                icon="CaretDownOutlined"
                v-if="item.prop === active.prop && active.type == 'top'"
              />
            </a-button>
          </div>
        </a-form-item>
      </template>
    </appTableForm>

    <AppTableBox
      :dataSource="data"
      :loading="tableLoading"
      :tableHeader="columns"
      :scroll="{ y: 2100 }"
      rowKey="id" 
      resetSetMenu="ozon-order"
      :row-selection="rowSelection"
    >
      <template #otherCount>
        <a-tabs
          v-model:activeKey="activeKey"
          type="card"
          @change="handleTabchange"
        >
          <a-tab-pane :key="1" tab="120天内订单"></a-tab-pane>
          <a-tab-pane :key="2" tab="历史订单"></a-tab-pane>
        </a-tabs>
      </template>
      <template #leftTool>
        <a-button
          type="primary"
          :loading="asyncOrderLoading"
          style="margin-right: 10px"
          @click="asyncOrderModal = true"
          >同步订单数据</a-button
        >
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
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'products'">
          <div>
            <span>{{ record.offerId }}</span>
            <span>* {{ record.quantity }}</span>
            <p>
              <span>{{ record.currencyCode }}</span>
              <span>{{ record.price }}</span>
            </p>
            <p>
              跟踪号：<span>{{ record.trackingNumber }}</span>
            </p>
          </div>
        </template>
        <template v-if="column.key === 'orderAmount'">
          <span>{{ record.currencyCode }} {{ record.orderAmount }}</span>
        </template>
        <template v-if="column.key === 'customerName'">
          <span>{{ record.customerName }}</span
          ><span>[俄罗斯]</span>
        </template>
        <template v-if="column.key === 'deliveryMethodName'">
          <p>买家指定： {{ record.deliveryMethodName }}</p>
          <div>
            <span>下单时间：</span><span>{{ record.inProcessAt }}</span>
          </div>
          <div>
            <span>付款时间：</span><span>{{ record.deliveringDate }}</span>
          </div>
          <div style="color: red">
            <span>剩余发货：</span><span>{{ record.shipmentDate }}</span>
          </div>
        </template>
        <template v-if="column.key === 'options'">
          <a @click="openDetailsModal = true">详情</a>
        </template>
      </template>
      <template #pagination>
        <appTablePagination
          @pageNumChange="handlePageChange"
          @pageSizeChange="handlePageSizeChange"
          v-model:current="paginations.pageNum"
          v-model:pageSize="paginations.pageSize"
          :total="paginations.total"
        />
      </template>
    </AppTableBox>

    <exportModal
      v-model:openExModal="openExModal"
      @backRefresh="backRefresh"
      :isTimes="isTimes"
      :selectedRowKeys="selectedRowKeys"
      :exportWay="exportWay"
      :incomingForm="formState"
    ></exportModal>
    <detailsModal v-model:openDetailsModal="openDetailsModal"></detailsModal>
    <a-modal
      :open="asyncOrderModal"
      title="同步时间选择"
      @cancel="asyncOrderModal = false"
      :width="'20%'"
      :maskClosable="false"
      :keyboard="false"
    >
      <a-range-picker
        @change="onRangeChange"
        v-model:value="asyncObj.asyncTime"
        show-time
        style="margin: 20px 0"
      />

      <template #footer>
        <a-button :loading="asyncOrderLoading" @click="asyncOrderModal = false"
          >取消</a-button
        >
        <a-button type="primary" :loading="asyncOrderLoading" @click="handleOk"
          >确定</a-button
        >
      </template>
    </a-modal>
  </div>
</template>

<script setup name="orders">
import selectComm from "~/components/select-unwrap/selectComm.vue";
import { ref, reactive, onMounted, computed, watchPostEffect } from "vue";
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import exportModal from "./common/exportModal.vue";
import detailsModal from "./common/detailsModal.vue";
import { accountCache } from "../config/api/product";
import { orderStatus } from "../config/commDic/defDic";
// asyncOrder, queryShop, queryAreaName, historyOrderList
import { orderList, asyncOrder } from "~/pages/ozon/config/api/order";
import { message } from "ant-design-vue";
import appTableBox from "~/components/common/appTableBox.vue";
import appTablePagination from "~@/components/common/appTablePagination.vue";
import appTableForm from "~@/components/common/appTableForm.vue";
import appCardSelect from "~@/components/common/appCardSelect.vue";
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
  endTime: "",
});
const emit = defineEmits([
  "selection-change",
]);
const areaList = ref([]);
const formState = reactive({
  account: "",
  orderStat: "",
});
// const tableData = ref([]);
const paginations = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0,
});
const sortObj = reactive({
  sortField: "orderDate",
  sortType: "ASC",
});
const openExModal = ref(false);
const openDetailsModal = ref(false);
const isTimes = ref(false);

const orderObj = ref({
  fieldKey: "status",
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
    name: "待打包",
    status: "awaiting_packaging",
  },
  {
    name: "已取消",
    status: "cancelled",
  },
  {
    name: "配送中",
    status: "delivering",
  },
  {
    name: "即将送达",
    status: "last-mile",
  },
  {
    name: "已送达",
    status: "delivered",
  },
  {
    name: "待配送",
    status: "awaiting_deliver",
  },
  {
    name: "卖家已发货",
    status: "sent_by_seller",
  },
]);
const selectCommRef = ref(null);
watch(
  () => formState.orderStat,
  (newVal, oldVal) => {
    if (newVal === "") {
      selectCommRef.value?.selectAll(false);
    }
  }
);

const selectedRowKeys = ref([]);
// const onChange = (selecteds) => {
//   selectedRowKeys.value = selecteds;
// };
/**
 * 表格行选择配置
 */
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys, selectedRows) => {
    selectedRowKeys.value = keys;
    emit("selection-change", selectedRows);
    console.log("selectedRowKeys", selectedRowKeys.value);
    console.log("selectedRows", selectedRows);
  },
  // getCheckboxProps: (record) => ({
  //   disabled: !!record.auditStatus, // 已审核的商品不可选
  // })
}));
const columns = [
  {
    title: "商品明细",
    dataIndex: "products",
    key: "products",
  },
  {
    title: "订单编号",
    dataIndex: "orderNumber",
    key: "orderNumber",
  },
  {
    title: "店铺单号",
    dataIndex: "postingNumber",
    key: "postingNumber",
  },
  {
    title: "订单金额",
    dataIndex: "orderAmount",
    key: "orderAmount",
    align: "right",
  },
  {
    title: "收件人「国家/地区」",
    dataIndex: "customerName",
    key: "customerName",
  },
  {
    title: "时间",
    dataIndex: "deliveryMethodName",
    key: "deliveryMethodName",
  },
  {
    title: "物流方式",
    dataIndex: "tplIntegrationType",
    key: "tplIntegrationType",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "options",
    key: "options",
    align: "center",
  },
];

const data = ref([]);

// 时间切换
const onRangeChange = (value, dateString) => {
  asyncObj.startTime = dateString[0];
  asyncObj.endTime = dateString[1];
};

// 店铺全选和单选
const selectAll = () => {
  isAllSelected.value = true;
  selectedIndex.value = null;
  formState.account = "";
  queryList();
};
const selectItem = (index, item) => {
  if (isAllSelected.value) {
    isAllSelected.value = false;
  }
  selectedIndex.value = index;
  formState.account = item.account;
  queryList();
};

// 订单状态全选和单选
const orderSelectAll = () => {
  formState.orderStat = "";
  queryList();
};
const orderSelectItem = (val) => {
  formState.orderStat = val;
  queryList();
};

// 处理页码和条数变化
const handlePageChange = (page) => {
  paginations.pageNum = page;
  queryList();
};

/**
 * 处理每页条数变化
 */
const handlePageSizeChange = (val) => {
  // 确保pageSize是数字类型
  paginations.pageSize = Number(val);
  queryList();
};

// 排序方式
const storChange = (val) => {
  val.type = val.type === "top" ? "bottom" : "top";
  active.value = val;
  sortObj.sortField = val.sortField;
  sortObj.sortType = val.type === "top" ? "ASC" : "DESC";
  queryList();
};

// 同步订单
const handleOk = () => {
  const { account, orderStat } = formState;
  asyncOrderLoading.value = true;
  let params = {
    account: account,
    orderStatuses: "",
    startDate: asyncObj.startTime,
    endDate: asyncObj.endTime,
  };
  asyncOrder(params)
    .then((res) => {
      message.success(res.msg);
    })
    .finally(() => {
      asyncOrderLoading.value = false;
      asyncOrderModal.value = false;
      asyncObj.startTime = "";
      asyncObj.endTime = "";
      asyncObj.asyncTime = [];
      queryList();
    });
};
// 查询店铺
const queryShopList = () => {
  accountCache().then((res) => {
    account.value = res?.data ?? [];
    formState.account = "";
  });
};
// tab切换
const handleTabchange = (activeKey) => {
  queryList();
};

//导出后刷新页面（防止表格选中后，没法清空）
const backRefresh = () => {
  queryList();
  selectedRowKeys.value = [];
};

const statusMenus = {
  awaiting_approve: "等待确认",
  awaiting_deliver: "待配送",
  awaiting_packaging: "待打包",
  cancelled: "已取消",
  "last-mile": "即将送达",
  delivering: "配送中",
  delivered: "已送达",
  sent_by_seller: "卖家已发货",
};

const tplTyep = {
  ozon: "Ozon 快递服务",
  "3pl_tracking": "集成服务快递",
  non_integrated: "第三方物流服务",
  aggregator: "通过Ozon合作物流伙伴交付",
  hybryd: "俄罗斯邮政配送方案",
};
// 120天内订单数据
const queryList = () => {
  const { account, orderStat } = formState;
  tableLoading.value = true;
  let params = {
    account,
    status: orderStat,
    pageSize: paginations.pageSize,
    pageNum: paginations.pageNum,
    queryHistoryOrder: activeKey.value == 1 ? true : false,
    prop: sortObj.sortField, //排序字段
    order: sortObj.sortType, //排序方式
  };

  orderList(params)
    .then((res) => {
      data.value =
        res?.rows.map((item) => {
          return {
            id: item.orderId, // 添加id字段作为rowKey
            customerName: item.customer.name,
            deliveryMethodName: item.deliveryMethod.name,
            inProcessAt: item.inProcessAt,
            shipmentDate: item.shipmentDate,
            deliveringDate: item.deliveringDate,
            postingNumber: item.postingNumber,
            products: item.products,
            orderAmount: item.orderAmount,
            trackingNumber: item.trackingNumber,
            orderNumber: item.orderNumber,
            offerId: item.products[0].offerId,
            price: item.products[0].price,
            orderId: item.orderId,
            quantity: item.products[0].quantity,
            currencyCode: item.products[0].currencyCode,
            status: statusMenus[item.status],
            tplIntegrationType: tplTyep[item.tplIntegrationType],
          };
        }) ?? [];
      paginations.total = res?.total ?? 0;
    })
    .finally(() => {
      tableLoading.value = false;
    });
};

// 导出方式
const handleMenuClick = (e) => {
  openExModal.value = true;
  isTimes.value = e.key === 1 ? true : false;
  exportWay.value = e.key;
};

onMounted(() => {
  queryShopList();
  queryList();
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
