<template>
    <div>
        <a-card>
            <BaseForm ref="baseFormRef" layout="inline" :formList="formList" :label-col="{ style: { width: '80px' } }"
                :wrapper-col="{ style: { width: '200px' } }" labelAlign="left">
                <template #default>
                    <div class="">
                        <a-button type="primary" @click="submit">查询</a-button>
                        <a-button style="margin-left: 10px" type="default" @click="handleReset">重置</a-button>
                    </div>
                </template>
            </BaseForm>

        </a-card>
    </div>
</template>

<script setup>
import { useResetReactive } from '@/composables/reset';
import { getAccountUser, getUserDep } from '../api'
import BaseForm from '@/components/baseForm/BaseForm.vue';

const { area } = defineProps({
    area: {
        type: Array,
        default: () => []
    }
});
const baseFormEl = useTemplateRef('baseFormRef')

const formList = computed(() => {
    return [
        {
            type: "input",
            name: "alias",
            label: "别名",
            componentProps: {
            },
        },
        {
            type: "input",
            name: "simpleName",
            label: "简称",
            componentProps: {
            },
        },
        {
            type: "select",
            name: "country",
            label: "地区",
            componentProps: {
                fieldNames: { label: "label", value: "value" },
                options: area,
                // onChange: (val) => {
                //     console.log('value', val);
                //     sessionStorage.setItem('lazadaCountry', val)
                // },
            },
        },
    ];
});


const submit = () => {
    const values = baseFormEl.value.getFieldsValue();
    emits('search', values);
};
const handleReset = () => {
    baseFormEl.value.clear();
    const values = baseFormEl.value.getFieldsValue();
    emits('search', values);
};
const emits = defineEmits(['search'])

</script>