<template>
  <div id="financeCont" ref="financeContRef">
    <a-card style="margin: 10px 0">
      <!-- <a-float-button-group shape="circle">
        <a-back-top :visibility-height="0" @click="backToTop" />
      </a-float-button-group> -->
      <a-form
        ref="formRef"
        :model="formState"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="时间筛选：" name="times">
          <a-range-picker
            format="YYYY-MM-DD"
            v-model:value="formState.times"
            @change="onRangeChange"
          />
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
              />
            </a-form-item-rest>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card style="height: 100vh">
      <a-row>
        <a-col :span="1"
          ><a-button type="primary" :loading="btnLoading" @click="exportList"
            >导出财务数据</a-button
          >
        </a-col>
        <a-col :span="1"
          ><a-button type="primary" :loading="btnLoading" @click="asyncList"
            >同步数据</a-button
          >
        </a-col>
        <a-col :span="18"></a-col>
        <a-col :span="4">
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
        </a-col>
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
  span: 20,
};
const financeContRef = ref(null);
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
});
const tableData = ref([]);
const loading = ref(false);
const btnLoading = ref(false);
const columns = tableHead;
const paginations = ref({
  pageNum: 1,
  pageSize: 50,
  total: 0,
  pageSizeOptions: [50, 100, 200],
});
const tableHeight = ref(0);
const tableContainer = ref(null);

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
const onRangeChange = (value, dateString) => {
  formState.sTime = dateString[0];
  formState.endTime = dateString[1];
};
// 店铺选择
const onCheckAllChange = (e) => {
  Object.assign(formState, {
    checkedList: e.target.checked ? shopOptions.value.map((e) => e.value) : [],
    indeterminate: false,
  });
};

const getList = () => {
  loading.value = true;
  let params = {
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
  queryShop().then((res) => {
    formState.checkedList = res?.data?.map((e) => e.id);
    shopOptions.value = res?.data?.map((item) => {
      return {
        label: item.shopName,
        value: item.id,
        areaEnName: item.areaEnName,
      };
    });
  });
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

// const backToTop = () => {
//   let elements = document.getElementsByClassName('ant-layout-content');
//   // if (financeContRef.value) {
//   //   console.log(11);
    
//   //   financeContRef.value.scrollTop = 0;
//   // }
//   elements[0].scrollTop = 0
//   console.log('elements',elements);
  
// };

const setTableHeight = () => {
  if (tableContainer.value) {
    tableHeight.value =
      window.innerHeight -
      tableContainer.value.getBoundingClientRect().top -
      140; // 偏移量可根据需求调整
  }
};
onMounted(() => {
  getShopList();
  setTableHeight();
  window.addEventListener("resize", setTableHeight);
});
onUnmounted(() => {
  window.removeEventListener("resize", setTableHeight);
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
// :deep(.pages) {
//   .ant-pagination-options .ant-select {
//     width: 100px;
//   }
// }
</style>