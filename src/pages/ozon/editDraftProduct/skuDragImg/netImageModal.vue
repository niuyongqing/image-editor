<template>
    <a-modal v-model:open="visible" title="从网络地址(URL)选择图片" width="500px">
        <div class="modal-box">
            <a-textarea v-model:value="form.imageUrl" placeholder="请填写图片URL地址，多个地址用回车换行" :rows="4" />
        </div>
        <template #footer>
            <a-button type="primary" @click="submit" :loading="loading">添加</a-button>
            <a-button @click="close">关闭</a-button>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { imageUrlUpload } from '@/pages/sample/acquisitionEdit/js/api.js'
const form = reactive({
    imageUrl: '',
});

const visible = ref(false);
const loading = ref(false);

const open = () => {
    form.imageUrl = '';
    visible.value = true;
};

const close = () => {
    form.imageUrl = '';
    visible.value = false;
};

const submit = async () => {
    loading.value = true;
    let res = await imageUrlUpload({
        url: form.imageUrl
    });

    loading.value = false;
    emits('submit', res.data);
    close()

};

const emits = defineEmits(['submit'])

defineExpose({
    open,
});

</script>

<style scoped lang="less"></style>
