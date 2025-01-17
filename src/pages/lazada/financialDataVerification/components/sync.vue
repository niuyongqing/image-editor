<template>
    <div>
        <a-modal v-model:open="dialogVisible" title="同步" :maskClosable="false" width="600px">
            <a-card style="margin-right: 5px; overflow-y: auto" bordered>
                <template #title>
                    <div class="clearfix">
                        <span>注意：</span>
                        <span style="margin-left: 30px; color: #9e9f9e; font-size: 12px">
                            同步月份为
                            <span style="color: red">必填</span>
                        </span>
                    </div>
                </template>
                <div>
                    <div style="margin-top: 10px;">
                        <div style="margin-top: 20px;">
                            <span style="display: inline-block;">
                                <div>
                                    <span style="color: grey;">同步月份：</span>
                                    <a-date-picker v-model:value="importDate" picker="month" placeholder="选择月"
                                        format="YYYY-MM" />
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            </a-card>

            <template #footer>
                <a-button @click="handleClose">取 消</a-button>
                <a-button type="primary" @click="onSubmit" :loading="loading">确 定</a-button>
            </template>
        </a-modal>

        <!-- 同步信息 -->
        <a-modal v-model:open="syncInfoVisible" title="同步信息" :maskClosable="false" width="600px">
            <a-card style="margin-right: 5px; overflow-y: auto" bordered>
                <a-descriptions title="同步信息">
                    <a-descriptions-item label="数据月份">{{ syncObj.month }}</a-descriptions-item>
                    <a-descriptions-item label="同步状态">
                        <a-tag>
                            {{ syncObj.status == "0" ? '未同步' : syncObj.status == "5" ? '同步中' : syncObj.status == "10" ?
                                '同步完成' :
                                '' }}
                        </a-tag>
                    </a-descriptions-item>
                    <a-descriptions-item label="整月总打款差额" v-if="syncObj.status == '10'">{{ syncObj.totalResultOrderAmount
                        }}</a-descriptions-item>
                    <a-descriptions-item label="操作人姓名">{{ syncObj.operateUserName }}</a-descriptions-item>
                    <a-descriptions-item label="更新时间">{{ syncObj.updateTime }}</a-descriptions-item>
                </a-descriptions>
            </a-card>

            <template #footer>
                <a-button @click="syncInfoClose">取 消</a-button>
                <a-button type="primary" @click="syncInfoClose">确 定</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { syncFinanceCheckList } from '@/pages/lazada/financialDataVerification/api';
const importDate = ref(undefined);
const dialogVisible = ref(false);
const loading = ref(false);
const syncInfoVisible = ref(false);

const { state: syncObj, reset } = useResetReactive({
    month: '',
    status: '',
    totalResultOrderAmount: '',
    operateUserName: '',
    updateTime: '',
});

const emits = defineEmits(['success']);
const onSubmit = () => {
    if (!importDate.value) {
        message.error('请选择同步月份');
        return;
    }
    loading.value = true;
    const params = {
        month: importDate.value.format('YYYYMM')
    }
    console.log(params)
    syncFinanceCheckList(params)
        .then((res) => {
            if (res.code === 200) {
                const data = res.data || {};
                syncObj.month = data.month;
                syncObj.status = data.status;
                syncObj.totalResultOrderAmount = data.totalResultOrderAmount;
                syncObj.operateUserName = data.operateUserName;
                syncObj.updateTime = data.updateTime;
                syncInfoVisible.value = true;
            }
        }).finally(() => {
            handleClose();
        })
};

const handleClose = () => {
    dialogVisible.value = false;
    loading.value = false;
    importDate.value = undefined;
};
const open = () => {
    dialogVisible.value = true;
};

const syncInfoClose = () => {
    reset()
    syncInfoVisible.value = false;
}
defineExpose({
    open,
})
</script>