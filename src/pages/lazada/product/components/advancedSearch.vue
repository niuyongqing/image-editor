<!-- 高级搜索 -->
<template>
    <div class="p-2" v-if="visible">
        <a-form :label-col="{ style: { width: '120px' } }" labelAlign="right">
            <a-form-item label="站点:">
                <a-select v-model:value="state.site" placeholder="请选择站点" style="width: 352px" :options="siteOptions"
                    allowClear>
                </a-select>
            </a-form-item>
            <a-form-item label="产品分类:">
                <a-select v-model:value="state.classify" placeholder="请先选择站点" style="width: 352px"
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
                        <a-select-option value="2">变种最小库存</a-select-option>
                    </a-select>
                </template>
                <a-input-number v-model:value="state.promotionalPrices" placeholder=""
                    style="width: 170px"></a-input-number>
                -
                <a-input-number v-model:value="state.promotionalPricesEnd" placeholder=""
                    style="width: 170px"></a-input-number>
            </a-form-item>

            <a-form-item label="预售:">
                <a-select v-model:value="state.classify" placeholder="请先选择站点" style="width: 352px" allowClear>
                    <a-select-option value="1">已开启预售</a-select-option>
                    <a-select-option value="2">未开启预售</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="备注:">
                <a-select v-model:value="state.stockType" allowClear>
                    <a-select-option value="1">有备注</a-select-option>
                    <a-select-option value="2">无备注</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="六合一发布:">
                <a-select v-model:value="state.stockType" allowClear>
                    <a-select-option value="1">六合一发布异常（无产品id）</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item>
                <template #label>
                    <a-select v-model:value="state.stockType">
                        <a-select-option value="1">更新时间</a-select-option>
                        <a-select-option value="2">创建时间</a-select-option>
                    </a-select>
                </template>
                <a-range-picker allowClear v-model:value="state.date" :format="dateFormat"
                    style="width: 352px"></a-range-picker>
            </a-form-item>

            <a-form-item label="">
                <div class="flex justify-end">
                    <a-button type="link" @click="cancel">取消</a-button>
                    <a-button type="link" @click="reset">重置</a-button>
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
const { state, reset } = useResetReactive({
    site: undefined,
    price: undefined,
    priceEnd: undefined,
    promotionalPrices: undefined,
    promotionalPricesEnd: undefined,
    stockType: '1',
    date: [
        // dayjs('2015/01/01', dateFormat),
        // dayjs('2015/01/01', dateFormat),
    ]
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


const cancel = () => {
    visible.value = false;
    reset();
};
const search = () => {
    console.log(state);
};

</script>

<style lang="less" scoped></style>