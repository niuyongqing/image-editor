<template>
  <a-card style="margin-top: 20px; height: 100vh">
    <div class="authorization">
      <a-button type="primary" @click="showModal = true">授权</a-button>
    </div>
    <div class="dept-table-container" ref="deptTableContainer">
      <a-table
        bordered
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="false"
        :default-expand-all-rows="true"
        :scroll="{ y: tableHeight, x: '100%', virtual: true }"
      >
      </a-table>
    </div>
    <reauthorizationDialog
      v-model:showModal.sync="showModal"
      @backShop="backShop"
    ></reauthorizationDialog>
  </a-card>
</template>

<script setup>
import tableHeard from "@/pages/amazon/js/tableHead/shop";
import reauthorizationDialog from "@/pages/amazon/shop/common/reauthorizationDialog.vue";
import { list } from "@/pages/amazon/js/api/shop";
import { getUrl, saveCode, refreshToken } from "@/pages/amazon/js/api/shop";
import { ref, reactive, onMounted, onUnmounted, watchPostEffect } from "vue";

const columns = tableHeard;
const tableData = ref([]);
const loading = ref(false);
const showModal = ref(false);
const tableHeight = ref(0);
const deptTableContainer = ref(null);

const getShopList = () => {
  loading.value = true;
  let params = {
    pageNum: 1,
    pageSize: 999,
    shopName: "",
    simpleName: "",
  };
  list(params)
    .then((res) => {
      tableData.value = res?.data?.rows;
    })
    .finally(() => {
      loading.value = false;
    });
};
const backShop = (id) => {
  console.log("id", id);
  if (!id) return;
  getUrl(id).then((res) => {
    window.location.href = res.msg;
  });
};
const setTableHeight = () => {
  if (deptTableContainer.value) {
    tableHeight.value =
      window.innerHeight -
      deptTableContainer.value.getBoundingClientRect().top -
      70; // 偏移量可根据需求调整
  }
};
onMounted(() => {
  setTableHeight();
  window.addEventListener('resize', setTableHeight);
  getShopList();
});
onUnmounted(() => {
  window.removeEventListener('resize', setTableHeight);
});
</script>


<style scoped lang="less">
.authorization {
  display: flex;
  margin-bottom: 20px;
}
</style>
