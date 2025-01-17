<template>
    <div>
        <BaseModal @register="register" title="赠品列表" @close="closeModal" @submit="submit" width="1000px">
            <a-alert message="1.请确保所选赠品/样品有充足库存，保证买家能够下单成功。" type="warning" showIcon :closable="false" />
            <a-alert message="2. Digital Goods 不能作为赠品/样品送出。" type="warning" showIcon :closable="false" />
            <a-alert message="3.此外，请确保主商品和赠品/样品在同一个仓库，否则优惠不生效。" type="warning" showIcon :closable="false" />
            <a-alert message="4. 卖家将默认承担赠品/样品的邮费" type="warning" showIcon :closable="false" />

            <a-card> </a-card>
        </BaseModal>
    </div>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';

const modalMethods = ref({});
const register = (modal) => {
    modalMethods.value = modal;
}
const closeModal = () => {
    modalMethods.value.closeModal();
}
const submit = () => {
    closeModal();
}
const open = () => {
    modalMethods.value.openModal();
};

defineExpose({
    open
})
</script>