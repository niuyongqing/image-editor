<template>
    <div id="editProductPublishCont" class="pr-14">
        <div class="w-19/20">
            <div class="flex justify-end mr-5 mt-5">
                <a-button class="ml-2.5" @click="onSubmit(2)">存为草稿</a-button>
                <a-button type="primary" class="ml-2.5" @click="onSubmit(1)">更新</a-button>
            </div>
            <br />
            <!-- 基本信息 -->
            <ozon-base-info ref="ozonBaseInfoRef" id="ozonBaseInfo"
                :categoryAttributesLoading="categoryAttributesLoading" :attributesCache="attributes"
                :productDetail="productDetail"></ozon-base-info>
            <br />
            <!-- 描述信息 -->
            <OzonNewImageInfo ref="ozonImageInfoRef"></OzonNewImageInfo>

            <!-- 变种信息. -->
            <OzonVariantInfo ref="ozonNewVariantInfoRef" :attributesCache="attributes" :productDetail="productDetail">
            </OzonVariantInfo>
            <div class="flex justify-end mr-5 mt-5">
                <a-button :loading="loading" @click="onSubmit(2)" class="ml-2.5">存为草稿</a-button>
                <a-button type="primary" :loading="loading" @click="onSubmit(1)" class="ml-2.5">更新</a-button>
            </div>
        </div>
        <div style="position: fixed;top: 12%;right: 3%;">
            <a-timeline>
                <a-timeline-item v-for="item in anchorList" :key="item.id"
                    :color="item.turnRed ? 'red' : 'blue'"><a-button type="text" :danger="item.turnRed"
                        @click="scroll(item.id)">{{ item.label }}</a-button></a-timeline-item>
            </a-timeline>
        </div>
        <a-back-top :visibility-height="0" style="margin-right: 10px;" @click="backToTop" />
    </div>
</template>

<script setup name='editProductPublish'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { getDetail, categoryAttributes, add } from "../config/api/product"
import OzonBaseInfo from './comm/OzonBaseInfo.vue';
import OzonVariantInfo from './comm/OzonVariantInfo.vue';
import OzonNewImageInfo from "./comm/OzonNewImageInfo.vue";
import { useOzonProductStore } from '~@/stores/ozon-product'
import {
    findFalseInArrayLikeObject, getInputValue, getSelectValue, getMultiSelectValue,
    isNotEmpty, createAndUpdateBaseObj
} from '~/pages/ozon/config/commJs/index';
import { ozonProductEdit } from "../config/api/waitProduct"
import { message } from "ant-design-vue";
const ozonBaseInfoRef = ref(null)
const ozonImageInfoRef = ref(null)
const ozonNewVariantInfoRef = ref(null)
const attributes = ref([])
const productDetail = ref({})
const loading = ref(false)
const anchorList = ref([
    {
        turnRed: false,
        id: 'ozonBaseInfo',
        label: '基本信息',
    },
    {
        turnRed: false,
        id: 'ozonNewImageInfo',
        label: '图片信息',
    },
    {
        turnRed: false,
        id: 'ozonNewVariantInfo',
        label: 'sku信息',
    }
])
const categoryAttributesLoading = ref(false)


const getProductDetail = (id, account) => {
    getDetail({ account, id }).then(res => {
        productDetail.value = res?.data ?? {}
        getAttributes(res?.data.account, res?.data.typeId, res?.data.descriptionCategoryId)
    })
}
const backToTop = () => {
    let elements = document.getElementsByClassName('ant-layout-content');
    if (elements) {
        elements[0].scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
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
            const ozonStore = useOzonProductStore()
            ozonStore.$patch(state => {
                state.attributes = attributes.value
            })
        }
    })
        .finally(() => {
            categoryAttributesLoading.value = false;
        });
}

const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

