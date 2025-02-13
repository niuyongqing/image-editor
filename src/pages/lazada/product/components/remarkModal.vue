<template>
    <div>
        <!-- 修改备注 -->
        <BaseModal :title="`${isBatch ? '批量' : ''}修改备注`" @close="cancel" width="600px" @register="register"
            showCancelBtn @submit="submit">
            <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                <a-form-item label="内容:">
                    <a-textarea v-model:value="row.remark" :rows="4" allow-clear />
                </a-form-item>
                <a-form-item label="颜色:">
                    <div>
                        <!-- 颜色列表 -->
                        <div class="color-list">
                            <div class="color-item" v-for="(item, index) in colorList" :key="index"
                                :class="item.id === seletColorId ? 'color-active' : ''"
                                :style="{ background: item.color }" @click="remarkColorSelect(item)"></div>
                        </div>
                    </div>
                </a-form-item>
            </a-form>
        </BaseModal>
    </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { remark } from '@/pages/lazada/product/api';
import { colors } from '@/pages/lazada/product/common';
import _ from 'lodash';

const acceptParams = ref({});
const isBatch = ref(false);
const dialogVisible = ref(false);
const loading = ref(false);
const colorList = colors;
const row = ref({
    remark: '',
    remarkColor: ''
});
const modelMethods = ref();
const register = (modal) => {
    modelMethods.value = modal;
};
const seletColorId = ref(0);
const remarkColorSelect = (item) => {
    row.value.remarkColor = item.id;
    seletColorId.value = item.id;
}
const open = (record, batch) => {
    acceptParams.value = record;
    isBatch.value = batch;
    if (!batch) {
        row.value.remark = record.remark;
        row.value.remarkColor = record.remarkColor;
        seletColorId.value = record.remarkColor;
    };
    modelMethods.value.openModal();
};
const cancel = () => { };
const submit = () => {
    const requestParams = isBatch.value
        ? acceptParams.value.map((item) => ({
            itemId: item.itemId,
            remark: row.value.remark,
            remarkColor: row.value.remarkColor
        }))
        : [{
            itemId: acceptParams.value.itemId,
            remark: row.value.remark,
            remarkColor: row.value.remarkColor
        }];

    remark(requestParams)
        .then(() => {
            message.success('备注成功');
            modelMethods.value.closeModal();
            emits('success');
        });
};


const emits = defineEmits(['success'])
defineExpose({
    open,
})

</script>

<style lang="less" scoped>
.color-item {
    width: 20px;
    height: 20px;
    border-radius: 2px;
    margin-right: 10px;
    cursor: pointer;
    border: 3px solid #ccc;
}

.color-list {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.color-active {
    border: 2px solid #000;
}
</style>