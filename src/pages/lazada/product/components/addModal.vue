<template>
    <div>
        <BaseModal title="新增" @register="register" @close="cancel" @submit="submit"
            :submitBtnLoading="submitBtnLoading">
            <BaseForm ref="baseFormRef" :formList="formList" :label-col="{ style: { width: '80px' } }"
                :wrapper-col="{ style: { width: '200px' } }" labelAlign="left">

            </BaseForm>
        </BaseModal>
    </div>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import BaseForm from '@/components/baseForm/BaseForm.vue';
import { useFormList } from './formList';
import { addAccount } from '../api';
import { message } from "ant-design-vue";

const baseFormEl = useTemplateRef('baseFormRef')
const modalMethods = ref();
const { formList } = useFormList()
const submitBtnLoading = ref(false);
const register = (methods) => {
    modalMethods.value = methods
};
const open = () => {
    modalMethods.value.openModal();
    nextTick(() => {
        baseFormEl.value.setFieldValue('platform', 'Lazada')
    })
};
const cancel = (data) => {
    submitBtnLoading.value = false;
    baseFormEl.value.reset()
};

const submit = async () => {
    await baseFormEl.value.validate();
    submitBtnLoading.value = true;
    const values = baseFormEl.value.getFieldsValue();
    const depId = values.depId && values.depId[values.depId.length - 1];
    const params = {
        platform: values.platform,
        depId,
        userId: values.userId.join(','),
        account: values.account.join(',')
    };
    addAccount(params).then((res) => {
        if (res.code == 200) {
            modalMethods.value.closeModal()
            message.success(res.msg);
            emits('success')
            submitBtnLoading.value = false;
        }
    })
};

const emits = defineEmits(['success']);
defineExpose({
    open
})
</script>

<style lang="less" scoped></style>