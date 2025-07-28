<template>
    <div id="editDraftProduct" class="pr-14">
        <div class="w-19/20">
            <div flex w-full justify-between items-center>
                <div>
                    <a-breadcrumb separator=">">
                        <a-breadcrumb-item>Ozon</a-breadcrumb-item>
                        <a-breadcrumb-item>产品模板</a-breadcrumb-item>
                        <a-breadcrumb-item>创建模板 </a-breadcrumb-item>
                    </a-breadcrumb>
                </div>
                <div>
                    <a-button type="primary" @click="onSubmit" :loading="loading" class="mb10px"
                        style="height: 32px; background-color: #FF8345; color: #fff;">保存</a-button>
                </div>
            </div>
            <!-- 基本信息 -->
            <ozon-base-info ref="ozonBaseInfoRef" id="ozonBaseInfo" :type="type"
                :categoryAttributesLoading="categoryAttributesLoading" :shopList="shopList"
                :attributesCache="attributes" @getAttributes="getAttributes" @emitAddDescription="addDescription"
                @sendShortCode="sendShortCode" :showDescription="showDescription"></ozon-base-info>
            <br />

            <!-- 描述信息 -->
            <OzonNewImageInfo ref="ozonImageInfoRef" :shopCode="formData.shortCode" v-if="showDescription"
                v-model:showDescription="showDescription">
            </OzonNewImageInfo>

            <!-- 变种信息. -->
            <OzonVariantInfo ref="ozonNewVariantInfoRef" :attributesCache="attributes" :shopCode="formData.shortCode"
                v-if="type === '3'">
            </OzonVariantInfo>

            <div flex justify-end>
                <a-button type="primary" @click="onSubmit" :loading="loading" class="mt10px"
                    style="height: 32px; background-color: #FF8345; color: #fff;">保存
                </a-button>
            </div>
        </div>
    </div>
</template>

<script setup name='addTemplate'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { categoryAttributes, add, accountCache } from "../config/api/product"
import OzonBaseInfo from './comm/OzonBaseInfo.vue';
import OzonNewImageInfo from "./comm/OzonNewImageInfo.vue";
import { useOzonProductStore } from '~@/stores/ozon-product'
import {
    findFalseInArrayLikeObject,
    isNotEmpty, createAndUpdateBaseObj,
} from '~/pages/ozon/config/commJs/index';
import {
    getInputValue, getSelectValue, getMultiSelectValue,
} from './commJs/index';

import { saveTowaitProduct } from "../config/api/waitProduct"
import { message, Modal } from "ant-design-vue";
import { UploadOutlined, DownOutlined } from '@ant-design/icons-vue';
import { translationApi } from '~/api/common/translation';
import { templateSaveOrUpdate, templateDetail } from "../config/api/userTemplate";
import { useRoute } from 'vue-router';
import OzonVariantInfo from './comm/OzonVariantInfo.vue';
import { cloneDeep } from 'lodash';

const route = useRoute();
const type = ref(null);
const showDescription = ref(false);
const ozonBaseInfoRef = ref(null)
const ozonImageInfoRef = ref(null)
const ozonNewVariantInfoRef = ref(null)
const showDescriptionBtn = ref(false);
const attributes = ref([])
const shopList = ref([]);
const templateDetailData = ref({});
const loading = ref(false)
const publishVis = ref(false)
const anchorList = ref([
    {
        turnRed: false,
        id: 'ozonBaseInfo',
        label: '基本信息',
    },
    // {
    //     turnRed: false,
    //     id: 'ozonNewImageInfo',
    //     label: '图片信息',
    // },
])
const categoryAttributesLoading = ref(false)
const channel = new BroadcastChannel('page-comm');
const formData = reactive({
    shortCode: ""
})

