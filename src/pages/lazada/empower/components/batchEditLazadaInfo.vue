<template>
    <div>
        <BaseModal title="批量修改Lazada店铺账号密码" @register="register" width="600px" @cancel="handleClose" @submit="submit"
            :footer="null">

            <a-steps direction="vertical" current="0">
                <a-step title="示例">
                    <template #description>
                        <a-table :columns="columns" :dataSource="dataArr" :pagination="false">
                        </a-table>
                    </template>
                </a-step>
                <a-step title="导出">
                    <template #description>
                        <span style="font-size: 15px; color: black;">
                            点击
                            <span style="font-size: 15px; color: orange; cursor: pointer;"
                                @click="exportFile">导出文件</span>
                            进行导出
                        </span>
                    </template>
                </a-step>
                <a-step title="导入">
                    <template #description>
                        <span style="font-size: 15px; color: black;">
                            把编辑好的
                            <span style="font-size: 15px; color: orange;">Excel</span>
                            进行导入
                            <a-upload style="display: inline-block; margin-left: 10px" :action="uploadFileUrl"
                                ref="uploadRef" :before-upload="beforeUpload" :headers="headers"
                                accept=".xlsx, .xlsm, .xls" :maxCount="1" v-model:fileList="fileList">
                                <a-button type="primary">
                                    <template #icon>
                                        <CloudUploadOutlined />
                                    </template>
                                    选择EXCEL</a-button>
                            </a-upload>
                        </span>
                    </template>
                </a-step>
            </a-steps>
            <div class="flex justify-end gap-10px">
                <a-button type="default" @click="handleClose">取消</a-button>
                <a-button type="primary" @click="submitUpload" :loading="loading">上传</a-button>
            </div>
        </BaseModal>
    </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { CloudUploadOutlined } from '@ant-design/icons-vue';
import { uploadBatchPasswordExcel } from '@/pages/lazada/empower/api';

const columns = [{
    title: 'ShortCode',
    dataIndex: 'a',
    key: 'a',
}, {
    title: '登录账号',
    dataIndex: 'b',
    key: 'b',
}, {
    title: '登录密码',
    dataIndex: 'c',
    key: 'c',
}, {
    title: '邮箱code',
    dataIndex: 'd',
    key: 'd',
}];
const dataArr = [{
    a: '***',
    b: '***',
    c: '***',
    d: '***'
}, {
    a: '***',
    b: '***',
    c: '***',
    d: '***'
}, {
    a: '***',
    b: '***',
    c: '***',
    d: '***'
}, {
    a: '***',
    b: '***',
    c: '***',
    d: '***'
},]

const emits = defineEmits(['success']);
const ruleFormEl = useTemplateRef('ruleFormRef');
const loading = ref(false);
const modalMethods = ref({});
const uploadFileUrl = import.meta.env.VITE_APP_BASE_API + '/platform-lazada/platform/lazada/empower/import-simple';
const fileList = ref([]);
const hearers = computed(() => {
    return {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + useAuthorization().value
    }
});
const register = (methods) => {
    modalMethods.value = methods
};
const handleClose = () => {
    fileList.value = [];
};

const open = (shortCode) => {
    modalMethods.value.openModal()
};

const beforeUpload = file => {
    return false;
};

const submitUpload = () => {
    loading.value = true;
    const formData = new FormData();
    formData.append('file', fileList.value[0].originFileObj);
    uploadBatchPasswordExcel(formData, hearers.value).then((res) => {
        if (res.code == 200) {
            message.success(res.msg);
            emits('success');
            modalMethods.value.closeModal()
        } else {
            message.error(res.data.msg);
        }
    }).finally(() => {
        loading.value = false;
    })
};
defineExpose({
    open
})
</script>
