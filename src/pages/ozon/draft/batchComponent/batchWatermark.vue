<template>
    <div>
        <a-modal v-model:open="visible" title="批量加水印" width="800px" @cancel="cancel">
            <div>
                <a-form :model="formData" ref="formRef" :label-col="{ span: 3 }">
                    <a-form-item label="选择水印模板" name="watermarkContent">
                        <a-select v-model:value="formData.watermarkContent" placeholder="请输入水印内容"
                            :options="watermarkOptions" :fieldNames="{ label: 'title', value: 'id' }"
                            style="width: 50%; margin-right: 10px;">
                        </a-select>
                        <a-form-item-rest>
                            <a-checkbox v-model:checked="formData.addFirstPicNew">只在首图上加水印</a-checkbox>
                        </a-form-item-rest>
                    </a-form-item>
                    <a-form-item>
                        <a-tag color="#009999">！说明</a-tag>
                        <span> 批量加水印针对所有变种图添加，请谨慎操作 </span>
                    </a-form-item>
                </a-form>
            </div>
            <template #footer>
                <a-button type="primary" @click="submitForm">保存</a-button>
                <a-button @click="cancel">关闭</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script setup>
import { watermarkListApi } from '@/api/common/water-mark.js';

const visible = ref(false);
const watermarkOptions = ref([]);
const formData = reactive({
    watermarkContent: undefined,
    addFirstPicNew: false,
});
const cancel = () => {
    formData.watermarkContent = undefined;
    formData.addFirstPicNew = false;
    visible.value = false;
};

const getWatermarkList = () => {
    watermarkListApi().then((res) => {
        if (res.code === 200) {
            watermarkOptions.value = res.data;
        }
    });
};

const open = (rows) => {
    console.log('rows', rows);
    visible.value = true;
    getWatermarkList();
};

const submitForm = () => {
    console.log('submitForm', formData);
    visible.value = false;
    emits('success');
};

const emits = defineEmits(['success']);

defineExpose({
    visible,
    cancel,
    open,
});
</script>
<style lang="less" scoped></style>