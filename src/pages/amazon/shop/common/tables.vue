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
      >
      </a-table>
      <a-pagination
        style="margin-top: 10px;text-align: right"
        :show-total="total => `共 ${total} 条`"
        v-model:current="paginations.pageNum"
        v-model:pageSize="paginations.pageSize"
        :total="paginations.total"
        class="pages"
        :show-quick-jumper="true"
        :showSizeChanger="true"
        :pageSizeOptions="[50,100,200]"
        @change="getShopList"
      />
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
import { ref, reactive, onMounted, watchPostEffect } from "vue";

const columns = tableHeard;
const tableData = ref([]);
const loading = ref(false);
const showModal = ref(false);
const paginations = reactive({
  pageNum: 1,
  pageSize: 50,
  total:0
});
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
      paginations.total = res.data.total ? res.data.total : 0;
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

onMounted(() => {
  getShopList();
});
</script>


<style scoped lang="less">
.authorization {
  display: flex;
  margin-bottom: 20px;
}
</style>
