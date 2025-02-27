<template>
    <div>
        <BaseModal title="选择店铺" width="1600px" @register="register" showCancelBtn showSaveBtn @close="handleClose"
            @submit="submit">
            <div overflow-auto>
                <div flex>
                    <div w-100px>
                        <a-checkbox v-model:checked="checkAll" @change="onCheckAllChange">
                            六合一
                        </a-checkbox>
                    </div>
                    <div flex-1>
                        <a-checkbox-group v-model:value="checkedList" :options="accountList" class="checkbox-group"
                            @change="onCheckChange">
                            <template #label="{ label }">
                                {{ label }}
                            </template>
                        </a-checkbox-group>
                    </div>
                </div>

                <div flex mt-10px>
                    <div w-100px>
                        同步到站点：
                    </div>
                    <div flex flex-1>
                        <a-checkbox v-model:checked="checkAreaAll" @change="checkAllAreaChange"
                            :disabled="checkedList.length === 0">
                            全部
                        </a-checkbox>
                        <a-checkbox-group v-model:value="checkedAreaList" :options="globalArea"
                            class="checkbox-area-group" @change="areaCheckChange" :disabled="checkedList.length === 0">
                            <template #label="{ label }">
                                {{ label }}
                            </template>
                        </a-checkbox-group>
                    </div>
                </div>
            </div>
        </BaseModal>
    </div>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { copy } from '@/pages/lazada/product/api';
import { globalArea } from '@/pages/lazada/product/common';
import { message } from 'ant-design-vue';
const { account } = defineProps({
    account: {
        type: Object,
        default: () => ({})
    }
});
const emits = defineEmits(['success']);

const acceptParams = ref({});
const checkAll = ref(false);
const checkedList = ref([]);
const accountList = ref([]);
const checkAreaAll = ref(false);
const checkedAreaList = ref([]);

const onCheckAllChange = () => {
    checkedList.value = checkAll.value ? accountList.value.map(item => item.value) : [];
};

const checkAllAreaChange = () => {
    checkedAreaList.value = checkAreaAll.value ? globalArea.map(item => item.value) : [];
};

const areaCheckChange = () => {
    checkAreaAll.value = checkedAreaList.value.length === globalArea.length;
};

const modelMethods = ref();
const register = (modal) => {
    modelMethods.value = modal;
};
const open = (record) => {
    acceptParams.value = record;
    modelMethods.value.openModal();
    const list = account['my'] || [];
    accountList.value = list.map((item) => {
        return {
            ...item,
            label: item.simpleName,
            value: item.shortCode
        }
    });
};
const handleClose = () => {
    accountList.value = [];
};

// 提交
const submit = () => {
    if (checkedList.value.length === 0) {
        message.error('至少选择一个店铺');
        return;
    }

    copy({
        "ventures": [
            "SG",
            "TH",
            "VN",
            "PH",
            "MY"
        ],
        "itemId": 5597461693,
        "type": "global",
        "shortCodes": [
            "MYJ2I1HC"
        ]
    }).then((res) => {
        if (res.code === 200) {
            modelMethods.value.closeModal();
        }
    })
    emits('success');
};

defineExpose({
    open,
})
</script>

<style scoped>
.checkbox-group {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 8px;
}

.checkbox-area-group {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 5px;
}
</style>