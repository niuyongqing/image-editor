<template>
    <div>
        <BaseModal title="Lazada店铺账号密码" v-model:open="dialogVisible" width="600px" @cancel="handleClose" :footer="null">
            <a-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-col="{ span: 6 }"
                :wrapper-col="{ span: 14 }">
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
import { lazadaLoginView } from '@/api/platformApi/lazada/empower';

const props = defineProps({
    resetSetMenu: {
        type: String,
        default: '',
    },
});

const loading = ref(false);
const dialogVisible = ref(false);
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

const detailInfo = (e) => {
    loading.value = true;
    lazadaLoginView({ shortCode: e }).then((response) => {
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
    dialogVisible.value = false;
};

const open = (e) => {
    dialogVisible.value = true;
    detailInfo(e)
};

</script>

<style scoped>
.dialog-footer {
    text-align: right;
}
</style>