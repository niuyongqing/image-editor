<template>
    <div>
        <!-- 管理商品 -->
        <BaseModal title="管理商品" @close="cancel" width="90%" @register="register" showCancelBtn :showSaveBtn="false">

        </BaseModal>
    </div>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
const columns = [{
    title: '仓库名称',
    dataIndex: 'name',
}, {
    title: '仓库',
    dataIndex: 'warehouse',
}];
const data = ref([
    {
        name: '仓库1',
        warehouse: '仓库1'
    },
    {
        name: '仓库2',
        warehouse: '仓库2'
    }
]);
const modelMethods = ref();
const register = (modal) => {
    modelMethods.value = modal;
};

const open = () => {
    modelMethods.value.openModal();
};
const cancel = () => { }
defineExpose({
    open,
})

</script>

<style lang="less" scoped></style>