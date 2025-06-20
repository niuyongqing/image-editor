<template>
    <div>
        <a-modal v-model:open="dialogVisible" title="提示" width="1000px" @cancel="cancel" :footer="null"
            :maskClosable="false">
            <div flex justify-between mb-15px>
                <div>
                    <a-breadcrumb separator=">">
                        <a-breadcrumb-item>Ozon</a-breadcrumb-item>
                        <a-breadcrumb-item>采集箱</a-breadcrumb-item>
                        <a-breadcrumb-item> 编辑 </a-breadcrumb-item>
                    </a-breadcrumb>
                </div>
                <div>
                    <a-space>
                        <a-button type="primary" @click="editCategory"
                            style="height: 32px;  background-color: #E97234;">保存，下一步</a-button>
                        <a-button @click="skip" style="height: 32px; background-color: #F5F5F5;">关闭</a-button>
                    </a-space>
                </div>
            </div>
            <a-table :columns="columns" :data-source="tableData" bordered :pagination="false">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'primaryImage'">
                        <div class="flex">
                            <div w-80px>
                                <a-image :src="record.primaryImage" class="imgCss" />
                            </div>
                            <div class="flex-1 ml-5px">
                                <div class="font-bold">{{ record.name }}</div>
                                <div class="text-gray-500"> 「{{ accountName(record.account) }}」 </div>
                                <div class="text-gray-500">来源: {{ platformName(record.gatherPlatformName) }}
                                </div>
                            </div>

                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'category'">
                        >>
                    </template>
                    <template v-if="column.dataIndex === 'ozonCategory'">
                        <a-select v-model:value="form.categoryId" allowClear showSearch placeholder="请选择"
                            style="width: 300px;" :options="historyCategoryList" @change="selectAttributes" :fieldNames="{
                                label: 'threeCategoryName', value: 'threeCategoryId',
                            }">
                        </a-select>
                        <a-button type="link" @click="changeCategory">更换分类</a-button>
                        <p class="tooltip-text" v-if="hisAttrObj && JSON.stringify(hisAttrObj) != '{}'">{{
                            hisAttrObj.categoryName
                        }} > {{ hisAttrObj.secondCategoryName }} > {{
                                hisAttrObj.threeCategoryName }} </p>
                        <!-- 表格 -->
                        <a-table :columns="innerColumns" :data-source="innerTableData" bordered :pagination="false"
                            style="margin-top: 10px;">
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.dataIndex === 'catTheme'">
                                    {{ record.catTheme }}
                                </template>
                                <template v-if="column.dataIndex === 'ozonTheme'">
                                    <a-select v-model:value="record.ozonTheme" allowClear placeholder="请选择"
                                        style="width: 180px;" :options="attrOptions(record.filterAttrOptions)">
                                    </a-select>
                                </template>
                            </template>
                        </a-table>

                    </template>
                </template>
            </a-table>
        </a-modal>
        <CategoryModal ref="categoryModalRef" :account="acceptParams.account" @select="handleSelect">
        </CategoryModal>
    </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import CategoryDialog from "@/pages/ozon/productPublish/comm/categoryDialog.vue";
import {
    categoryTree,
    historyCategory,
    addHistoryCategory,
    categoryAttributes,
} from "@/pages/ozon/config/api/product.js";
import { ozonCollectDetail, ozonRelationSave } from "@/pages/ozon/config/api/draft.js";
import CategoryModal from "@/pages/ozon/draft/comm/categoryModal.vue";
import { accountCache } from "@/pages/ozon/config/api/product.js";

