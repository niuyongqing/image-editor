<template>
    <div>
        <a-modal v-model:open="dialogVisible" title="提示" width="1000px" @cancel="cancel" :footer="null">

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
                    <template v-if="column.dataIndex === 'productInfo'">
                        <div class="flex items-center">
                            <div class="w-70px h-70px">
                                <img :src="record.image" class="w-full h-full" alt="商品图片">
                            </div>
                            <div class="ml-5">
                                <div class="font-bold">{{ record.title }}</div>
                                <div class="text-gray-500">来源: {{ record.source }}</div>
                            </div>
                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'category'">
                        >>
                    </template>
                    <template v-if="column.dataIndex === 'ozonCategory'">
                        <a-select v-model:value="form.categoryId" allowClear showSearch labelInValue placeholder="请选择"
                            style="width: 300px;" :options="historyCategoryList" @change="selectAttributes" :fieldNames="{
                                label: 'threeCategoryName', value: 'threeCategoryId',
                            }">
                        </a-select>

                        <!-- <a-button type="link" @click="selectVisible = true">更换分类</a-button> -->
                        <a-button type="link" @click="changeCategory">更换分类</a-button>
                        <div text-gray-600 v-if="hisAttrObj.length != 0">
                            <span>{{ hisAttrObj[0].categoryName }}</span>/ <span>{{
                                hisAttrObj[0].secondCategoryName }}</span>/
                            <span>{{ hisAttrObj[0].threeCategoryName }}</span>
                        </div>
                    </template>
                </template>
            </a-table>
        </a-modal>

        <CategoryDialog :selectVisible="selectVisible" :categoryTreeList="categoryTreeList"
            @getAttributesID="getAttributesID" @handleEditClose="selectVisible = false"></CategoryDialog>


        <CategoryModal ref="categoryModalRef"></CategoryModal>
    </div>

</template>

<script setup>
import CategoryDialog from "@/pages/ozon/productPublish/comm/categoryDialog.vue";
import CategoryModal from "./categoryModal.vue";
import {
    historyCategory,
    addHistoryCategory,
} from "@/pages/ozon/config/api/product.js";

const columns = [
    {
        title: '产品信息',
        dataIndex: 'productInfo',
        key: 'productInfo',
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

const categoryTableData = ref([
    {
        productInfo: '机身颜色',
        theme: undefined,
    }
]);
const categoryModalEl = useTemplateRef('categoryModalRef');
const categoryOptions = ref([]);
const selectVisible = ref(false);
const categoryTreeList = ref([]);
const historyCategoryList = ref([]);
const hisAttrObj = ref([]) //选中的三级

const tableData = ref([
    {
        productInfo: '',
        category: '',
        ozonCategory: '',
    }
]);

const dialogVisible = ref(false);
const acceptParams = ref({});


const form = reactive({
    name: "",
    shortCode: "",
    categoryId: null,
    vat: "", //税
    attributes: {}, //产品属性
    storeHistoryCategoryId: "", //资料库分类ID
})

// 根据分类弹窗中选择的分类去查询属性
const getAttributesID = (ids) => {

    console.log('ids', ids);
    let params = {
        account: form.shortCode,
        secondCategoryId: ids.secondCategoryId,
        threeCategoryId: ids.value,
    };
    addHistoryCategory(params).then((res) => {
        getHistoryList(form.shortCode);
    });
    form.categoryId = {
        threeCategoryId: ids.value,
        threeCategoryName: "",
        secondCategoryId: ids.secondCategoryId,
        label: ids.label,
        value: ids.value
    };
    console.log('form', form.categoryId);

    emits("getAttributes", form.shortCode, form.categoryId);
}


// 历史分类
const getHistoryList = (account) => {
    if (!form.shortCode) {
        return;
    }
    emits("sendShortCode", form.shortCode);
    historyCategory({ account })
        .then((res) => {
            historyCategoryList.value = res?.data || [];
            if (
                historyCategoryList.value.length != 0 &&
                JSON.stringify(form.categoryId) != "{}"
            ) {
                hisAttrObj.value = historyCategoryList.value.filter(
                    (item) =>
                        item.threeCategoryId ==
                        form?.categoryId?.threeCategoryId
                );
            }
        })
};

// 选中的分类
const selectAttributes = (e) => {
    if (e) {
        if (historyCategoryList.value.length != 0) {
            hisAttrObj.value = historyCategoryList.value.filter(
                (item) =>
                    item.threeCategoryId ==
                    e.option.threeCategoryId
            );
        }
        form.categoryId = {
            threeCategoryId: e.option.threeCategoryId,
            threeCategoryName: "",
            secondCategoryId: e.option.secondCategoryId,
            label: e.option.threeCategoryName,
            value: e.option.threeCategoryId
        }
        emit("getAttributes", form.shortCode, e.option);
    }
}

// 更换分类
const changeCategory = () => {
    dialogVisible.value = false;
    nextTick(() => {
        categoryModalEl.value.open();
    })
}



const open = (data) => {
    acceptParams.value = data;
    dialogVisible.value = true;
};

const cancel = () => {
    dialogVisible.value = false;
};

// 编辑分类
const editCategory = () => {
    emits('edit');
    cancel();
};

//  跳过
const skip = () => {
    emits('skip');
    cancel();
};

// 更换分类
const handleCategoryChange = () => {

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
    width: 68px;
    height: 68px;
}

.info {
    color: #999;

    p {
        margin: 0;
    }
}
</style>