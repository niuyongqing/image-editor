<template>
  <div account="ordersCont">
    <a-card style="margin: 10px 0">
      <a-tabs v-model:activeKey="activeKey" type="card">
        <a-tab-pane key="1" tab="120天内订单"></a-tab-pane>
        <a-tab-pane key="2" tab="历史订单"></a-tab-pane>
      </a-tabs>
      <a-form :model="formState">
        <a-form-item label="店铺账号：">
          <selectComm
            style="margin-left: 10px"
            :options="account"
            :fieldObj="shopObj"
            @backSelectAll="selectAll"
            @backSelectItem="selectItem"
          ></selectComm>
        </a-form-item>
        <a-form-item>
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: flex-start;
            "
          >
            <div style="display: flex; margin-bottom: 24px">
              <span style="margin-right: 10px; white-space: nowrap"
                >订单状态：</span
              >
              <selectComm
                :options="orderType"
                :fieldObj="orderObj"
                @backSelectAll="orderSelectAll"
                @backSelectItem="orderSelectItem"
              ></selectComm>
            </div>
            <div style="display: flex">
              <span style="margin-right: 10px; white-space: nowrap"
                >国家区域：</span
              >
              <selectComm
                :options="orderType"
                :fieldObj="orderObj"
                @backSelectAll="orderSelectAll"
                @backSelectItem="orderSelectItem"
              ></selectComm>
            </div>
          </div>
        </a-form-item>
        <a-form-item label="排序方式：">
          <a-checkbox-group v-model:value="formState.type">
            <a-checkbox value="1" name="type">Online</a-checkbox>
            <a-checkbox value="2" name="type">Promotion</a-checkbox>
            <a-checkbox value="3" name="type">Offline</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card></a-card>
  </div>
</template>

<script setup name='orders'>
import selectComm from "~/components/select-unwrap/selectComm.vue";
import { ref, reactive, onMounted, computed, watchPostEffect } from "vue";
const activeKey = ref("1");
const formState = reactive({
  shopId: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});
const shopObj = ref({
  fieldKey: "account",
  fieldLabel: "simpleName",
});
const orderObj = ref({
  fieldKey: "status",
  fieldLabel: "name",
});
const account = ref([
  {
    simpleName: "Amazon10-US（Amazon）",
    account: 1,
  },
  {
    simpleName: "Amazon11-US（Amazon）",
    account: 2,
  },
  {
    simpleName: "Amazon12-US（Amazon）",
    account: 3,
  },
  {
    simpleName: "Amazon13-US（Amazon）",
    account: 4,
  },
  {
    simpleName: "Amazon14-US（Amazon）",
    account: 5,
  },
  {
    simpleName: "Amazon15-US（Amazon）",
    account: 6,
  },
  {
    simpleName: "Amazon16-US（Amazon）",
    account: 7,
  },
  {
    simpleName: "Amazon17-US（Amazon）",
    account: 8,
  },
  {
    simpleName: "Amazon18-US（Amazon）",
    account: 9,
  },
  {
    simpleName: "Amazon19-US（Amazon）",
    account: 10,
  },
  {
    simpleName: "Amazon20-US（Amazon）",
    account: 1,
  },
  {
    simpleName: "Amazon21-US（Amazon）",
    account: 1,
  },
  {
    simpleName: "Amazon22-US（Amazon）",
    account: 1,
  },
]);
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
const selectAll = () => {
  console.log("1");
};
const selectItem = (val) => {
  console.log("2", val);
  //   formState.shopId = account;
};
const orderSelectAll = () => {
  console.log("1");
};
const orderSelectItem = (val) => {
  console.log("2", val);
  //   formState.shopId = account;
};
</script>
<style lang="less" scoped>
</style>