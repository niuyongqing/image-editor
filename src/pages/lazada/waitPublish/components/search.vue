<template>
    <div>
        <a-card style="padding-left: 16px;">
            <a-form :label-col="{ style: { width: '80px' } }" labelAlign="left">
                <a-form-item label="店铺账号:">
                    <div class="flex flex-wrap gap-10px">
                        <a-button v-for="(item) in shortCodes" :key="item.shortCode"
                            :type="item.shortCode === formState.shortCode ? 'primary' : 'text'"
                            @click="changeShortCode(item.shortCode)">
                            {{ item.simpleName }}
                        </a-button>
                    </div>
                </a-form-item>
                <a-form-item label="搜索类型：">
                    <div class="flex flex-wrap gap-16px">
                        <a-button v-for="(item) in searchTypeList" :key="item.value" @click="changeSearchType(item)"
                            :type="item.value === currentSearchType ? 'primary' : 'text'">
                            {{ item.label }}</a-button>
                    </div>
                </a-form-item>

                <a-form-item label="搜索内容：">
                    <div>
                        <div class="flex">
                            <a-input v-model:value="formState.name" placeholder="请输入搜索内容" style="width: 480px"
                                v-show="currentSearchType === 'title'" />
                            <a-textarea v-model:value="formState.sku" placeholder="多个SKU间隔用逗号隔开，最多支持200个"
                                style="width: 480px" v-show="currentSearchType === 'sku'"
                                :auto-size="{ minRows: 1, maxRows: 5 }" />
                            <a-textarea v-model:value="formState.id" placeholder="多个产品ID间隔用逗号隔开，最多支持200个"
                                style="width: 480px" v-show="currentSearchType === 'id'"
                                :auto-size="{ minRows: 1, maxRows: 5 }" />
                            <a-button class="ml-10px" type="primary" @click="submit">搜索</a-button>
                            <a-button type="link" @click="showAdvanceSearch">高级搜索</a-button>
                        </div>
                        <div class="flex w-600px  mt-10px" style="background-color: rgb(245, 245, 245);">
                            <!-- <AdvancedSearch v-model="visible"></AdvancedSearch> -->
                            <AdvancedSearch :shortCodes="shortCodes" v-model="visible" @change="advancedSearchChange"
                                @submit="advancedSearchSubmit"></AdvancedSearch>
                        </div>
                    </div>
                </a-form-item>

                <a-form-item label="刊登类型：">
                    <div class="flex flex-wrap gap-10px">
                        <a-button v-for="(item) in publishList" :key="item.value"
                            :type="item.value === formState.publishType ? 'primary' : 'text'"
                            @click="changePublishType(item)">
                            {{ item.label }}
                        </a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup>
import { CaretDownOutlined, CaretUpOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import AdvancedSearch from './advancedSearch.vue'
const { shortCodes = [] } = defineProps({
    shortCodes: {
        type: Array
    }
});
const searchTypeList = [{
    label: '标题',
    value: 'title'
}, {
    label: 'SKU',
    value: 'sku'
}, {
    label: '产品ID',
    value: 'id'
}];
const publishList = [{
    label: '全部',
    value: ''
}, {
    label: '六合一',
    value: 'published'
}, {
    label: '站点',
    value: 'unpublished'
}];
const globalPlusList = [{
    label: '全部',
    value: ''
}, {
    label: '已升级',
    value: '1'
}, {
    label: '可升级',
    value: '2'
}, {
    label: '不可升级',
    value: '3'
}];
const sortTypeList = [{
    label: '按创建时间',
    value: 'create_time',
    sort: 'asc' // asc 升序； desc 降序
},
{
    label: '按更新时间',
    value: 'update_time',
    sort: 'asc'
},
{
    label: '按库存量',
    value: 'sales',
    sort: 'desc'
},
{
    label: '按变种库存量',
    value: 'price',
    sort: 'desc'
}]
const currentSearchType = ref('title');
const visible = ref(false);
const formState = reactive({
    shortCode: '', // 店铺账号：
    name: '', // 搜索内容
    publishType: '', // 刊登类型
    globalPlus: '',// Global Plus
    sortType: 'create_time',// 排序类型
    sort: 'asc', // asc 升序； desc 降序
    sku: '',
    id: ''
});
const searchParams = reactive({})

// 显示高级搜索
const showAdvanceSearch = () => {
    visible.value = !visible.value;
};
const changeShortCode = (value) => {
    formState.shortCode = value;
    submit();
};
const changeSearchType = (item) => {
    currentSearchType.value = item.value;
    formState.name = '';
    formState.sku = '';
    formState.id = '';
};

const changePublishType = (item) => {
    formState.publishType = item.value;
};
const changeGlobalPlus = (item) => {
    formState.globalPlus = item.value;
};

const changeSortType = (item) => {
    formState.sortType = item.value;
    item.sort = item.sort === 'asc' ? 'desc' : 'asc';
    formState.sort = item.sort;
};

// 高级搜索
const advancedSearchChange = (evt) => {
    Object.assign(searchParams, evt);
};
// 高级搜索
const advancedSearchSubmit = (evt) => {
    Object.assign(searchParams, evt);
    const params = getParams();
    emits('search', params);
}

// 获取所有参数
function getParams() {
    console.log('searchParams', searchParams);
    const params = {
        "country": searchParams.country,//站点
        "primaryCategoryId": searchParams.primaryCategoryId && searchParams.primaryCategoryId.length > 0 ? searchParams.primaryCategoryId[searchParams.primaryCategoryId.length - 1] : '',//分类id

        shortCode: formState.shortCode,
        name: formState.name, // 标题
        sku: formState.sku,
        id: formState.id,
        publishType: formState.publishType,
        prop: formState.sortType, // 排序字段
        order: formState.sort, // 排序方式
        minPrice: searchParams.minPrice, //  //起始价格
        maxPrice: searchParams.maxPrice, //结束价格
        minSalesPprice: searchParams.minSalesPprice, //  //起始特价
        maxSalesPprice: searchParams.maxSalesPprice, //  //结束促销价格
        "minInventoryQuantity": searchParams.minInventoryQuantity, //起始库存数量
        "maxInventoryQuantity": searchParams.maxInventoryQuantity, //结束库存数量
        // "minVariantQuantity": searchParams.minVariantQuantity, // 起始变种库存数量
        // "maxVariantQuantity": searchParams.maxVariantQuantity, //结束变种库存数量
        "createAfter": searchParams.createAfter, //创建开始时间 
        "createBefore": searchParams.createBefore,  //创建结束时间 
        "updateAfter": searchParams.updateAfter,//修改开始时间
        "updateBefore": searchParams.updateBefore, //修改结束时间
    };
    return params;
};

const submit = () => {
    const params = getParams();
    emits('search', params);
};
const handleReset = () => {
    reset();
    emits('search', state);
};
const emits = defineEmits(['search']);
</script>