<template>
    <div>
        <BaseModal title="密码验证" @register="register" @close="cancel" @submit="submit" width="600px"
            :submitBtnLoading="submitBtnLoading">
            <a-form :label-col="{ style: { width: '80px' } }" :wrapper-col="{ style: { width: '200px' } }"
                labelAlign="left" placeholder="请输入ERP密码验证" ref="formRef" :model="form">
                <a-form-item label="ERP密码" name="password" :rules="[{ required: true, message: '请输入ERP密码验证' }]">
                    <a-input v-model:value="form.password"></a-input>
                </a-form-item>
            </a-form>
        </BaseModal>
    </div>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { InputPassword, message } from 'ant-design-vue';
import { loginPowerVerify } from '@/pages/lazada/empower/api';
import { Modal } from 'ant-design-vue';
const emits = defineEmits(['success']);
const form = reactive({
    password: ''
})

const submitBtnLoading = ref(false);
const formEl = useTemplateRef('formRef');

const modalMethods = ref();

const register = (methods) => {
    modalMethods.value = methods
};
const cancel = () => {
    form.password = '';
};

const open = async () => {
    submitBtnLoading.value = false;
    modalMethods.value.openModal();
};

const submit = async () => {
    if (!form.password) {
        message.error('请输入ERP密码验证');
        return
    };
    await formEl.value?.validate();
    loginPowerVerify({ password: form.password }).then((res) => {
        if (res.data === true) {
            emits('success');
            message.success('验证成功');
            submitBtnLoading.value = false;
            modalMethods.value.closeModal();
        } else {
            Modal.confirm({
                title: '验证失败',
                content: '验证失败,请重新验证!',
                okText: '重新验证',
                cancelText: '取消',
                cancelButtonProps: { style: { display: 'none' } },
            });
        }
    })
};

defineExpose({
    open
});
</script>

<style lang="less" scoped></style>