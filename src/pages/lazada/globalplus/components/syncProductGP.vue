<template>
    <div>
        <BaseModal title="同步" @register="register" @close="cancel" @submit="submit" :submitBtnLoading="submitBtnLoading"
            width="550px" style="top: 20px">
            <a-card ::bordered="false" style="margin-right: 5px; overflow-y: auto">
                <template #title>
                    <div class="clearfix">
                        <span>注意：</span>
                        <span style="margin-left: 30px; color: #9e9f9e; font-size: 12px">
                            信息<span style="color: red">必填</span>
                        </span>
                    </div>
                </template>
                <div>
                    <a-form layout="inline" ref="formRef" :model="formData" class="form-padding"
                        :labelCol="{ width: '80px' }" :wrapperCol="{ width: '100px' }">
                        <a-form-item name="shortCode" label="店铺："
                            :rules="[{ required: true, message: '请选择店铺', trigger: ['change'] }]">
                            <a-select v-model:value="formData.shortCode" placeholder="店铺" allowClear
                                style="width: 150px;">
                                <a-select-option v-for="item in account" :key="item.shortCode" :value="item.shortCode">
                                    {{ item.alias ? item.alias : item.simpleName }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item name="type" label="类型："
                            :rules="[{ required: true, message: '请选择店铺', trigger: ['change'] }]">
                            <a-select v-model:value="formData.type" placeholder="状态" allowClear style="width: 150px;">
                                <a-select-option value="global">global(全球)</a-select-option>
                                <a-select-option value="single">single(站点)</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-form>
                </div>
            </a-card>
        </BaseModal>
        <!-- 进度条 -->
        <syncProductProgress v-model:open="openProgress" v-model:percent="percent"></syncProductProgress>
    </div>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { message } from "ant-design-vue";
import { getNoFeePriceApi, productUpgrade, syncProductGP } from '@/pages/lazada/globalplus/api';
import syncProductProgress from '@/pages/lazada/globalplus/components/syncProductProgress.vue';

const { account } = defineProps({
    account: {
        type: Array,
        default: () => []
    }
});
const openProgress = ref(false);
const percent = ref(0);

const formEl = useTemplateRef('formRef');
const rowData = ref({
    skus: []
});
const formData = reactive({
    shortCode: undefined,
    type: undefined,
});
const modalMethods = ref();
const submitBtnLoading = ref(false);
const register = (methods) => {
    modalMethods.value = methods
};
const open = (row) => {
    rowData.value = row;
    modalMethods.value.openModal();
};
const cancel = (data) => {
    submitBtnLoading.value = false;
};
const submit = async () => {
    formEl.value.validate().then(async () => {
        submitBtnLoading.value = true;
        syncProductGP(formData.shortCode, formData.type).then(res => {
            if (res.code === 200) {
                modalMethods.value.closeModal();
            }
        }).catch(() => {
            message.error('同步失败')
        }).finally(() => {
            submitBtnLoading.value = false;
        });
    })
};

const emits = defineEmits(['success']);
defineExpose({
    open
})
</script>

<style lang="less" scoped>
.required {
    color: #f40;
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>