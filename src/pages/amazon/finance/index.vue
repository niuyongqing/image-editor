<template>
  <div id="financeCont">
    <a-card style="margin: 10px 0">
      <a-form
        ref="formRef"
        :model="formState"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="时间筛选：" name="times">
          <div class="timesBox">
            <div style="display: flex">
              <div class="fBox">
                <a-button
                  @click="timeChange(item.prop)"
                  :type="item.prop === actives ? 'primary' : ''"
                  v-for="(item, index) in timeList"
                  :key="index"
                  >{{ item.label }}</a-button
                >
              </div>
              <a-form-item-rest>
                <a-range-picker
                  style="margin-left: 10px"
                  v-model:value="formState.times"
                  @change="onRangeChange"
                />
              </a-form-item-rest>
            </div>

            <div style="float: right">
              <a-form-item-rest>
                <a-select
                  ref="shopSelect"
                  style="width: 80px"
                  v-model:value="formState.currenc"
                  :options="currencyList"
                ></a-select>
              </a-form-item-rest>
            </div>
          </div>
        </a-form-item>
        <a-form-item label="店铺账号：" name="checkedList">
          <div class="setBox" v-if="shopOptions.length != 0">
            <a-form-item-rest>
              <a-checkbox
                v-model:checked="formState.checkAll"
                :indeterminate="formState.indeterminate"
                @change="onCheckAllChange"
              >
                全部
              </a-checkbox>
            </a-form-item-rest>
            <a-form-item-rest>
              <a-checkbox-group
                v-model:value="formState.checkedList"
                :options="shopOptions"
                @change="getList"
              />
            </a-form-item-rest>
          </div>
        </a-form-item>
        <a-form-item label="国家站点：" name="marketplaces">
          <div class="setBox" v-if="formState.checkedList.length != 0">
            <a-form-item-rest>
              <a-checkbox
                v-model:checked="formState.countryCheckAll"
                :indeterminate="formState.countryIndeterminate"
                @change="onCountryCheckAllChange"
              >
                全部
              </a-checkbox>
            </a-form-item-rest>
            <a-form-item-rest>
              <a-checkbox-group
                v-model:value="formState.marketplaces"
                :options="countryOptions"
                @change="getList"
              />
            </a-form-item-rest>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card>
      <div style="display: flex; justify-content: space-around">
        <div v-for="(item, index) in statisticsList" :key="index">
          <span style="color: #a0a3a6; font-size: 18px">{{ item.title }}</span>
          <div
            style="
              color: #434649;
              font-size: 18px;
              font-weight: 600;
              text-align: right;
            "
          >
            <span v-if="item.title === '销售额' || item.title === '退款金额'">{{
              formState.currenc == "1" ? "$" : "￥"
            }}</span
            ><span>{{ item.value }}</span>
          </div>
        </div>
      </div>
    </a-card>
    <div style="text-align: right; margin-top: 20px">
      <div>
        <a-select
          ref="shopSelect"
          style="width: 120px; margin-right: 10px"
          v-model:value="searchType"
          :options="searchList"
        ></a-select>
        <a-input-search
          v-model:value="skuCont"
          v-if="searchType == 1"
          placeholder="SKU"
          style="width: 200px"
          @search="getList"
        />
        <a-input-search
          v-model:value="descCont"
          v-if="searchType == 2"
          placeholder="产品标题"
          style="width: 200px"
          @search="getList"
        />
      </div>
    </div>
    <a-card style="height: 100vh; margin-top: 10px">
      <a-row>
        <a-col :span="1"
          ><a-button type="primary" :loading="btnLoading" @click="asyncList"
            >同步数据</a-button
          >
        </a-col>
        <a-col :span="1.5"
          ><a-button type="primary" :loading="btnLoading" @click="exportList"
            >导出财务数据</a-button
          >
        </a-col>
        <a-col :span="16"></a-col>
        <!-- <a-col :span="6">
          <a-pagination
            style="text-align: right"
            :show-total="(total) => `共 ${paginations.total} 条`"
            v-model:current="paginations.pageNum"
            v-model:pageSize="paginations.pageSize"
            :total="paginations.total"
            class="pages"
            :show-quick-jumper="true"
            :showSizeChanger="true"
            :pageSizeOptions="[50, 100, 200]"
          />
        </a-col> -->
      </a-row>
      <div style="margin-top: 10px">
        <a-table
          bordered
          :rowKey="(record) => record"
          :columns="columns"
          :data-source="tableData"
          :loading="loading"
          :pagination="false"
          :default-expand-all-rows="true"
        >
        </a-table>
        <a-pagination
          style="text-align: right; margin-top: 10px"
          :show-total="(total) => `共 ${paginations.total} 条`"
          v-model:current="paginations.pageNum"
          v-model:pageSize="paginations.pageSize"
          :total="paginations.total"
          class="pages"
          :show-quick-jumper="true"
          :showSizeChanger="true"
          :pageSizeOptions="[50, 100, 200]"
        />
        <!-- @change="changePagination" -->
      </div>
    </a-card>
  </div>
