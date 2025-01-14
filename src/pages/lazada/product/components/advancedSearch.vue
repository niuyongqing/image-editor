<!-- 高级搜索 -->
<template>
    <div class="p-2" v-if="visible">
        <a-form :label-col="{ style: { width: '140px' } }" labelAlign="right">
            <a-form-item label="站点:">
                <a-select v-model:value="state.site" placeholder="请选择站点" style="width: 352px" :options="siteOptions"
                    @change="change" allowClear>
                </a-select>
            </a-form-item>
            <a-form-item label="产品分类:">
                <a-select v-model:value="state.classify" placeholder="请先选择站点" style="width: 352px"
                    :options="classifyOptions" allowClear @change="change">
                </a-select>
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

            <a-form-item>
                <template #label>
                    <a-select v-model:value="type" style="width: 170px" @change="handleSelect">
                        <a-select-option :value="1">库存</a-select-option>
                        <a-select-option :value="2">变种最小库存</a-select-option>
                    </a-select>
                </template>
                <a-input-number v-model:value="minValue" placeholder="" style="width: 170px"
                    @change="changeMinValue"></a-input-number>
                -
                <a-input-number v-model:value="maxValue" placeholder="" style="width: 170px"
                    @change="changeMaxValue"></a-input-number>
            </a-form-item>
            <!-- 
            <a-form-item label="预售:">
                <a-select @change="change" v-model:value="state.classify" placeholder="请先选择站点" style="width: 352px"
                    allowClear>
                    <a-select-option value="1">已开启预售</a-select-option>
                    <a-select-option value="2">未开启预售</a-select-option>
                </a-select>
            </a-form-item> -->

            <a-form-item label="备注:">
                <a-select v-model:value="state.stockType" allowClear @change="change">
                    <a-select-option value="1">有备注</a-select-option>
                    <a-select-option value="2">无备注</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="六合一发布:">
                <a-select v-model:value="state.stockType" allowClear @change="change">
                    <a-select-option value="1">六合一发布异常（无产品id）</a-select-option>
                </a-select>
            </a-form-item>

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

const dateFormat = 'YYYY/MM/DD';
const type = ref(1); //默认库存
const minValue = ref(undefined);
const maxValue = ref(undefined);
const dateType = ref('updateTime');
const date = ref([]);
const { state, reset } = useResetReactive({
    site: undefined,
    classify: undefined,
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
});

const emits = defineEmits(['submit']);

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
        // site: state.site, // 站点
        // classify:state.classify  // 产品分类
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
    };
    return params;
}

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
        date.value = []
        state.updateAfter = minValue.value;
        state.updateBefore = maxValue.value;
        state.createAfter = undefined;
        state.createBefore = undefined;

    } else {
        state.createAfter = date[0];
        state.createBefore = date[1];;
        state.updateAfter = undefined;
        state.updateBefore = undefined;
    };
    change()
};
const search = () => {
    emits('submit');
};
</script>