// 获取属性
const getAttributes = (account, cId) => {
    if (!account) {
        return;
    };
    categoryAttributesLoading.value = true;
    categoryAttributes({
        account,
        descriptionCategoryId: cId.secondCategoryId,
        typeId: cId.threeCategoryId,
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
};

const addDescription = () => {
    showDescription.value = true;
}
// 根据是否选择店铺后选择资料库
const sendShortCode = (shortCode) => {
    formData.shortCode = shortCode ? shortCode : null;
}


const onSubmit = async () => {
    //  产品模板
    let params;
    if (type.value === '1') {
        const ozonBaseInfo = await ozonBaseInfoRef.value.childForm();
        let base = ozonBaseInfoRef.value.form;
        console.log('base -》》》》》》', base);

        let image = ozonImageInfoRef.value?.form;
        params = {
            type: 1, //模板类型 1-产品模板  2-尺码模板 3-变种模板 4-富内容模板
            name: base.templateName, // 模板名称
            state: 1, // 状态是否生效  0-不生效 1-生效
            account: formData.shortCode,
            categoryId: base.categoryId || {},
            content: {
                productTemplate: {
                    productAttr: base.attributes || {},
                    productDesc: image?.description || ""
                },
                jsonRich: image?.jsons ?? {}
            }
        };
    } else if (type.value === '3') {
        const ozonBaseInfo = await ozonBaseInfoRef.value.childForm();
        // const OzonNewImageInfo = await ozonImageInfoRef.value.submitForm();
        const ozonNewVariantInfo = await ozonNewVariantInfoRef.value.submitForm();
        // const errorIndex = findFalseInArrayLikeObject({ ozonBaseInfo, OzonNewImageInfo })
        // anchorList.value.forEach(item => {
        //     item.turnRed = errorIndex.includes(item.id)
        // })
        // if (errorIndex.length) {
        //     scrollTo(errorIndex[0])
        //     message.error("信息填写有误！");
        //     return
        // }

        let base = ozonBaseInfoRef.value.form;
        let image = ozonImageInfoRef.value?.form;

        let data = ozonNewVariantInfoRef.value;
        const { attributeList: dataAttrs, tableData } = data;

        //! 过滤一些属性
        const newList = attributes.value.filter(
            (a) =>
                !(
                    a.id === 4080 ||
                    a.id == 8789 ||
                    a.id == 8790 ||
                    a.id == 4180 ||
                    a.id == 9024 ||
                    a.id == 100002 ||
                    a.id == 100001
                ) &&
                !(
                    a.attributeComplexId == "100001" || a.attributeComplexId == "100002"
                ) && a.isAspect
        );
        const addHeaderList = useOzonProductStore().addHeaderList;
        const resItem = tableData.map((item) => {
            const moditAttributes = [];
            const getDictionaryIdKey = 'dictionaryValueId';
            const getComplexIdKey = 'complexId';
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
                        newVal = getInputValue(attr, item);
                        if (attr.id === 10097) {
                            const inputValueObj = createValueObj(0, newVal);
                            moditAttributes.push(createAttrItem(attr, [inputValueObj]));
                        } else if (isNotEmpty(newVal)) {
                            const inputValueObj = createValueObj(0, newVal);
                            moditAttributes.push(createAttrItem(attr, [inputValueObj]));
                        }
                        break;
                    case "select":
                        [newId, newVal] = getSelectValue(attr, item);
                        if (isNotEmpty(newVal)) {
                            const selectValueObj = createValueObj(newId, newVal);
                            moditAttributes.push(createAttrItem(attr, [selectValueObj]));
                        }
                        break;
                    case "multSelect":
                        mSlect = getMultiSelectValue(
                            attr,
                            item,
                            createValueObj
                        );
                        const filteredMSlect = mSlect.filter(
                            (obj) =>
                                (obj.dictionaryValueId !== 0 || obj.value) &&  // 保留有有效ID或值的项
                                !(obj.dictionaryValueId === 0 && !obj.value)    // 过滤掉无效空值项
                        );
                        if (filteredMSlect.length) {
                            moditAttributes.push(createAttrItem(attr, filteredMSlect));
                        }
                        break;
                }
            }
            console.log("moditAttributes--", moditAttributes);

            return {
                attributes: moditAttributes,
            };
        });
        console.log("resItem", resItem);
        params = {
            type: 3, //模板类型 1-产品模板  2-尺码模板 3-变种模板 4-富内容模板
            name: base.templateName, // 模板名称
            state: 1, // 状态是否生效  0-不生效 1-生效
            account: formData.shortCode,
            categoryId: base.categoryId || {},
            content: {
                variantTemplate: {
                    variantAttr: resItem
                }
            }
        };
    }
    console.log("params", params);
    loading.value = true;
    templateSaveOrUpdate(params).then(res => {
        message.success(res.msg)
    }).finally(() => {
        loading.value = false;
        window.close();
    });
};
// 关闭页签时通知列表刷新
window.addEventListener('beforeunload', () => {
    if (window.opener && !window.opener.closed) {
        window.opener.postMessage('pageClosed', "*");
    }
});


const handleOk = () => {
    publishVis.value = false
    location.reload();
}

onMounted(() => {
    type.value = route.query.type;
    getAccount();
})
</script>