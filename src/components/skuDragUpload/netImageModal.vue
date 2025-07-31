<template>
    <a-modal v-model:open="visible" title="从网络地址(URL)选择图片" width="40%">
        <div class="modal-box">
            <a-textarea v-model:value="form.imageUrl" placeholder="请填写图片URL地址，多个地址用回车换行" :rows="6" />
        </div>
        <template #footer>
            <a-button type="primary" @click="submit" :loading="loading">添加</a-button>
            <a-button @click="close">关闭</a-button>
        </template>
    </a-modal>
</template>

<script setup>
import { batchUploadFromUrlApi } from '@/api/common/upload'

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
    try {
      let res = await batchUploadFromUrlApi({
          imageList: form.imageUrl.trim().split('\n')
      });
      if (res.code === 200) {
        emits('submit', res.data);
        close()
      };
    } catch (error) {}
    loading.value = false;
};

const emits = defineEmits(['submit'])

defineExpose({
    open,
});

</script>

<style scoped lang="less"></style>
