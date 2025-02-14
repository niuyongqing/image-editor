<template>
    <div w-full>
        <div flex>
            <div flex-1>
                <div w-full flex justify-between m-auto>
                    <div>
                        <div>
                            <a-breadcrumb separator=">">
                                <a-breadcrumb-item>Lazada</a-breadcrumb-item>
                                <a-breadcrumb-item>待发布</a-breadcrumb-item>
                                <a-breadcrumb-item>编辑</a-breadcrumb-item>
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
                                    <a-menu-item @click="selectNowProduct">
                                        引用现有产品
                                    </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>

                        <a-button type="primary" style="height: 32px;" @click="save" :loading="saveLoading">
                            保存
                        </a-button>

                        <a-button type="primary" style="height: 32px;" @click="publish" :loading="publishLoading">
                            发布
                        </a-button>
                    </div>
                </div>
                <BaseInfo id="baseInfo" ref="baseInfoRef" :detailData="detailData" :type="type"></BaseInfo>
                <ProductInfo id="productInfo" ref="productInfoRef" :detailData="detailData"></ProductInfo>
                <Package id="package" ref="packageRef" :detailData="detailData"></Package>
                <ImageInfo id="imageInfo" ref="imageInfoRef" :waterList="waterList" :detailData="detailData"
                    :isHalfway="isHalfway">
                </ImageInfo>
                <Variant id="variant" ref="variantRef" :detailData="detailData"></Variant>
                <VariantInfo id="variantInfo" ref="variantInfoRef" :detailData="detailData" :isHalfway="isHalfway"
                    :type="type">
                </VariantInfo>

                <VariantImage id="variantImage" ref="variantImageRef" :waterList="waterList" :detailData="detailData"
                    :isHalfway="isHalfway">
                </VariantImage>
                <Description id="description" ref="descriptionRef" :detailData="detailData"></Description>

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

                        <a-button type="primary" style="height: 32px;" @click="save" :loading="saveLoading">
                            保存
                        </a-button>

                        <a-button type="primary" style="height: 32px;" @click="publish" :loading="publishLoading">
                            发布
                        </a-button>
                    </div>
                </div>
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
        <!-- 选择资料库产品 弹窗 -->
        <SelectProduct ref="selectProductRef" @select="handleSelect"> </SelectProduct>
        <!-- 发布成功弹窗 -->
        <AddSuccessModal ref="addSuccessModalRef"></AddSuccessModal>
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
import AddSuccessModal from './components/batchModal/addSuccessModal.vue';
import dayjs from 'dayjs';
import { useLadazaAttrs } from "@/stores/lazadaAttrs";
import { watermarkList, lazadaAdd } from '@/pages/lazada/product/api';
import { lazadaWaitProductDetail, publishCopyPublish, saveCopyPublish } from '@/pages/lazada/waitPublish/api';
import { message } from 'ant-design-vue';

const route = useRoute();
const isHalfway = ref(false); // 是否半托管
const type = ref(false); //  是否是全球商品
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
const selectProductEl = useTemplateRef('selectProductRef');// 选择资料库产品 弹窗
const addSuccessModalEl = useTemplateRef('addSuccessModalRef');// 发布成功弹窗
// 校验状态
const baseInfoValid = ref(true);
const productInfoValid = ref(true);
const packageValid = ref(true);
const imageInfoValid = ref(true);
const variationValid = ref(true);
const variantImageValid = ref(true);

const { state: lazadaAttrsState, setProduct } = useLazadaWaitPublish();
const product = ref({});
// 引用现有产品
const selectNowProduct = () => {
    selectProductEl.value.openModal();
};

