<template>
    <div>
        <a-model v-model:open="visible" :title="title" width="800px" @cancel="cancel">
            批量修改属性
            <template #footer>
                <a-button type="primary" @click="submitForm">保存</a-button>
                <a-button @click="cancel">关闭</a-button>
            </template>
        </a-model>
    </div>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';

const title = ref('批量修改属性');
const seelctRows = ref({});
const visible = ref(false);
const open = (params) => {
    title.value = params.title;
    seelctRows.value = params.data;
    visible.value = true;
};
const cancel = () => {
    visible.value = false;
};
const emits = defineEmits(['success']);
defineExpose({
    open,
});
</script>