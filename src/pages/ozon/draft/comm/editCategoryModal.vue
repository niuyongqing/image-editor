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
                        <!-- -->
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
                                        style="width: 180px;" :options="filterAttrOptions">
                                    </a-select>
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
import CategoryDialog from "@/pages/ozon/productPublish/comm/categoryDialog.vue";
import CategoryModal from "./categoryModal.vue";
import {
    categoryTree,
    historyCategory,
    addHistoryCategory,
    categoryAttributes,
} from "@/pages/ozon/config/api/product.js";

const { shopAccount } = defineProps({
    shopAccount: {
        type: String,
        default: ''
    }
});

const baseApi = import.meta.env.VITE_APP_BASE_API;
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
const innerColumns = [
    {
        title: '天猫变种主题',
        dataIndex: 'catTheme',
        key: 'catTheme',
        width: 150
    },
    {
        title: '对应Ozon变种主题',
        dataIndex: 'ozonTheme',
        key: 'ozonTheme',
        width: 150
    },
];

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
const innerTableData = ref([
]);

const dialogVisible = ref(false);
const acceptParams = ref({});
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
        }
    });
    innerTableData.value = [];
    if (acceptParams.value.variantAttr && Object.keys(acceptParams.value.variantAttr).length > 0) {
        Object.keys(acceptParams.value.variantAttr).forEach((key) => {
            innerTableData.value.push({
                catTheme: key,
                ozonTheme: undefined,
            })
        });
    };
}

// 历史分类
const getHistoryList = (account, typeId, categoryId = '') => {
    if (!form.shortCode) {
        return;
    }
    emits("sendShortCode", form.shortCode);
    historyCategory({ account })
        .then((res) => {
            historyCategoryList.value = res?.data || [];
            const findItem = historyCategoryList.value.find((item) => {
                return item.threeCategoryId === typeId
            });
            hisAttrObj.value = findItem || {};
            secondCategoryId.value = findItem?.secondCategoryId;
            if (acceptParams.value.variantAttr && Object.keys(acceptParams.value.variantAttr).length > 0) {
                Object.keys(acceptParams.value.variantAttr).forEach((key) => {
                    innerTableData.value.push({
                        catTheme: key,
                        ozonTheme: undefined,
                    })
                });
            };

            if (findItem) {
                categoryAttributes({
                    account,
                    descriptionCategoryId: findItem.secondCategoryId,
                    typeId: findItem.threeCategoryId,
                }).then((res) => {
                    if (res.code === 200) {
                        attributes.value = res.data || [];
                        getFilterAttrs();
                    }
                })
            } else {
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
            categoryAttributes({
                account: form.shortCode,
                descriptionCategoryId: hisAttrObj.value.secondCategoryId,
                typeId: hisAttrObj.value.threeCategoryId,
            }).then((res) => {
                if (res.code === 200) {
                    attributes.value = res.data || [];
                    getFilterAttrs();
                }
            })
        }
    }
};

// 更换分类
const changeCategory = () => {
    // dialogVisible.value = false;
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
    addHistoryCategory(params).then((res) => {
        getHistoryList(form.shortCode, data.value);
    });
    emits("getAttributes", form.shortCode, form.categoryId);
};

const accountName = (account) => {
    return shopAccount.find(item => item.account === account)?.simpleName
};


const open = (data) => {
    acceptParams.value = data;
    dialogVisible.value = true;
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
};

const cancel = () => {
    dialogVisible.value = false;
    innerTableData.value = [];
};
const platformName = (platform) => {
    const platNames = {
        Ozon: 'Ozon',
        Tmall: '天猫',
        AliExpress: '速卖通',
    };
    return platNames[platform] ?? platform
};

// 编辑分类
const editCategory = () => {
    emits('edit');
    cancel();
    window.open(`/platform/ozon/editDraftProduct?account=${acceptParams.value.account}&id=${acceptParams.value.gatherProductId}`, '_blank')
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