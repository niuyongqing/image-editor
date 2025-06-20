<template>
    <div>
        <a-card>
            <a-form :layout="'inline'" :label-col="{ style: { width: '80px' } }"
                :wrapper-col="{ style: { width: '200px' } }" labelAlign="left">
                <a-form-item label="SKU：">
                    <a-input placeholder="SKU" v-model:value="state.sellerSku"></a-input>
                </a-form-item>
                <a-form-item label="店铺：">
                    <a-select v-model:value="state.shortCode" placeholder="店铺" allowClear>
                        <a-select-option v-for="item in account" :key="item.shortCode" :value="item.shortCode">{{
                            item.alias ? item.alias : item.simpleName }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="类型：">
                    <a-select v-model:value="state.type" placeholder="类型" allowClear>
                        <a-select-option value="global"> global(全球) </a-select-option>
                        <a-select-option value="single"> single(站点) </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" @click="submit" htmlType="submit" :loading="loading">查询</a-button>
                    <a-button style="margin-left: 10px" @click="handleReset">重置</a-button>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup>
import { useResetReactive } from '@/composables/reset';

const props = defineProps({
    account: {
        type: Array,
        default: () => []
    }
});

const baseFormEl = useTemplateRef('baseFormRef')

const loading = defineModel()
const { state, reset } = useResetReactive({
    sellerSku: "",
    type: 'global',
    shortCode: "",
});

const submit = () => {
    loading.value = true;
    emits('search', state);
};
const handleReset = () => {
    reset();
    emits('search', state);
};
const emits = defineEmits(['search'])

</script>

<style lang="less" scoped></style>