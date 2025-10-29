<template>
    <div>
        <BaseModal title="日志" @register="register" :submitBtnLoading="submitBtnLoading" width="60%" style="top: 20px">
            <a-card :bordered="false" style="margin-right: 5px">
                <div>
                    <a-timeline style="height: 600px; overflow: auto;">
                        <a-timeline-item v-for="(item, index) in tableData" :key="index" color="#0bbd87">
                            <div>
                                <div>{{ item.operatorUserName }}</div>
                                <div style="color: #888888;">{{ item.action }}</div>
                                <div style="">{{ item.content }}</div>
                                <div v-if="item.data != null && item.data != ''">
                                    <a-button type="link" @click="openInnerModal(item.data)">详细参数</a-button>
                                </div>
                                <div>
                                    {{ Timedata(item.createTime) }}
                                </div>
                            </div>
                        </a-timeline-item>
                    </a-timeline>
                </div>
            </a-card>
        </BaseModal>
        <a-modal v-model:open="innerModal" title="详细参数" :footer="null" width="70%">
            <div>
                {{ detail }}
            </div>
        </a-modal>
    </div>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { message } from "ant-design-vue";
import { getNoFeePriceApi, productUpgrade, logGPPage } from '@/pages/lazada/globalplus/api';
import { Timedata } from '~@/pages/lazada/regularCoupons/common/util.js';
const rowData = ref({
    skus: []
});
const innerModal = ref(false);
const tableData = ref([]);
const reverse = true
const modalMethods = ref();
const submitBtnLoading = ref(false);
const register = (methods) => {
    modalMethods.value = methods
};

const open = (row) => {
    rowData.value = row;
    logGPPage({
        type: 'GpUpgrade',
    }).then((res) => {
        tableData.value = res.rows || [];
    })
    modalMethods.value.openModal();
};


const detail = ref({});
const openInnerModal = (data) => {
    innerModal.value = true;
    detail.value = data;
}

const emits = defineEmits(['success']);
defineExpose({
    open
})
</script>

<style lang="less" scoped>
.required {
    color: #f40;
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>