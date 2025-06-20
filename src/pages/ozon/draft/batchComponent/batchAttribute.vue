<template>
    <div>
        <a-modal v-model:open="visible" :title="title" width="800px" @cancel="cancel">
            <div>
                <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 20 }">
                    <a-form-item label="选择要修改的属性：">
                        <a-input-search v-model:value="searchValue" placeholder="输入搜索属性" @search="onSearch" />
                    </a-form-item>
                </a-form>

                <a-card title="选择批量编辑的信息">
                    <a-checkbox v-model:checked="state.checkAll" @change="onCheckAllChange">
                        全选
                    </a-checkbox>
                    <a-checkbox-group v-model:value="state.checkedList" :options="plainOptions" />
                </a-card>
            </div>

            <template #footer>
                <a-button type="primary" @click="submitForm">保存</a-button>
                <a-button @click="cancel">关闭</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script setup>
const searchValue = ref('');
const title = ref('批量修改属性');
const seelctRows = ref({});
const visible = ref(true);

const plainOptions = ['Apple', 'Pear', 'Orange'];
const state = reactive({
    checkAll: false,
    checkedList: [],
});

const open = (params) => {
    title.value = params.title;
    seelctRows.value = params.data;
    visible.value = true;
};
const cancel = () => {
    visible.value = false;
};

const onSearch = () => {

};

// 保存
const submitForm = () => {
    visible.value = false;
    emits('success');
};

const emits = defineEmits(['success']);
defineExpose({
    open,
});
</script>