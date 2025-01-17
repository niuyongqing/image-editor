<template>
    <div>
        <BaseModal title="选择店铺-认领到采集箱" width="600px" @register="register" @close="close">
            <a-form>
                <a-form-item label="店铺：">
                    <a-select v-model:value="state.shortCode" placeholder="店铺" allowClear>
                        <a-select-option v-for="item in account" :key="item.shortCode" :value="item.shortCode">{{
                            item.alias ? item.alias : item.simpleName }}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-form>
        </BaseModal>
    </div>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';

const { account } = defineProps({
    account: {
        type: Array,
        default: () => []
    }
})
const state = reactive({
    shortCode: undefined,
})
const modelMethods = ref({});

const register = (modal) => {
    modelMethods.value = modal;
};
const close = () => {
    state.shortCode = undefined;
};
const open = () => {
    modelMethods.value.openModal();
};

defineExpose({
    open,
})
</script>

<style lang="less" scoped></style>