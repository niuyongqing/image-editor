<template>
    <div>
        <!-- 仓库管理 -->
        <BaseModal title="仓库管理" @close="cancel" width="600px" @register="register" showCancelBtn :showSaveBtn="false">
            <a-table :columns="columns" :data-source="data" :pagination="false" row-key="id"></a-table>
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

defineExpose({
    open,
})

</script>

<style lang="scss" scoped></style>