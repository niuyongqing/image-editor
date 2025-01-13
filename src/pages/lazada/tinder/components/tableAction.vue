<template>
    <div class="my-12px">
        <div class="w-full flex justify-between items-center">
            <div class="pl-2">
                <a-button type="primary" style="height: 32px;  margin-left: 10px;" @click="batchClaim">
                    批量认领
                </a-button>
            </div>

            <div class="pl-2">
                <a-button type="primary" style="height: 32px;  margin-left: 10px;" @click="syncProduct">
                    同步产品
                </a-button>
            </div>
        </div>
    </div>
    <!-- 批量认领弹窗 -->
    <ClaimModal ref="claimModalRef"></ClaimModal>
    <BaseProgess v-model:open="processVisible" v-model:percent="percent" @submit="syncProductProgess" title="同步产品">
    </BaseProgess>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import BaseProgess from '@/components/baseProgess/BaseProgess.vue';
import ClaimModal from './claimModal.vue';
import { SettingOutlined } from "@ant-design/icons-vue";

const emits = defineEmits(["success"]);
const claimModalEl = useTemplateRef("claimModalRef");
const processVisible = ref(false);//同步弹窗
const percent = ref(0); //同步进度条

//  批量认领
const batchClaim = () => {
    claimModalEl.value.open();
};
const syncProduct = () => {
    processVisible.value = true;
}

const syncProductProgess = () => {
    emits('success');
}
</script>

<style lang="less" scoped></style>