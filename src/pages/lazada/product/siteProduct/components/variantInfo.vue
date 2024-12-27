<template>
    <div class="mt-10px" v-show="lazadaAttrsState.skuAttrs.length > 0">
        <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
            <template #title>
                <div text-left> 变种信息 </div>
            </template>
        </a-card>
    </div>
</template>

<script setup>
import { useLadazaAttrs } from "@/stores/lazadaAttrs";
const { state: lazadaAttrsState } = useLadazaAttrs();
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { message } from 'ant-design-vue';


</script>

<style lang="less" scoped></style>
