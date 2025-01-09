<template>
    <div>
        <a-card style="margin-top: 0; padding: 0">
            <a-form layout="inline" ref="ruleForm" :model="formData" class="form-padding" :label-col="{ span: 6 }"
                :wrapper-col="{ span: 14 }">
                <a-form-item label="店铺简称：" name="simpleName">
                    <a-input v-model:value="formData.simpleName" placeholder="请输入店铺简称" allowClear />
                </a-form-item>
                <a-form-item label="站点：" name="county">
                    <a-select v-model:value="formData.county" allowClear>
                        <a-select-option value="ID">ID</a-select-option>
                        <a-select-option value="MY">MY</a-select-option>
                        <a-select-option value="PH">PH</a-select-option>
                        <a-select-option value="SG">SG</a-select-option>
                        <a-select-option value="TH">TH</a-select-option>
                        <a-select-option value="VN">VN</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="SKU：" name="sellerSkus">
                    <a-input v-model:value="formData.sellerSkus" placeholder="多个SKU请用逗号隔开" allowClear />
                </a-form-item>
                <a-form-item label="订单编号：" name="orderNo">
                    <a-input v-model:value="formData.orderNo" placeholder="请输入订单编号" allowClear />
                </a-form-item>
                <a-form-item label="交易编号：" name="transactionNumber">
                    <a-input v-model:value="formData.transactionNumber" placeholder="请输入交易编号" allowClear />
                </a-form-item>
                <a-form-item label="时间：" name="time">
                    <a-range-picker style="width: 198px" v-model:value="formData.time" showTime
                        format="YYYY-MM-DD HH:mm:ss" @change="onSubmit" />
                </a-form-item>

                <a-form-item>
                    <a-button type="primary" @click="onSubmit">查询</a-button>
                    <a-button @click="resetForm">重置</a-button>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { debounce } from 'lodash';
import { formatDate } from '@/utils';

const props = defineProps({
    resetSetMenu: {
        type: String,
        default: '',
    },
    shop: {
        type: Array,
        default: () => [],
    },
    searchData: {
        type: Object,
        default: () => ({}),
    },
});

const defaultDate = [
    formatDate(new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate(), 0, 0, 0)), // 当前日期
    formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59)),
];

const formData = ref({
    pageNum: 1,
    pageSize: 50,
    prop: 'create_time',
    order: 'desc',
    simpleName: '',
    county: '',
    shortCode: '',
    orderNo: '',
    transactionNumber: '',
    time: [
        formatDate(new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate(), 0, 0, 0)), // 当前日期
        formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59)),
    ],
    startTime: '',
    endTime: '',
    sellerSkus: '',
});

const onSubmit = debounce(() => {
    formData.value.pageNum = props.searchData.pageNum;
    formData.value.pageSize = props.searchData.pageSize;

    // 开始结束时间
    if (formData.value.time !== null && formData.value.time !== '') {
        formData.value.startTime = formData.value.time[0];
        formData.value.endTime = formData.value.time[1];
    } else {
        formData.value.startTime = '';
        formData.value.endTime = '';
    }
    emit('requestParams', formData.value);
}, 300);

const resetForm = () => {
    formData.value = {
        pageNum: 1,
        pageSize: 50,
        prop: 'create_time',
        order: 'desc',
        shortCode: '',
        orderNo: '',
        transactionNumber: '',
        time: [],
        simpleName: '',
        county: '',
        startTime: '',
        endTime: '',
    };
    onSubmit();
};
</script>

<style lang="less" scoped>
.page-wrapper {
    width: 80px;
    height: 80px;
    opacity: 0.8;
    transition: all 0.3s;
    margin-left: 300px;
    margin-top: -30px;
    justify-content: right;
    align-items: end;
}

.form-padding {
    padding-top: 0px;

    .ant-form-item {
        margin-bottom: 10px;
    }
}
</style>