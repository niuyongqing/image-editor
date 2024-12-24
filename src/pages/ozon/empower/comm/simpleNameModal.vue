<template>
<div id="simpleNameModalCont">
    <a-modal :width="'30%'" title="批量修改简称" :open="editnameType" :keyboard="false" :maskClosable="false"
            @ok="uploadEditName" @cancel="handelCancel">
            <a-descriptions :column="1">
                <a-descriptions-item label="示范EXCEL">
                    <a-table :data-source="editWarehouseTypeTableData" :pagination="false" :columns="editNameColumns"
                        style="width: 100%" bordered>
                    </a-table>
                </a-descriptions-item>
                <br />
                <a-descriptions-item label="文件">
                    <!-- :action="uploadFileUrl" -->
                    <a-upload style="display: inline-block; margin-left: 10px"  ref="upload"
                        :headers="headers" :before-upload="beforeUpload" @change="handleUploadShortCodeSuccess" accept=".xlsx, .xlsm, .xls"
                        :maxCount="1" v-model:file-list="fileList">
                        <a-button type="primary">选择EXCEL</a-button>
                    </a-upload>
                </a-descriptions-item>
            </a-descriptions>
        </a-modal>
</div>
</template>

<script setup name='simpleNameModal'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'

const props = defineProps({
    editnameType: Boolean,
});
const emit = defineEmits(["handelClose"]);
const fileList = ref([]);
const headers = {
    Authorization: "Bearer " + useAuthorization().value,
}
const uploadFileUrl = import.meta.env.VITE_APP_BASE_API + "/platform-ozon/platform/ozon/shop/import/simplename"
const editWarehouseTypeTableData = [
    {
        id: "SGLUDXFX",
        type: "总仓",
        simpleName: "Ozon-01",
    },
    {
        id: "PH7S3AAIT7",
        type: "馨拓靓仓(配饰,服饰类)",
        simpleName: "Lazada-02",
    },
    {
        id: "VN33W6PCLA",
        type: "菲律宾本土仓",
        simpleName: "Ozon-03",
    },
    {
        id: "TH1JHP5KFZ",
        type: "馨拓美仓(美妆类)",
        simpleName: "Ozon-04",
    },
    {
        id: "MY4N9VN6K5",
        type: "馨拓美仓(3C类)",
        simpleName: "Ozon-05",
    },
    {
        id: "ID67XMZSDR",
        type: "馨拓美仓(汽摩配类)",
        simpleName: "Ozon-06",
    },
]
const editNameColumns = [
    {
        title: '账号Code',
        dataIndex: 'id',
        key: 'id',
        align: "center"
    },
    {
        title: '简称',
        dataIndex: 'simpleName',
        key: 'simpleName',
        align: "center"
    },
]

const beforeUpload = file => {
  fileList.value = [...(fileList.value || []), file];
  return false;
};

// 上传修改简称
const handleUploadShortCodeSuccess = (res, file) => {
    console.log('s',res, file);
    if (res.file.status === 'done') {
        message.success("上传成功！");
        emit("handelClose")
        upload.value.handleRemove(file);
    } else if (res.file.status === 'error') {
        message.error("上传有误，请重新上传");
    }
    
}
const uploadEditName = () => {
    console.log('upload', upload.value);

}
const handelCancel = () => {
    emit("handelClose")
}
</script>
<style lang="less" scoped>

</style>