const onSubmit = async (type = 1) => {
    const ozonBaseInfo = await ozonBaseInfoRef.value.childForm();
    console.log('ozonBaseInfoRef', ozonBaseInfo);
    // const imageInfoRes = await ozonImageInfoRef.submitForm();
    const ozonNewVariantInfo = await ozonNewVariantInfoRef.value.submitForm();
    const errorIndex = findFalseInArrayLikeObject({ ozonBaseInfo, ozonNewVariantInfo })
    console.log('errorIndex', errorIndex);

    anchorList.value.forEach(item => {
        item.turnRed = errorIndex.includes(item.id)
    })
    if (errorIndex.length > 0) {
        scrollTo(errorIndex[0])
        message.error("信息填写有误！");
        return
    }

    let base = ozonBaseInfoRef.value.form;
    let image = ozonImageInfoRef.value.form;
    let tableDatas = ozonNewVariantInfoRef.value.tableData;

    console.log('base', base);
    // console.log('image', image);
    console.log('tableDatas', tableDatas);

    //! 过滤一些属性
    const newList = attributes.value.filter(
        (a) =>
            !(
                a.id === 4080 ||
                a.id == 8789 ||
                a.id == 8790 ||
                a.id == 4180 ||
                a.id == 9024
            ) &&
            !(
                a.attributeComplexId == "100001" || a.attributeComplexId == "100002"
            )
    );
    let warehouse = []
    tableDatas.forEach((item) => {
        item.warehouse.forEach(warehouseItem => {
            // 将 warehouse 数组中的每个元素添加到数组 b 中
            warehouse.push(warehouseItem);
        });
    });
    let newComplexAttributes = [];
    //! 判断视频有没有上传
    const baseObj = {
        attributes: [
            {
                complex_id: null,
                id: null,
                values: [
                    {
                        value: "",
                    },
                ],
            },
        ],
    };
    if (image.coverUrl !== "" && JSON.stringify(image.video) != "{}") {
        // 创建video对应的baseObj副本并更新value值
        let videoBaseObj = JSON.parse(JSON.stringify(baseObj));
        videoBaseObj = createAndUpdateBaseObj(image.video, 100002, 21845);
        newComplexAttributes.push(videoBaseObj);

        // 创建coverUrl对应的baseObj副本并更新value值
        let coverUrlBaseObj = JSON.parse(JSON.stringify(baseObj));
        coverUrlBaseObj = createAndUpdateBaseObj(
            image.coverUrl,
            100001,
            21841
        );
        newComplexAttributes.push(coverUrlBaseObj);
    } else if (image.coverUrl !== "") {
        let coverUrlBaseObj = JSON.parse(JSON.stringify(baseObj));
        coverUrlBaseObj = createAndUpdateBaseObj(
            image.coverUrl,
            100001,
            21841
        );
        newComplexAttributes.push(coverUrlBaseObj);
    } else if (JSON.stringify(image.video) != "{}") {
        let videoBaseObj = JSON.parse(JSON.stringify(baseObj));
        videoBaseObj = createAndUpdateBaseObj(image.video, 100002, 21845);
        newComplexAttributes.push(videoBaseObj);
    }
    console.log("newComplexAttributes", newComplexAttributes);

    const resItem = tableDatas.map((item) => {
        const moditAttributes = [];
        const createValueObj = (newId, newVal) => ({
            dictionary_value_id: newId || 0,
            value: newVal instanceof Array ? newVal.split(",") : newVal || "",
        });
        const createAttrItem = (attr, values) => ({
            id: attr.id,
            complex_id: attr.attributeComplexId,
            values,
        });
        for (let attr of newList) {
            let newId = null;
            let newVal = "";
            let mSlect = [];
            // 根据属性类型进行处理
            switch (attr.selectType) {
                case "input":
                    newVal = getInputValue(attr, base, image, item);
                    if (isNotEmpty(newVal)) {
                        const inputValueObj = createValueObj(0, newVal);
                        moditAttributes.push(createAttrItem(attr, [inputValueObj]));
                    }
                    break;
                case "select":
                    [newId, newVal] = getSelectValue(attr, base);
                    if (isNotEmpty(newVal)) {
                        const selectValueObj = createValueObj(newId, newVal);
                        moditAttributes.push(createAttrItem(attr, [selectValueObj]));
                    }
                    break;
                case "multSelect":
                    mSlect = getMultiSelectValue(
                        attr,
                        item,
                        base,
                        createValueObj
                    );
                    const filteredMSlect = mSlect.filter(
                        (obj) => obj.value || obj.dictionary_value_id !== 0
                    );
                    if (filteredMSlect.length) {
                        moditAttributes.push(createAttrItem(attr, filteredMSlect));
                    }
                    break;
            }
        }
        console.log("moditAttributes--", moditAttributes);

        return {
            // attributes: moditAttributes,
            // description_category_id:
            //     base.categoryId.secondCategoryId, // 二级id
            // type_id: base.categoryId.threeCategoryId, // 三级分id
            // complex_attributes: newComplexAttributes
            // ? newComplexAttributes
            // : null, // 非必填 100002-21845-封面视频 100001-21841-视频

            attributes: [
                {
                    attributes: moditAttributes,
                    complex_attributes: newComplexAttributes ?? null, // 非必填 100002-21845-封面视频 100001-21841-视频
                }
            ],
            color_image: item?.colorImg[0]?.url, // 非必填
            depth: item.packageLength,
            dimension_unit: "mm",
            height: item.packageHeight,
            images: item.imageUrl && item.imageUrl.map(item => item.url),
            offer_id: item.sellerSKU,
            old_price: item.oldPrice, // 非必填
            price: item.price,
            weight: item.packageWeight,
            warehouseList: item?.warehouseList,
            weight_unit: "g",
            width: item.packageWidth,
        };
    });
    let params = {
        account: base.shortCode,
        vat: base.vat,
        name: base.name,
        skuList: resItem,
        historyCategoryId: base?.categoryId?.threeCategoryId, //平台分类ID
        storeHistoryCategoryId: base?.categoryId?.storeHistoryCategoryId
            ? base?.categoryId?.storeHistoryCategoryId
            : "", //资料库分类ID
        historyAttributes: base.attributes,
        description_category_id:
            base.categoryId.secondCategoryId, // 二级id
        type_id: base.categoryId.threeCategoryId, // 三级分id
    };

    if (type === 1) {
        params['isUpdate'] = true
        // add().then(res => {

        // })
    } else {
        // ozonProductEdit().then(res => {

        // })
    }
    console.log('params', params);
}



onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const rowId = urlParams.get('id');
    const rowAccount = urlParams.get('account');
    getProductDetail(rowId, rowAccount)
})
</script>
<style lang="less" scoped></style>