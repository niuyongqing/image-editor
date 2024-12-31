<template>
    <div>
        <div class="mt-10px" v-show="lazadaAttrsState.skuAttrs.length > 0">
            <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
                <template #title>
                    <div text-left> 变种图片 </div>
                </template>
                <div>
                    <a-form :labelCol="{ span: 1 }" :wrapperCol="{ span: 23 }" :model="form">
                        <a-form-item label="变种图片:">
                            <div class="flex flex-wrap" v-for="(item, index) in lazadaAttrsState.skuTable" :key="index">
                                <SkuDragUpload :actionUrl="actionUrl" v-model:file-list="item.fileList" :maxCount="8"
                                    :showUploadList="false" accept=".jpg,.png" :api="uploadImage"
                                    :apiParams="apiParams">
                                    <template #default>
                                        <div flex flex-col w-full justify-start mb-4px text-left>
                                            <p>
                                                <a-tag color="#00AEB3">说明！</a-tag>
                                                <span class="text-#999"> 图片像素在330 x 330和5000 x 5000px之间，单个图片大小不超过2M。
                                                </span>
                                            </p>
                                        </div>
                                    </template>
                                    <template #variantInfo>
                                        <div v-if="lazadaAttrsState.selectTheme.length === 1">
                                            {{ variantInfo(item) }}
                                        </div>
                                        <div text-left v-if="lazadaAttrsState.selectTheme.length === 2">
                                            <p pb-1px mb-0> {{ variantInfo(item) }} </p>
                                            <p> {{ variantInfoTwo(item) }} </p>
                                        </div>

                                    </template>
                                    <template #skuInfo>
                                        {{ `【${item.fileList.length}/8】图片 ` }}
                                    </template>
                                </SkuDragUpload>
                            </div>


                        </a-form-item>
                    </a-form>
                </div>
            </a-card>
        </div>
    </div>
</template>

<script setup>
import { useLadazaAttrs } from "@/stores/lazadaAttrs";
import { uploadImage } from '@/pages/lazada/product/api';

const { state: lazadaAttrsState, setSkuTable } = useLadazaAttrs();
const actionUrl = import.meta.env.VITE_APP_BASE_API + '/platform-lazada/platform/lazada/file/upload/main-image';
const apiParams = computed(() => {
    return {
        shortCode: lazadaAttrsState.shortCode,
    }
});
const form = reactive({
    fileList: []
});

const variantInfo = (item) => {
    // 如果是1种 变体
    const name = lazadaAttrsState.selectTheme[0].name;
    return name + '：' + item[name]
};
const variantInfoTwo = (item) => {
    const name = lazadaAttrsState.selectTheme[1].name;
    return name + '：' + item[name]
};
</script>

<style lang="scss" scoped></style>