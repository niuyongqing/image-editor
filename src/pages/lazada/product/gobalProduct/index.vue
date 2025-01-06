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
                    <a-button type="primary" style="width: 90px; height: 31px;"
                        :disabled="lazadaAttrsState.primaryCategory.length ? false : true">
                        引用产品
                        <DownOutlined />
                    </a-button>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="selectNowProduct">
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
        <ImageInfo ref="imageInfoRef" :waterList="waterList"></ImageInfo>
        <Variant ref="variantRef"></Variant>
        <VariantInfo ref="variantInfoRef"></VariantInfo>
        <VariantImage ref="variantImageRef" :waterList="waterList"></VariantImage>
        <Description ref="descriptionRef"></Description>

        <div w-full flex justify-end mt-10px>
            <div class="flex gap-12px">
                <a-dropdown>
                    <a-button type="primary" style="width: 90px; height: 31px;">
                        引用产品
                        <DownOutlined />
                    </a-button>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="selectNowProduct">
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
        <!-- 选择资料库产品 弹窗 -->
        <SelectProduct ref="selectProductRef" @select="handleSelect"> </SelectProduct>
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
import VariantImage from './components/variantImage.vue';
import Description from './components/description.vue';
import SelectProduct from '@/components/selectProduct/index.vue';
import { useLadazaAttrs } from "@/stores/lazadaAttrs";
import { watermarkList } from '@/pages/lazada/product/api';

const waterList = ref([]); // 水印列表
const baseInfoEl = useTemplateRef('baseInfoRef');
const productInfoEl = useTemplateRef('productInfoRef');
const packageEl = useTemplateRef('packageRef');
const imageInfoEl = useTemplateRef('imageInfoRef');
const variantEl = useTemplateRef('variantRef');
const variantInfoEl = useTemplateRef('variantInfoRef');
const variantImageEl = useTemplateRef('variantImageRef');
const descriptionEl = useTemplateRef('descriptionRef');
const selectProductEl = useTemplateRef('selectProductRef');// 选择资料库产品 弹窗

const { state: lazadaAttrsState, setProduct } = useLadazaAttrs();
const product = ref({});
// 引用现有产品
const selectNowProduct = () => {
    selectProductEl.value.openModal();
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


//  使用资料库产品
const handleSelect = (productData) => {
    product.value = productData;
    setProduct(productData);
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

// 获取水印
const getWatermark = () => {
    watermarkList().then((res) => {
        if (res.code === 200) {
            waterList.value = res.data || [];
        }
    });
};
onMounted(() => {
    getWatermark()
})

</script>

<style lang="less" scoped></style>