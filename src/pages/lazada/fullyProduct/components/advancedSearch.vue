<!-- 高级搜索 -->
<template>
    <div class="p-2" v-if="visible">
        <a-form :label-col="{ style: { width: '140px' } }" labelAlign="right">
            <a-form-item label="站点:">
                <a-select v-model:value="state.country" placeholder="请选择站点" style="width: 352px" :options="siteOptions"
                    @change="changeSite" allowClear>
                </a-select>
            </a-form-item>
            <a-form-item label="产品分类:">
                <a-cascader :showSearch="showSearchConfig" class="flex w-full justify-start" style="width: 352px"
                    v-model:value="state.primaryCategoryId" :options="primaryCategoryOptions" placeholder="请先选择站点"
                    allowClear :fieldNames="{ label: 'name2', value: 'categoryId', children: 'children' }">
                    <template #notFoundContent>
                        <div v-if="primaryCategoryOptions.length === 0">
                            暂无数据
                        </div>
                        <div w-full h-300px flex items-center justify-center m-auto v-else>
                            <a-spin :spinning="true" tip="正在加载中..." m-auto>
                            </a-spin>
                        </div>
                    </template>
                </a-cascader>
            </a-form-item>

            <a-form-item label="价格:">
                <a-input-number v-model:value="state.minPrice" placeholder="" style="width: 170px"
                    @change="change"></a-input-number>
                -
                <a-input-number v-model:value="state.maxPrice" placeholder="" style="width: 170px"
                    @change="change"></a-input-number>
            </a-form-item>

            <a-form-item label="促销价:">
                <a-input-number v-model:value="state.minSpecialPrice" placeholder="" style="width: 170px"
                    @change="change"></a-input-number>
                -
                <a-input-number v-model:value="state.maxSpecialPrice" placeholder="" style="width: 170px"
                    @change="change"></a-input-number>
            </a-form-item>

            <a-form-item label="库存:">
                <a-input-number v-model:value="minValue" placeholder="" style="width: 170px"
                    @change="changeMinValue"></a-input-number>
                -
                <a-input-number v-model:value="maxValue" placeholder="" style="width: 170px"
                    @change="changeMaxValue"></a-input-number>
            </a-form-item>

            <a-form-item label="备注:">
                <a-select v-model:value="state.hasRemark" allowClear @change="change">
                    <a-select-option :value="true">有备注</a-select-option>
                    <a-select-option :value="false">无备注</a-select-option>
                </a-select>
            </a-form-item>

            <!-- <a-form-item label="六合一发布:">
                <a-select v-model:value="state.hasRemark" allowClear @change="change">
                    <a-select-option value="1">六合一发布异常（无产品id）</a-select-option>
                </a-select>
            </a-form-item> -->

            <a-form-item>
                <template #label>
                    <a-select v-model:value="dateType" @change="changeDateType" style="width: 170px">
                        <a-select-option value="updateTime">更新时间</a-select-option>
                        <a-select-option value="createTime">创建时间</a-select-option>
                    </a-select>
                </template>
                <a-range-picker allowClear v-model:value="date" :format="dateFormat" @change="changeDate"
                    style="width: 352px"></a-range-picker>
            </a-form-item>

            <a-form-item label="">
                <div class="flex justify-end">
                    <a-button type="link" @click="cancel">取消</a-button>
                    <a-button type="link" @click="handleReset">重置</a-button>
                    <a-button type="primary" @click="search">搜索</a-button>
                </div>
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup>
import { useResetReactive } from '@/composables/reset';
import dayjs from 'dayjs';
import { lazadaCategoryTree } from '@/pages/lazada/product/api';
import { message } from "ant-design-vue";

const { shortCodes = [] } = defineProps({
    shortCodes: {
        type: Array
    }
});
const showSearchConfig = {
    filter: (inputValue, path) => {
        return path.some(option => option.name2.toLowerCase().includes(inputValue.toLowerCase()));
    }
};
const primaryCategoryOptions = ref([]); // 分类列表
const dateFormat = 'YYYY/MM/DD';
const type = ref(1); //默认库存
const minValue = ref(undefined);
const maxValue = ref(undefined);
const dateType = ref('updateTime');
const date = ref([]);
const { state, reset } = useResetReactive({
    country: undefined,
    primaryCategoryId: undefined,
    minSpecialPrice: undefined,
    maxSpecialPrice: undefined,
    minInventoryQuantity: undefined,
    maxInventoryQuantity: undefined,
    minVariantQuantity: undefined,
    maxVariantQuantity: undefined,
    createAfter: undefined,
    createBefore: undefined,
    updateAfter: undefined,
    updateBefore: undefined,
    hasRemark: undefined,
});

