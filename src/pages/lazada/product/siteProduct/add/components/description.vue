<template>
    <div class="mt-10px">
        <!-- 描述信息 -->
        <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
            <template #title>
                <div text-left> 描述信息 </div>
            </template>
            <a-form :mode="form" :label-col="{ span: 1 }" :wrapper-col="{ span: 23 }">
                <a-form-item label="产品描述：">
                    <div>
                        <p class="text-red-600" text-left>
                            说明：描述区图片尺寸需大于330*330，小于5000x5000，图片大小不能超过3M
                        </p>
                        <div v-loading="descriptionLoading">
                            <WangEditor v-model="form.description" :height="500" ref="productEditorRef"
                                :editorConfig="editorConfig">
                            </WangEditor>
                        </div>

                    </div>
                </a-form-item>
                <a-form-item label="短描述">
                    <div v-loading="loading">
                        <WangEditor v-model="form.short_description" :height="500" ref="codeEditorRef"
                            :editorConfig="codeEditorConfig">
                        </WangEditor>
                    </div>
                </a-form-item>
            </a-form>

        </a-card>
    </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { marketImageLazada } from '@/pages/lazada/product/api';

const { state: lazadaAttrsState, } = useLadazaAttrs();
const valueHtml = ref('');
const productEditorEl = useTemplateRef('productEditorRef');
const codeEditorEl = useTemplateRef('codeEditorRef');
const descriptionLoading = ref(false);
const loading = ref(false);

const actionUrl = import.meta.env.VITE_APP_BASE_API + '/platform-lazada/platform/lazada/file/upload/market-image-lazada';
const headers = computed(() => {
    return {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + useAuthorization().value
    }
});

const editorConfig = {
    placeholder: "请输入内容...",
    MENU_CONF: {
        uploadImage: {
            server: actionUrl,
            headers: headers.value,
            maxFileSize: 3 * 1024 * 1024, // 3M
            allowedFileTypes: ["image/png", "image/jpg", "image/jpeg"], // 文件类型限制
            fieldName: "file",
            customInsert(res, insertFn) {
            },
            customUpload(file, insertFn) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('shortCode', lazadaAttrsState.shortCode); // 添加额外参数
                descriptionLoading.value = true;
                marketImageLazada(formData, headers.value)
                    .then((res) => {
                        if (res.code === 200) {
                            insertFn(res.url);
                            message.success('上传成功');
                        }
                    }).finally(() => {
                        descriptionLoading.value = false;
                    })
            }
        },
    },
};

const codeEditorConfig = {
    placeholder: "请输入内容...",
    MENU_CONF: {
        uploadImage: {
            server: actionUrl,
            headers: headers.value,
            maxFileSize: 3 * 1024 * 1024, // 3M
            allowedFileTypes: ["image/png", "image/jpg", "image/jpeg"], // 文件类型限制
            fieldName: "file",
            customInsert(res, insertFn) {
            },
            customUpload(file, insertFn) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('shortCode', lazadaAttrsState.shortCode); // 添加额外参数
                loading.value = true;
                marketImageLazada(formData, headers.value)
                    .then((res) => {
                        if (res.code === 200) {
                            insertFn(res.url);
                            message.success('上传成功');
                        }
                    }).finally(() => {
                        loading.value = false;
                    })
            }
        },
    },
};

const form = reactive({
    description: '',
    short_description: '',
});

watch(() => lazadaAttrsState.product, (newVal) => {
    if (newVal && JSON.stringify(newVal) !== '{}') {
        const richTextList = lazadaAttrsState.attributes.filter((item) => {
            return item.input_type === "richText" && item.is_mandatory === 1;
        });
        richTextList.forEach((item) => {
            console.log('item', item);
            form[item.item] = '<ul><li></li><ul>';
        });
        form.description = newVal.meansEnglishDescription;
        form.short_description = '<ul><li></li><ul>';
    }
});

defineExpose({
    form
});

onMounted(() => {
    nextTick(() => {
        console.log('editorEl', productEditorEl.value, codeEditorEl.value);
    });
});
</script>

<style lang="less" scoped>
:deep(.ant-form-item-explain-error) {
    text-align: left;
}

:deep(.ant-select-selector) {
    text-align: left;
}
</style>