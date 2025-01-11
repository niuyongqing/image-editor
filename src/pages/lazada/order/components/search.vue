<template>
    <div>
        <a-card>
            <a-form layout="inline" ref="ruleForm" :model="formData" :label-col="{ width: '100px' }"
                :wrapper-col="{ width: '200px' }">
                <a-form-item label="店铺简称：" name="simpleName">
                    <a-input v-model:value="formData.simpleName" placeholder="请输入店铺简称" allowClear />
                </a-form-item>
                <a-form-item label="站点：" name="county">
                    <a-select v-model:value="formData.county" style="width: 180px;" allowClear placeholder="请选择站点">
                        <a-select-option value="ID">ID</a-select-option>
                        <a-select-option value="MY">MY</a-select-option>
                        <a-select-option value="PH">PH</a-select-option>
                        <a-select-option value="SG">SG</a-select-option>
                        <a-select-option value="TH">TH</a-select-option>
                        <a-select-option value="VN">VN</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="店铺：" name="shortCode">
                    <a-select v-model:value="formData.sellerId" allowClear showSearch style="width: 180px;"
                        placeholder="请选择店铺">
                        <a-select-option v-for="item in shop" :key="item.sellerId" :value="item.sellerId">
                            {{ item.alias ? item.alias : item.simpleName }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="订单编号：" name="shortCode">
                    <a-input v-model:value="formData.orderId" placeholder="请输入订单编号" allowClear />
                </a-form-item>
                <a-form-item label="订单状态：">
                    <a-select v-model:value="formData.status" allowClear style="width: 180px;" placeholder="请选择订单状态">
                        <a-select-option v-for="item in status" :key="item" :value="item">
                            {{ item }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="下单时间：">
                    <a-range-picker style="width: 220px" v-model:value="formData.time" @change="onSubmit" />
                </a-form-item>

                <a-form-item name="description">
                    <a-space>
                        <a-button type="primary" @click="onSubmit">查询</a-button>
                        <a-button @click="resetForm">重置</a-button>
                    </a-space>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup>
import { useResetReactive } from '@/composables/reset';
import { ref } from 'vue';
import { debounce } from 'lodash';

const props = defineProps({
    shop: {
        type: Array,
        default: () => [],
    },
});
const emits = defineEmits(['search']);
const status = [
    'confirmed',
    'pending',
    'delivered',
    'returned',
    'canceled',
    'ready_to_ship',
    'packed',
    'ready_to_ship_pending',
    'shipped_back_success',
];
const { state: formData, reset } = useResetReactive({
    "simpleName": "",
    "county": undefined,
    "shortCode": "",
    "orderId": undefined,
    "sellerId": undefined,
    time: []
})


const onSubmit = () => {
    const startTime = formData.time[0] ? formData.time[0].format('YYYY-MM-DD 00:00:00') : '';
    const endTime = formData.time[1] ? formData.time[1].format('YYYY-MM-DD 23:59:59') : '';
    emits('search', {
        "simpleName": formData.simpleName,
        "county": formData.county,
        "orderId": formData.orderId,
        "sellerId": formData.sellerId,
        startTime,
        endTime: endTime
    });
};
const resetForm = () => {
    reset();
    onSubmit();
};

defineExpose({
    formData
})
</script>

<style lang="less" scoped></style>