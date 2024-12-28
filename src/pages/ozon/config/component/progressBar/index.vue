<template>
    <div id="progressBarCont">
        <a-modal :open="showOpen" :maskClosable="false" :width="'40%'" :keyboard="false" @ok="handleCancel">
            <a-progress :percent="percent" :size="[300, 20]" />
        </a-modal>
    </div>
</template>

<script setup name='progressBar'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'

const props = defineProps({
    showOpen: Boolean,
    percent: Number,
});
// 模拟进度增加
let timer;
onMounted(() => {
    timer = setInterval(() => {
        if (progress.value < 100) {
            progress.value += 10;
        } else {
            clearInterval(timer);
            handleCancel();
        }
    }, 1000);
});
const handleCancel = () => {
    isVisible.value = false;
}
</script>
<style lang="less" scoped></style>