const shopAccount = ref([]); // 店铺列表
const acceptParams = ref({});// 表格行ID
const platNames = {
    Ozon: 'Ozon',
    Tmall: '天猫',
    AliExpress: '速卖通',
};
const baseApi = import.meta.env.VITE_APP_BASE_API;
const relationDetail = ref({});
const columns = [
    {
        title: '产品信息',
        dataIndex: 'primaryImage',
        key: 'primaryImage',
        width: 300

    },
    {
        title: '分类对应',
        dataIndex: 'category',
        key: 'category',
        width: 100
    },
    {
        title: 'OZON分类',
        dataIndex: 'ozonCategory',
        key: 'ozonCategory',
        width: 400
    },
];
const isClear = ref(false); // 是否清空对应的变种主题
const innerColumns = computed(() => {
    const title = platNames[acceptParams.value.gatherPlatformName] || '';
    return [
        {
            title: `${title}变种主题`,
            dataIndex: 'catTheme',
            key: 'catTheme',
            width: 150
        },
        {
            title: '对应Ozon变种主题',
            dataIndex: 'ozonTheme',
            key: 'ozonTheme',
            width: 150
        }]
});

const categoryModalEl = useTemplateRef('categoryModalRef');
const historyCategoryList = ref([]);
const hisAttrObj = ref({}) //选中的三级
const secondCategoryId = ref(undefined);
const attributes = ref([]);
const filterAttrOptions = ref([]); // 过滤后的属性
const tableData = ref([
    {
        primaryImage: '',
        category: '',
        ozonCategory: '',
        gatherPlatformName: '',
        account: ''
    }
]);
const innerTableData = ref([]);

const dialogVisible = ref(false);
const form = reactive({
    name: "",
    shortCode: "",
    categoryId: null,
})

const primaryImage = (primaryImage) => {
    return baseApi + primaryImage
};

function getFilterAttrs() {
    const filterAttr = attributes.value.filter((attrItem) => {
        return attrItem.isAspect
    });

    filterAttrOptions.value = filterAttr.map((attrItem) => {
        return {
            label: attrItem.name.replace(/\(.*\)/, ""), // 去掉（）里面的
            value: attrItem.id,
            attrLabel: attrItem.name,
        }
    });
    innerTableData.value = [];
    if (relationDetail.value.variantAttr && Object.keys(relationDetail.value.variantAttr).length > 0) {
        Object.keys(relationDetail.value.variantAttr).forEach((key) => {
            const platformVariantName = relationDetail.value.variantInfoList.find((item) => {
                return item.originalVariantName === key
            })?.platformVariantName

            if (isClear.value) {
                innerTableData.value.push({
                    catTheme: key,
                    attrLabel: undefined,
                    ozonTheme: undefined,
                    filterAttrOptions: filterAttrOptions.value,
                })
            } else {
                innerTableData.value.push({
                    catTheme: key,
                    attrLabel: platformVariantName ? platformVariantName.replace(/\(.*\)/, "") : undefined,
                    ozonTheme: relationDetail.value.variantInfoList.find((item) => {
                        return item.originalVariantName === key
                    })?.attributeId,
                    filterAttrOptions: filterAttrOptions.value,
                })
            }

        });
    };
}

// 历史分类  typeId, categoryId = ''
const getHistoryList = (account) => {
    historyCategory({ account })
        .then((res) => {
            historyCategoryList.value = res?.data || [];
            innerTableData.value.forEach((item) => {
                item.ozonTheme = undefined;
                item.attrLabel = undefined;
            })
        })
};

// 选中的分类
const selectAttributes = (value) => {
    if (value) {
        if (historyCategoryList.value.length != 0) {
            hisAttrObj.value = historyCategoryList.value.find((item) => item.threeCategoryId === value);
            secondCategoryId.value = hisAttrObj.value.secondCategoryId;
            categoryAttributes({
                account: form.shortCode,
                descriptionCategoryId: hisAttrObj.value.secondCategoryId,
                typeId: hisAttrObj.value.threeCategoryId,
            }).then((res) => {
                if (res.code === 200) {
                    attributes.value = res.data || [];
                    isClear.value = true;
                    getFilterAttrs();
                }
            })
        }
    }
};

// 更换分类
const changeCategory = () => {
    nextTick(() => {
        categoryModalEl.value.open(form.categoryId);
    })
};

