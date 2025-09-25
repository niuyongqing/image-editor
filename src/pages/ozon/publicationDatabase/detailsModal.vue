<template>
  <div id="publicationDatabase_detailsModal" class="publicationDatabase_detailsModal">
    <a-modal 
      v-model:open="modalOpen" 
      :style="{ top: '10px', padding: 0, height: '99vh' }"
      :bodyStyle="{ height: 'calc(95vh - 100px)', 'overflow-y': 'auto' }" 
      :title="'产品详情'" 
      :maskClosable="false"
      width="95%"
    >
      <a-spin :spinning="loading" class="dialog-box">
        <a-descriptions title="基本信息">
          <a-descriptions-item label="产品名称">
            <div v-html="detailData.row.productName"></div>
          </a-descriptions-item>
          <a-descriptions-item label="产品分类">
            <a-tag color="success" v-if="detailData.row.classify">{{ detailData.row.classify }}</a-tag>
          </a-descriptions-item>
        </a-descriptions>
      </a-spin>
      <template #footer>
        <!-- <a-button key="back" type="primary" @click="handleSelect">选中</a-button> -->
        <a-button key="back" @click="closeModalFn">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import _ from 'lodash';
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
defineOptions({ name: "publicationDatabase_detailsModal" })
const { proxy: _this } = getCurrentInstance()
const modalOpen = ref(false);
const loading = ref(false);
const detailData = reactive({
  row: null,
  commodityTypeList: [],
  data: {},
})

async function modalOpenFn({ row, commodityTypeList }) {
  detailData.row = row
  detailData.commodityTypeList = commodityTypeList
  modalOpen.value = !modalOpen.value;
  loading.value = true
  try {
    
  } catch (error) {
    console.error(error);
  }
  loading.value = false
  // console.log({ id, forbidSaleList, cacheGetArr, res });
}
function closeModalFn() {
  modalOpen.value = false;
}

defineExpose({
  modalOpenFn
})
</script>
<style lang="less" scoped>
:deep(.ant-image-img) {
  width: 198px;
  height: 198px;
}
:deep(.ant-tag) {
  margin-bottom: 6px;
}
:deep(.ant-spin-nested-loading) {
  width: 100%;
}
:deep(.ant-descriptions) {
  width: 100%;
  &.devConsultLink {
    .ant-descriptions-item-content {
      flex-direction: column;
      a {
        width: 100%;
      }
    }
  }
  &.meansChineseDescription {
    .ant-descriptions-item-label {
      white-space: nowrap;
    }
    .ant-descriptions-item-content {
      max-width: calc(100% - 100px);
      .pre {
        word-wrap:break-word; 
        word-break:break-all;
      }
    }
  }
}
</style>