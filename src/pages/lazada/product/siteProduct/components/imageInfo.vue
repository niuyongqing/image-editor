<template>
    <div class="mt-10px">
        <!-- 图片信息 -->
        <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
            <template #title>
                <div text-left> 图片信息 </div>
            </template>
            <a-form :model="form" :label-col="{ style: { width: '80px' } }" style="margin-left: 100px;" ref="formRef"
                scrollToFirstError>
                <a-form-item label="产品图片:" name="fileList" :rules="fileListRules">
                    <DragUpload :actionUrl="actionUrl" v-model:modelValue="form.fileList" :maxCount="8"
                        :showUploadList="false" accept=".jpg,.png" :api="uploadImage" :apiParams="apiParams">
                        <template #default>
                            <div flex flex-col w-full justify-start mb-4px text-left>
                                <p class="text-#999 mb-1px"> 点击图片拖动，即可调整图片顺序！「图片最多选用 <span class="text-#EC4339">
                                        8</span>
                                    张，已经选用了 <span class="text-#009966">{{ form.fileList.length }} </span> 张」
                                </p>
                                <p>
                                    <a-tag color="#00AEB3">说明！</a-tag>
                                    <span class="text-#999"> 图片像素在330 x 330和5000 x 5000px之间，单个图片大小不超过2M。 </span>
                                </p>
                            </div>
                        </template>
                    </DragUpload>

                </a-form-item>

                <a-form-item label="营销图:" name="promotionWhite">
                    <DragUpload :actionUrl="actionUrl" v-model:modelValue="form.promotionWhite" :maxCount="1"
                        :showUploadList="false" accept=".jpg,.png" :api="uploadImage" :apiParams="apiParams"
                        :showRightTool="false">
                        <template #default>
                            <div flex flex-col w-full justify-start mt-15px text-left mb-5px>
                                <div flex>
                                    <a-tag style="width: 45px" color="#00AEB3">说明！</a-tag>
                                    <p class="text-#999 mb-1px">
                                        1、图片格式只能为jpg、jpeg、png，且大小不超过3M；长图要求：像素不低于750×1000；方图要求：像素不低于330×330
                                    </p>
                                </div>
                                <div flex>
                                    <div style="width: 53px"></div>
                                    <p class="text-#999 mb-1px">
                                        2、6合1发布不支持设置营销图。
                                    </p>
                                </div>

                            </div>
                        </template>
                    </DragUpload>
                </a-form-item>
                <a-form-item label="产品视频:" name="video">
                    <div class="flex flex-col w-full justify-start">
                        <p class="color-#a0a3a6 text-left">
                            最小尺寸：480x480像素。最大视频长度：60秒。最大文件大小：100mb。支持的格式：mp4。新视频可能需要长达36小时才能获得批准
                            封面图尺寸：330px X 330px ~ 2000px X 2000px
                        </p>
                        <div class="flex flex-col w-full justify-start">
                            <div class="flex  w-full justify-start">
                                <a-upload name="file" :customRequest="customRequestVideo"
                                    :before-upload="videoBeforeUpload" :headers="headers" accept="video/*"
                                    :action="actionUrlVideo" :showUploadList="false" :file-list="[]" :maxCount="1"
                                    :disabled="form.video.url ? true : false">
                                    <a-button v-if="form.video.url === ''" style=" width: 120px; height: 140px;">
                                        <plus-outlined></plus-outlined>
                                        <p> 上传视频 </p>
                                    </a-button>
                                    <div v-else class="productVideoIcon">
                                        <img src="@/assets/images/productVideoIcon.png" alt="" />
                                        <div flex justify-end class="del-icon">
                                            <span @click="videoPreview">播放</span>
                                            <DeleteOutlined @click="videoDelete">
                                            </DeleteOutlined>
                                        </div>
                                    </div>
                                </a-upload>

                                <a-form-item-rest>
                                    <a-upload name="file" :customRequest="customRequestImg"
                                        :before-upload="urlBeforeUpload" :headers="headers" accept="video/*"
                                        :action="actionUrl" :showUploadList="false" style="margin-left: 15px;"
                                        :file-list="[]" :maxCount="1">
                                        <a-button v-if="form.video.url === ''" style="width: 120px; height: 140px;">
                                            <plus-outlined></plus-outlined>
                                            <p> 封面图 </p>
                                        </a-button>

                                        <div v-else class="productVideoIcon">
                                            <img src="@/assets/images/productVideoIcon.png" alt="" />
                                            <div flex justify-end class="del-icon">
                                                <DeleteOutlined>
                                                </DeleteOutlined>
                                            </div>
                                        </div>

                                    </a-upload>
                                </a-form-item-rest>
                            </div>
                            <div mt-20px>
                                <a-form-item label="视频标题:" name="title">
                                    <a-input v-model:value="form.video.title"></a-input>
                                </a-form-item>
                            </div>

                        </div>
                    </div>
                </a-form-item>
            </a-form>
        </a-card>

        <!-- 视频预览 -->
        <a-modal v-model:open="videoPreviewVisible" :footer="null">
            <template #title>
                <div flex justify-between>
                    <span>视频预览</span>
                </div>
                <video controls class="video-file" ref="videoRef">
                    <source :src="form.video.url" type="video/mp4">
                </video>
            </template>
        </a-modal>
    </div>