</template>

<script setup name='finance'>
import dayjs from "dayjs";
import {
  ref,
  reactive,
  onMounted,
  computed,
  watch,
  watchEffect,
  onUnmounted,
} from "vue";
import {
  queryShop,
  queryAreaName,
  getFinancesList,
  getFinancesExport,
  syncTransaction,
} from "@/pages/amazon/js/api/finance";
import tableHead from "@/pages/amazon/js/tableHead/finance";
import download from "@/api/common/download";
import { message } from "ant-design-vue";
const labelCol = {
  style: {
    width: "80px",
  },
};
const wrapperCol = {
  span: 24,
};
const skuCont = ref("");
const descCont = ref("");
const searchType = ref(1);
const searchList = ref([
  {
    label: "SKU",
    value: 1,
  },
  {
    label: "产品标题",
    value: 2,
  },
]);
const currencyList = ref([
  {
    label: "USD",
    value: "1",
  },
  {
    label: "RMB",
    value: "2",
  },
]);
const timeList = ref([
  {
    label: "上月",
    prop: "lastMonth",
  },
  {
    label: "上周",
    prop: "lastWeek",
  },
  {
    label: "本月",
    prop: "thisMonth",
  },
]);
const shopOptions = ref([]);
const countryOptions = ref([]);
const formState = reactive({
  times: [],
  sTime: "",
  endTime: "",
  indeterminate: true,
  checkAll: false,
  checkedList: [],
  countryCheckAll: false,
  countryIndeterminate: true,
  marketplaces: [],
  currenc: "1",
});
const tableData = ref([]);
const statisticsList = ref([
  {
    title: "SKU数量",
    value: "0",
  },
  {
    title: "销售数量	",
    value: "0",
  },
  {
    title: "销售额",
    value: "0",
  },
  {
    title: "退款数量",
    value: "0",
  },
  {
    title: "退款金额",
    value: "0",
  },
]);
const loading = ref(false);
const btnLoading = ref(false);
const columns = tableHead;
const actives = ref("thisMonth");
const paginations = ref({
  pageNum: 1,
  pageSize: 50,
  total: 0,
  pageSizeOptions: [50, 100, 200],
});

// 监听formState.checkedList的变化
watch(
  () => formState.checkedList,
  (newCheckedList) => {
    if (newCheckedList && newCheckedList.length > 0) {
      let result = Array.from(
        new Set(
          newCheckedList.map((item) => {
            return shopOptions.value
              .filter((obj) => obj.value === item)
              .map((found) => found.areaEnName)
              .pop();
          })
        )
      );
      getQueryAreaName(result);
    }
  }
);

