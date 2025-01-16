<template>
    <div>
        <BaseModal title="Lazada店铺账号密码" @register="register" ref="baseModalRef" width="600px" @cancel="handleClose"
            :footer="null">
            <a-form :model="ruleForm" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
                <a-form-item label="店铺ID" name="shortCode">
                    <a-input v-model:value="ruleForm.shortCode" disabled />
                </a-form-item>
                <a-form-item label="登录账号" name="loginAccount">
                    <a-input v-model:value="ruleForm.loginAccount" disabled />
                </a-form-item>
                <a-form-item label="登录密码" name="loginPassword">
                    <a-input v-model:value="ruleForm.loginPassword" disabled />
                </a-form-item>
                <a-form-item label="邮箱Code" name="emailCode">
                    <a-input v-model:value="ruleForm.emailCode" disabled />
                </a-form-item>
            </a-form>
            <div class="dialog-footer" style="text-align: right;">
                <a-button @click="handleClose">取 消</a-button>
            </div>
        </BaseModal>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { lazadaLoginView } from '@/pages/lazada/empower/api';
import BaseModal from '@/components/baseModal/BaseModal.vue';
const loading = ref(false);
const modalMethods = ref();

const register = (methods) => {
    modalMethods.value = methods
};
const ruleForm = ref({
    shortCode: '',
    loginAccount: '',
    loginPassword: '',
    emailCode: '',
});
const rules = ref({
    shortCode: [{ required: true, message: '请输入', trigger: 'blur' }],
    loginAccount: [{ required: true, message: '请输入', trigger: 'blur' }],
    loginPassword: [{ required: true, message: '请输入', trigger: 'blur' }],
    emailCode: [{ required: true, message: '请输入', trigger: 'blur' }],
});

const detailInfo = (code) => {
    loading.value = true;
    lazadaLoginView({ shortCode: code }).then((response) => {
        if (response.code === 200) {
            ruleForm.value.shortCode = response.data.shortCode;
            ruleForm.value.loginAccount = response.data.loginAccount;
            ruleForm.value.loginPassword = response.data.loginPassword;
            ruleForm.value.emailCode = response.data.emailCode;
        }
    }).finally(() => {
        loading.value = false;
    });
};

const handleClose = () => {
    ruleForm.value = {
        shortCode: '',
        loginAccount: '',
        loginPassword: '',
        emailCode: '',
    };
    modalMethods.value.closeModal()
};

const open = (shortCode) => {
    modalMethods.value.openModal()
    detailInfo(shortCode)
};
defineExpose({
    open
})
</script>