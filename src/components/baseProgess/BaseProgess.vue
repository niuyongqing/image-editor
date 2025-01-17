<template>
    <div>
        <a-modal :title="title" v-model:open="open" :maskClosable="false" width="600px">
            <!-- 实时进度条 -->
            <div p-15px>
                <a-progress :percent="percent" :status="status" />
            </div>
            <template #footer>
                <slot name="modalFooter"></slot>
                <a-button key="back" @click="closeModal" v-if="showCancelBtn">取消</a-button>
                <a-button key="submit" type="primary" :loading="submitBtnLoading" @click="handleSubmit"
                    @keyup.enter="handleSubmit" v-if="showSaveBtn">确定</a-button>
            </template>

        </a-modal>
    </div>
</template>

<script setup>
const { footer, title, showCancelBtn, showSaveBtn } = defineProps({
    footer: {
        type: String,
        default: null,
    },
    title: {
        type: String,
        default: '',
    },
    // 显示取消按钮
    showCancelBtn: {
        type: Boolean,
        default: true,
    },
    // 显示保存按钮
    showSaveBtn: {
        type: Boolean,
        default: true,
    },
    submitBtnLoading: {
        type: Boolean,
        default: false
    }
});
const emits = defineEmits(['close', 'submit']);
const open = defineModel('open', { type: Boolean, default: 0 });
const percent = defineModel('percent', { type: Number, default: 0 });// 进度条百分比状态
const status = ref('active');
const closeModal = () => {
    open.value = false;
    emits('close')
};
const handleSubmit = () => {
    emits('submit')
}

const setStatus = (value) => {
    status.value = value;
};



defineExpose({
    setStatus
})
</script>