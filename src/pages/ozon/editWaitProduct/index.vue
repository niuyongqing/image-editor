<template>
  <div id="editWaitProductCont" class="pr-14">
    <div class="w-19/20">
      <div class="flex justify-end mr-5 mt-5">
        <a-button class="ml-2.5">存为草稿</a-button>
        <a-button type="primary" class="ml-2.5">更新</a-button>
      </div>
      <br />
      <!-- 基本信息 -->
      <ozon-base-info ref="ozonBaseInfo" id="ozonBaseInfo" :categoryAttributesLoading="categoryAttributesLoading"
        :attributesCache="attributes" :productDetail="productDetail"></ozon-base-info>
      <br />
      <!-- 描述信息 -->


      <!-- 变种信息. -->
      <!-- <OzonVariantInfo :attributesCache="attributes" :productDetail="productDetail"></OzonVariantInfo> -->
      <div class="flex justify-end mr-5 mt-5">
        <a-button class="ml-2.5">存为草稿</a-button>
        <a-button type="primary" class="ml-2.5">更新</a-button>
      </div>
    </div>
    <div style="position: fixed;top: 16%;right: 4%;">
      <a-anchor class="absolute mr-50" :affix="false" :items=anchorList></a-anchor>
    </div>
  </div>
</template>

<script setup name='editWaitProduct'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { ozonProductDetail, categoryAttributes } from "../config/api/waitProduct"
import OzonBaseInfo from './comm/OzonBaseInfo.vue';

const attributes = ref([])
const productDetail = ref({})
const anchorList = [
    {
        key: '1',
        href: '#OzonBaseInfo',
        title: '基本信息',
    },
    {
        key: '2',
        href: '#OzonNewImageInfo',
        title: '图片信息',
    },
    {
        key: '3',
        href: '#ozonNewVariantInfo',
        title: 'sku',
    }
]
const categoryAttributesLoading = ref(false)
const getProductDetail = (waitId, account) => {
  ozonProductDetail({ account, waitId }).then(res => {
        productDetail.value = res?.data ?? {}
        getAttributes(res?.data.account, res?.data.typeId, res?.data.descriptionCategoryId)
    })
}

// 获取属性
const getAttributes = (account, typeId, descriptionCategoryId) => {
    categoryAttributesLoading.value = true;
    categoryAttributes({
        account,
        descriptionCategoryId,
        typeId,
    }).then((res) => {
        if (res.data) {
            attributes.value = res?.data ?? [];
        }
    })
        .finally(() => {
            categoryAttributesLoading.value = false;
        });
}

onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const rowId = urlParams.get('id');
    const rowAccount = urlParams.get('account');
    getProductDetail(rowId, rowAccount)
})
</script>
<style lang="less" scoped></style>