<template>
    <div id="progressBarCont">
        <a-modal :open="showOpen" :footer="null" @cancel="handleCancel" :maskClosable="false" :width="'40%'" :keyboard="false">
            <a-progress class="m-5" style="width: 850px;" :percent="percentage" :stroke-width="20" />

            <div class="ml-5">
                <span>详情:</span>
                <div>
                    <div v-for="(item,index) in asyncErrData" :key="index" class="mb-2.5">
                        <span>{{ item.shopName }}</span>,<span>同步成功：{{ item.successCount }}条数据</span>，<span>同步失败：{{ item.failCount }}条数据</span>
                    </div>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script setup name='progressBar'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'

const props = defineProps({
    showOpen: Boolean,
    percentage: Number,
    asyncErrData: Array
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