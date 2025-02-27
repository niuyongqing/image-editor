<template>
    <div>
        <a-card style="margin-top: 0; padding: 0">
            <a-form layout="inline" ref="ruleForm2" :model="formData">
                <a-form-item label="月份：" name="month" :label-col="{ width: '100px' }" :wrapper-col="{ width: '200px' }">
                    <a-date-picker v-model:value="formData.month" picker="month" placeholder="选择月" format="YYYY-MM"
                        style="width: 200px" @change="onSubmit" />
                </a-form-item>
                <a-form-item label="交易状态：" name="settleOrNot">
                    <a-select v-model:value="formData.settleOrNot" placeholder="请选择交易状态" allowClear
                        style="width: 200px">
                        <a-select-option value="是">是</a-select-option>
                        <a-select-option value="否">否</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="操作类型：" name="action">
                    <a-select v-model:value="formData.action" placeholder="请选择" allowClear style="width: 200px">
                        <a-select-option value="失败">失败</a-select-option>
                        <a-select-option value="导入">导入</a-select-option>
                        <a-select-option value="同步">同步</a-select-option>
                        <a-select-option value="导出">导出</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="操作时间：" name="createTime">
                    <a-range-picker v-model:value="formData.createTime" format="YYYY-MM-DD" style="width: 220px" />
                </a-form-item>
                <a-form-item label="模糊查询：">
                    <a-space>
                        <a-form-item name="puyuanOrderNo">
                            <a-input v-model:value="formData.puyuanOrderNo" placeholder="订单编号" allowClear />
                        </a-form-item>
                        <a-form-item name="accountName">
                            <a-input v-model:value="formData.accountName" placeholder="店铺名称" allowClear />
                        </a-form-item>
                        <a-form-item name="optUserName">
                            <a-input v-model:value="formData.optUserName" placeholder="操作人" allowClear />
                        </a-form-item>
                    </a-space>
                </a-form-item>
                <a-form-item>
                    <a-space>
                        <a-button type="primary" @click="onSubmit">查询</a-button>
                        <a-button @click="resetForm">重置</a-button>
                    </a-space>
                </a-form-item>
            </a-form>
            <a-alert :closable="false" show-icon type="warning" style="margin-top: 10px;">
                <template #message>
                    <span style="color: #E6A23C"> {{ alertTitle }}</span>
                </template>
            </a-alert>
        </a-card>
    </div>
</template>

<script setup>
import { debounce } from 'lodash';
import dayjs from 'dayjs';
const emits = defineEmits(['search']);
const status = ref(null);
const alertTitle = `注意：
  1、点击“同步”按钮前，请先导入 “普元订单数据”、“费用名称维度表”
  2、因待导入的普元数据量较大，请耐心等待导入完成
  3、导入时间与同步时间较长，请耐心等待进度条完成
  4、导出数据时，请先选择月份再导出`;

const formData = ref({
    month: dayjs(),
    accountName: '',
    puyuanOrderNo: '',
    settleOrNot: undefined,
    createTime: [],
    createTimeStart: '',
    createTimeEnd: '',
    action: undefined,
    optUserName: '',
});


const sendMsg = () => {
    emits('search', {
        month: formData.value.month.format('YYYYMM'),
        accountName: formData.value.accountName,
        puyuanOrderNo: formData.value.puyuanOrderNo,
        settleOrNot: formData.value.settleOrNot,
        createTimeStart: formData.value.createTimeStart,
        createTimeEnd: formData.value.createTimeEnd,
        action: formData.value.action,
        optUserName: formData.value.optUserName,
    });
}
const onSubmit = debounce(() => {
    formData.value.pageNum = 1;
    if (formData.value.createTime && formData.value.createTime.length) {
        formData.value.createTimeStart = formData.value.createTime[0].format('YYYY-MM-DD 00:00:00')
        formData.value.createTimeEnd = formData.value.createTime[1].format('YYYY-MM-DD 23:59:59')
    } else {
        formData.value.createTimeStart = '';
        formData.value.createTimeEnd = '';
    }
    sendMsg();
}, 500);


const resetForm = () => {
    formData.value = {
        month: dayjs(),
        accountName: '',
        puyuanOrderNo: '',
        settleOrNot: '',
        createTime: [],
        createTimeStart: '',
        createTimeEnd: '',
        action: '',
        optUserName: '',
    };
    sendMsg();
    onSubmit();
};

onMounted(() => {
    emits('send', {
        month: formData.value.month.format('YYYYMM'),
        accountName: formData.value.accountName,
        puyuanOrderNo: formData.value.puyuanOrderNo,
        settleOrNot: formData.value.settleOrNot,
        createTimeStart: formData.value.createTimeStart,
        createTimeEnd: formData.value.createTimeEnd,
        action: formData.value.action,
        optUserName: formData.value.optUserName,
    });
})
</script>