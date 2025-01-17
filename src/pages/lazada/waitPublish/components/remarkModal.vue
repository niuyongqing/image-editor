<template>
    <div>
        <!-- 批量修改备注 -->
        <BaseModal title="批量修改备注" @close="cancel" width="600px" @register="register" showCancelBtn @submit="submit">
            <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                <a-form-item label="内容:">
                    <a-textarea v-model:value="row.remark" rows="4" allow-clear />
                </a-form-item>
                <a-form-item label="颜色:">
                    <div>
                        <!-- 颜色列表 -->
                        <div class="color-list">
                            <div class="color-item" v-for="(item, index) in colorList" :key="index"
                                :class="row.remarkColor === item ? 'color-active' : ''" :style="{ background: item }"
                                @click="row.remarkColor = item"></div>
                        </div>
                    </div>
                </a-form-item>
            </a-form>
        </BaseModal>
    </div>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { message } from 'ant-design-vue';
import _ from 'lodash';

const dialogVisible = ref(false);
const loading = ref(false);
const colorList = [
    '#009926',
    '#F00',
    '#0005FD',
    '#FF5800',
    '#8E0075',
    '#FF6666',
    '#FFCAC5',
    '#00D0FF'
];
const row = ref({
    remark: '',
    remarkColor: ''
});
const modelMethods = ref();
const register = (modal) => {
    modelMethods.value = modal;
};

const open = () => {
    modelMethods.value.openModal();
};
const cancel = () => { };
const submit = () => {
    console.log('submit');
};

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
    border: 1px solid #ccc;
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