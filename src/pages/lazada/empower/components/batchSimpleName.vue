<template>
    <div>
        <BaseModal title="批量修改简称" @register="register" @close="cancel" @submit="submit" width="600px"
            :submitBtnLoading="submitBtnLoading">
            <a-form :label-col="{ style: { width: '80px' } }" :wrapper-col="{ style: { width: '200px' } }"
                labelAlign="left">
                <a-form-item label="示范EXCEL" name="simpleName" rules="required">
                    <a-table :dataSource="dataSource" :columns="columns" bordered :pagination="false">

                    </a-table>
                </a-form-item>
                <a-form-item label="文件" name="simpleName" rules="required">
                    <a-upload style="display: inline-block; margin-left: 10px" :action="uploadFileUrl" ref="uploadRef"
                        :before-upload="beforeUpload" :headers="headers" accept=".xlsx, .xlsm, .xls" :maxCount="1"
                        :fileList="fileList" @change="change">
                        <a-button type="primary">
                            <template #icon>
                                <CloudUploadOutlined />
                            </template>
                            选择EXCEL</a-button>
                    </a-upload>
                </a-form-item>
            </a-form>
        </BaseModal>
    </div>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { CloudUploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import axios from 'axios';

const dataSource = [{
    id: 'SGLUDXFX',
    type: '总仓',
    simpleName: "Lazada-01",
}, {
    id: 'PH7S3AAIT7',
    type: '馨拓靓仓(配饰,服饰类)',
    simpleName: "Lazada-02",
}, {
    id: 'VN33W6PCLA',
    type: '菲律宾本土仓',
    simpleName: "Lazada-03",
}, {
    id: 'TH1JHP5KFZ',
    type: '馨拓美仓(美妆类)',
    simpleName: "Lazada-04",
}, {
    id: 'MY4N9VN6K5',
    type: '馨拓美仓(3C类)',
    simpleName: "Lazada-05",
}, {
    id: 'ID67XMZSDR',
    type: '馨拓美仓(汽摩配类)',
    simpleName: "Lazada-06",
}];
const columns = [
    {
        title: "ShortCode",
        dataIndex: "id",
        key: "id",
        align: "center"
    },
    {
        title: "简称",
        dataIndex: "simpleName",
        key: "simpleName",
        align: "center"
    },
];
const submitBtnLoading = ref(false);// 提交按钮loading
const uploadFileUrl = import.meta.env.VITE_APP_BASE_API + '/platform-lazada/platform/lazada/empower/import-simple';
const fileList = ref([]);
const hearers = computed(() => {
    return {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + useAuthorization().value
    }
});
const uploadEl = useTemplateRef('uploadRef');
const beforeUpload = file => {
    fileList.value = [...(fileList.value || []), file];
    return false;
};

const modalMethods = ref();

const register = (methods) => {
    modalMethods.value = methods
};

const cancel = (data) => {
    fileList.value = [];
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

    axios.post(uploadFileUrl, formData, {
        headers: hearers.value,
    })
        .then((res) => {
            if (res.data.code == 200) {
                message.success(res.data.msg);
                emits('success')
            } else {
                message.error(res.data.msg);
            }
        }).finally(() => {
            submitBtnLoading.value = false;
            fileList.value = [];
            modalMethods.value.closeModal();
        })
};
const open = () => {
    submitBtnLoading.value = false;
    modalMethods.value.openModal();
};
const emits = defineEmits(['success']);
defineExpose({
    open
})

</script>