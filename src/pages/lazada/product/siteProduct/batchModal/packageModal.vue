<template>
    <a-modal v-model:open="dialogVisible" title="修改价格" width="500px" @cancel="cancel">
        <a-form :model="form" :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">
            <a-form-item label="长">
                <a-input-number v-model:value="form.packageLength" :min="0.01" :max="110" :precision="2" width="100%"
                    placeholder="长" />
            </a-form-item>
            <a-form-item label="宽">
                <a-input-number v-model:value="form.packageWidth" :min="0.01" :max="110" :precision="2" width="100%"
                    placeholder="宽" />
            </a-form-item>
            <a-form-item label="高">
                <a-input-number v-model:value="form.packageHeight" :min="0.01" :max="110" :precision="2" width="100%"
                    placeholder="高" />
            </a-form-item>
        </a-form>
        <p class="pull-left p-top8 f-red f13">注：所有SKU信息将同步更改</p>
        <template #footer>
            <a-button @click="cancel">取 消</a-button>
            <a-button type="primary" @click="save">确定</a-button>
        </template>
    </a-modal>
</template>

<script setup>
const dialogVisible = ref(false);
const form = reactive({
    packageLength: 0,
    packageWidth: 0,
    packageHeight: 0
});
const open = () => {
    dialogVisible.value = true;
};

const cancel = () => {
    dialogVisible.value = false;
    emit('cancel');
};

const save = () => {
    emit('success', form);
    cancel();
};

const emit = defineEmits(['cancel', 'success']);

defineExpose({
    open
})

</script>

<style scoped>
.radio-group {
    display: flex;
    flex-direction: column;
}

.p-top8 {
    padding-top: 20px !important;
}

.f13 {
    font-size: 13px !important;
}

.f-red {
    color: #ec4339 !important;
}
</style>