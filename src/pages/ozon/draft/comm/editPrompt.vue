<template>
    <div>
        <a-modal v-model:open="dialogVisible" title="提示" width="700px" @cancel="cancel" :maskClosable="false">
            <a-steps v-model:current="current" :items="stepsList"></a-steps>

            <div class="pt-10px">
                <div class="flex p-10px">
                    <div w-70px h-70px>
                        <div h-68px>
                            <img :src="primaryImage(acceptParams.primaryImage)" class="imgCss">
                        </div>
                    </div>
                    <div class="inline-block v-top">
                        <span class="gray-c">
                            <div>{{ acceptParams.name }}</div>
                        </span>
                    </div>
                </div>
            </div>
            <template #footer>
                <div flex justify-between w-full>
                    <div class="info">
                        <p> 说明！编辑分类，可使搬家/采集产品信息更完善； </p>
                        <p> 若选择跳过，需重新手动选择分类、添加变种信息。 </p>
                    </div>
                    <div content-end>
                        <a-button type="primary" @click="editCategory" style="height: 32px;">编辑分类</a-button>
                        <a-button @click="skip" style="height: 32px; background-color: #F5F5F5;">跳过，去编辑产品</a-button>
                    </div>
                </div>

            </template>
        </a-modal>
        <EditCategoryModal ref="editCategoryModalRef" :shopAccount="shopAccount" />
    </div>

</template>

<script setup>
import EditCategoryModal from './editCategoryModal.vue';

const { shopAccount } = defineProps({
    shopAccount: {
        type: Array,
        default: () => []
    }
})

const baseApi = import.meta.env.VITE_APP_BASE_API;
const editCategoryModalEl = useTemplateRef('editCategoryModalRef');
const stepsList = [
    {
        title: '选择产品',
        disabled: true,
    },
    {
        title: '编辑分类',
        disabled: true,
    },
    {
        title: '编辑产品',
        disabled: true,
    },
    {
        title: '保存/发布',
        disabled: true,
    },
];
const current = ref(1);

const dialogVisible = ref(false);

const acceptParams = ref({});


const primaryImage = (primaryImage) => {
    if (primaryImage.includes('https')) {
        return primaryImage
    }
    return baseApi + primaryImage
};

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
    editCategoryModalEl.value.open(acceptParams.value);
    cancel();
};

//  跳过
const skip = () => {
    emit('skip');
    window.open(`/platform/ozon/editDraftProduct?account=${acceptParams.value.account}&id=${acceptParams.value.gatherProductId}`, '_blank')
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