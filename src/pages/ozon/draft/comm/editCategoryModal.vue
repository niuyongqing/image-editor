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
                                <a-image :src="primaryImage(record.primaryImage)" class="imgCss" />
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
                            }" :filter-option="filterOption">
                        </a-select>
                        <a-button type="link" @click="changeCategory">更换分类</a-button>
                        <p class="tooltip-text" v-if="hisAttrObj && JSON.stringify(hisAttrObj) != '{}'">{{
                            hisAttrObj.categoryName
                            }} > {{ hisAttrObj.secondCategoryName }} > {{
                                hisAttrObj.threeCategoryName }} </p>
                        <!-- 表格 -->
                        <a-table :columns="innerColumns" :data-source="innerTableData" bordered :pagination="false"
                            :loading="optionsLoading" style="margin-top: 10px;">
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.dataIndex === 'catTheme'">
                                    {{ record.catTheme }}
                                </template>
                                <template v-if="column.dataIndex === 'ozonTheme'">
                                    <div>
                                        <a-select v-model:value="record.ozonTheme" allowClear placeholder="请选择"
                                            style="width: 180px;" :options="filterAttrOptions">
                                            <template #notFoundContent>
                                                <div v-if="optionsLoading" w-180px h-150px flex justify-center
                                                    items-center>
                                                    <a-spin />
                                                </div>
                                                <div v-else flex justify-center items-center>
                                                    <a-empty />
                                                </div>
                                            </template>
                                        </a-select>
                                    </div>

                                </template>
                            </template>
                        </a-table>

                    </template>
                </template>
            </a-table>
        </a-modal>
        <CategoryModal ref="categoryModalRef" :account="form.shortCode" @select="handleSelect"></CategoryModal>
    </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import CategoryDialog from "@/pages/ozon/productPublish/comm/categoryDialog.vue";
import CategoryModal from "./categoryModal.vue";
import {
    categoryTree,
    historyCategory,
    addHistoryCategory,
    categoryAttributes,
} from "@/pages/ozon/config/api/product.js";
import { ozonRelationDetail, ozonRelationSave } from "@/pages/ozon/config/api/draft.js";

const { shopAccount } = defineProps({
    shopAccount: {
        type: Array,
        default: () => []
    }
});

const platNames = {
    Ozon: 'Ozon',
    Tmall: '天猫',
    AliExpress: '速卖通',
};

const resData = ref(null);
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
const optionsLoading = ref(false); // 下拉框loading
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
const acceptParams = ref({});
const form = reactive({
    name: "",
    shortCode: "",
    categoryId: null,
})

function filterOption(input, option) {
    return option.threeCategoryName.indexOf(input) >= 0;
}


const primaryImage = (primaryImage) => {
    if (primaryImage.includes('https')) {
        return primaryImage
    }
    return baseApi + primaryImage
};
function getFilterAttrs() {
    const filterAttr = attributes.value.filter((attrItem) => {
        return attrItem.isAspect
    });

    // 过滤属性10097和9533
    filterAttrOptions.value = filterAttr
        .map((attrItem) => ({
            label: attrItem.name.replace(/\(.*\)/, ""),
            value: attrItem.id,
            attrLabel: attrItem.name,
        }))
        // 新增过滤逻辑
        .filter((item, index, arr) => {
            const valueSet = new Set(arr.map(v => v.value));
            // 排除10097当10096存在时
            if (item.value === 10097 && valueSet.has(10096)) return false;
            // 排除9533当4295存在时
            if (item.value === 9533 && valueSet.has(4295)) return false;
            return true;
        });
    innerTableData.value = [];

    if (resData.value) {
        if (acceptParams.value.variantAttr && Object.keys(acceptParams.value.variantAttr).length > 0) {
            Object.keys(acceptParams.value.variantAttr).forEach((key) => {
                const variantRelationList = relationDetail.value.variantRelationList || [];
                const platformVariantName = variantRelationList.find((item) => {
                    return item.originalVariantName === key
                })?.platformVariantName;


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
                        ozonTheme: relationDetail.value.variantRelationList.find((item) => {
                            return item.originalVariantName === key
                        })?.attributeId,
                        filterAttrOptions: filterAttrOptions.value,
                    })
                }

            });
        }

    } else {
        Object.keys(acceptParams.value.variantAttr).forEach((key) => {
            innerTableData.value.push({
                catTheme: key,
                attrLabel: undefined,
                ozonTheme: undefined,
                filterAttrOptions: filterAttrOptions.value,
            })
        })

    }
}

