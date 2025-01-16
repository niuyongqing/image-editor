<template>
    <div>
        <a-modal v-model:open="dialogVisible" title="同步时间选择" :maskClosable="false" width="600px">
            <a-form :model="ruleForm" :rules="rules" ref="ruleFormRef" :label-col="{ span: 6 }"
                :wrapper-col="{ span: 14 }" class="demo-ruleForm">
                <a-form-item label="同步时间：" name="getPayoutTime">
                    <a-range-picker style="width: 230px" v-model:value="ruleForm.getPayoutTime" format="YYYY-MM-DD" />
                </a-form-item>

                <a-form-item label="温馨提示：">
                    <div style="color: red">亲，由于同步数据时间较长，耐心等待！</div>
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
import { sync } from '../api';
import { message } from 'ant-design-vue';

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
            createTimeStart: ruleForm.value.getPayoutTime[0].format('YYYY-MM-DDT00:00:00+08:00'),
            createTimeEnd: ruleForm.value.getPayoutTime[1].format('YYYY-MM-DDT23:59:59+08:00'),
        };
        loading.value = true;
        sync(data)
            .then((res) => {
                if (res.code === 200) {
                    message.success(res.msg);
                } else {
                    message.error(res.msg);
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