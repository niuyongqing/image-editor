<template>

    <div class="w-250px ">
        <a-card :bordered="false" style="margin: 0 auto; border-radius: 0px; ">
            <template #title>
                <div flex justify-between class="nav-title">
                    <div> 常用模板 </div>
                </div>
            </template>

            <div v-for="item in templateList" :key="item.id" :class="activeId === item.id ? 'ozon-active' : 'default'">
                <div text-left pl-10px cursor-pointer @click="selectActive(item.id)">
                    {{ item.name }}
                </div>
            </div>
        </a-card>

    </div>

</template>

<script setup>
const activeId = defineModel('activeId');
const templateList = ref([
    {
        id: 1,
        name: '产品模板'
    },
    // {
    //     id: 2,
    //     name: '尺码模板'
    // },
    {
        id: 3,
        name: '变种模板'
    },
    {
        id: 4,
        name: '富文本模板'
    }
]);

const selectActive = (id) => {
    console.log(id);
    activeId.value = id;
};

</script>
<style lang="less" scoped>
:deep(.ant-card-body) {
    padding: 0px
}

:deep(.ant-card-head) {
    padding: 0px;
}

.nav-title {
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    padding-left: 12px;
    padding-right: 12px;
    height: 40px;
    line-height: 40px;
    color: #434649;
    font-weight: 600;
    background-color: #f2f2f2;
}

.ozon-active {
    border-left: 3px solid #428bca;
    color: #428bca;
    background: #eff2f9;
    padding: 8px;
}

.default {
    padding: 8px;
}
</style>
