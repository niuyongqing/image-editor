D<template>
    <div id="productPublishCont" class="pr-10">
        <div class="w-19/20">
            <a-button type="primary" @click="selectProduct" style="float: right; right: 20px;top: 10px;"
                :disabled="!formData.shortCode">选择资料库产品</a-button>
            <br />
            <br />
            <div class="flex justify-end mr-5">
                <a-button>保存</a-button>
                <a-button type="primary" class="ml-2.5" @click="onSubmit">发布</a-button>
            </div>
            <br />
            <!-- 基本信息 -->
            <ozon-base-info ref="ozonBaseInfo" id="ozonBaseInfo" :product="product" :shopList="shopList" :attributesCache="attributes"
                @getAttributes="getAttributes" @sendShortCode="sendShortCode"
                :categoryAttributesLoading="categoryAttributesLoading"></ozon-base-info>
            <br />
            <!-- 图片信息 -->
            <!-- <ozon-new-image-info
            ref="ozonImageInfo"
            :product="product"
            :shortCode="formData.shortCode"
            :attributes="attributes"
            ></ozon-new-image-info>
            <br /> -->
            <!-- sku -->
            <ozon-new-variant-info ref="ozonNewVariantInfo" id="ozonNewVariantInfo" :product="product" :storeOption="storeOption"
                :watermark="watermark" :attributes="attributes"></ozon-new-variant-info>
            <br />
        </div>
        <div style="position: fixed;top: 16%;right: 4%;">
            <a-anchor class="absolute mr-50" :affix="false" :items=anchorList></a-anchor>
        </div>
    </div>
</template>

<script setup name='productPublish'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import OzonBaseInfo from './comm/OzonBaseInfo.vue';
// import OzonNewImageInfo from './comm/OzonNewImageInfo.vue';
import OzonNewVariantInfo from './comm/OzonNewVariantInfo.vue';
import { accountCache, categoryAttributes } from "../config/api/product";
import { warehouseList } from "../config/api/storeManagement"

const formData = reactive({
    shortCode: ""
})
const ozonBaseInfo = ref(null)
const product = ref({})
const shopList = ref([])
const attributes = ref([])
const storeOption = ref([])
const watermark = ref([])
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
// 资料库点击
const selectProduct = () => { }

// 根据是否选择店铺后选择资料库
const sendShortCode = (shortCode) => {
    formData.shortCode = shortCode ? shortCode : null;
    getEditStore(shortCode)
}

// 获取店铺列表
const getAccount = () => {
    accountCache().then((res) => {
        if (res.data) {
            shopList.value = res?.data.map(item => {
                return {
                    label: item.simpleName,
                    value: item.account
                }
            }) ?? [];

        }
    });
}

// 获取属性
const getAttributes = (shortCode, primaryCategoryId) => {
    if (shortCode === "" || shortCode == null) {
        return;
    }
    categoryAttributesLoading.value = true;
    categoryAttributes({
        account: shortCode,
        descriptionCategoryId: primaryCategoryId.secondCategoryId,
        typeId: primaryCategoryId.threeCategoryId,
    }).then((res) => {
        if (res.data) {
            attributes.value = res?.data || [];
        }
    })
        .finally(() => {
            categoryAttributesLoading.value = false;
        });
}
// 获取水印列表
const getWatermark = () => {
    watermarkList().then((res) => {
        watermark.value = res.data;
    });
}

const getEditStore = (account) => {
    let params = {
        name: "",
        status: "created",
        account,
        startCreateDate: "",
        endCreateDate: "",
    };
    warehouseList(params).then((res) => {
        storeOption.value =
            res?.rows?.map((item) => {
                return {
                    value: item.warehouseId,
                    label: item.name,
                };
            }) || [];
    });
}

// 发布
const onSubmit = () => {
    console.log('ozonBaseInfoRef', ozonBaseInfo.value);
    const baseInfoRes = ozonBaseInfo.value.childForm();
    if (!baseInfoRes) {
        message.error("基本信息填写有误！");
        return;
    }
}

onMounted(() => {
    getAccount()
})
</script>
<style lang="less" scoped></style>