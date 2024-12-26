<template>
    <div class="mt-10px">
        <!-- 图片信息 -->
        <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
            <template #title>
                <div text-left> 图片信息 </div>
            </template>

            <a-form :model="form" :label-col="{ style: { width: '80px' } }" style="margin-left: 100px;" ref="formRef"
                scrollToFirstError>
                <a-form-item label="产品图片:" name="fileList" :rules="[{ required: true, message: '请输入标题' }]">
                    <div>
                        <DragUpload :actionUrl="actionUrl" v-model:modelValue="form.fileList" :maxCount="8"
                            :showUploadList="false" accept=".jpg,.png" :api="uploadImage" :apiParams="apiParams">
                        </DragUpload>
                    </div>

                    <div flex flex-col w-full justify-start mb-5px text-left>
                        <p class="text-#999 mb-1px"> 点击图片拖动，即可调整图片顺序！「图片最多选用 <span class="text-#EC4339"> 8</span>
                            张，已经选用了 <span class="text-#009966">{{ form.fileList.length }} </span> 张」
                        </p>
                        <p>
                            <a-tag color="#108ee9">说明！</a-tag>
                            <span class="text-#999"> 图片像素在330 x 330和5000 x 5000px之间，单个图片大小不超过2M。 </span>
                        </p>
                    </div>
                </a-form-item>
                <a-form-item-rest label="产品视频:" name="video">
                    <div class="flex flex-col w-full justify-start">
                        <p class="color-#a0a3a6 text-left">
                            最小尺寸：480x480像素。最大视频长度：60秒。最大文件大小：100mb。支持的格式：mp4。新视频可能需要长达36小时才能获得批准
                            封面图尺寸：330px X 330px ~ 2000px X 2000px
                        </p>
                        <div class="flex flex-col w-full justify-start">
                            <div class="flex  w-full justify-start">
                                <a-upload name="file" :customRequest="customRequest" :before-upload="beforeUpload"
                                    :headers="headers" accept="video/*" :action="actionUrl" :showUploadList="false">
                                    <a-button v-if="form.video.url === ''" style="width: 120px; height: 140px;">
                                        <plus-outlined></plus-outlined>
                                        <p> 上传视频 </p>
                                    </a-button>
                                </a-upload>

                                <a-upload name="file" :customRequest="customRequest" :before-upload="beforeUpload"
                                    :headers="headers" accept="video/*" :action="actionUrl" :showUploadList="false"
                                    style="margin-left: 15px;">
                                    <a-button v-if="form.video.url === ''" style="width: 120px; height: 140px;">
                                        <plus-outlined></plus-outlined>
                                        <p> 封面图 </p>
                                    </a-button>
                                </a-upload>
                            </div>
                            <div mt-20px>
                                <a-form-item label="视频标题:" name="title">
                                    <a-input v-model:value="form.video.title"></a-input>
                                </a-form-item>
                            </div>

                        </div>
                    </div>
                </a-form-item-rest>
            </a-form>
        </a-card>
    </div>
</template>

<script setup>
import { DownOutlined, DownloadOutlined, UploadOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { useReseReactive } from '@/composables/reset';
import { accountCache, categoryTree, getBrandList, uploadImage } from '@/pages/lazada/product/api';
import EventBus from "~/utils/event-bus";
import { debounce } from "lodash-es";
import { message } from "ant-design-vue";
import DragUpload from '@/components/dragUpload/index.vue';
import { saveAs } from 'file-saver';

const shortCode = ref('');
const apiParams = ref({});
const formEl = useTemplateRef('formRef');
const primaryCategoryOptions = ref([]); // 分类列表
const { state } = useReseReactive({
    title: undefined,
    brandId: '',
});
const form = reactive({
    fileList: [
        {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-2',
            name: 'image.png',
            status: 'done',
            url: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.uPx-FbZ4nf2U05kCoJ7_1QHaE8?rs=1&pid=ImgDetMain',
        },
    ], // 产品图片
    video: {
        url: '',
        img: '', // 视频封面
        title: '' // 视频标题
    }
});
const actionUrl = import.meta.env.VITE_APP_BASE_API + '/platform-lazada/platform/lazada/file/upload/image';
const headers = computed(() => {
    return {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + useAuthorization().value
    }
});

const customRequest = (options) => {
    if (!options.file) return;
    const formData = new FormData();
    formData.append('file', options.file);
    uploadImage(formData, options.headers).then(res => {
        if (res.code === 200) {
            // form.video.img =  import.meta.env.VITE_APP_BASE_API +  + res.data.url;
        }
    })
};


const handleCancel = () => {
    previewVisible.value = false;
    previewTitle.value = '';
};
const handlePreview = async file => {
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};


//   导出全部图片
const downloadIamge = () => {
    const blob = new Blob(['Hello, world!'], { type: 'image/png' });
    saveAs(blob, 'hello.txt');
};

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
        console.log('接受到的shortCode22 -->>', code);
        shortCode.value = code;
        apiParams.value = { shortCode: code }
    });
});
</script>

<style lang="less" scoped>
:deep(.ant-form-item-explain-error) {
    text-align: left;
}
</style>