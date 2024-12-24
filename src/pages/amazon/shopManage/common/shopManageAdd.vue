<template>
  <div id="shopManageAddCont">
    <a-modal
      :open="props.showAddModal"
      title="新增"
      @cancel="handleCancel"
      @ok="onSubmit"
      :width="600"
      :maskClosable="false"
      :keyboard="false"
    >
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="labelCol" :wrapper-col="wrapperCol"
      >
        <a-form-item ref="name" label="区域：" required name="areaEnName">
          <a-select
            ref="shopSelect"
            v-model:value="formState.areaEnName"
            placeholder="请选择店铺"
            :options="areaList"
            :fieldNames="areaLabels"
            allowClear
            @change="changeArea"
          ></a-select>
        </a-form-item>
        <a-form-item label="站点：" required name="marketplaces">
          <a-checkbox-group
            v-model:value="formState.marketplaces"
            name="checkboxgroup"
            :options="marketList"
          />
        </a-form-item>
        <a-form-item label="店铺名称：" required name="shopName">
          <a-input
            v-model:value="formState.shopName"
            placeholder="请输入内容"
          ></a-input>
        </a-form-item>
        <a-form-item label="简称：" required name="simpleName">
          <a-input
            v-model:value="formState.simpleName"
            placeholder="请输入内容"
          ></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup name='shopManageAdd'>
import { ref, reactive, onMounted, watch } from "vue";
import { getAreaList, getMarketList } from "@/pages/amazon/js/api/shop";
import { addShop } from "@/pages/amazon/js/api/shopManage";
import { message } from "ant-design-vue";
const props = defineProps({
  showAddModal: Boolean,
  getList: Function,
});
// 使用defineEmits获取emit函数
const emit = defineEmits(["update:showAddModal"]);
watch(
  () => props.showAddModal,
  (val) => {
    if (val) {
      getAreaListFn();
    }
  }
);

const formRef = ref();
const formState = reactive({
  shopName: "",
  areaEnName: "",
  simpleName: "",
  marketplaces: [],
});
const rules = {
  areaEnName: [{ required: true, message: "请选择区域", trigger: "change" }],
  marketplaces: [
    { required: true, message: "请选择站点", trigger: ["change", "blur"] },
  ],
  shopName: [{ required: true, message: "请输入店铺名称", trigger: "blur" }],
  simpleName: [{ required: true, message: "请输入简称", trigger: "blur" }],
};
const labelCol = {
  style: {
    width: '80px',
  },
};
const wrapperCol = {
  span: 20,
};

const areaList = ref([]);
const areaLabels = ref({
  label: "areaName",
  value: "areaEnName",
});
const marketList = ref([]);
const okType = ref(false);

// 获取区域数据
const getAreaListFn = () => {
  getAreaList().then((res) => {
    areaList.value = res.data;
    formState.areaEnName = res.data[0].areaEnName;
    getMarketListFn(res.data[0].areaEnName);
  });
};
// 切换区域
const changeArea = (val) => {
  console.log("val;", val);

  marketList.value = [];
  formState.marketplaces = [];
  getMarketListFn(val);
};
// 获取站点
const getMarketListFn = (val) => {
  let params = {
    areaEnName: val,
  };
  getMarketList(params).then((res) => {
    marketList.value = res.data.map((item) => {
      return {
        label: item.countryZhName,
        value: item.id,
      };
    });
  });
};

const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      okType.value = true;
      let params = {
        shopName: formState.shopName,
        areaEnName: formState.areaEnName,
        simpleName: formState.simpleName,
        marketplaces: formState.marketplaces.join(),
      };
      console.log("params", params);
      addShop(params)
        .then((res) => {
          if (res.code == 200) {
            message.success(res.msg);
            // this.$emit("update:dialogVisible", false);
          }
        })
        .finally(() => {
          handleCancel();
          props.getList();
          okType.value = false;
        });
    })
    .catch((error) => {
      console.log("error", error);
    });
}

const handleCancel = () => {
  emit("update:showAddModal", false);
  formRef.value.resetFields();
}
onMounted(() => {
  getAreaListFn();
});
</script>
<style lang="less" scoped>
</style>