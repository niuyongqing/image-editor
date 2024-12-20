<template>
    <div>
        <a-modal v-bind="getBindValue" v-model:open="open" :title="title" @ok="openModal" :maskClosable="false"
            @cancel="closeModal">
            <slot></slot>
            <template #footer>
                <slot name="modalFooter"></slot>
                <a-button key="back" @click="closeModal" v-if="showCancelBtn">取消</a-button>
                <a-button key="submit" type="primary" :loading="submitBtnLoading" @click="handleSubmit"
                    v-if="showSaveBtn">确定</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script setup>
const attrs = useAttrs();
const props = defineProps({
    title: {
        type: String,
        default: '标题',
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
const emits = defineEmits(['close', 'open', 'register', 'submit']);
const getBindValue = computed(() => {
    return {
        ...attrs,
        ...unref(props),
    };
});

const data = ref();
//  弹窗显示
const open = ref(false);
const openModal = (value) => {
    if (value) {
        data.value = value
    }
    open.value = true;
    emits('open', value)
};

const closeModal = () => {
    open.value = false;
    emits('close')
};
const handleSubmit = () => {
    emits('submit')
}

const modalMethods = {
    openModal,
    closeModal,
    handleSubmit
};

const instance = getCurrentInstance();
if (instance) {
    emits('register', modalMethods);
}

defineExpose(modalMethods);
</script>