// 历史分类
const getHistoryList = (account, typeId, categoryId = '') => {
    if (!form.shortCode) {
        return;
    }
    historyCategory({ account })
        .then((res) => {
            historyCategoryList.value = res?.data || [];
            const findItem = historyCategoryList.value.find((item) => {
                return item.threeCategoryId === typeId
            });
            hisAttrObj.value = findItem || {};
            secondCategoryId.value = findItem?.secondCategoryId;

            if (acceptParams.value.variantAttr && Object.keys(acceptParams.value.variantAttr).length > 0) {
                innerTableData.value = [];
                Object.keys(acceptParams.value.variantAttr).forEach((key) => {
                    innerTableData.value.push({
                        catTheme: key,
                        ozonTheme: undefined,
                        attrLabel: undefined,
                        filterAttrOptions: filterAttrOptions.value,
                    })
                });
            };

            if (findItem) {
                optionsLoading.value = true;
                filterAttrOptions.value = [];
                categoryAttributes({
                    account,
                    descriptionCategoryId: findItem.secondCategoryId,
                    typeId: findItem.threeCategoryId,
                }).then((res) => {
                    if (res.code === 200) {
                        attributes.value = res.data || [];
                        getFilterAttrs();
                        optionsLoading.value = false;
                    }
                })
            } else {
                if (!categoryId) {
                    return;
                }
                // 没找到 加入历史分类记录里面
                addHistoryCategory({
                    account: form.shortCode,
                    secondCategoryId: categoryId,
                    threeCategoryId: typeId,
                }).then((res) => {
                    getHistoryList(form.shortCode, typeId);
                })
            }
        })
};

// 选中的分类
const selectAttributes = (value) => {
    if (value) {
        if (historyCategoryList.value.length != 0) {
            hisAttrObj.value = historyCategoryList.value.find((item) => item.threeCategoryId === value);
            secondCategoryId.value = hisAttrObj.value.secondCategoryId;
            optionsLoading.value = true;
            filterAttrOptions.value = [];
            categoryAttributes({
                account: form.shortCode,
                descriptionCategoryId: hisAttrObj.value.secondCategoryId,
                typeId: hisAttrObj.value.threeCategoryId,
            }).then((res) => {
                if (res.code === 200) {
                    attributes.value = res.data || [];
                    isClear.value = true;
                    getFilterAttrs();
                    optionsLoading.value = false;
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
        account: form.shortCode,
        secondCategoryId: data.ids[1],
        threeCategoryId: data.ids[2],
    };
    isClear.value = true;
    addHistoryCategory(params).then((res) => {
        getHistoryList(form.shortCode, data.value);
    });
};

const accountName = (account) => {
    return shopAccount.find(item => item.account === account)?.simpleName
};


const open = (data) => {
    isClear.value = false;
    acceptParams.value = data;
    dialogVisible.value = true;
    ozonRelationDetail({
        platformName: 'ozon',
        productCollectId: data.gatherProductId,
    }).then((res) => {
        if (res.code === 200) {
            resData.value = res.data;
            relationDetail.value = res.data || {};
            if (JSON.stringify(relationDetail.value) != '{}') {
                tableData.value = [{
                    primaryImage: data.primaryImage,
                    name: data.name,
                    category: relationDetail.value.typeId,
                    gatherPlatformName: data.gatherPlatformName,
                    account: data.account,
                }];

                form.shortCode = data.account;
                form.categoryId = relationDetail.value.typeId;
                getHistoryList(data.account, relationDetail.value.typeId, relationDetail.value.categoryId);
            } else {

                tableData.value = [{
                    primaryImage: data.primaryImage,
                    name: data.name,
                    category: data.categoryId,
                    gatherPlatformName: data.gatherPlatformName,
                    account: data.account,
                }];

                form.shortCode = data.account;
                form.categoryId = data.typeId;
                getHistoryList(data.account, data.typeId, data.categoryId);
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
        "productCollectId": acceptParams.value.gatherProductId, //数据采集产品id或者采集箱产品id
        "platformName": "ozon",//所属平台
        "categoryId": hisAttrObj.value.secondCategoryId, // 二级分类id
        "variantRelationList": variantRelationList
    };

    // 对应Ozon变种主题 选择不能有一样的
    const attributeIdList = variantRelationList.map(item => item.attributeId).filter(Boolean);

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
            window.open(`/platform/ozon/editDraftProduct?account=${acceptParams.value.account}&id=${acceptParams.value.gatherProductId}`, '_blank')
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
<style lang="less" scoped>
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