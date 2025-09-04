<template>
    <div>
        <a-modal v-model:open="dialogVisible" title="关联分类" width="1000px" @cancel="cancel" :footer="null"
            :maskClosable="false">
            <div flex justify-end mb-15px>
                <a-button type="primary" @click="editCategory"
                    style="height: 32px;  background-color: #E97234;">保存</a-button>
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
                        <p class="tooltip-text" v-if="JSON.stringify(hisAttrObj) !== '{}'">
                            {{
                                hisAttrObj.categoryName
                            }} > {{ hisAttrObj.secondCategoryName }} > {{
                                hisAttrObj.threeCategoryName }} </p>
                        <!-- 表格 -->
                        <a-table :columns="innerColumns" :data-source="innerTableData" bordered :pagination="false"
                            style="margin-top: 10px;" :loading="optionsLoading">
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.dataIndex === 'catTheme'">
                                    {{ record.catTheme }}
                                </template>
                                <template v-if="column.dataIndex === 'ozonTheme'">
                                    <a-select v-model:value="record.ozonTheme" allowClear placeholder="请选择"
                                        style="width: 180px;" :options="filterAttrOptions">
                                        <template #notFoundContent>
                                            <div v-if="optionsLoading" w-180px h-150px flex justify-center items-center>
                                                <a-spin />
                                            </div>
                                            <div v-else flex justify-center items-center>
                                                <a-empty />
                                            </div>
                                        </template>
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
import { ozonCollectDetail, ozonRelationSave, ozonRelationDetail } from "@/pages/ozon/config/api/draft.js";
import CategoryModal from "@/pages/ozon/draft/comm/categoryModal.vue";
import { accountCache } from "@/pages/ozon/config/api/product.js";

