<template>
    <div id="progressBarCont">
        <a-modal :open="showOpen" :maskClosable="false" :width="'40%'" :keyboard="false" @ok="handleCancel">
            <a-progress :percent="50" :size="[300, 20]" />
        </a-modal>
    </div>
</template>

<script setup name='progressBar'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'

const props = defineProps({
    showOpen: Boolean,
    tabRow: Object,
});

const handleCancel = () => {

}
</script>
<style lang="less" scoped></style>