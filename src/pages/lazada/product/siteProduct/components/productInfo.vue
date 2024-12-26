<template>
    <div class="mt-10px">
        <!-- 产品信息 -->
        <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
            <template #title>
                <div text-left> 产品信息 </div>
            </template>
            <a-form :model="state" :label-col="{ style: { width: '80px' } }" style="margin-left: 100px;" ref="formRef"
                scrollToFirstError>
                <a-form-item label="产品标题: " name="title"
                    :rules="[{ required: true, message: '请选择产品标题', trigger: ['change'] }]">
                    <a-input show-count :maxlength="255" v-model:value="state.title" placeholder="请选择产品标题" allowClear
                        class="flex  justify-start">
                    </a-input>
                </a-form-item>
                <a-form-item label="品牌:" name="brandId"
                    :rules="[{ required: true, message: '请选择品牌', trigger: ['change'] }]">
                    <a-select allowClear show-search @search="search" :filter-option="false"
                        v-model:value="state.brandId" :fieldNames="{ label: 'nameEn', value: 'brandId' }"
                        :not-found-content="brandIdSelction.searchLoading ? undefined : null"
                        :options="brandIdSelction.data" placeholder="请输入品牌">
                        <template v-if="brandIdSelction.searchLoadingg" #notFoundContent>
                            <a-spin size="small" />
                        </template>
                    </a-select>
                    <!-- 说明  -->
                    <div text-left pt-5px>
                        <a-tag color="#108ee9"> 说明! </a-tag>
                        <span class="text-#999"> 请选择下拉提示框品牌或者填写Lazada后台已有品牌，如无品牌则填写OEM。 </span>
                    </div>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup>
import { DownOutlined } from "@ant-design/icons-vue";
import { useReseReactive } from '@/composables/reset';
import { accountCache, categoryTree, getBrandList } from '@/pages/lazada/product/api';
import EventBus from "~/utils/event-bus";
import { debounce } from "lodash-es";
import { message } from "ant-design-vue";
const shortCode = ref('');
const shortCodes = ref([]); // 店铺列表
const formEl = useTemplateRef('formRef');
const primaryCategoryOptions = ref([]); // 分类列表
const { state } = useReseReactive({
    title: undefined,
    brandId: '',
});
const brandIdSelction = reactive({
    data: [],
    searchLoading: false
});
const search = debounce((value) => {
    if (!value) return;
    if (!shortCode.value) {
        message.error('请先选择店铺');
        return
    };
    brandIdSelction.data = [];
    brandIdSelction.searchLoading = true;
    getBrandList({ brandName: value, shortCode: shortCode.value }).then(res => {
        if (res.code === 200) {
            brandIdSelction.data = res.data || [];
        }
    }).finally(() => {
        brandIdSelction.searchLoading = false;
    });

}, 200);

// 校验
const validateForm = async () => {
    return new Promise((resolve, reject) => {
        formEl.value.validate().then(() => {
            resolve(true);
        }).catch(() => {
            document.querySelector('.ant-form-item-has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            reject(false);
        })
    })
};
defineExpose({
    validateForm
});

onMounted(() => {
    EventBus.on('shortCodeEmit', (code) => {
        console.log('接受到的shortCode -->>', code);
        shortCode.value = code;
        getBrandList({ brandName: '', shortCode: code }).then(res => {
            if (res.code === 200) {
                brandIdSelction.data = res.data || [];
                //  品牌设置默认 No Brand
                const brandItem = brandIdSelction.data.find((item) => {
                    return item.nameEn === item.brandId
                });
                brandIdSelction.brandId = brandItem ? brandItem.brandId : '';
            }
        }).finally(() => {
            brandIdSelction.searchLoading = false;
        });

    });
});
onBeforeUnmount(() => {
    EventBus.off('shortCodeEmit')
});


</script>

<style lang="less" scoped>
:deep(.ant-form-item-explain-error) {
    text-align: left;
}
</style>