const props = defineProps({
    relationType: {
        type: Number,
        default: 3
    },
    relevanceData: {
        type: Object,
        default: () => { }
    }

})
const collectData = ref({});
const shopAccount = ref([]); // 店铺列表
const acceptParams = ref({});// 表格行ID
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
        align: 'center',
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
    return [
        {
            title: `资料库变种主题`,
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
const attributes = ref([]);
const filterAttrOptions = ref([]); // 过滤后的属性
const optionsLoading = ref(false); // 下拉框loading
const tableData = ref([
    {
        primaryImage: '',
        category: '',
        ozonCategory: '',
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

watch(() => props.relevanceData, (newVal) => {
    if (Object.keys(newVal).length > 0) {
        const { typeId, variantRelationList, categoryId } = newVal

        innerTableData.value = variantRelationList.map(item => ({
            catTheme: "型号",
            ozonTheme: item.attributeId, // 将之前选择过的主题ID回显
            attrLabel: item.platformVariantName, // 将之前选择过的主题中文回显
            filterAttrOptions: []
        }))
        // 将之前选择过的分类进行赋值通过getAttributes方法去获取分类下的属性 会将对应主题过滤出来

        hisAttrObj.value = {
            "categoryId": "",
            "secondCategoryId": categoryId,
            "threeCategoryId": typeId,
            "categoryName": "",
            "secondCategoryName": "",
            "threeCategoryName": ""
        };
        form.categoryId = typeId;
        getAttributes();
    }
})


// 分类搜索
function filterOption(input, option) {
    return option.threeCategoryName.indexOf(input) >= 0;
}
// 图片加前缀
const primaryImage = (primaryImage) => {
    return baseApi + primaryImage
};

// 更换分类
const changeCategory = () => {
    nextTick(() => {
        categoryModalEl.value.open(form.categoryId);
    })
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
    let mainImage = JSON.parse(data.record.artMainImage)?.[0]?.url || "";
    let assistantImage = JSON.parse(data.record.artAssistantImage)?.[0]?.url || "";
    tableData.value = [{
        primaryImage: mainImage || assistantImage, // 主图或副图或无图
        name: data.record.tradeName,
        category: undefined,
        account: data.account,
    }];

    innerTableData.value = [
        {
            catTheme: "型号",
            ozonTheme: undefined,
            attrLabel: undefined,
            filterAttrOptions: []
        }
    ]
    form.categoryId = undefined;
    getHistoryList(data.account);

};

const cancel = () => {
    attributes.value = [];
    hisAttrObj.value = {};
    isClear.value = false;
    collectData.value = {};
    relationDetail.value = {};
    filterAttrOptions.value = [];
    innerTableData.value = [];
    dialogVisible.value = false;

};

// 从filterAttrOptions中找到attrLabel
const getAttrLabel = (value) => {
    return filterAttrOptions.value.find(item => item.value === value)?.attrLabel
}

// 弹窗选择分类后的操作
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
    let params = {
        account: form.shortCode,
        secondCategoryId: data.ids[1],
        threeCategoryId: data.ids[2]
    };
    // 将弹窗中选择的分类添加到历史分类中
    addHistoryCategory(params).then((res) => {
        getHistoryList(form.shortCode);
    });
    // 选择分类后，查询分类的属性
    getAttributes();
}

// 历史分类
const getHistoryList = (account) => {
    if (!account) {
        return;
    }
    historyCategory({ account }).then((res) => {
        historyCategoryList.value = res?.data || [];
        if (historyCategoryList.value.length != 0 && form.categoryId) {
            hisAttrObj.value = historyCategoryList.value.find(
                (item) => item.threeCategoryId == form.categoryId
            ) || {};
        }
    });
};

const editCategory = () => {
    let variantRelationList = innerTableData.value.map(item => {
        return {
            "originalVariantName": "型号",
            "platformVariantName": getAttrLabel(item.ozonTheme),
            "attributeId": item.ozonTheme
        }
    });

    const params = {
        typeId: form.categoryId, // 三级分类id
        relationType: props.relationType, // 3代表保存的是待发布的数据  4是在线产品
        productCollectId: acceptParams.value.id, // 资料库id
        platformName: "ozon",//所属平台
        categoryId: hisAttrObj.value.secondCategoryId, // 二级分类id
        variantRelationList: variantRelationList
    };
    // 将二级和三级ID进行存储，传递给父组件
    let categoryObj = {
        secondCategoryId: hisAttrObj.value.secondCategoryId,
        typeId: form.categoryId,
    }
    // 对应Ozon变种主题 选择不能有一样的
    // const attributeIdList = variantRelationList.map(item => item.attributeId).filter(Boolean);
    // if (attributeIdList.every(item => item === undefined)) {
    //     message.error('请选择变种主题选择属性');
    //     return;
    // };
    console.log("params", params);

    ozonRelationSave(params).then((res) => {
        if (res.code === 200) {
            message.success('保存成功');
            emits('feedBackData', categoryObj);
            cancel();
        }
    })
}

// 选择ozon主题
const selectAttributes = (value) => {
    if (value) {
        if (historyCategoryList.value.length != 0) {
            hisAttrObj.value = historyCategoryList.value.find((item) => item.threeCategoryId === value);
            getAttributes();
            innerTableData.value = innerTableData.value.map((item) => {
                return {
                    catTheme: item.catTheme,
                    ozonTheme: undefined,
                    attrLabel: undefined,
                    filterAttrOptions: filterAttrOptions.value,
                }
            })
            isClear.value = true;
        }
    } else {
        filterAttrOptions.value = [];
    }
}

// 根据选择的分类去查询属性，用于过滤出相关的主题下拉数据
const getAttributes = () => {
    categoryAttributes({
        account: form.shortCode,
        descriptionCategoryId: hisAttrObj.value.secondCategoryId,
        typeId: hisAttrObj.value.threeCategoryId,
    }).then((res) => {
        if (res.code === 200) {
            attributes.value = res.data || [];
            // 将属性中的主题过滤出来处理成下拉数据
            filterAttrOptions.value = filterAttrs(attributes.value)
        }
    })
}

// 关联的结对变种属性
const TWINS = [
    [10096, 10097], // [商品颜色, 颜色名称]
    [4295, 9533] // [俄罗斯尺码, 制造商尺码]
]
// 过滤出变种属性, 颜色, 尺寸只保留一个
function filterAttrs(list) {
    let aspectList = list.filter(attrItem => attrItem.isAspect)
    TWINS.forEach(arr => {
        const ids = aspectList.map(item => item.id)
        if (arr.every(id => ids.includes(id))) {
            // 删后一个 id
            aspectList = aspectList.filter(item => item.id !== arr[1])
        }
    })
    const resList = aspectList.map(attrItem => {
        return {
            label: attrItem.name.replace(/\(.*\)/, ''), // 去掉（）里面的
            value: attrItem.id,
            attrLabel: attrItem.name
        }
    })

    return resList
}


const emits = defineEmits(['cancel', 'feedBackData']);
defineExpose({
    open
});
</script>
<style scoped lang="less">
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