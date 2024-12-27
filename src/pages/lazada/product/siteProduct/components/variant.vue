<template>
    <div class="mt-10px" v-show="lazadaAttrsState.skuAttrs.length > 0">
        <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
            <template #title>
                <div text-left> 变种参数 </div>
            </template>
            <a-form>
                <!-- {{ lazadaAttrsState.skuAttrs }} -->
                <a-form-item label="变种主题:">
                    <div>
                        <div class="flex items-center gap-12px">
                            <a-button type="link" v-for="item in lazadaAttrsState.skuAttrs" :key="item.id"
                                :disabled="disabledTheme(item)" @click="handleSelectTheme(item)">
                                <PlusCircleOutlined style="color: #108ee9; font-size: 14px" />
                                <span style="color: #108ee9;"> {{ item.label }} </span>
                            </a-button>
                            <a-button @click="addVariant" type="primary"
                                :disabled="lazadaAttrsState.skuAttrs.length >= 2"> 添加自定义属性
                            </a-button>
                        </div>
                        <div class="flex">
                            <a-tag color="#108ee9"> 说明 </a-tag>
                            <span style="color: #737679"> Lazada接口限制，选择了两个变种主题时，Size不能作为第一个变种主题使用！ </span>
                        </div>
                    </div>
                </a-form-item>
            </a-form>

            <a-card v-for="(item, index) in selectThemeList" :key="item.name" class="mt-10px">
                <template #title>
                    <div flex>
                        {{ item.label }}
                    </div>
                </template>
                <template #extra>
                    <a-button @click="handleRemove(item, index)" type="link"> 移除 </a-button>
                </template>
                <a-checkbox-group v-model:value="state.oneCheckedList" :options="oneCheckedOptions">
                </a-checkbox-group>
            </a-card>

        </a-card>

        <!-- 添加自定义属性弹窗 -->
        <BaseModal @register="register" ref="baseModalRef" title="添加自定义属性" width="400px" @submit="submit">
            <a-form style="margin-top: 10px;">
                <a-form-item label="添加自定义主题">
                    <a-input v-model:value="customTheme" placeholder="请输入自定义属性名称" />
                </a-form-item>
            </a-form>
        </BaseModal>
    </div>
</template>

<script setup>
import { PlusCircleOutlined } from '@ant-design/icons-vue';
import { useLadazaAttrs } from "@/stores/lazadaAttrs";
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { message } from 'ant-design-vue';
// defineProps({});
const { state: lazadaAttrsState } = useLadazaAttrs();
const baseModalEl = useTemplateRef('baseModalRef');
const modalMethods = ref({});
const selectThemeList = ref([]); // 选择的变种主题列表

const { state, reset } = useReseReactive({
    oneCheckedList: undefined,
    twoCheckedList: undefined,
});



const register = (methods) => {
    modalMethods.value = methods;
};
const customTheme = ref('');

const themeList = ref([]);// 主题列表theme

const disabledTheme = (item) => {
    if (selectThemeList.value.length >= 2) {
        return true
    };

    const findItem = selectThemeList.value.find((item) => {
        return item.label === item.label
    });
    if (findItem) {
        return true
    }
    return false
}

const handleSelectTheme = (item) => {
    selectThemeList.value.push(item);
};
// 添加自定义属性
const addVariant = () => {
    modalMethods.value.openModal();
};
// 移除选中的变种主题
const handleRemove = (item, index) => {
    selectThemeList.value.splice(index, 1);
}

const submit = () => {
    if (!customTheme.value) return;
    const findItem = lazadaAttrsState.skuAttrs.find((item) => {
        return item.label === customTheme.value
    });
    if (findItem) {
        message.warning('该属性已存在');
        return;
    }

    lazadaAttrsState.skuAttrs.push({
        label: customTheme.value,
        name: customTheme.value,
        is_mandatory: 0,
        input_type: 'multiEnumInput',
        options: []
    });
    modalMethods.value.closeModal();
}

</script>

<style lang="less" scoped>
.required {
    color: red;
    margin-right: 4px;
}
</style>