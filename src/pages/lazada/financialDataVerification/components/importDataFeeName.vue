<template>
    <div>
        <BaseModal @register="register" @close="cancel" title="导入费用明细表" width="800px" @submit="submit"
            :submitBtnLoading="submitBtnLoading">
            <a-card style="margin-right: 5px; overflow-y: auto" bordered>
                <template #title>
                    <div class="clearfix">
                        <span>注意：</span>
                        <span style="margin-left: 30px;color: #9e9f9e;font-size: 12px">所上传的文件格式必须为<span
                                style="color: red">xls、xlsx格式</span></span>
                        <div style="color: orange">导入成功后由于数据量巨大,稍后刷新列表后显示 ,请耐心等待!</div>
                    </div>
                </template>
                <div>
                    <div style="margin-top: 10px;">
                        <div style="margin-top: 20px;">
                            <span style="display: inline-block;">
                                <a-upload style="display: inline-block; margin-left: 10px" ref="uploadRef"
                                    :before-upload="beforeUpload" :headers="headers" accept=".xls,.xlsx" :maxCount="1"
                                    v-model:fileList="fileList" @change="change">
                                    <a-button type="primary">
                                        <template #icon>
                                            <CloudUploadOutlined />
                                        </template>
                                        上传文件</a-button>
                                </a-upload>
                            </span>
                        </div>
                    </div>
                </div>
            </a-card>
        </BaseModal>
    </div>
</template>

<script setup>
import { CloudUploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { uploadFeeName } from '@/pages/lazada/financialDataVerification/api';
const headers = computed(() => {
    return {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + useAuthorization().value
    }
});
const submitBtnLoading = ref(false);
const fileList = ref([]);
const modalMethods = ref();
const register = (modal) => {
    modalMethods.value = modal;
};

const open = () => {
    modalMethods.value.openModal();
};
const beforeUpload = file => {
    return false;
};
const change = (info) => {
    fileList.value = info.fileList;
}
const submit = () => {
    if (fileList.value.length == 0) {
        message.error('请上传文件');
        return;
    };
    submitBtnLoading.value = true;
    const formData = new FormData();
    formData.append('file', fileList.value[0].originFileObj);
    uploadFeeName(formData, headers)
        .then(res => {
            if (res.code === 200) {
                message.success(res.msg);
                fileList.value = [];
                modalMethods.value.closeModal();
            }
        })
        .finally(() => {
            submitBtnLoading.value = false;
        })
};

const cancel = () => {
    fileList.value = [];
};

defineExpose({
    open
});

</script>

<style scoped></style>