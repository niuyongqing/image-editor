<template>
    <div id="OzonNewImageInfoCont">
        <a-card class="text-left">
            <template #title>
                <span>描述信息<span style="color: #9fa0a2">（编辑视频时请先选择店铺）</span></span>
            </template>
            <a-form ref="ruleForm" :model="form" :label-col="{ span: 2 }" :rules="rules">
                <a-form-item label="产品描述：" name="description">
                    <span style="color: #ff0a37;">说明：描述区图片尺寸需大于330*330，小于5000x5000，图片大小不能超过3M</span>
                    <div style="width: 90%;margin-top: 10px;">
                        <a-textarea v-model:value="form.description" :rows="10" :maxlength="6000" showCount />
                    </div>
                </a-form-item>
                <a-form-item label="JSON 丰富内容：" name="jsons">
                    <span style="color: #ff0a37">说明：描述区图片尺寸需大于330*330，小于5000x5000，图片大小不能超过3M</span>
                    <a-form-item-rest>
                        <jsonForm @backResult="backResult" :content="form.jsons" :shop="shopCode"></jsonForm>
                    </a-form-item-rest>
                </a-form-item>
                <a-form-item label="视频：">
                    <div>
                        <a-tag type="success" effect="dark">！说明</a-tag>
                        <span style="color: #9fa0a2">
                            最小尺寸：640x640像素。最大文件大小：100mb。支持的格式：mp4,MOV。产品视频最多上传5个。
                        </span>
                        <br />
                    </div>
                    <div class="flex">
                        <div class="ml-7.5 flex flex-col">
                            <p m-10px>封面视频：</p>
                            <a-upload name="file" :customRequest="customRequestCoverVideo" :headers="headers"
                                accept="video/*" :showUploadList="false" :file-list="videoFile" :maxCount="1"
                                :disabled="form.coverVideoUrl ? true : false">
                                <a-button v-if="!form.coverVideoUrl" style="width: 120px; height: 140px;">
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
                        </div>
                        <div class="ml-7.5 flex flex-col">
                            <p m-10px>详情描述视频：</p>
                            <div flex gap-10px>
                                <div v-for="item in form.detailVideoList" :key="item.url">
                                    <a-upload name="file" :customRequest="customRequestDetailVideo" :headers="headers"
                                        accept="video/*" :showUploadList="false" :file-list="form.detailVideoList"
                                        :maxCount="1" :disabled="item.url ? true : false" v-if="item.url">
                                        <div class="productVideoIcon">
                                            <img src="@/assets/images/productVideoIcon.png" alt="" />
                                            <div flex justify-end class="del-icon">
                                                <span @click="detailVideoPreview(item)">播放</span>
                                                <DeleteOutlined @click="detailVideoDelete(item)">
                                                </DeleteOutlined>
                                            </div>
                                        </div>
                                    </a-upload>
                                </div>

                                <a-upload name="file" v-if="form.detailVideoList.length < 5"
                                    :customRequest="customRequestDetailVideo" :headers="headers" accept="video/*"
                                    :showUploadList="false" :file-list="[]" :maxCount="1">
                                    <a-button style=" width: 120px; height: 140px;">
                                        <plus-outlined></plus-outlined>
                                        <p> 上传视频 </p>
                                    </a-button>
                                </a-upload>
                            </div>
                        </div>
                    </div>
                </a-form-item>
            </a-form>
        </a-card>
        <a-modal v-model:open="videoPreviewVisible" :footer="null" width="600px">
            <template #title>
                <div flex justify-between>
                    <span>视频预览</span>
                </div>
            </template>
            <div flex justify-center>
                <video controls class="video-file" ref="videoRef" style="width: 400px; height: 400px;">
                    <source :src="videoUrl" type="video/mp4">
                </video>
            </div>
        </a-modal>
    </div>
</template>

