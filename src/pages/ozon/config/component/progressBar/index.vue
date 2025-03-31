<template>
    <div id="progressBarCont">
        <a-modal :open="showOpen" :footer="null" @cancel="handleCancel" :maskClosable="false" :width="'40%'" :keyboard="false">
            <a-progress class="m-5" style="width: 850px;" :percent="percentage" :stroke-width="20" />
        </a-modal>
    </div>
</template>

<script setup name='progressBar'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'

const props = defineProps({
    showOpen: Boolean,
    percentage: Number,
});
const emit = defineEmits(["handleProgressBarClose"]);
// 模拟进度增加
// let timer;
// const percent = ref(0)
// console.log('props',props.percentage);
watch(() => props.percentage, val => {
    if (props.percentage >= 100) {
        handleCancel(); 
    }
    // timer = setInterval(() => {
    // }, 1000);
},{ immediate: true })

const handleCancel = () => {
    emit("handleProgressBarClose")
    // percent.value = 0
}
</script>
<style lang="less" scoped></style>