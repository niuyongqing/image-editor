<template>
    <div>
        <BaseModal title="选择店铺" width="1600px" @register="register" showCancelBtn showSaveBtn @close="handleClose"
            @submit="submit">
            <div max-h-900px overflow-auto>
                <div v-for="[key, obj] in accountList" :key="key" mt-15px>
                    <div flex gap-10px>
                        <div w-120px>
                            <a-checkbox v-model:checked="obj.checkAll" :indeterminate="obj.indeterminate"
                                @change="onCheckAllChange(obj)">
                                {{ areaMap(key) }}
                            </a-checkbox>
                        </div>
                        <div flex-1>
                            <a-checkbox-group v-model:value="obj.checkedList" :options="valueTransform(obj.value)"
                                class="checkbox-group" @change="onCheckChange(obj)">
                                <template #label="{ label }">
                                    {{ label }}
                                </template>
                            </a-checkbox-group>
                        </div>
                    </div>
                </div>
            </div>
        </BaseModal>
    </div>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { globalArea } from '@/pages/lazada/product/common';
import { copy } from '@/pages/lazada/product/api';
import { message } from 'ant-design-vue';

const { account } = defineProps({
    account: {
        type: Object,
        default: () => ({})
    }
});
const emits = defineEmits(['success']);

const acceptParams = ref({});
const accountList = ref([]);
const areaMap = (key) => {
    return globalArea.find(item => item.value === key)?.label ?? '';
};
const valueTransform = (value) => {
    return value.map(item => {
        return {
            ...item,
            label: item.simpleName,
            value: item.shortCode
        };
    });
};

const onCheckAllChange = (obj) => {
    obj.checkedList = obj.checkAll ? obj.value.map(item => item.shortCode) : [];
    if (obj.checkedList.length === 0) {
        obj.checkAll = false;
    } else if (obj.checkedList.length === obj.value.length) {
        obj.checkAll = true;
    } else {
        obj.checkAll = false;
    }
};
const onCheckChange = (obj) => {
    obj.checkAll = obj.checkedList.length === obj.value.length;
};

const modelMethods = ref();
const register = (modal) => {
    modelMethods.value = modal;
};
const open = (record) => {
    acceptParams.value = record;
    modelMethods.value.openModal();
    //  是否半托管
    const isHalf = acceptParams.value.productType === 1;
    //  是否普通商品
    const isNormal = acceptParams.value.productType === 0;
    const accountMap = Object.entries(account).reduce((acc, [key, value]) => {
        let list = [];
        if (isHalf) {
            list = value.filter((valItem) => valItem.shopModeType === 1);
        } else if (isNormal) {
            list = value.filter((valItem) => valItem.shopModeType === 0);
        } else {
            list = value;
        };
        acc[key] = {
            value: list,
            checkAll: false,
            indeterminate: false,
            checkedList: []
        };
        return acc;
    }, {});
    accountList.value = Object.entries(accountMap);
};
const handleClose = () => {
    accountList.value = [];
};

// 提交
const submit = () => {
    let shortCodes = [];
    accountList.value.forEach(item => {
        if (item[1].checkedList.length > 0) {
            shortCodes.push(...item[1].checkedList)
        }
    });
    copy({
        "itemId": acceptParams.value.itemId,
        "shortCodes": shortCodes
    }).then((res) => {
        if (res.code === 200) {
            message.success('复制成功');
            modelMethods.value.closeModal();
            emits('success');
        }
    })

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
</style>