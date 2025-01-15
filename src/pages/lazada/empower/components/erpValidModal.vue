<template>
    <div>
        <BaseModal title="密码验证" @register="register" @close="cancel" @submit="submit" width="600px"
            :submitBtnLoading="submitBtnLoading">
            <a-form :label-col="{ style: { width: '80px' } }" :wrapper-col="{ style: { width: '200px' } }"
                labelAlign="left">
                <a-form-item name="simpleName" rules="required">
                    <a-input v-model:value="password"></a-input>
                </a-form-item>
            </a-form>
        </BaseModal>
    </div>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { InputPassword } from 'ant-design-vue';
import { loginPowerVerify } from '@/pages/lazada/empower/api';

const emits = defineEmits(['success']);
const password = ref('');
const submitBtnLoading = ref(false);
const modalMethods = ref();

const register = (methods) => {
    modalMethods.value = methods
};

const cancel = () => {

    modalMethods.value.closeModal();
};

const open = async () => {

    submitBtnLoading.value = false;
    modalMethods.value.openModal();
};

const submit = () => {
    loginPowerVerify({ password: password.value }).then((res) => {
        console.log('res ->>>>>', res);
    })
    emits('success');
};



defineExpose({
    open
})


</script>

<style lang="less" scoped></style>