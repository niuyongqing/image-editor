<template>
    <div>
        <BaseModal title="Lazada店铺账号密码" @register="register" width="600px" @cancel="handleClose" @submit="submit">
            <a-form :model="ruleForm" :rules="rules" ref="ruleFormRef" :label-col="{ span: 6 }"
                :wrapper-col="{ span: 14 }">
                <a-form-item label="店铺ID" name="shortCode">
                    <a-input v-model:value="ruleForm.shortCode" disabled />
                </a-form-item>
                <a-form-item label="登录账号" name="loginAccount">
                    <a-input v-model:value="ruleForm.loginAccount" />
                </a-form-item>
                <a-form-item label="登录密码" name="loginPassword">
                    <a-input v-model:value="ruleForm.loginPassword" />
                </a-form-item>
                <a-form-item label="邮箱Code" name="emailCode">
                    <a-input v-model:value="ruleForm.emailCode" />
                </a-form-item>
            </a-form>
        </BaseModal>
    </div>
</template>

<script setup>
import { lazadaLoginEdit, lazadaLoginView } from '@/pages/lazada/empower/api';
import { message } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';
import BaseModal from '@/components/baseModal/BaseModal.vue';

const emits = defineEmits(['success']);
const ruleFormEl = useTemplateRef('ruleFormRef');
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
});

const detailInfo = (code) => {
    loading.value = true;
    lazadaLoginView({ shortCode: code }).then((response) => {
        ruleForm.value.shortCode = response.data.shortCode;
        ruleForm.value.loginAccount = response.data.loginAccount;
        ruleForm.value.loginPassword = response.data.loginPassword;
        ruleForm.value.emailCode = response.data.emailCode;
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
};

const open = (shortCode) => {
    modalMethods.value.openModal()
    detailInfo(shortCode)
};

const submit = () => {
    ruleFormEl.value.validate().then(() => {
        lazadaLoginEdit(ruleForm.value).then((res) => {
            if (res.code === 200) {
                message.success('修改成功');
                handleClose();
                emits('success');
            }
        });
    })
};
defineExpose({
    open
})
</script>

<style scoped>
.dialog-footer {
    text-align: right;
}
</style>