<template>
    <div>
        <a-card>
            <a-form ref="baseFormRef" layout="inline" :formList="formList" :label-col="{ style: { width: '80px' } }"
                :wrapper-col="{ style: { width: '220px' } }" labelAlign="left">
                <a-form-item label="店铺：">
                    <a-select style="width: 220px" v-model:value="state.shortCode" placeholder="请选择店铺" allow-clear>
                        <a-select-option v-for="item in account" :key="item.shortCode" :value="item.shortCode"
                            :field-names="{ label: 'simpleName', value: 'shortCode' }">
                            <div flex justify-between>
                                <div> {{ item.simpleName }} </div>
                                <div style="color: rgb(132, 146, 166)"> {{ item.country }} </div>
                            </div>
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="状态：">
                    <a-select v-model:value="state.status" placeholder="请选择状态" allow-clear>
                        <a-select-option value="NOT_START">未开始</a-select-option>
                        <a-select-option value="ONGOING">进行中</a-select-option>
                        <a-select-option value="SUSPEND">暂停</a-select-option>
                        <a-select-option value="FINISH">已过期</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="活动名称：">
                    <a-input style="width: 220px" placeholder="请输入" v-model:value="state.name" allow-clear />
                </a-form-item>
                <a-form-item label="活动ID:">
                    <a-input style="width: 220px" placeholder="多个活动ID用逗号隔开" v-model:value="state.ids" allow-clear />
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

const shortCode = ref('');
const { state, reset } = useResetReactive({
    shortCode: undefined,
    name: '',
    status: undefined,
    ids: ''
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
        shortCode.value = val[0]?.shortCode;
        emits('search', { shortCode: state.shortCode });
    } else {
        state.shortCode = undefined
    }
});

const submit = () => {
    emits('search', {
        shortCode: state.shortCode,
        status: state.status,
        name: state.name,
        ids: state.ids
    });
};
const handleReset = () => {
    reset();
    state.shortCode = shortCode.value;
    emits('search', {
        shortCode: shortCode.value,
        voucherName: '',
        status: undefined,
        periodStartTimeEnd: undefined,
        periodStartTimeStart: undefined
    });
};
const emits = defineEmits(['search'])

</script>