<template>
    <div id="detailsModalCont">
        <a-modal :open="props.openDetailsModal" @ok="handleOk" @cancel="handleCancel" :width="'40%'"
            :maskClosable="false" :keyboard="false">
            <template #title>
                <div>包裹{{ }}详情 - 来源于{{ }}</div>
            </template>
            <div>
                <div style="display:flex;justify-content: space-between;">
                    <div>卖家：</div>
                    <div style="display: flex;flex-direction: column;">
                        <span>买家姓名：L***N A***</span><span>邮箱：v4bGLX6CYJ3QIF5ANXP</span>
                    </div>
                    <div style="display: flex;flex-direction: column;">
                        <span>包裹总额：PHP58.69</span><span>利润：CNY</span>
                    </div>
                </div>
                <a-steps v-model:current="current" type="navigation" :style="stepStyle" :items="stepsItems"></a-steps>

                <a-tabs v-model:activeKey="activeKey" :tab-position="'left'" animated>
                    <a-tab-pane key="1" tab="收货地址">
                        <a-descriptions>
                            <a-descriptions-item label="UserName">Zhou Maomao</a-descriptions-item>
                            <a-descriptions-item label="Telephone">1810000000</a-descriptions-item>
                            <a-descriptions-item label="Live">Hangzhou, Zhejiang</a-descriptions-item>
                            <a-descriptions-item label="Remark">empty</a-descriptions-item>
                            <a-descriptions-item label="Address">
                                No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                            </a-descriptions-item>
                        </a-descriptions>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="物流信息">Content of Tab 2</a-tab-pane>
                    <a-tab-pane key="3" tab="备注信息">Content of Tab 3</a-tab-pane>
                </a-tabs>
            </div>
        </a-modal>
    </div>
</template>

<script setup name='detailsModal'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
const props = defineProps({
    openDetailsModal: Boolean
})
const emit = defineEmits(["update:openDetailsModal"])
const current = ref(0);
const activeKey = ref('2');
const stepsItems = ref([
    {
        status: 'finish',
        title: '已审核',
    },
    {
        status: 'process',
        title: '已处理',
    },
    {
        status: 'wait',
        title: '已申请订单号',
    },
    {
        status: 'wait',
        title: '已打拣货单',
    },
    {
        status: 'wait',
        title: '已打面单',
    },
    {
        status: 'wait',
        title: '已发货',
    }
])
const stepStyle = {
    margin: ' 20px 0 20px 0',
    boxShadow: '0px -1px 0 0 #e8e8e8 inset',
};

const handleOk = () => {
    
}
const handleCancel = () => {
    emit("update:openDetailsModal", false);
}
</script>
<style lang="less" scoped></style>