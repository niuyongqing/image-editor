<template>
    <div id="editProductPublishCont" class="pr-14">
        <div class="w-19/20">
            <div class="flex justify-end mt-5">
                <a-button class="ml-2.5" @click="onSubmit(2)">保存待发布</a-button>
                <a-button type="primary" class="ml-2.5" @click="onSubmit(1)">更新</a-button>
            </div>
            <br />
            <!-- 基本信息 -->
            <ozon-base-info ref="ozonBaseInfoRef" id="ozonBaseInfo"
                :categoryAttributesLoading="categoryAttributesLoading" :shopList="shopList"
                :attributesCache="attributes" :productDetail="productDetail"></ozon-base-info>
            <br />
            <!-- 描述信息 -->
            <OzonNewImageInfo ref="ozonImageInfoRef" :productDetail="productDetail" :shopCode="formData.shortCode">
            </OzonNewImageInfo>

            <!-- 变种信息. -->
            <OzonVariantInfo ref="ozonNewVariantInfoRef" :attributesCache="attributes" :productDetail="productDetail">
            </OzonVariantInfo>
            <div class="flex justify-end mr-5 mt-5">
                <a-button :loading="loading" @click="onSubmit(2)" class="ml-2.5">保存待发布</a-button>
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
        <a-modal :open="publishVis" title="消息提示" @cancel="handleCancel" :width="'20%'" :maskClosable="false"
            :keyboard="false">
            <span>产品已提交发布，请在发布中、发布失败或在线产品中查看！</span>
            <template #footer>
                <a-button @click="handleCancel">关闭</a-button>
                <a-button type="primary" @click="handleOk">继续刊登</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script setup name='editProductPublish'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { getDetail, categoryAttributes, add, accountCache } from "../config/api/product"
import OzonBaseInfo from './comm/OzonBaseInfo.vue';
import OzonVariantInfo from './comm/OzonVariantInfo.vue';
import OzonNewImageInfo from "./comm/OzonNewImageInfo.vue";
import { useOzonProductStore } from '~@/stores/ozon-product'
import {
    findFalseInArrayLikeObject, getInputValue, getSelectValue, getMultiSelectValue,
    isNotEmpty, createAndUpdateBaseObj
} from '~/pages/ozon/config/commJs/index';
import { saveTowaitProduct } from "../config/api/waitProduct"
import { message, Modal } from "ant-design-vue";
const ozonBaseInfoRef = ref(null)
const ozonImageInfoRef = ref(null)
const ozonNewVariantInfoRef = ref(null)
const attributes = ref([])
const shopList = ref([])
const productDetail = ref({})
const loading = ref(false)
const publishVis = ref(false)
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
const formData = reactive({
    shortCode: ""
})

