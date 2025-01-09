<template>
    <div>
        <a-modal v-model:open="dialogVisible" title="同步时间选择" :maskClosable="false" width="600px">
            <a-form :model="ruleForm" :rules="rules" ref="ruleFormRef" :label-col="{ span: 6 }"
                :wrapper-col="{ span: 14 }" class="demo-ruleForm">
                <a-form-item label="同步时间：" name="getPayoutTime">
                    <a-range-picker style="width: 230px" v-model:value="ruleForm.getPayoutTime" format="YYYY-MM-DD" />
                </a-form-item>

                <a-form-item label="温馨提示：">
                    <div style="color: red">
                        亲，由于同步数据时间较长，您可以离开当前页面，稍后回来！！</div>
                </a-form-item>
            </a-form>

            <template #footer>
                <a-button @click="handleClose">取 消</a-button>
                <a-button type="primary" @click="onSubmit" :loading="loading">确 定</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { myIncomeSync } from '../api';
import { message } from 'ant-design-vue';
import { Modal } from 'ant-design-vue'
const ruleFormEl = useTemplateRef('ruleFormRef');
const dialogVisible = ref(false);
const loading = ref(false);
const ruleForm = ref({
    getPayoutTime: [],
});
const rules = ref({
    getPayoutTime: [
        { required: true, message: '请选择同步时间', trigger: 'change' },
    ],
});

const onSubmit = (formName) => {
    ruleFormEl.value.validate().then(() => {
        const data = {
            startTime: ruleForm.value.getPayoutTime[0].format('YYYY-MM-DD 00:00:00'),
            endTime: ruleForm.value.getPayoutTime[1].format('YYYY-MM-DD 23:59:59'),
        };
        loading.value = true;
        myIncomeSync(data)
            .then((res) => {
                if (res.code === 200) {
                    Modal.confirm({
                        title: '提示',
                        content: res.msg,
                    })
                } else {
                    Modal.confirm({
                        title: '提示',
                        content: res.msg,
                    })
                }
            })
            .finally(() => {
                handleClose();
                loading.value = false;
            });
    });
};

const handleClose = () => {
    ruleFormEl.value.resetFields();
    ruleForm.value.getPayoutTime = [];
    dialogVisible.value = false;
};
const open = () => {
    dialogVisible.value = true;
};

defineExpose({
    open,
})
</script>