<template>
    <div w-full>
        <div flex>
            <div flex-1>
                <div w-full flex justify-between m-auto>
                    <div>
                        <div>
                            <a-breadcrumb separator=">">
                                <a-breadcrumb-item>Lazada</a-breadcrumb-item>
                                <a-breadcrumb-item>在线产品</a-breadcrumb-item>
                                <a-breadcrumb-item>详情</a-breadcrumb-item>
                            </a-breadcrumb>
                        </div>
                    </div>
                </div>
                <BaseInfo id="baseInfo" ref="baseInfoRef" :detailData="detailData"></BaseInfo>
                <ProductInfo id="productInfo" ref="productInfoRef" :detailData="detailData"></ProductInfo>
                <Package id="package" ref="packageRef" :detailData="detailData"></Package>
                <ImageInfo id="imageInfo" ref="imageInfoRef" :waterList="waterList" :detailData="detailData">
                </ImageInfo>
                <Variant id="variant" ref="variantRef" :detailData="detailData"></Variant>
                <VariantInfo id="variantInfo" ref="variantInfoRef" :detailData="detailData" :isHalfway="isHalfway">
                </VariantInfo>
                <VariantImage id="variantImage" ref="variantImageRef" :waterList="waterList" :detailData="detailData">
                </VariantImage>
                <Description id="description" ref="descriptionRef" :detailData="detailData"></Description>
            </div>
            <div>
                <div w-150px mt-10px h-full px-20px>
                    <div h-full>
                        <a-timeline pending="" :reverse="false">
                            <a-timeline-item>
                                <a-button type="link" :color="baseInfoValid ? '#1677ff' : '#ec4339'"
                                    @click="scrollTo('baseInfo')">基本信息 </a-button>
                            </a-timeline-item>
                            <a-timeline-item> <a-button type="link" :color="productInfoValid ? '#1677ff' : '#ec4339'"
                                    @click="scrollTo('productInfo')">产品信息
                                </a-button>
                            </a-timeline-item>
                            <a-timeline-item> <a-button type="link" :color="packageValid ? '#1677ff' : '#ec4339'"
                                    @click="scrollTo('package')">包装信息
                                </a-button>
                            </a-timeline-item>
                            <a-timeline-item> <a-button type="link" :color="imageInfoValid ? '#1677ff' : '#ec4339'"
                                    @click="scrollTo('imageInfo')">图片信息
                                </a-button>
                            </a-timeline-item>
                            <a-timeline-item>
                                <a-button type="link" :color="variationValid ? '#1677ff' : '#ec4339'"
                                    @click="scrollTo('variantInfo')">变种参数
                                </a-button>
                            </a-timeline-item>
                            <a-timeline-item>
                                <a-button type="link" :color="variantImageValid ? '#1677ff' : '#ec4339'"
                                    @click="scrollTo('variantImage')">变种图片
                                </a-button>
                            </a-timeline-item>
                            <a-timeline-item>
                                <a-button type="link" @click="scrollTo('description')">描述信息
                                </a-button>
                            </a-timeline-item>
                        </a-timeline>
                    </div>
                </div>
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
import VariantImage from './components/variantImage.vue';
import Description from './components/description.vue';
import SelectProduct from '@/components/selectProduct/index.vue';
import { useLadazaAttrs } from "@/stores/lazadaAttrs";
import { watermarkList, lazadaEdit, lazadaProductDetail } from '@/pages/lazada/product/api';
import dayjs from 'dayjs';

const route = useRoute();
const isHalfway = ref(false);
const detailData = ref({}); // 产品详情数据
const saveLoading = ref(false);
const publishLoading = ref(false);
const waterList = ref([]); // 水印列表
const baseInfoEl = useTemplateRef('baseInfoRef');
const productInfoEl = useTemplateRef('productInfoRef');
const packageEl = useTemplateRef('packageRef');
const imageInfoEl = useTemplateRef('imageInfoRef');
const variantEl = useTemplateRef('variantRef');
const variantInfoEl = useTemplateRef('variantInfoRef');
const variantImageEl = useTemplateRef('variantImageRef');
const descriptionEl = useTemplateRef('descriptionRef');

// 校验状态
const baseInfoValid = ref(true);
const productInfoValid = ref(true);
const packageValid = ref(true);
const imageInfoValid = ref(true);
const variationValid = ref(true);
const variantImageValid = ref(true);

const { state: lazadaAttrsState, setProduct } = useLadazaAttrs();
const product = ref({});
// 引用现有产品
const selectNowProduct = () => {
    selectProductEl.value.openModal();
};

// 获取水印
const getWatermark = () => {
    watermarkList().then((res) => {
        if (res.code === 200) {
            waterList.value = res.data || [];
        }
    });
};
// 获取产品
const getProductDetail = () => {
    const params = {
        itemId: route.query.itemId
    };
    if (!params.itemId) return;
    lazadaProductDetail(params)
        .then((res) => {
            if (res.code === 200) {
                detailData.value = res.data || {};
            }
        });
};

const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

onMounted(() => {
    getProductDetail();
    getWatermark()
});
</script>

<style lang="less" scoped></style>