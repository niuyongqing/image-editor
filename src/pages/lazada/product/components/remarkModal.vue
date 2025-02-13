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
                                :class="row.remarkColor === item.color ? 'color-active' : ''"
                                :style="{ background: item.color }" @click="remarkColorSelect"></div>
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
import _ from 'lodash';

const acceptParams = ref({});
const isBatch = ref(false);
const dialogVisible = ref(false);
const loading = ref(false);
const colorList = [
    {
        id: 1,
        color: '#009926',
    },
    {
        id: 2,
        color: '#F00',
        name: '红色'
    },
    {
        id: 3,
        color: '#0005FD',
    },
    {
        id: 4,
        color: '#FF5800',
    },
    {
        id: 5,
        color: '#8E0075',
    },
    {
        id: 6,
        color: '#FF6666',
    },
    {
        id: 7,
        color: '#FFCAC5',
    },
    {
        id: 8,
        color: '#00D0FF',
    }
];
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
    row.value.remarkColor = item.color;
    console.log('row', row.value);
    seletColorId.value = item.id;
}
const open = (record, batch) => {
    acceptParams.value = record;
    isBatch.value = batch;
    modelMethods.value.openModal();
};
const cancel = () => { };
const submit = () => {
    if (isBatch.value) {
        const requestParams = acceptParams.value.map((item) => {
            return {
                itemId: item.itemId,
                "remark": row.value.remark,
                "remarkColor": row.value.remarkColor
            }
        });
        remark({
            "request": requestParams
        }).then(() => {
            message.success('备注成功');
            modelMethods.value.closeModal();
            emits('success')
        })
    } else {
        remark({
            "request": [{
                "itemId": acceptParams.value.itemId,
                "remark": row.value.remark,
                "remarkColor": row.value.remarkColor
            }]
        }).then(() => {
            message.success('备注成功');
            modelMethods.value.closeModal();
            emits('success')
        })
    }

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