<template>
    <div>
        <a-card style="padding-left: 16px; margin-top: 16px;">
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
                            <a-input v-model:value="formState.searchContent" placeholder="请输入搜索内容" style="width: 480px"
                                v-show="currentSearchType === 'title'" />
                            <a-textarea v-model:value="formState.sku" placeholder="多个SKU间隔用逗号隔开，最多支持200个"
                                style="width: 480px" v-show="currentSearchType === 'sku'"
                                :auto-size="{ minRows: 1, maxRows: 5 }" />
                            <a-textarea v-model:value="formState.product" placeholder="多个SKU间隔用逗号隔开，最多支持200个"
                                style="width: 480px" v-show="currentSearchType === 'productId'"
                                :auto-size="{ minRows: 1, maxRows: 5 }" />
                            <a-button class="ml-10px" type="primary" @click="submit">搜索</a-button>
                            <a-button type="link" @click="showAdvanceSearch">高级搜索</a-button>
                        </div>
                        <div class="flex w-600px  mt-10px" style="background-color: rgb(245, 245, 245);">
                            <AdvancedSearch v-model="visible"></AdvancedSearch>
                        </div>
                    </div>
                </a-form-item>
                <a-form-item label="产品状态：">
                    <div class="flex flex-wrap gap-10px">
                        <a-button v-for="(item) in statusList" :key="item.value"
                            :type="item.value === formState.publishType ? 'primary' : 'text'"
                            @click="changePublishType(item)">
                            {{ item.label }}
                        </a-button>
                    </div>
                </a-form-item>

                <a-form-item label="排序类型：">
                    <div class="flex flex-wrap gap-10px">
                        <a-button v-for="(item) in sortTypeList" :key="item.value"
                            :type="item.value === formState.sortType ? 'primary' : 'text'"
                            @click="changeSortType(item)">
                            {{ item.label }}
                            <template v-if="item.value === formState.sortType">
                                <CaretUpOutlined v-if="formState.sort === 'asc'" />
                                <CaretDownOutlined v-if="formState.sort === 'desc'" />
                            </template>
                        </a-button>
                        <a-tooltip placement="top">
                            <template #title>
                                <span>按照产品变种的最小库存排序</span>
                            </template>
                            <QuestionCircleOutlined />
                        </a-tooltip>

                    </div>
                </a-form-item>
            </a-form>
            <template #tabBarExtraContent></template>
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
    value: 'productId'
}];
const publishList = [{
    label: '全部',
    value: ''
}, {
    label: '已发布',
    value: 'published'
}, {
    label: '未发布',
    value: 'unpublished'
}];

const statusList = [{
    label: '在线',
    value: ''
}, {
    label: '已下架',
    value: '1'
}, {
    label: '审核中',
    value: '2'
}, {
    label: '平台下架',
    value: '3'
},
{
    label: '疑似删除',
    value: '4'
}]

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
    searchContent: '', // 搜索内容
    publishType: '', // 刊登类型
    globalPlus: '',// Global Plus
    sortType: 'create_time',// 排序类型
    sort: 'asc', // asc 升序； desc 降序
    sku: '',
    productId: ''
});
// 显示高级搜索
const showAdvanceSearch = () => {
    visible.value = !visible.value;
};
const changeShortCode = (value) => {
    formState.shortCode = value;
    console.log('value ->>>', formState.shortCode);
    submit();
};
const changeSearchType = (item) => {
    currentSearchType.value = item.value;
    formState.searchContent = '';
    formState.sku = '';
    formState.productId = '';
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
const submit = () => {
    emits('search', formState);
};
const handleReset = () => {
    reset();
    emits('search', state);
};
const emits = defineEmits(['search']);




</script>

<style lang="less" scoped></style>