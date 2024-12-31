<template>
    <a-modal v-model:open="visible" title="选择资料库产品" :footer="null" :width="'95vw'" :zIndex="1000"
        :style="{ top: 0, padding: 0, height: '100vh' }" :bodyStyle="{ height: 'calc(100vh - 55px)', overflow: 'auto' }"
        :maskClosable="false" :destroyOnClose="true">
        <div class="modal-content">
            <Search @search="handleSearch"></Search>

        </div>
    </a-modal>
    <a-button type="primary" @click="showModal">打开全屏弹窗</a-button>
</template>

<script setup>
import Search from './search.vue';

const visible = ref(true);
const openModal = () => {
    visible.value = true;
};

const handleOk = () => {
    visible.value = false;
};

const handleCancel = () => {
    visible.value = false;
};

//  搜索
const handleSearch = () => {

}

defineExpose({ openModal });

</script>

<style scoped>
.modal-content {
    padding: 24px;
}
</style>