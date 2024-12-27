<template>
    <div w-full>
        <div w-full flex justify-between m-auto>
            <div>
                <div>
                    <a-breadcrumb separator=">">
                        <a-breadcrumb-item>Lazada</a-breadcrumb-item>
                        <a-breadcrumb-item>创建产品</a-breadcrumb-item>
                    </a-breadcrumb>
                </div>
            </div>
            <div class="flex gap-12px">
                <a-dropdown>
                    <a-button type="primary" style="width: 90px; height: 31px;">
                        引用产品
                        <DownOutlined />
                    </a-button>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="syncProduct">
                                引用现有产品
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
                <a-button type="primary" style="width: 51px; height: 32px;" @click="save">
                    保存
                </a-button>

                <a-button type="primary" style="width: 51px; height: 32px;" @click="publish">
                    发布
                </a-button>
            </div>
        </div>
        <BaseInfo ref="baseInfoRef"></BaseInfo>
        <ProductInfo ref="productInfoRef"></ProductInfo>
        <Package ref="packageRef"></Package>
        <ImageInfo ref="imageInfoRef"></ImageInfo>
        <Variant ref="variantRef"></Variant>
        <VariantInfo ref="variantInfoRef"></VariantInfo>
        <div w-full flex justify-end mt-10px>
            <div class="flex gap-12px">
                <a-dropdown>
                    <a-button type="primary" style="width: 90px; height: 31px;">
                        引用产品
                        <DownOutlined />
                    </a-button>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="syncProduct">
                                引用现有产品
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
                <a-button type="primary" style="width: 51px; height: 32px;" @click="save">
                    保存
                </a-button>

                <a-button type="primary" style="width: 51px; height: 32px;" @click="publish">
                    发布
                </a-button>
            </div>
        </div>

    </div>

</template>

<script setup>
import { DownOutlined } from '@ant-design/icons-vue';
import BaseInfo from './components/baseInfo.vue';
import Package from './components/package.vue';
import ProductInfo from './components/productInfo.vue';
import ImageInfo from './components/imageInfo.vue';
import VariantInfo from './components/variantInfo.vue';
import Variant from './components/variant.vue';

const baseInfoEl = useTemplateRef('baseInfoRef');
const productInfoEl = useTemplateRef('productInfoRef');
const packageEl = useTemplateRef('packageRef');
const imageInfoEl = useTemplateRef('imageInfoRef');
const variantEl = useTemplateRef('variantRef');
const variantInfoEl = useTemplateRef('variantInfoRef');
// 引用现有产品
const syncProduct = () => {

};

//  验证校验
const validateAll = async () => {
    const baseInfoForm = await baseInfoEl.value.validateForm();
    if (!baseInfoForm) {
        return;
    }
    const productInfoForm = await productInfoEl.value.validateForm();
    if (!productInfoForm) {
        return;
    }
    const packageForm = await packageEl.value.validateForm();
    if (!packageForm) {
        return;
    }
    // const imageInfoForm = imageInfoEl.value.validateForm();
    // if (!imageInfoForm) {
    //     return;
    // }
};

// 保存
const save = () => {
    validateAll()
};

// 发布
const publish = () => {
    validateAll().then(() => {
        console.log('校验通过');
    })
};
</script>

<style lang="less" scoped></style>