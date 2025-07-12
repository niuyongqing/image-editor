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
                    <a-button type="primary" @click="onSubmit" :loading="loading"
                        style="height: 32px; background-color: #FF8345; color: #fff;">保存</a-button>
                </div>
            </div>
            <!-- 基本信息 -->
            <ozon-base-info ref="ozonBaseInfoRef" id="ozonBaseInfo" :productDetail="productDetail"
                :categoryAttributesLoading="categoryAttributesLoading" :shopList="shopList"
                :attributesCache="attributes" @getAttributes="getAttributes" @emitAddDescription="addDescription"
                @sendShortCode="sendShortCode" :showDescription="showDescription"></ozon-base-info>
            <br />

            <!-- 描述信息 -->
            <OzonNewImageInfo ref="ozonImageInfoRef" :shopCode="formData.shortCode" v-if="showDescription"
                :productDetail="productDetail" v-model:showDescription="showDescription">
            </OzonNewImageInfo>
            <div flex justify-end>
                <a-button type="primary" @click="onSubmit" :loading="loading"
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
    findFalseInArrayLikeObject, getInputValue, getSelectValue, getMultiSelectValue,
    isNotEmpty, createAndUpdateBaseObj
} from '~/pages/ozon/config/commJs/index';
import { saveTowaitProduct } from "../config/api/waitProduct"
import { message, Modal } from "ant-design-vue";
import { UploadOutlined, DownOutlined } from '@ant-design/icons-vue';
import { translationApi } from '~/api/common/translation';
import { templateSaveOrUpdate, templateDetail } from "../config/api/userTemplate";
import { useRoute } from 'vue-router';

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
const productDetail = ref({});
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
    const ozonBaseInfo = await ozonBaseInfoRef.value.childForm();

    // const OzonNewImageInfo = await ozonImageInfoRef.value.submitForm();
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
    let newComplexAttributes = [];
    //! 判断视频有没有上传
    const baseObj = {
        attributes: [
            {
                complexId: null,
                id: null,
                values: [
                    {
                        value: "",
                    },
                ],
            },
        ],
    };

    if (image) {
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
    }


    const addHeaderList = useOzonProductStore().addHeaderList
    let params = {
        type: 1, //模板类型 1-产品模板  2-尺码模板 3-变种模板 4-富内容模板
        id: null, // id 为null  新增  不为null 是修改
        name: base.templateName, // 模板名称
        state: 1, // 状态是否生效  0-不生效 1-生效
        account: formData.shortCode,
        content: {
            productTemplate: {
                categoryId: base.categoryId || {},
                productAttr: base.attributes || {},
                productDesc: image?.description || ""
            },
            jsonRich: image?.jsons ?? {}
        }
    }
    loading.value = true;
    templateSaveOrUpdate(params).then(res => {
        message.success(res.msg)
        setTimeout(() => {
            window.close();
        }, 2000);
    })
        .finally(() => {
            loading.value = false;
        });
};

const handleOk = () => {
    publishVis.value = false
    location.reload();
}


//  获取模板详情
const getTemplateDetail = () => {
    templateDetail({
        id: route.query.id
    }).then(res => {
        if (res.code === 200) {
            productDetail.value = res?.data ?? {};
        }
    })
}

onMounted(() => {
    type.value = route.query.type;
    getAccount()
    if (route.query.id) {
        getTemplateDetail()
    }
})
</script>