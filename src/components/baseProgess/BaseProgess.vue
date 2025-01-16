<template>
    <div>
        <a-modal v-model:open="open" :maskClosable="false" width="600px" :footer="null">
            <!-- 实时进度条 -->
            <div p-15px>
                <a-progress :percent="percent" :status="status" />
            </div>
        </a-modal>
    </div>
</template>

<script setup>
const open = defineModel('open');
const percent = defineModel('percent');// 进度条状态
const status = ref('active');
const setStatus = (value) => {
    status.value = value;
};
defineExpose({
    setStatus
})
</script>