<template>
    <a-modal v-model:open="dialogVisible" title="修改促销时间" width="620px" @cancel="cancel">
        <div>
            <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
                <a-form-item label="促销时间：">
                    <a-range-picker v-model:value="specialDate" style="width: 80%;" :format="dateFormat" />
                </a-form-item>
            </a-form>
        </div>
        <p class="pull-left  f-red f13">注：所有SKU信息将同步更改</p>
        <template #footer>
            <a-button @click="cancel">取 消</a-button>
            <a-button type="primary" @click="save">确定</a-button>
        </template>
    </a-modal>
</template>

<script setup>
const dialogVisible = ref(false);
const specialDate = ref([]);
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const open = () => {
    dialogVisible.value = true;
};

const cancel = () => {

    dialogVisible.value = false;
    emit('cancel');
};

const save = () => {
    emit('success', specialDate.value);
    cancel();
};

const emit = defineEmits(['cancel', 'success']);

defineExpose({
    open
})

</script>

<style scoped lang="less">
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