<!-- 高级搜索 -->
<template>
    <div class="p-2" v-if="visible">
        <a-form :label-col="{ style: { width: '120px' } }" labelAlign="right">
            <a-form-item label="站点:">
                <a-select v-model:value="state.country" placeholder="请选择站点" style="width: 352px" :options="siteOptions"
                    allowClear>
                </a-select>
            </a-form-item>
            <a-form-item label="产品分类:">
                <a-select v-model:value="state.categoryId" placeholder="请先选择站点" style="width: 352px"
                    :options="classifyOptions" allowClear>
                </a-select>
            </a-form-item>

            <a-form-item label="价格:">
                <a-input-number v-model:value="state.price" placeholder="" style="width: 170px"></a-input-number>
                -
                <a-input-number v-model:value="state.priceEnd" placeholder="" style="width: 170px"></a-input-number>
            </a-form-item>

            <a-form-item label="促销价:">
                <a-input-number v-model:value="state.promotionalPrices" placeholder=""
                    style="width: 170px"></a-input-number>
                -
                <a-input-number v-model:value="state.promotionalPricesEnd" placeholder=""
                    style="width: 170px"></a-input-number>
            </a-form-item>

            <a-form-item>
                <template #label>
                    <a-select v-model:value="state.stockType" style="width: 170px">
                        <a-select-option value="1">库存</a-select-option>
                        <!-- <a-select-option value="2">变种最小库存</a-select-option> -->
                    </a-select>
                </template>
                <a-input-number v-model:value="state.minValue" placeholder="" style="width: 170px"
                    @change="changeMinValue"></a-input-number>
                -
                <a-input-number v-model:value="state.maxValue" placeholder="" style="width: 170px"
                    @change="changeMaxValue"></a-input-number>
            </a-form-item>

            <!-- <a-form-item label="预售:">
                <a-select v-model:value="state.categoryId" placeholder="请先选择站点" style="width: 352px" allowClear>
                    <a-select-option value="1">已开启预售</a-select-option>
                    <a-select-option value="2">未开启预售</a-select-option>
                </a-select>
            </a-form-item> -->

            <a-form-item label="备注:">
                <a-select v-model:value="state.hasRemark" allowClear>
                    <a-select-option value="1">有备注</a-select-option>
                    <a-select-option value="2">无备注</a-select-option>
                </a-select>
            </a-form-item>

            <!-- <a-form-item label="六合一发布:">
                <a-select v-model:value="state.stockType" allowClear>
                    <a-select-option value="1">六合一发布异常（无产品id）</a-select-option>
                </a-select>
            </a-form-item> -->

            <a-form-item>
                <template #label>
                    <a-select v-model:value="dateType" @change="changeDateType" style="width: 170px">
                        <a-select-option value="1">更新时间</a-select-option>
                        <a-select-option value="2">创建时间</a-select-option>
                    </a-select>
                </template>
                <a-range-picker allowClear v-model:value="date" :format="dateFormat" style="width: 352px"
                    @change="changeDate"></a-range-picker>
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
    country: undefined,
    categoryId: undefined,
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
const getParams = () => {
    const params = {
        country: state.country, // 站点
        categoryId: state.categoryId,  // 产品分类
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
const change = () => {
    const params = getParams()
    emits('change', params);
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

const changeDate = (value) => {
    if (dateType.value === 'updateTime') {
        state.updateAfter = date.value[0].format('YYYY-MM-DD HH:mm:ss');
        state.updateBefore = date.value[1].format('YYYY-MM-DD HH:mm:ss');;
        state.createAfter = undefined;
        state.createBefore = undefined;
    } else {
        state.createAfter = date.value[0].format('YYYY-MM-DD HH:mm:ss');;
        state.createBefore = date.value[1].format('YYYY-MM-DD HH:mm:ss');;
        state.updateAfter = undefined;
        state.updateBefore = undefined;
    };
    change()
};
const changeDateType = () => {
    date.value = []
    change()
};
const search = () => {
    const params = getParams()
    emits('submit', params);
};

</script>

<style lang="less" scoped></style>