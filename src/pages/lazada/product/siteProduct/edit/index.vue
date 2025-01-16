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
                                <a-breadcrumb-item>编辑</a-breadcrumb-item>
                            </a-breadcrumb>
                        </div>
                    </div>
                    <div class="flex gap-12px">
                        <a-button type="primary" style=" height: 32px;" @click="save" :loading="saveLoading">
                            更新到lazada
                        </a-button>
                    </div>
                </div>
                <BaseInfo id="baseInfo" ref="baseInfoRef" :detailData="detailData"></BaseInfo>
                <ProductInfo id="productInfo" ref="productInfoRef" :detailData="detailData"></ProductInfo>
                <Package id="package" ref="packageRef" :detailData="detailData"></Package>
                <ImageInfo id="imageInfo" ref="imageInfoRef" :waterList="waterList" :detailData="detailData">
                </ImageInfo>
                <Variant id="variant" ref="variantRef" :detailData="detailData"></Variant>
                <VariantInfo id="variantInfo" ref="variantInfoRef" :detailData="detailData"></VariantInfo>
                <VariantImage id="variantImage" ref="variantImageRef" :waterList="waterList" :detailData="detailData">
                </VariantImage>
                <Description id="description" ref="descriptionRef" :detailData="detailData"></Description>
                <div w-full flex justify-end mt-10px>
                    <div class="flex gap-12px">
                        <a-button type="primary" style=" height: 32px;" @click="save" :loading="saveLoading">
                            更新到lazada
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
import { useLadazaAttrs } from "@/stores/lazadaAttrs";
import AddSuccessModal from './components/batchModal/addSuccessModal.vue';
import { watermarkList, lazadaAdd, lazadaProductDetail } from '@/pages/lazada/product/api';
import dayjs from 'dayjs';

const route = useRoute();
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

const { state: lazadaAttrsState, setProduct } = useLadazaAttrs();
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
    console.log('attrsForm', attrsForm);

    const packageState = packageEl.value.state;
    const taxClass = packageState.taxClass;// 税
    const packageContent = packageState.packageContent;// 包裹内容

    const imageInfoState = imageInfoEl.value.form;
    const images = imageInfoState.fileList.map((item) => item.url);// 产品图片
    const promotion_whitebkg_image = imageInfoState.promotionWhite.length > 0 ? imageInfoState.promotionWhite[0].url : '';// 营销图
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
            hasImage: true,
            customize: item.is_mandatory === 1 ? false : true,  // ??/ 必填 false ，非必填true
            options: {
                option: item.checkedList
            }
        };
    });
    // SKU数据组装
    const skus = lazadaAttrsState.skuTable.map((item, index) => {
        if (lazadaAttrsState.selectTheme.length === 1) {
            return {
                "packageHeight": item.packageHeight,
                "packageLength": item.packageLength,
                "packageWeight": item.packageWeight,
                "packageWidth": item.packageWidth,
                "packageContent": packageContent,
                "price": item.price,
                "quantity": item.quantity,
                "sellerSku": item.sellerSku,
                "specialFromDate": item.specialFromDate ? dayjs(item.specialFromDate).format('YYYY-MM-DD hh:mm:ss') : '',
                "specialToDate": item.specialToDate ? dayjs(item.specialToDate).format('YYYY-MM-DD hh:mm:ss') : '',
                "specialPrice": item.specialPrice ? dayjs(item.specialPrice).format('YYYY-MM-DD hh:mm:ss') : '',
                "saleProp": {
                    [lazadaAttrsState.selectTheme[0].name]: item[lazadaAttrsState.selectTheme[0].name],
                },
                "images": {
                    "imageList": item.fileList.map((item) => item.url)
                }
            }
        } else if (lazadaAttrsState.selectTheme.length === 2) {
            return {
                "packageHeight": item.packageHeight,
                "packageLength": item.packageLength,
                "packageWeight": item.packageWeight,
                "packageWidth": item.packageWidth,
                "packageContent": packageContent,
                "price": item.price,
                "quantity": item.quantity,
                "sellerSku": item.sellerSku,
                "specialFromDate": item.specialFromDate ? dayjs(item.specialFromDate).format('YYYY-MM-DD hh:mm:ss') : '',
                "specialToDate": item.specialToDate ? dayjs(item.specialToDate).format('YYYY-MM-DD hh:mm:ss') : '',
                "specialPrice": item.specialPrice ? dayjs(item.specialPrice).format('YYYY-MM-DD hh:mm:ss') : '',
                "saleProp": {
                    [lazadaAttrsState.selectTheme[0].name]: item[lazadaAttrsState.selectTheme[0].name],
                    [lazadaAttrsState.selectTheme[1].name]: item[lazadaAttrsState.selectTheme[1].name],
                },
                "images": {
                    "imageList": item.fileList.map((item) => item.url)
                }
            }
        }

    });
    const attributes = {
        ...attrsForm,
        ...form
    };

    return attributes

};


//  使用资料库产品
const handleSelect = (productData) => {
    product.value = productData;
    setProduct(productData);
};

// 更新到lazada 
const save = () => {
    const data = validateAll();
    console.log('data', data);
    // publishLoading.value = true;
    // lazadaAdd(res).then(res => {
    //     addSuccessModalEl.value.open();
    // }).finally(() => {
    //     publishLoading.value = false;
    // })
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