const getProductDetail = (offerId, account) => {
    formData.shortCode = account
    getDetail({ account, offerId }).then(res => {
        productDetail.value = res?.data ?? {}
        getAttributes(res?.data?.account, res?.data?.typeId, res?.data?.descriptionCategoryId)
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

const isObjectProperty = (obj, prop) => {
    const value = obj[prop];
    return value instanceof Object && !(value instanceof Array);
}

const onSubmit = async (type = 1) => {
    const ozonBaseInfo = await ozonBaseInfoRef.value.childForm();
    console.log('ozonBaseInfoRef', ozonBaseInfo);
    const OzonNewImageInfo = await ozonImageInfoRef.value.submitForm();
    const ozonNewVariantInfo = await ozonNewVariantInfoRef.value.submitForm();
    const errorIndex = findFalseInArrayLikeObject({ ozonBaseInfo, OzonNewImageInfo, ozonNewVariantInfo })
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
    let hisAttr = {}
    const source = base.attributes;
    for (const key in source) {
        if (Object.hasOwnProperty.call(source, key)) {
            let value = source[key];

            // 解包 ref
            if (isRef(value)) {
                value = value.value;
            }
            // 获取 reactive 的原始对象
            else if (isReactive(value)) {
                value = toRaw(value);
            }

            // 过滤无效值
            if (value != null && value !== '') {
                hisAttr[key] = key === '品牌(Бренд)' ? '无品牌' : value;
            }
        }
    }
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
        item.warehouseList.forEach(warehouseItem => {
            // 将 warehouse 数组中的每个元素添加到数组 b 中
            warehouseItem.offerId = item.sellerSKU
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

    if (image.coverUrl !== "" && image.video.length > 0) {
    // 创建video对应的baseObj副本并更新value值
    let videoBaseObj = JSON.parse(JSON.stringify(baseObj));
    videoBaseObj = createAndUpdateBaseObj(image.coverUrl, 100002, 21845, type === 1 ? 1 : 2);
    newComplexAttributes.push(videoBaseObj);

    // 创建coverUrl对应的baseObj副本并更新value值
    let coverUrlBaseObj = JSON.parse(JSON.stringify(baseObj));
    coverUrlBaseObj = createAndUpdateBaseObj(
      image.video,
      100001,
      21841, type === 1 ? 1 : 2
    );
    newComplexAttributes.push(coverUrlBaseObj);
  } else if (image.coverUrl !== "") {
    let coverUrlBaseObj = JSON.parse(JSON.stringify(baseObj));
    coverUrlBaseObj = createAndUpdateBaseObj(
      image.coverUrl,
      100002,
      21845, type === 1 ? 1 : 2
    );
    newComplexAttributes.push(coverUrlBaseObj);
  } else if (image.video.length > 0) {
    let videoBaseObj = JSON.parse(JSON.stringify(baseObj));
    videoBaseObj = createAndUpdateBaseObj(image.video, 100001, 21841, type === 1 ? 1 : 2);
    newComplexAttributes.push(videoBaseObj);
  }
    console.log("newComplexAttributes", newComplexAttributes);

    const resItem = tableDatas.map((item) => {
        const moditAttributes = [];
        const getDictionaryIdKey = type === 1 ? 'dictionary_value_id' : 'dictionaryValueId';
        const getComplexIdKey = type === 1 ? 'complex_id' : 'complexId';
        const createValueObj = (newId, newVal) => ({
            [getDictionaryIdKey]: newId || 0,
            value: newVal instanceof Array ? newVal.split(",") : newVal || "",
        });
        const createAttrItem = (attr, values) => ({
            id: attr.id,
            [getComplexIdKey]: attr.attributeComplexId,
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
                    let inputValueObj = {}
                    if (isNotEmpty(newVal)) {
                        inputValueObj = createValueObj(0, newVal);
                        moditAttributes.push(createAttrItem(attr, [inputValueObj]));
                    } else if (item.hasOwnProperty(attr.name)) {
                        inputValueObj = createValueObj(0, item[attr.name]);
                        moditAttributes.push(createAttrItem(attr, [inputValueObj]));
                    }
                    break;
                case "select":
                    [newId, newVal] = getSelectValue(attr, base, item);
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
                        createValueObj,
                        2
                    );
                    const filteredMSlect = mSlect.filter(
                        (obj) => obj.value || obj?.dictionary_value_id !== 0 || obj?.dictionaryValueid !== 0
                    );
                    if (filteredMSlect.length) {
                        moditAttributes.push(createAttrItem(attr, filteredMSlect));
                    }
                    break;
            }
        }
        console.log("moditAttributes--", moditAttributes);

        if (type === 1) {
            return {
                attributes: moditAttributes,
                complex_attributes: newComplexAttributes ?? null, // 非必填 100002-21845-封面视频 100001-21841-视频
                // complex_attributes: [
                //     {
                //         attributes: [
                //             {
                //                 complex_id: 100001,
                //                 id: 21841,
                //                 values: [
                //                     {
                //                         value:
                //                             "https://www.xzerp.com/file/wish/upload/2025-03-10/2025/03/10/asset_0_h264_20250310114853A002.mp4",
                //                     },
                //                 ],
                //             },
                //         ],
                //     },
                //     {
                //         attributes: [
                //             {
                //                 complex_id: 100002,
                //                 id: 21845,
                //                 values: [
                //                     {
                //                         value:
                //                             "https://www.xzerp.com/file/wish/upload/2025-03-10/2025/03/10/asset_0_h264_20250310114853A002.mp4",
                //                     },
                //                 ],
                //             },
                //         ],
                //     },
                // ],
                color_image: item?.colorImg[0]?.url ?? "", // 非必填
                // color_image: "https://www.xzerp.com/file/wish/upload/2025-03-10/2025/03/10/2_20250310114827A001.jpg",
                images: item.imageUrl && item?.imageUrl?.map(e => e.url),
                // images: [
                //     "https://www.xzerp.com/file/wish/upload/2025-03-10/2025/03/10/7017600413_20250310114548A001.jpg",
                //     "https://www.xzerp.com/file/wish/upload/2025-03-10/2025/03/10/2_20250310114827A001.jpg"
                // ],
                offer_id: item.sellerSKU,
                old_price: item.oldPrice, // 非必填
                price: item.price,
                dimension_unit: "mm",
                weight_unit: "g",
                depth: item.packageLength,
                height: item.packageHeight,
                weight: item.packageWeight,
                width: item.packageWidth,
                vat: base.vat,
                name: base.name,
                description_category_id:
                    base.categoryId.secondCategoryId, // 二级id
                type_id: base.categoryId.threeCategoryId, // 三级分id
            };
        } else {
            return {
                attributes: moditAttributes,
                complex_attributes: newComplexAttributes ?? null, // 非必填 100002-21845-封面视频 100001-21841-视频
                colorimage: item?.colorImg[0]?.url.replace('/prod-api', '') ?? "", // 非必填
                images: item.imageUrl && item.imageUrl.map(item => item.url.replace('/prod-api', '')),
                warehouseList: item?.warehouseList,
                offerId: item.sellerSKU,
                oldPrice: item.oldPrice, // 非必填
                price: item.price,
                weightUnit: "g",
                dimensionUnit: "mm",
                weight: item.packageWeight,
                height: item.packageHeight,
                depth: item.packageLength,
                width: item.packageWidth,
            }
        }
    });

    if (type === 1) {
        let params = {
            account: base.shortCode,
            items: resItem,
            warehouseList: warehouse,
            historyCategoryId: base?.categoryId?.threeCategoryId, //平台分类ID
            // storeHistoryCategoryId: base?.categoryId?.storeHistoryCategoryId
            //     ? base?.categoryId?.storeHistoryCategoryId
            //     : "", //资料库分类ID
            historyAttributes: hisAttr,
            isUpdate: true
        };
        console.log('params', params);
        loading.value = true;
        add(params).then((res) => {
            message.success(res.msg);
            publishVis.value = true
        })
            .finally(() => {
                loading.value = false;
            });
    } else {
        loading.value = true;
        let waitParams = {
            account: base.shortCode,
            vat: base.vat,
            name: base.name,
            skuList: resItem,
            historyCategoryId: base?.categoryId?.threeCategoryId, //平台分类ID
            // storeHistoryCategoryId: base?.categoryId?.storeHistoryCategoryId
            //     ? base?.categoryId?.storeHistoryCategoryId
            //     : "", //资料库分类ID
            historyAttributes: hisAttr,
            descriptionCategoryId:
                base.categoryId.secondCategoryId, // 二级id
            typeId: base.categoryId.threeCategoryId, // 三级分id
        }
        saveTowaitProduct(waitParams).then(res => {
            message.success(res.msg);
            Modal.confirm({
                title: '是否关闭',
                content: '数据已保存到待发布，是否离开当前页面！',
                okText: '确定',
                onOk() {
                    window.close();
                }
            });
        }).finally(() => {
            loading.value = false;
        });
    }
}

const handleCancel = () => {
    publishVis.value = false
    window.close();
}
const handleOk = () => {
    publishVis.value = false
    location.reload();
}

onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const rowId = urlParams.get('id');
    const decodedId = decodeURIComponent(rowId); //解译
    const rowAccount = urlParams.get('account');
    getProductDetail(decodedId, rowAccount)
    getAccount()
})
</script>
<style lang="less" scoped></style>