//  验证校验
const validateAll = async () => {
    const baseInfoForm = await baseInfoEl.value.validateForm();
    baseInfoValid.value = baseInfoForm;
    if (!baseInfoForm) {
        return;
    }
    const productInfoForm = await productInfoEl.value.validateForm();
    productInfoValid.value = productInfoForm;
    if (!productInfoForm) {
        return;
    }
    const packageForm = await packageEl.value.validateForm();
    packageValid.value = packageValid;
    if (!packageForm) {
        return;
    }
    const imageInfoForm = await imageInfoEl.value.validateForm();
    packageValid.value = imageInfoForm;
    if (!imageInfoForm) {
        return;
    }
    const variationForm = await variantInfoEl.value.validateForm();
    variationValid.value = variationForm;
    if (!variationForm) {
        return;
    }
    const variantImage = await variantImageEl.value.validateForm();
    variantImageValid.value = variantImage;
    if (!variantImage) {
        return;
    };
    const form = await descriptionEl.value.form;

    const baseInfoState = baseInfoEl.value.state;
    const shortCode = baseInfoState.shortCode; // 店铺
    const primaryCategory = Array.isArray(baseInfoState.primaryCategory) ? baseInfoState.primaryCategory[baseInfoState.primaryCategory.length - 1] : baseInfoState.primaryCategory; // 店铺
    const productInfoState = productInfoEl.value.state;
    const title = productInfoState.title; // 标题
    const brand_id = productInfoState.brandId; // 品牌id
    const brandId = productInfoState.brandId; // 品牌id
    const model = productInfoState.model; // 型号
    const warranty_type = productInfoState.warranty_type; // 保修类型
    const warranty = productInfoState.warranty; // 保修质保时长
    // 属性
    const productClassifyAtrrs = lazadaAttrsState.productClassifyAtrrs;
    let attrsForm = {};
    productClassifyAtrrs.forEach((item) => {
        if (item.value && Array.isArray(item.value)) {
            Reflect.set(attrsForm, item.name, item.value.join(','));
        } else {
            Reflect.set(attrsForm, item.name, item.value);
        }
    });

    const packageState = packageEl.value.state;
    const taxClass = packageState.taxClass;// 税
    const packageContent = packageState.packageContent;// 包裹内容
    const packageWeight = packageState.packageWeight;
    const packageHeight = packageState.packageHeight;
    const packageLength = packageState.packageLength;
    const packageWidth = packageState.packageWidth;


    const imageInfoState = imageInfoEl.value.form;
    const images = imageInfoState.fileList.map((item) => item.url);// 产品图片
    const promotion_whitebkg_image = imageInfoState.promotionWhite.length > 0 ? [imageInfoState.promotionWhite[0].url] : [];// 营销图
    const video = imageInfoState.video.url;// 产品视频
    const cover_url = imageInfoState.video.img; // 视频封面图 
    // to do... 视频标题

    const tableData = variantInfoEl.value.tableData;
    let variations = {};
    console.log('lazadaAttrsState.selectTheme', lazadaAttrsState.selectTheme);
    lazadaAttrsState.selectTheme.forEach((item, index) => {
        variations['variation' + index] = {
            // 在这里添加你需要的属性和值
            name: item.name,
            hasImage: index === 0 ? true : false,
            customize: item.is_mandatory === 1 ? false : true,  // ??/ 必填 false ，非必填true
            options: {
                option: item.checkedList
            }
        };
    });
    // SKU数据组装
    const skus = lazadaAttrsState.skuTable.map((item) => {
        // 共同的基础属性  
        const baseProperties = {
            taxClass: taxClass,
            skuId: item.SkuId,
            packageHeight: type.value ? packageHeight : item.packageHeight,
            packageLength: type.value ? packageLength : item.packageLength,
            packageWeight: type.value ? packageWeight : Number(item.packageWeight),
            packageWidth: type.value ? packageWidth : item.packageWidth,
            packageContent: packageContent,
            price: item.price,
            quantity: item.stock,
            sellerSku: item.sellerSKU,
            supplyPrice: String(item.supplyPrice),
            images: {
                image: item.fileList.map((img) => img.url)
            }
        };
        // 动态生成 saleProp  
        const saleProp = lazadaAttrsState.selectTheme.reduce((acc, theme) => {
            acc[theme.name] = item[theme.name];
            return acc;
        }, {});

        // 处理特殊日期和价格  
        const specialDateProps = !isHalfway.value ? {
            specialFromDate: item.specialDate ? dayjs(item.specialDate[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            specialToDate: item.specialDate ? dayjs(item.specialDate[1]).format('YYYY-MM-DD HH:mm:ss') : '',
            specialPrice: item.specialPrice
        } : {};

        return {
            ...baseProperties,
            saleProp,
            ...specialDateProps
        };
    });
    const attributes = {
        "productType": isHalfway.value ? "1" : "0", // 0 普通卖家店铺, 1 半托管店铺, 2 全托管店铺
        attributes: {
            model,
            name: title,
            brand_id,
            brandId,
            warranty_type,
            warranty,
            ...attrsForm, // 产品属性
            promotion_whitebkg_image,// 营销图
            ...form, // 描述信息
        },
        shortCode,
        primaryCategory,
        images: { image: images },// 产品图片
        // video, // 产品视频
        variation: variations,
        skus: {
            sku: skus
        },
    };
    if (!promotion_whitebkg_image.length) {
        delete attributes.attributes.promotion_whitebkg_image;
    };
    return attributes
};
//  使用资料库产品
const handleSelect = (productData) => {
    product.value = productData;
    console.log('productData', productData);

    setProduct(productData);
};

// 保存
const save = async () => {
    const addParams = await validateAll();
    console.log('校验通过');
    if (!addParams) {
        return;
    };
    saveLoading.value = true;
    console.log('addParams', addParams);

    saveCopyPublish(addParams).then(res => {
        message.success('保存成功');
    }).finally(() => {
        saveLoading.value = false;
    })
};

// 发布
const publish = async () => {
    const addParams = await validateAll();
    console.log('校验通过');
    if (!addParams) {
        return;
    };
    //  先保存成功再发布
    publishLoading.value = true;
    publishCopyPublish({ ids: detailData.value.id }).then(res => {
        addSuccessModalEl.value.open();
    }).finally(() => {
        publishLoading.value = false;
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

// 获取产品
const getProductDetail = () => {
    const params = {
        id: route.query.id
    };
    type.value = route.query.type === 'global';
    const productType = route.query.productType;
    isHalfway.value = productType === '1';
    if (!params.id) return;
    lazadaWaitProductDetail(params)
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