const handleSelect = (data) => {
    dialogVisible.value = true;
    form.categoryId = data.value;
    hisAttrObj.value = {
        "categoryId": data.ids[0],
        "secondCategoryId": data.ids[1],
        "threeCategoryId": data.ids[2],
        "categoryName": data.label[0],
        "secondCategoryName": data.label[1],
        "threeCategoryName": data.label[2]
    };
    secondCategoryId.value = data.ids[1];
    let params = {
        account: acceptParams.value.account,
        secondCategoryId: data.ids[1],
        threeCategoryId: data.ids[2],
    };
    isClear.value = true;
    addHistoryCategory(params).then((res) => {
        getHistoryList(acceptParams.value.account, data.value);
    });
};

const accountName = (account) => {
    return shopAccount.value.find(item => item.account === account)?.simpleName
};


// 店铺列表
const getAccount = () => {
    accountCache().then((res) => {
        if (res.code === 200) {
            shopAccount.value = res.data || [];
        }
    });
};


const open = (data) => {
    isClear.value = false;
    acceptParams.value = data;
    dialogVisible.value = true;
    getAccount();
    form.shortCode = data.account;
    ozonCollectDetail({
        "id": data.id // 产品主键ID
    }).then((res) => {
        if (res.code === 200) {
            relationDetail.value = res.data || {};
            if (relationDetail.value) {
                tableData.value = [{
                    primaryImage: relationDetail.value.imageList[0],
                    name: relationDetail.value.productTitle,
                    category: relationDetail.value.typeId,
                    gatherPlatformName: relationDetail.value.platform,
                    account: data.account,
                }];

                form.shortCode = data.account;
                form.categoryId = relationDetail.value.typeId;
                getHistoryList(data.account);
            }
        }
    })
};

const cancel = () => {
    dialogVisible.value = false;
    innerTableData.value = [];
};
const platformName = (platform) => {
    return platNames[platform] ?? platform
};

// 从filterAttrOptions中找到attrLabel
const getAttrLabel = (value) => {
    return filterAttrOptions.value.find(item => item.value === value)?.attrLabel
}

// 编辑分类
const editCategory = () => {
    let variantRelationList = innerTableData.value.map(item => {
        return {
            "originalVariantName": item.catTheme,
            "platformVariantName": getAttrLabel(item.ozonTheme),
            "attributeId": item.ozonTheme
        }
    });
    const params = {
        typeId: form.categoryId,
        "productCollectId": acceptParams.value.id, //数据采集产品id或者采集箱产品id
        "platformName": "ozon",//所属平台
        "categoryId": form.categoryId,
        "variantRelationList": variantRelationList
    };

    // 对应Ozon变种主题 选择不能有一样的
    const attributeIdList = variantRelationList.map(item => item.attributeId);
    if (attributeIdList.every(item => item === undefined)) {
        message.error('请选择变种主题选择属性');
        return;
    }
    const hasRepeat = attributeIdList.some((item, index) => attributeIdList.indexOf(item) !== index);
    if (hasRepeat) {
        message.error('对应Ozon变种主题，选择不能有重复');
        return;
    }
    ozonRelationSave(params).then((res) => {
        if (res.code === 200) {
            message.success('保存成功');
            emits('edit');
            cancel();

            //  to do ....  跳转

        }
    })
};

const attrOptions = (options) => {
    return options
};

//  跳过
const skip = () => {
    emits('skip');
    cancel();
};
const emits = defineEmits(['cancel', 'edit', 'skip', "sendShortCode", "getAttributes"]);
defineExpose({
    open
});
</script>
<style scoped>
.card {
    background-color: #f9f9f9;
}

.imgCss {
    width: 80px;
    height: 80px;
}

.info {
    color: #999;

    p {
        margin: 0;
    }
}

.tooltip-text {
    color: #a0a3a6;
    padding-top: 5px;
}
</style>