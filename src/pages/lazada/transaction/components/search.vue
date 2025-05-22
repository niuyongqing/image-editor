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
                <a-form-item label="SKU：">
                    <a-input v-model:value="formData.sellerSkus" placeholder="多个SKU请用逗号隔开" allowClear></a-input>
                </a-form-item>
                <a-form-item label="订单编号：">
                    <a-input v-model:value="formData.orderNo" placeholder="请输入订单编号" allowClear />
                </a-form-item>
                <a-form-item label="交易编号：">
                    <a-input v-model:value="formData.transactionNumber" placeholder="请输入交易编号" allowClear />
                </a-form-item>
                <a-form-item label="时间：">
                    <a-range-picker style="width: 220px" v-model:value="formData.time" @change="onSubmit"
                        :format="dateFormat" />
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
import dayjs from 'dayjs';
const props = defineProps({
    shop: {
        type: Array,
        default: () => [],
    },
});
const emits = defineEmits(['search']);
const dateFormat = ['YYYY-MM-DD', 'YYYY-MM-DD'];
const { state: formData, reset } = useResetReactive({
    "simpleName": "",
    "county": undefined,
    "sellerSkus": undefined,
    "orderNo": undefined,
    "sellerId": undefined,
    transactionNumber: '',
    time: []
})


const onSubmit = () => {
    const startTime = formData.time[0] ? formData.time[0].format('YYYY-MM-DD 00:00:00') : '';
    const endTime = formData.time[1] ? formData.time[1].format('YYYY-MM-DD 23:59:59') : '';
    emits('search', {
        "simpleName": formData.simpleName,
        "country": formData.county,
        sellerSkus: formData.sellerSkus,
        "sellerId": formData.sellerId,
        transactionNumber: formData.transactionNumber,
        startTime,
        endTime: endTime
    });
};
const resetForm = () => {
    reset();
    onSubmit();
};

onMounted(() => {
    formData.time = [
        dayjs().startOf('day'),
        dayjs().endOf('day'),
    ];
    onSubmit()
})

defineExpose({
    formData
})
</script>

<style lang="less" scoped></style>