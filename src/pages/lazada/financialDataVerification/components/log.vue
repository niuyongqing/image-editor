<template>
    <div>
        <BaseModal @register="register" @close="cancel" title="财务日志" width="1100px" :show-cancel-btn="false"
            :show-save-btn="false" :submitBtnLoading="submitBtnLoading">
            <a-card style="margin-right: 5px; overflow-y: auto" bordered>
                <a-card>
                    <a-form layout="inline" ref="ruleForm" :model="formData">
                        <a-form-item label="操作类型：" name="action">
                            <a-select style="width: 150px;" v-model:value="formData.action" placeholder="请选择"
                                allowClear>
                                <a-select-option value="失败">失败</a-select-option>
                                <a-select-option value="导入">导入</a-select-option>
                                <a-select-option value="同步">同步</a-select-option>
                                <a-select-option value="导出">导出</a-select-option>
                            </a-select>
                        </a-form-item>

                        <a-form-item label="操作时间：" name="createTime">
                            <a-range-picker v-model:value="formData.createTime" format="YYYY-MM-DD"
                                style="width: 230px" />
                        </a-form-item>

                        <a-form-item label="模糊查询：" name="optUserName">
                            <a-input v-model:value="formData.optUserName" placeholder="操作人" allowClear />
                        </a-form-item>

                        <a-form-item>
                            <a-space>
                                <a-button type="primary" @click="onSubmit">查询</a-button>
                                <a-button @click="handleReset">重置</a-button>
                            </a-space>
                        </a-form-item>
                    </a-form>
                </a-card>
                <a-card style="display: flex; padding: 20px;">
                    <a-timeline style="height: 600px; overflow: auto" mode="left">
                        <a-timeline-item v-for="(item, index) in tableData" :key="index" color="#0bbd87"
                            :label="item.createTime">
                            <div w-800px>
                                <div>{{ item.optUserName }}</div>
                                <div style="color: #888888">{{ item.action }}</div>
                                <div style="color: #888888">{{ item.content }}</div>
                            </div>
                        </a-timeline-item>
                    </a-timeline>
                </a-card>
                <div w-full flex justify-end mt-10px>
                    <a-pagination size="small" v-model:current="pagination.pageNum"
                        v-model:pageSize="pagination.pageSize" :total="pagination.total" show-size-changer
                        show-quick-jumper @change="handleChangePagination" />
                </div>
            </a-card>
        </BaseModal>
    </div>
</template>

<script setup>
import { CloudUploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { logFinanceCheckList } from '@/pages/lazada/financialDataVerification/api';

const { state: formData, reset } = useResetReactive({
    action: undefined,
    createTime: [],
    optUserName: '',
});
const createTime = ref([])
const reverse = ref(false);
const tableData = ref([]);
const loading = ref(false);
const pagination = reactive({
    pageNum: 1,
    pageSize: 10,
    total: 0,
})
const submitBtnLoading = ref(false);

const modalMethods = ref();
const register = (modal) => {
    modalMethods.value = modal;
};

const handleReset = () => {
    reset();
    submit()
}
// 查询逻辑
const onSubmit = () => {
    loading.value = true;
    let createTimeStart = undefined
    let createTimeEnd = undefined;
    if (formData.createTime.length) {
        createTimeStart = formData.createTime[0].format('YYYY-MM-DD 00:00:00');
        createTimeEnd = formData.createTime[1].format('YYYY-MM-DD 23:59:59');
    }

    let params = {
        action: formData.action,
        createTimeStart: createTimeStart,
        createTimeEnd: createTimeEnd,
        optUserName: formData.optUserName,
        pageNum: pagination.pageNum,
        pageSize: pagination.pageSize,
    }

    logFinanceCheckList(params).then(res => {
        tableData.value = res.rows || [];
        pagination.total = res.total;
    }).finally(() => {
        loading.value = false;
    })
};


const handleChangePagination = (page, size) => {
    pagination.pageNum = page;
    pagination.pageSize = size;
};

const open = () => {
    reset();
    pagination.pageNum = 1;
    pagination.pageSize = 10;
    pagination.total = 0;
    modalMethods.value.openModal();
    onSubmit()
};

const cancel = () => {

};

defineExpose({
    open
});

</script>

<style scoped></style>