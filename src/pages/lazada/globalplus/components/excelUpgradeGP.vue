<template>
    <div>
        <BaseModal title="Global Plus 商品升级" @register="register" @close="cancel" @submit="submit"
            :submitBtnLoading="submitBtnLoading" width="60%" style="top: 20px">

            <div style="height: 200px;">
                <a-steps direction="vertical" :current="active">
                    <a-step title="步骤 1：导出">
                        <template #description>
                            <a-button type="link" @click="copyData" style="color: orange; font-size: 15px"
                                v-has-permi="['platform:lazada:gp:product:export']">导出</a-button>
                            <span style="font-size: 15px; color: black">导出表格之前必须现在主页面搜索出来数据,方可导出EXCEL</span>
                        </template>
                    </a-step>
                    <a-step title="步骤 2：导入">
                        <template #description>
                            <span style="font-size: 15px; color: black">把导出好的 <span
                                    style="font-size: 15px; color: orange">Excel</span> 进行编辑再进行导入</span>
                            <a-upload ref="upload" list-type="text" :action="url" :file-list="fileList"
                                :headers="header" :on-success="successFun" :auto-upload="false" accept=".xlsx"
                                :limit="1">
                                <a-button size="small" type="primary"
                                    v-has-permi="['platform:lazada:gp:product:importUpgrade']">选取文件</a-button>
                            </a-upload>
                        </template>
                    </a-step>
                </a-steps>
            </div>
            <div>
                <a-table :columns="columns" :data-source="UploadTable" :loading="UploadTableType" :pagination="{
                    current: tableParms.pageNum,
                    pageSize: tableParms.pageSize,
                    total: tableParms.total,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    showTotal: (total, range) => `第${range[0]}-${range[1]}条, 共${total}条`
                }" :scroll="{ y: 400 }">
                    <template #createTime="{ text }">
                        <span>{{ text }}</span>
                    </template>
                    <template #taskName="{ text }">
                        <span>{{ text }}</span>
                    </template>
                    <template #success="{ text, record }">
                        11{{ text }} {{ record }}
                        <!-- <a-tag :color="getTagColor(record.success)">
                            {{ getTagText(record.success) }}
                        </a-tag> -->
                    </template>
                    <template #action="{ record }">
                        <a-button type="warning" @click="detailLog(record)">日志详情</a-button>
                    </template>
                </a-table>
            </div>
        </BaseModal>
        <!-- 进度条 -->
        <!-- <a-modal v-model:open="dialogVisible" :maskClosable="false" width="30%">
            <a-progress type="circle" :percent="percentageRes" :stroke-width="26" stroke-color="#f56c6c" />
        </a-modal> -->
    </div>
</template>

<script setup>
import { useAuthorization } from '~/composables/authorization'
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { message } from "ant-design-vue";
import download from '@/api/common/download';
import { exportExcelGP, GPPage, syncProductGPPropress } from "@/pages/lazada/globalplus/api";
const columns = [
    {
        title: 'Date',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        width: 250,
    },
    {
        title: 'TaskName',
        dataIndex: 'taskName',
        key: 'taskName',
        align: 'center',
    },
    {
        title: '上传状态',
        dataIndex: 'success',
        key: 'success',
        align: 'center',
        width: 150,
    },
    {
        title: '操作',
        key: 'action',
        align: 'center',
        width: 150,
    },
];

const props = defineProps({
    searchData: {
        type: Object,
        default: () => {}
    }
})

const baseFormEl = useTemplateRef('baseFormRef')
const modalMethods = ref();
const rowData = ref({});
const submitBtnLoading = ref(false);
const active = ref(0);
const fileList = ref([]);
const UploadTable = ref([]);
const url = import.meta.env.VITE_APP_BASE_API + '/platform-lazada/platform/lazada/gp/product/importExcelUpgradeProduct';
const header = ref({ Authorization: useAuthorization().value });
const UploadTableType = ref(false);
const tableParms = reactive({
    taskName: "",
    type: "GpExcelGetNoFeePrice",
    startTime: "",
    endTime: "",
    order: "desc",
    pageNum: 1,
    pageSize: 50,
    prop: "create_time"
})

// 导出表格
const copyData = () => {
    active.value = 1;
    exportExcelGP(props.searchData).then((res) => {
        download.name(res.msg);
        message.success("下载任务已开始！请耐心等待完成");
    });
};

// 详情
const detailLog = () => {

};

const successFun = (res) => {

};
const close = () => {
    dialogVisible.value = false;
    percentageRes.value = 0;
    customColor.value = '#f56c6c';
};

const cancel = () => {

};

const submit = () => {

};

const register = (methods) => {
    modalMethods.value = methods
};

const open = (row) => {
    rowData.value = row;
    modalMethods.value.openModal();
};

const emits = defineEmits(['success']);
defineExpose({
    open
})
</script>

<style lang="less" scoped></style>