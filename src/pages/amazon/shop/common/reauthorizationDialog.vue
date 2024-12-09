<template>
  <div>
    <a-modal :open="props.showModal" title="授权" @ok="handleOk">
      <template #footer>
        <a-button key="back" @click="handleCancel">关闭</a-button>
        <a-button
          key="submit"
          type="primary"
          @click="handleOk"
          >确定</a-button
        >
      </template>
      <a-select
        ref="select"
        v-model:value="shopVal"
        style="width: 200px"
        :options="selectOptions"
        :fieldNames="options"
        show-search
        :filter-option="filterOption"
      ></a-select>
    </a-modal>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { shopList } from "@/pages/amazon/js/api/shopManage";
// 使用defineProps接收props
const props = defineProps({
  showModal: Boolean,
});
// 使用defineEmits获取emit函数
const emit = defineEmits(["update:showModal","backShop"]);
const shopVal = ref("");
const selectOptions = ref([]);
const options = ref({
  label: 'shopName', 
  value: 'id'
})

const handleOk = () => {
  emit("backShop", shopVal.value);
  handleCancel();
};
const handleCancel = () => {
  emit("update:showModal", false);
  shopVal.value = ""
};
const filterOption = (input, option) => {
  return option.shopName.indexOf(input) >= 0;
};

const getShopList = () => {
  let params = {
    pageNum: 1,
    pageSize: 999,
    shopName: "",
    simpleName: "",
  };
  shopList(params).then((res) => {
    selectOptions.value = res.data.rows
  });
};
onMounted(() => {
  getShopList()
});
</script>