</template>

<script setup>
import { DownOutlined, DownloadOutlined, UploadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { useReseReactive } from '@/composables/reset';
import { accountCache, categoryTree, getBrandList, uploadImage } from '@/pages/lazada/product/api';
import EventBus from "~/utils/event-bus";
import { debounce } from "lodash-es";
import { message } from "ant-design-vue";
import DragUpload from '@/components/dragUpload/index.vue';
import { saveAs } from 'file-saver';

const videoEl = useTemplateRef('videoRef');
const shortCode = ref('');
const apiParams = ref({});
const formEl = useTemplateRef('formRef');
const primaryCategoryOptions = ref([]); // 分类列表
const { state } = useReseReactive({
    title: undefined,
    brandId: '',
});
const form = reactive({
    // 产品图片
    fileList: [],
    video: {
        url: '',
        img: '', // 视频封面
        title: '' // 视频标题
    },
    // 营销图
    promotionWhite: [

    ]
});
const fileListRules = computed(() => {
    return [
        {
            required: true,
            message: '请上传产品图片',
            trigger: ['blur'],
            validator: (rule, value) => {
                if (form.fileList.length < 1) {
                    return Promise.reject('请上传产品图片');
                }
                return Promise.resolve();
            }
        }
    ]
});
const actionUrl = import.meta.env.VITE_APP_BASE_API + '/platform-lazada/platform/lazada/file/upload/image';
const actionUrlVideo = import.meta.env.VITE_APP_BASE_API + '/platform-lazada/platform/lazada/file/upload/local/video';
const actionUrlImage = import.meta.env.VITE_APP_BASE_API + '/platform-lazada/platform/lazada/file/upload/local/video/image';
const headers = computed(() => {
    return {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + useAuthorization().value
    }
});
const videoPreviewVisible = ref(false); // 视频预览
// 视频上传校验
const videoBeforeUpload = (file) => {
    const isMp4 = file.type === 'video/mp4';
    if (!isMp4) {
        message.error('上传视频只能是 MP4 格式!');
        return false;
    }
    const isLt100M = file.size / 1024 / 1024 < 100;
    if (!isLt100M) {
        message.error('上传视频大小不能超过 100MB!');
        return false;
    }

    return true;
};
// 封面上传校验
const urlBeforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
        message.error('上传封面图只能是图格式!');
        return false;
    };
    // if (width < 330 || height < 330 || width > 2000 || height > 2000) {
    //     message.error('封面图尺寸应在 330px X 330px ~ 2000px X 2000px 之间!');
    //     return false;
    // }
    return true;
};

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


// 视频上传
const customRequestVideo = (options) => {
    console.log('-》》》》', options);

    if (!options.file) return;
};
// 删除视频
const videoDelete = (file) => {
    console.log('->>.');
    form.video.url = '';
};
// 自定义上传封面图
const customRequestImg = () => {

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


// 视频播放
const videoPreview = () => {
    videoPreviewVisible.value = true;
    nextTick(() => {
        if (!form.video.url) return;
        videoEl.value.play();
    });
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

.empty-img {
    width: 120px;
    height: 120px;
    background-color: white;
    border: 1px solid #cccccc;
}

.video-file {
    width: 178px;
    height: 178px;
    display: block;
}

.productVideoIcon {
    width: 120px;
    height: 140px;
    border: 1px solid #cccccc;
    border-radius: 5px;

    img {
        width: 100%;
        height: 115px;
    }

    .del-icon {
        border-top: 1px solid #cccccc;
        display: flex;
        justify-content: space-between;
        padding: 0px 5px;
        align-items: center;
        color: #428bca;

        span {
            cursor: pointer;
        }

    }
}
</style>