<script setup name='OzonNewImageInfo'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import { message } from "ant-design-vue";
import jsonForm from "../../config/component/json/index.vue"
import { processImageSource } from "~/pages/ozon/config/commJs/index"
import { videoUpload } from "~/pages/ozon/config/api/draft"
import { DownOutlined, DownloadOutlined, UploadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons-vue";

const videoEl = useTemplateRef('videoRef');
const ruleForm = ref(null)
const props = defineProps({
    shopCode: String,
    productDetail: Object,
});
const form = reactive({
    video: [],
    coverUrl: "",
    description: "",
    jsons: "",
    coverVideoUrl: '',
    detailVideoList: [],

});

const videoUrl = ref('');
const copyJson = ref([])
const headers = {
    'Content-Type': 'multipart/form-data',
    'Authorization': 'Bearer ' + useAuthorization().value,
}
const uploadUrl =
    import.meta.env.VITE_APP_BASE_API +
    "/platform-ozon/platform/ozon/file/upload/img"
const uploadVideoUrl =
    import.meta.env.VITE_APP_BASE_API +
    "/platform-ozon/platform/ozon/file/upload/video"
const uploadImageVideoUrl =
    import.meta.env.VITE_APP_BASE_API +
    "/platform-ozon/platform/ozon/file/upload/video"
const uploadVideoLoading = ref(false)

const videoImageFile = ref([]);
const videoFile = ref([]);
const videoPreviewVisible = ref(false);

const rules = {
    jsons: [{ required: true }],
}

const handleChange = info => {
    if (info.file.status === 'done') {
        if (info.file.response.code == 200) {
            form.coverUrl = info.file.response.url
        } else {
            message.error(info.file.response.msg)
        }
    }
}
const msgHandleChange = info => {
    if (info.file.status === 'done') {
        if (info.file.response.code == 200) {
            form.video.push({
                url: info.file.response.url
            })
        } else {
            message.error(info.file.response.msg)
        }
    }
}
const removeVideo = () => {
    form.coverUrl = ""
}
const removeVideoList = (index) => {
    form.video.splice(index, 1)
}
const backResult = (res) => {
    form.jsons = res
}

const submitForm = () => {
    if (Object.keys(form.jsons).length == 0) {
        message.error("JSON富文本未填写！")
        return false;
    }
    return true;
};

// 封面-视频播放
const videoPreview = () => {
    videoPreviewVisible.value = true;
    nextTick(() => {
        videoUrl.value = form.coverVideoUrl;
        videoEl.value.play();
    });
};

// 详情-视频播放
const detailVideoPreview = (item) => {
    videoPreviewVisible.value = true;
    nextTick(() => {
        videoUrl.value = item.url;
        videoEl.value.play();
    });
};


// 封面-视频上传
const customRequestCoverVideo = (options) => {
    if (!options.file) return;
    const formData = new FormData();
    formData.append('shortCode', props.shopCode);
    formData.append('file', options.file);
    videoUpload(formData, options.headers).then(res => {
        form.coverVideoUrl = import.meta.env.VITE_APP_BASE_API + res.url;
    })
};

// 封面- 删除视频
const videoDelete = (file) => {
    form.coverVideoUrl = ''
};

// 详情-视频删除
const detailVideoDelete = (item) => {
    form.detailVideoList = form.detailVideoList.filter((i) => i.url != item.url)
};

const customRequestDetailVideo = (options) => {
    if (!options.file) return;
    const formData = new FormData();
    formData.append('shortCode', props.shopCode);
    formData.append('file', options.file);
    videoUpload(formData, options.headers).then(res => {
        form.detailVideoList.push({
            url: import.meta.env.VITE_APP_BASE_API + res.url
        })
    })
};
defineExpose({
    form,
    submitForm
})

watch(() => props.productDetail, val => {
    if (Object.keys(val).length > 0) {
        const { attributes, complexAttributes } = val.skuList[0];

        if (attributes?.length == 0 || attributes == null) return;
        const copyAttr = attributes?.filter(
            (a) => a.id == 11254 || a.id == 4191
        );
        complexAttributes && complexAttributes.forEach((item) => {
            if (item.id === 21841) {
                form.video.push({
                    url: processImageSource(item.values[0].value)
                })
            } else if (item.id === 21845) {
                form.coverVideoUrl = processImageSource(item.values[0].value)
            }
        });
        copyAttr.forEach(e => {
            if (e.id === 11254) {
                form.jsons = e.values[0].value
            } else {
                form.description = e.values[0].value
            }
        })
    }
})
</script>
<style lang="less" scoped>
.cover-item {
    position: relative;

    .image-wrap {
        position: absolute;
        bottom: -30px;
        left: 0;
        width: 200px;
        background-color: rgba(5, 5, 5, 0.3);
        padding: 0 4px;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}

.video-item {
    display: flex;
    flex-wrap: wrap;

    .items {
        position: relative;
        margin-right: 20px;
        margin-bottom: 40px;
    }

    .image-wrap {
        position: absolute;
        bottom: -25px;
        left: 0;
        width: 200px;
        background-color: rgba(5, 5, 5, 0.3);
        padding: 0 4px;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
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