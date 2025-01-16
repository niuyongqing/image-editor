<template>
    <div>
        <BaseModal title="日志" @register="register" @close="cancel" @submit="submit" :submitBtnLoading="submitBtnLoading"
            width="90%" style="top: 20px">
            <a-card :bordered="false" style="margin-right: 5px">

                <div>
                    日志
                </div>

            </a-card>
        </BaseModal>
    </div>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { message } from "ant-design-vue";
import { getNoFeePriceApi, productUpgrade } from '@/pages/lazada/globalplus/api';
const rowData = ref({
    skus: []
});

const modalMethods = ref();
const submitBtnLoading = ref(false);
const register = (methods) => {
    modalMethods.value = methods
};

const open = (row) => {
    rowData.value = row;
    modalMethods.value.openModal();
};
const cancel = (data) => {
    submitBtnLoading.value = false;
};

const submit = async () => {
    submitBtnLoading.value = true;

};

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