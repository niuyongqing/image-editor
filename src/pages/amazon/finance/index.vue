<template>
  <div id="financeCont">
    <a-card style="margin-top: 20px">
      <a-form
        ref="formRef"
        :model="formState"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="时间筛选：" name="times">
          <a-range-picker v-model:value="formState.times" />
        </a-form-item>
        <a-form-item label="店铺账号：" name="checkedList">
          <div class="setBox">
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
      <div>
        <div></div>
      </div>
    </a-card>
  </div>
</template>

<script setup name='finance'>
import dayjs from "dayjs";
import { ref, reactive, onMounted, computed, watch, watchEffect } from "vue";
import { queryShop, queryAreaName } from "@/pages/amazon/js/api/finance";

const labelCol = {
  style: {
    width: "80px",
  },
};
const wrapperCol = {
  span: 20,
};
const shopOptions = ref([]);
const countryOptions = ref([]);
const formState = reactive({
  times: [],
  indeterminate: true,
  checkAll: false,
  checkedList: [],
  countryCheckAll: false,
  countryIndeterminate: true,
  marketplaces: [],
});

// 监听formState.checkedList的变化
watch(
  () => formState.checkedList,
  (newCheckedList) => {
    if (newCheckedList && newCheckedList.length > 0) {
      getQueryAreaName(newCheckedList);
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
});

// 店铺选择
const onCheckAllChange = (e) => {
  Object.assign(formState, {
    checkedList: e.target.checked ? shopOptions.value.map((e) => e.value) : [],
    indeterminate: false,
  });
  getQueryAreaName(formState.checkedList);
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
    formState.checkedList = res.data.map((e) => e.areaEnName);
    shopOptions.value = res.data.map((item) => {
      return {
        label: item.shopName,
        value: item.areaEnName,
      };
    });
  });
};
// 店铺对应站点
const getQueryAreaName = (list) => {
  queryAreaName({ areaAames: list }).then((res) => {
    formState.marketplaces = res.data.map((e) => e.marketplaceId);
    countryOptions.value = res.data.map((item) => {
      return {
        label: item.countryZhName,
        value: item.marketplaceId,
      };
    });
  });
};
onMounted(() => {
  getShopList();
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
</style>