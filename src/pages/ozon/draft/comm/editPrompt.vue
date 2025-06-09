<template>
    <div>
        <a-modal v-model:open="dialogVisible" title="提示" width="700px" @cancel="cancel">
            <a-steps v-model:current="current" :items="stepsList"></a-steps>

            <div class="pt-10px">
                <div class="flex p-10px">
                    <div w-70px h-70px>
                        <div h-68px>
                            <img src="https://gw.alicdn.com/bao/uploaded/i2/2207440821122/O1CN01ENYkYQ1K9vR6IWS4E_!!2207440821122.png"
                                class="imgCss">
                        </div>
                    </div>
                    <div class="inline-block v-top">
                        <span class="gray-c">
                            【国家补贴省500元】vivo X200s新品蔡司天玑9400+旗舰芯拍照学生智能手机vivo官方旗舰店官网正品
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

        <!-- 编辑分类 -->
        <EditCategoryModal ref="editCategoryModalRef" />
    </div>

</template>

<script setup>
import EditCategoryModal from './editCategoryModal.vue';
const editCategoryModalEl = useTemplateRef('editCategoryModalRef');
const stepsList = [
    {
        status: 'finish',
        title: '选择产品',
        disabled: true,
    },
    {
        status: 'wait',
        title: '编辑分类',
        disabled: true,
    },
    {
        status: 'wait',
        title: '编辑产品',
        disabled: true,
    },
    {
        status: 'wait',
        title: '保存/发布',
        disabled: true,
    },
];
const current = ref(0);

const dialogVisible = ref(false);

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
    editCategoryModalEl.value.open();
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