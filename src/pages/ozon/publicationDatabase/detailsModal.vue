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
        <a-descriptions title="">
          <a-descriptions-item label="前缀修饰词">
            <div>{{ detailData.data.prefixDecorateName }}</div>
          </a-descriptions-item>
          <a-descriptions-item label="产品名称">
            <div>{{ detailData.data.productName }}</div>
          </a-descriptions-item>
          <a-descriptions-item label="后缀修饰词">
            <div>{{ detailData.data.suffixDecorateName }}</div>
          </a-descriptions-item>
          <a-descriptions-item label="产品分类">
            <a-tag color="success" v-if="detailData.row.classify">{{ detailData.row.classify }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="品牌">
            <div>{{ detailData.data.productAttributeList?.find(i => i.attributeId === 85)?.attributeValue || '无品牌' }}</div>
          </a-descriptions-item>
          <a-descriptions-item label="VAT">
            <div>{{ detailData.data.vat }}</div>
          </a-descriptions-item>
          <a-descriptions-item label="制造国">
            <div>{{ detailData.data.productAttributeList?.find(i => i.attributeId === 4389)?.attributeValue || '无' }}</div>
          </a-descriptions-item>
        </a-descriptions>
        
        <a-descriptions title="">
          <a-descriptions-item label="竞品参考链接">
            <div class="url-item" v-for="(item, index) in detailData.data.purchaseLinkUrls.split(',')" :key="item">
              {{ `${index + 1}、 ` }}<a target="_blank" :href="item">{{ item }}</a>
            </div>
          </a-descriptions-item>
        </a-descriptions>
        <a-descriptions title="">
          <a-descriptions-item label="采购链接">
            <div class="url-item" v-for="(item, index) in detailData.data.purchaseLinkUrls.split(',')" :key="item">
              {{ `${index + 1}、 ` }}<a target="_blank" :href="item">{{ item }}</a>
            </div>
          </a-descriptions-item>
        </a-descriptions>
        
        <a-descriptions title="">
          <a-descriptions-item label="产品属性">
            <div class="attribute-box">
              <div class="attribute-item" v-for="(item, index) in detailData.categoryAttributeList" :key="item.attributeId">
                <a-tooltip>
                  <template #title>{{ item.attributeName }}</template>
                  <div class="attribute-item-label">
                    {{ item.attributeName }}
                  </div>
                </a-tooltip>：
                <div class="attribute-item-value">
                  {{ detailData.data.productAttributeList.find(i => i.attributeId === item.attributeId)?.attributeValue || '无' }}
                </div>
              </div>
            </div>
          </a-descriptions-item>
        </a-descriptions>
        
        <a-descriptions title="">
          <a-descriptions-item label="产品描述">
            <div>{{ detailData.data.productAttributeList.find(i => i.attributeId === 4191)?.attributeValue || '无' }}</div>
          </a-descriptions-item>
          <a-descriptions-item label="JSON富文本">
            <div>{{ detailData.data.editor_json_11254 || '无'}}</div>
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
import { getDetail } from './js/api';
defineOptions({ name: "publicationDatabase_detailsModal" })
const { proxy: _this } = getCurrentInstance()
const modalOpen = ref(false);
const loading = ref(false);
const detailData = reactive({
  row: null,
  commodityTypeList: [],
  data: {},
  categoryAttributeList: [],// 商品属性
  variantAttr: []// 变种属性
})
async function modalOpenFn({ row, commodityTypeList }) {
  detailData.row = row
  detailData.commodityTypeList = commodityTypeList
  modalOpen.value = !modalOpen.value;
  loading.value = true
  try {
    await getDetailFn()
  } catch (error) {
    console.error(error);
  }
  loading.value = false
  // console.log({ id, forbidSaleList, cacheGetArr, res });
}
async function getDetailFn() {
  let res = null;
  try {
    res = await getDetail(detailData.row.id);
    detailData.categoryAttributeList = res.data.categoryAttributeList.filter(i => !i.isAspect).filter(i => {
      return !([11254,4191,85,31,4389,4080,8789,8790,4180,9024].includes(i.attributeId) || [100001,100002].includes(i.attributeComplexId))
    })
    detailData.variantAttr = res.data.categoryAttributeList.filter(i => i.isAspect)
    res.data.editor_json_11254 = res.data.productAttributeList.find(i => i.attributeId === 11254)?.attributeValue
    detailData.data = res.data;
  } catch (error) {
    console.error(error);
  }
  return res;
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

  .attribute-box {
    max-height: 500px;
    width: 100%;
    margin: 30px 60px;
    // padding: 20px;
    overflow-y: auto;
    .attribute-item {
      display: flex;
      margin-bottom: 10px;
      .attribute-item-label {
        width: 300px;
        text-align: right;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 6px;
      }
      .attribute-item-value {
        margin-left: 10px;
      }
    }
  }
}
</style>