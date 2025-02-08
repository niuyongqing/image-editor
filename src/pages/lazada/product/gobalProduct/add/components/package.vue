<template>
    <div class="mt-10px">
        <!-- 包装信息 -->
        <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
            <template #title>
                <div text-left> 包装信息 </div>
            </template>
            <a-form :model="state" :label-col="{ style: { width: '80px' } }" style="margin-left: 100px;" ref="formRef"
                scrollToFirstError>
                <a-form-item label="税: " name="taxClass"
                    :rules="[{ required: true, message: '请选择税', trigger: ['change'] }]">
                    <a-select v-model:value="state.taxClass" placeholder="请选择税" allowClear class="flex justify-start"
                        :options="taxClassOptions" style="width: 150px;">
                    </a-select>
                </a-form-item>
                <a-form-item label="包装重量: " name="packageWeight"
                    :rules="[{ required: true, message: '请输入包装重量', trigger: ['change'] }]">
                    <div class="flex">
                        <a-input-number placeholder="请输入包装重量" v-model:value="state.packageWeight" :precision="2"
                            addon-after="Kg" :controls="false"></a-input-number>
                    </div>
                </a-form-item>
                <a-form-item label="包装尺寸: " name="package" :rules="packageRules">
                    <div class="flex gap-10px items-center">

                        <a-input-number placeholder="长" v-model:value="state.packageLength" addon-after="cm"
                            :precision="2" :controls="false"></a-input-number>

                        <a-input-number placeholder="宽" v-model:value="state.packageWidth" addon-after="cm"
                            :precision="2" :controls="false"></a-input-number>

                        <a-input-number placeholder="高" v-model:value="state.packageHeight" addon-after="cm"
                            :precision="2" :controls="false"></a-input-number>
                    </div>
                </a-form-item>

                <a-form-item label="包装内容:" name="packageContent">
                    <a-textarea v-model:value="state.packageContent" placeholder="请输入包装内容" allow-clear showCount
                        :maxlength="1000" />
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup>
import { DownOutlined } from "@ant-design/icons-vue";
import { useResetReactive } from '@/composables/reset';
import { accountCache, categoryTree, getBrandList } from '@/pages/lazada/product/api';
import EventBus from "~/utils/event-bus";
import { message } from "ant-design-vue";
import { useLazadaGobalAttrs } from "~@/stores/lazadaGobalAttrs";

const shortCode = ref('');
const formEl = useTemplateRef('formRef');
const { state: lazadaAttrsState } = useLazadaGobalAttrs();
const { state } = useResetReactive({
    taxClass: 'default', // 税
    packageContent: '',
    packageWeight: undefined,
    packageLength: undefined,
    packageWidth: undefined,
    packageHeight: undefined,
});

// 税列表
const taxClassOptions = computed(() => {
    return lazadaAttrsState.taxOptions.map(item => {
        return {
            label: item.en_name,
            value: item.en_name
        }
    })
});

const packageRules = [{
    required: true,
    validator: (rule, value) => {
        if (!state.packageLength || !state.packageWidth || !state.packageHeight) {
            return Promise.reject('请输入包装尺寸');
        }
        return Promise.resolve();
    },
}]

// 校验
const validateForm = async () => {
    return new Promise((resolve, reject) => {
        formEl.value.validate().then(() => {
            resolve(true);
        }).catch(() => {
            document.querySelector('.ant-form-item-has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            reject(false);
        })
    })
};
defineExpose({
    state,
    validateForm
});
</script>

<style lang="less" scoped>
:deep(.ant-form-item-explain-error) {
    text-align: left;
}
</style>