<template>
  <BaseModal @register="register" title="管理sku" width="800px" @submit="submit">
    <div>
      <a-card>
        <div style="display: flex;">
          <div>
            <a-popover placement="right" trigger="hover">
              <template #content>
                <img v-if="productSkuObJ.images !== undefined" :src="JSON.parse(productSkuObJ.images)[0]"
                  style="height: 400px; width: 400px;" alt="" />
              </template>
              <a-image v-if="productSkuObJ.images !== undefined"
                style="width: 56px; height: 56px; border: 1px solid #ccc;" :src="JSON.parse(productSkuObJ.images)[0]"
                :preview-src-list="JSON.parse(productSkuObJ.images)">
                <template #placeholder>
                  <div class="image-slot">加载中<span class="dot">...</span></div>
                </template>
                <template #error>
                  <div class="image-slot"><i class="anticon anticon-picture"></i></div>
                </template>
              </a-image>
            </a-popover>
          </div>
          <div style="margin-left: 10px;">
            <div style="font-size: 12px; color: #858b9c;">ID：{{ productSkuObJ.itemId }}</div>
            <div style="color: #000000ab;">{{ productSkuObJ.itemName }}</div>
          </div>
        </div>
      </a-card>

      <a-card>
        <a-table :columns="columns"
          :data-source="productSkuObJ.skus ? productSkuObJ.skus.slice((pagination.currentPage - 1) * pagination.pageSize, pagination.currentPage * pagination.pageSize) : []"
          row-key="itemId" :scroll="{ y: 800 }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'Include'">
              <a-switch v-model:checked="record.isSelect" />
            </template>
          </template>
        </a-table>
      </a-card>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { useTableSelection } from '@/components/baseTable/useTableSelection';

const columns = [
  {
    title: 'Sku Info',
    dataIndex: 'sellerSku',
    align: "center"
  }, {
    title: 'Retail Price',
    dataIndex: 'retailPrice',
    align: "center"
  },
  {
    title: 'Sale Price',
    dataIndex: 'salePrice',
    align: "center"
  }, {
    title: 'stock',
    dataIndex: 'stock',
    align: "center"
  }, {
    title: '当前库存',
    dataIndex: 'totalStock',
    align: "center"
  },
  {
    title: 'Include',
    dataIndex: 'Include',
    align: "center"
  },
];
const productSkuObJ = ref({});


const { state: pagination, reset } = useResetReactive({
  currentPage: 1,
  pageSize: 50,
  total: 0,
})
const loading = ref(false);
const modelMethods = ref();
const register = (modal) => {
  modelMethods.value = modal;
};

const open = (rows) => {
  productSkuObJ.value = rows;
  modelMethods.value.openModal();
};
const cancel = () => { }
const submit = () => {
  modelMethods.value.closeModal();
}
defineExpose({
  open,
})
</script>

<style lang="less" scoped></style>