const emits = defineEmits(['submit', 'change']);

const siteOptions = [
    {
        label: "马来西亚",
        value: "my"
    },
    {
        label: "越南",
        value: "vn"
    },
    {
        label: "印度尼西亚",
        value: "id"
    },
    {
        label: "新加坡",
        value: "sg"
    },
    {
        label: "菲律宾",
        value: "ph"
    },

    {
        label: "泰国",
        value: "th"
    },
];
const classifyOptions = ref([]); // 产品分类
const visible = defineModel(true);
const cancel = () => {
    visible.value = false;
    reset();
    type.value = 1;
    minValue.value = undefined;
    maxValue.value = undefined;
    dateType.value = 'updateTime';
    date.value = [];
    change();
};

const handleReset = () => {
    reset();
    type.value = 1;
    minValue.value = undefined;
    maxValue.value = undefined;
    dateType.value = 'updateTime';
    date.value = [];
    change();
};

const getParams = () => {
    const params = {
        country: state.country, // 站点
        primaryCategoryId: state.primaryCategoryId,  // 产品分类
        minPrice: state.minPrice,
        maxPrice: state.maxPrice,
        minSpecialPrice: state.minSpecialPrice,
        maxSpecialPrice: state.maxSpecialPrice,
        minInventoryQuantity: state.minInventoryQuantity,
        maxInventoryQuantity: state.maxInventoryQuantity,

        minVariantQuantity: state.minVariantQuantity,
        maxVariantQuantity: state.maxVariantQuantity,

        updateAfter: state.updateAfter,
        updateBefore: state.updateBefore,
        createAfter: state.createAfter,
        createBefore: state.createBefore,
        hasRemark: state.hasRemark,
    };
    return params;
};

const changeSite = (value) => {
    state.primaryCategoryId = undefined;
    primaryCategoryOptions.value = [];
    const findItem = shortCodes.find((item) => {
        return item.country === value
    })
    console.log("shortCodes", findItem, value);

    if (!findItem) {
        state.primaryCategoryId = undefined;
        primaryCategoryOptions.value = [];
        message.error("站点下没有产品分类，请重新选择！")
        return
    };
    lazadaCategoryTree({ shortCode: findItem.shortCode }).then((categoryTreeRes) => {
        if (categoryTreeRes.code === 200) {
            const data = categoryTreeRes.data || [];
            function treeToArr(arr) {
                arr.forEach(item => {
                    item.name2 = item.name + ' ( ' + item.translateName + ' )'
                    if (item.children && item.children.length > 0) {
                        treeToArr(item.children)
                    }
                    if (!item.children || item.children.length === 0) {
                        delete item.children
                    }
                })
                return arr
            };
            primaryCategoryOptions.value = treeToArr(data)
        };

    })
    change();
};


const change = () => {
    const params = getParams()
    emits('change', params);
};
const handleSelect = () => {
    minValue.value = undefined;
    maxValue.value = undefined;
};

const changeMinValue = (value) => {
    if (type.value === 1) {
        state.minInventoryQuantity = minValue.value;
        state.minVariantQuantity = undefined;
    } else {
        state.minInventoryQuantity = undefined;
        state.minVariantQuantity = minValue.value;
    };
    change()
};
const changeMaxValue = (value) => {
    if (type.value === 1) {
        state.maxInventoryQuantity = maxValue.value;
        state.maxVariantQuantity = undefined;
    } else {
        state.maxInventoryQuantity = undefined;
        state.maxVariantQuantity = maxValue.value;
    };
    change()
};

const changeDateType = () => {
    date.value = []
    change()
};
const changeDate = (value) => {
    if (dateType.value === 'updateTime') {
        state.updateAfter = date.value[0].format('YYYY-MM-DD 00:00:00');
        state.updateBefore = date.value[1].format('YYYY-MM-DD 23:59:59');;
        state.createAfter = undefined;
        state.createBefore = undefined;
    } else {
        state.createAfter = date.value[0].format('YYYY-MM-DD 00:00:00');;
        state.createBefore = date.value[1].format('YYYY-MM-DD 23:59:59');;
        state.updateAfter = undefined;
        state.updateBefore = undefined;
    };
    change()
};
const search = () => {
    const params = getParams()
    emits('submit', params);
};
</script>