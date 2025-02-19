<template>
    <div>
        <!-- 一键生成SKU 弹窗 -->
        <BaseModal @register="register" title="SKU生成规则" @submit="submit" width="650px">
            <div flex justify-around>
                <div>
                    <a-form :model="state" :label-col="{ span: 4 }">
                        <a-form-item label="前缀：">
                            <a-input v-model:value="state.prefix" placeholder="示例： GX" />
                        </a-form-item>
                        <a-form-item label="后缀">
                            <a-input v-model:value="state.suffix" placeholder="示例： US" />
                        </a-form-item>
                    </a-form>
                </div>
                <div>
                    <p class="">SKU生成格式=[前缀]-[Variation]-[后缀]</p>
                    <p class="">生成示例：</p>
                    <p class="">前缀=BG0001，Variation=XL，后缀=CN</p>
                    <p class="">生成：BG0001-XL-CN</p>
                </div>
            </div>

        </BaseModal>
    </div>
</template>

<script setup>
import BaseModal from "@/components/baseModal/BaseModal.vue";
import { useResetReactive } from '@/composables/reset';
const modalMethods = ref();
const { state, reset } = useResetReactive({
    prefix: "",
    suffix: ""
});
const register = (methods) => {
    modalMethods.value = methods;
};
const open = () => {
    reset()
    modalMethods.value.openModal();
};
const submit = async () => {
    emits("success", state);
    modalMethods.value.closeModal();
};

const emits = defineEmits(["success"]);

defineExpose({
    open,
});

</script>

<style lang="less" scoped>
p {
    margin: 0;
    padding: 0;
    color: #999;
}
</style>