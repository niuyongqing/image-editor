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
const shortCode = ref('');
const formEl = useTemplateRef('formRef');
const { state: lazadaAttrsState } = useLadazaAttrs();
const { state } = useResetReactive({
    taxClass: 'default', // 税
    packageContent: '',
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