<template>
    <div>
        <!-- 产品添加成功弹窗 -->
        <BaseModal @register="register" title="消息提示" @submit="submit" width="450px" :showSaveBtn="false"
            :showCancelBtn="false">
            <div flex>
                <div text-left>
                    产品已提交发布列表查看
                </div>
            </div>
            <template #modalFooter>
                <div flex gap-10px justify-end>
                    <a-button type="default" @click="close" style="width: 90px; height: 31px;"> 关闭 </a-button>
                    <a-dropdown>
                        <a-button type="primary" link style="width: 90px; height: 31px;">
                            创建产品
                            <DownOutlined />
                        </a-button>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item @click="createProduct">
                                    创建新产品
                                </a-menu-item>
                                <a-menu-item @click="createProductKeep">
                                    创建新产品（保留已填内容）
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
            </template>

        </BaseModal>
    </div>
</template>

<script setup>
import BaseModal from "@/components/baseModal/BaseModal.vue";
import { DownOutlined } from '@ant-design/icons-vue';
import { useLadazaAttrs } from "@/stores/lazadaAttrs";
const { reset } = useLadazaAttrs();
const modalMethods = ref();
const register = (methods) => {
    modalMethods.value = methods;
};
// 打开
const open = () => {
    modalMethods.value.openModal();
};
// 关闭
const close = () => {
    reset();
    modalMethods.value.closeModal();
    window.open('/platform/lazada/product', '_self');
};
//  创建新产品
const createProduct = () => {
    reset();
    location.reload(); // 刷新浏览器页面
    modalMethods.value.closeModal();
};
//  创建新产品（保留已填内容）
const createProductKeep = () => {
    modalMethods.value.closeModal();
};

const submit = () => {

}

defineExpose({
    open,
})


</script>

<style scoped></style>