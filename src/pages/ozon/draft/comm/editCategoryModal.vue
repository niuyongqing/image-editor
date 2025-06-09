<template>
    <div>
        <a-modal v-model:open="dialogVisible" title="提示" width="900px" @cancel="cancel" :footer="null">

            <div flex justify-between mb-15px>
                <div>
                    <a-breadcrumb separator=">">
                        <a-breadcrumb-item>Ozon</a-breadcrumb-item>
                        <a-breadcrumb-item>采集箱</a-breadcrumb-item>
                        <a-breadcrumb-item> 编辑 </a-breadcrumb-item>
                    </a-breadcrumb>
                </div>
                <div>
                    <a-space>
                        <a-button type="primary" @click="editCategory"
                            style="height: 32px;  background-color: #E97234;">保存，下一步</a-button>
                        <a-button @click="skip" style="height: 32px; background-color: #F5F5F5;">关闭</a-button>
                    </a-space>
                </div>
            </div>

            <a-table :columns="columns" :data-source="tableData" bordered>
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'productInfo'">
                        <div class="flex items-center">
                            <div class="w-70px h-70px">
                                <img :src="record.image" class="w-full h-full" alt="商品图片">
                            </div>
                            <div class="ml-5">
                                <div class="font-bold">{{ record.title }}</div>
                                <div class="text-gray-500">来源: {{ record.source }}</div>
                            </div>
                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'category'">
                        <select class="w-300px" v-model="record.categoryId" @change="handleCategoryChange(record)">
                            <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
                                {{ option.label }}
                            </option>
                        </select>
                    </template>
                    <template v-if="column.dataIndex === 'ozonCategory'">
                        <div class="text-gray-600">{{ record.ozonCategoryPath }}</div>
                    </template>
                </template>
            </a-table>
        </a-modal>
    </div>

</template>

<script setup>
const columns = [
    {
        title: '产品信息',
        dataIndex: 'productInfo',
        key: 'productInfo',
        width: 400,

    },
    {
        title: '分类对应',
        dataIndex: 'category',
        key: 'category',
        width: 400,

    },
    {
        title: 'OZON分类',
        dataIndex: 'ozonCategory',
        key: 'ozonCategory',
        width: 400,
    },
];

const tableData = ref([
    {
        productInfo: '',
        category: '',
        ozonCategory: '',
    }
]);
const current = ref(0);

const dialogVisible = ref(true);

const acceptParams = ref({});

const open = (data) => {
    acceptParams.value = data;
    dialogVisible.value = true;
};

const cancel = () => {
    dialogVisible.value = false;
};

// 编辑分类
const editCategory = () => {
    emit('edit');
    cancel();
};

//  跳过
const skip = () => {
    emit('skip');
    cancel();
};

const emit = defineEmits(['cancel', 'edit', 'skip']);

defineExpose({
    open
});


</script>
<style scoped>
.card {
    background-color: #f9f9f9;
}

.imgCss {
    width: 68px;
    height: 68px;
}

.info {
    color: #999;

    p {
        margin: 0;
    }
}
</style>