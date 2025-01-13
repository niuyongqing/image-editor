<template>
    <div>
        <a-card class="mt-2.5 text-left" title="数据搬家任务流程图">
            <a-steps v-model:current="current" :items="stepsList"></a-steps>
        </a-card>
    </div>
</template>

<script setup>
const current = defineModel('current', { type: Number, default: 0 });
const stepsList = [
    {
        title: '同步产品',
        disabled: false,
    },
    {
        title: '认领产品',
        disabled: true,
    },
    {
        title: '选择店铺',
        disabled: true,
    },
    {
        title: '进入采集箱',
        disabled: true,
    },
]
</script>

<style lang="less" scoped></style>