watchEffect(() => {
  if (formState.checkedList) {
    formState.indeterminate =
      !!formState.checkedList.length &&
      formState.checkedList.length < shopOptions.value.length;
    formState.checkAll =
      formState.checkedList.length === shopOptions.value.length;
  }
  if (formState.marketplaces) {
    formState.countryIndeterminate =
      !!formState.marketplaces.length &&
      formState.marketplaces.length < countryOptions.value.length;
    formState.countryCheckAll =
      formState.marketplaces.length === countryOptions.value.length;
  }
  if (formState.checkedList?.length > 0 && formState.marketplaces?.length > 0) {
    getList();
  }
});
// 时间切换
const onRangeChange = (value, dateString) => {
  formState.sTime = dateString[0];
  formState.endTime = dateString[1];
};
// 时间筛选
const timeChange = (val) => {
  actives.value = val;
  switch (val) {
    case "lastMonth":
      // 获取上个月的开始时间（上个月的第一天 00:00:00）
      const startOfLastMonth = dayjs().subtract(1, "month").startOf("month");
      // 获取上个月的结束时间（上个月的最后一天 23:59:59）
      const endOfLastMonth = dayjs().subtract(1, "month").endOf("month");
      formState.times = [startOfLastMonth, endOfLastMonth];
      formState.sTime = startOfLastMonth.format("YYYY-MM-DD");
      formState.endTime = endOfLastMonth.format("YYYY-MM-DD");
      break;
    case "lastWeek":
      // 获取本周的开始时间（周一 00:00:00）
      const startOfThisWeek = dayjs().startOf("week");
      // 获取本周的开始时间往前推7天，就是上周的开始时间（上周周一 00:00:00）
      const startOfLastWeek = startOfThisWeek.subtract(7, "day");
      // 获取上周的结束时间（上周周日 23:59:59），先获取本周开始时间再减去1天
      const endOfLastWeek = startOfThisWeek.subtract(1, "day");

      formState.times = [startOfLastWeek, endOfLastWeek];
      formState.sTime = startOfLastWeek.format("YYYY-MM-DD");
      formState.endTime = endOfLastWeek.format("YYYY-MM-DD");
      break;
    case "thisMonth":
      const startOfMonth = dayjs().startOf("month");
      const endOfMonth = dayjs().endOf("month");

      formState.times = [startOfMonth, endOfMonth];
      formState.sTime = startOfMonth.format("YYYY-MM-DD");
      formState.endTime = endOfMonth.format("YYYY-MM-DD");
      break;
    default:
      break;
  }
};
// 店铺选择
const onCheckAllChange = (e) => {
  Object.assign(formState, {
    checkedList: e.target.checked ? shopOptions.value.map((e) => e.value) : [],
    indeterminate: false,
  });
  // getList();
};
// 获取列表数据
const getList = () => {
  loading.value = true;
  let params = {
    sku: skuCont.value,
    description: descCont.value,
    postedAfter: formState.endTime,
    postedBefore: formState.sTime,
    shopId: formState.checkedList,
    markedId: formState.marketplaces,
    pageNum: paginations.value.pageNum,
    pageSize: paginations.value.pageSize,
  };
  getFinancesList(params)
    .then((res) => {
      tableData.value = res?.rows ?? [];
      paginations.value.total = res?.total ?? 0;
    })
    .finally(() => {
      loading.value = false;
    });
};
// 国家站点选择
const onCountryCheckAllChange = (e) => {
  Object.assign(formState, {
    marketplaces: e.target.checked
      ? countryOptions.value.map((e) => e.value)
      : [],
    countryIndeterminate: false,
  });
};

// 店铺数据
const getShopList = () => {
  queryShop()
    .then((res) => {
      formState.checkedList = res?.data?.map((e) => e.id);
      shopOptions.value = res?.data?.map((item) => {
        return {
          label: item.shopName,
          value: item.id,
          areaEnName: item.areaEnName,
        };
      });
    })
};
// 店铺对应站点
const getQueryAreaName = (list) => {
  queryAreaName({ areaAames: list }).then((res) => {
    formState.marketplaces = res?.data?.map((e) => e.marketplaceId);
    countryOptions.value = res?.data?.map((item) => {
      return {
        label: item.countryZhName,
        value: item.marketplaceId,
        areaEnName: item.areaEnName,
      };
    });
  });
};

// 导出
const exportList = () => {
  btnLoading.value = true;
  let params = {
    postedAfter: formState.endTime,
    postedBefore: formState.sTime,
    shopId: formState.checkedList,
    markedId: formState.marketplaces,
  };
  getFinancesExport(params)
    .then((res) => {
      download.name(res.msg);
    })
    .finally(() => {
      btnLoading.value = false;
    });
};

// 同步
const asyncList = () => {
  if (formState.checkedList.length == 0) {
    message.error("请选择店铺后再同步数据！");
    return;
  }
  btnLoading.value = true;
  let params = {
    shopId: formState.checkedList,
    postedAfter: formState.endTime,
    postedBefore: formState.sTime,
    markedId: formState.checkAll ? null : formState.marketplaces,
  };
  syncTransaction(params)
    .then((res) => {
      tableData.value = res?.rows ?? [];
      paginations.value.total = res?.total ?? 0;
    })
    .finally(() => {
      btnLoading.value = false;
    });
};

onMounted(() => {
  getShopList();
  const startOfMonth = dayjs().startOf("month");
  const endOfMonth = dayjs().endOf("month");
  formState.times = [startOfMonth, endOfMonth];
  formState.sTime = startOfMonth.format("YYYY-MM-DD");
  formState.endTime = endOfMonth.format("YYYY-MM-DD");
});
</script>
<style lang="less" scoped>
:deep(.ant-form) {
  .ant-form-item
    .ant-row
    .ant-form-item-control
    .ant-form-item-control-input
    .ant-form-item-control-input-content {
    display: flex;
    .setBox {
      display: flex;
      flex-wrap: wrap;
    }
  }
}
:deep(.pages) {
  .ant-pagination-options .ant-select {
    width: 100px;
  }
}
:deep(.ant-form-item-control-input-content) {
  .timesBox {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .fBox {
      display: flex;
      .ant-btn {
        margin: 0 5px;
        cursor: pointer;
      }
    }
  }
}
</style>