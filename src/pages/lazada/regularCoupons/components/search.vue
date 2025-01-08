<template>
    <div>
        <a-card>
            <a-form ref="baseFormRef" layout="inline" :formList="formList" :label-col="{ style: { width: '80px' } }"
                :wrapper-col="{ style: { width: '200px' } }" labelAlign="left">
                <a-form-item label="店铺：">
                    <a-select style="width: 200px" v-model:value="state.shortCode" placeholder="请选择店铺">
                        <a-select-option v-for="item in account" :key="item.value" :value="item.value">
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="优惠卷名称：">
                    <a-input style="width: 200px" placeholder="请输入优惠卷名称" v-model:value="state.voucherName" />
                </a-form-item>
                <a-form-item label="优惠券状态：">
                    <a-select v-model:value="state.status" placeholder="请选择优惠券状态">
                        <a-select-option value="NOT_START">未开始</a-select-option>
                        <a-select-option value="ONGOING">进行中</a-select-option>
                        <a-select-option value="SUSPEND">暂停</a-select-option>
                        <a-select-option value="FINISH">已过期</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="优惠券时间：">
                    <a-range-picker style="width: 210px" v-model:value="state.periodStartTime"
                        value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" />
                </a-form-item>
                <a-form-item label="">
                    <a-button type="primary" @click="submit">查询</a-button>
                    <a-button style="margin-left: 10px" type="default" @click="handleReset">重置</a-button>
                </a-form-item>
            </a-form>

        </a-card>
    </div>
</template>

<script setup>
import { useResetReactive } from '@/composables/reset';
import BaseForm from '@/components/baseForm/BaseForm.vue';

const { state, reset } = useResetReactive({
    shortCode: undefined,
    voucherName: '',
    status: undefined,
    periodStartTime: [],
});
const { account } = defineProps({
    account: {
        type: Array,
        default: () => []
    }
});
const baseFormEl = useTemplateRef('baseFormRef')

watch(() => account, (val) => {
    if (val && val.length > 0) {
        state.shortCode = val[0]?.shortCode;
        emits('search', { shortCode: state.shortCode });
    } else {
        state.shortCode = undefined
    }
});

const submit = () => {
    const values = baseFormEl.value.getFieldsValue();
    emits('search', values);
};
const handleReset = () => {
    baseFormEl.value.clear();
    const values = baseFormEl.value.getFieldsValue();
    emits('search', values);
};
const emits = defineEmits(['search'])

</script>