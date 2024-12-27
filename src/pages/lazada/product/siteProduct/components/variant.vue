<template>
    <div class="mt-10px">
        <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
            <template #title>
                <div text-left> 变种参数 </div>
            </template>
            <a-form>
                <a-form-item label="变种主题:">
                    <div>
                        <div class="flex items-center gap-12px">
                            <div v-for="item in 3" :key="item" @click="handleSelectTheme(item)">
                                <PlusCircleOutlined style="color: #108ee9; font-size: 14px" />
                                <span style="color: #108ee9;"> 主题1 </span>
                            </div>
                            <a-button @click="addVariant" type="primary"> 添加自定义属性 </a-button>
                        </div>
                        <div class="flex">
                            <a-tag color="#108ee9"> 说明 </a-tag>
                            Lazada接口限制，选择了两个变种主题时，Size不能作为第一个变种主题使用！
                        </div>
                    </div>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup>
import { PlusCircleOutlined } from '@ant-design/icons-vue';

defineProps({});

const themeList = ref([]);// 主题列表theme


const handleSelectTheme = (item) => {

};

const addVariant = () => {

}

</script>

<style lang=" less" scoped></style>
