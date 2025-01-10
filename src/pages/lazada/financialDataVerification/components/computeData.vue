<template>
    <div>
        <a-modal v-model:open="dialogVisible" title="计算" :maskClosable="false" width="600px">
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
        <BaseProgess ref="baseProgessRef" v-model:percent="percent" v-model:open="progessOpen"></BaseProgess>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { computeFinanceCheckList } from '@/pages/lazada/financialDataVerification/api';
import BaseProgess from '~@/components/baseProgess/BaseProgess.vue';
const importDate = ref(undefined);
const dialogVisible = ref(false);
const loading = ref(false);
const progessOpen = ref(false);

const emits = defineEmits(['success']);


const schedule = async (e) => {
    try {
        // 调用异步函数并获取结果
        let computeCount = await computeFinanceCheckList(e);
        let percentageRes = parseInt(computeCount.msg);
        this.percentageRes = percentageRes;
        if (this.percentageRes == 100) {
            // 成功时弹出提示框并发送事件
            // await this.$alert('计算成功', '计算', { type: 'success' });
            // this.$bus.$emit('financialDataVerificationList');
            this.close()
        }
        else if (this.percentageRes == null) {
            // await this.$alert('计算尚未完成，请稍后再试', '计算', { type: 'info' });
            // this.close()
        }
        else {
            setTimeout(async () => {
                await this.schedule(e);
            }, 40000)
        }
    } catch (error) {
        // await this.$alert('计算过程中出现错误：' + error.message, '计算', { type: 'error' });
        // this.close()
    }
};

const onSubmit = () => {
    progessOpen.value = true;

    if (!importDate.value) {
        message.error('请选择同步月份');
        return;
    }
    loading.value = true;
    const params = {
        month: importDate.value.format('YYYYMM')
    }
    console.log(params)
    computeFinanceCheckList(params.month)
        .then((res) => {
            if (res.code === 200) {
                const data = res.data || {};
                // progessOpen.value = true;
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
defineExpose({
    open,
})
</script>