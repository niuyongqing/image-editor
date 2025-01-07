<template>
    <div>
        <BaseModal title="Global Plus 商品升级" @register="register" @close="cancel" @submit="submit"
            :submitBtnLoading="submitBtnLoading" width="90%" style="top: 20px">
            123
        </BaseModal>
    </div>
</template>

<script setup>
const baseFormEl = useTemplateRef('baseFormRef')
const modalMethods = ref();

const submitBtnLoading = ref(false);
const register = (methods) => {
    modalMethods.value = methods
};

</script>

<style lang="less" scoped></style>