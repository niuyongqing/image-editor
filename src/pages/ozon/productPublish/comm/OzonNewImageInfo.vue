<template>
    <div id="OzonNewImageInfoCont">
        <a-card class="text-left">
            <template #title>
                <span>描述信息<span style="color: #9fa0a2">（编辑视频时请先选择店铺）</span></span>
            </template>
            <a-form ref="ruleForm" class="richForm" :model="form" :label-col="{ span: 2 }">
                <a-form-item label="产品描述：" name="description">
                    <div style="width: 90%;margin-top: 10px;">
                        <a-textarea v-model:value="form.description" :rows="10" :maxlength="6000" showCount />
                    </div>
                </a-form-item>
                <a-form-item label="JSON富文本：">
                    <div>
                        <a-select v-model:value="form.jsonTemp" size="large" @change="changeJsonTemp" allowClear style="width: 30%"
                            :options="tempList">
                        </a-select>
                        <a-button type="link" size="middle" class="ml10px" @click="searchTemp">
                            <SyncOutlined />
                            更新模板
                        </a-button>
                    </div>
                    <div class="my10px text-16px" style="color: #737679"><a-tag color="green">说明</a-tag>小秘页面不支持设置手机端描述，保存发布后，手机端的图片及文字信息将跟PC端保持一致
                    </div>
                    <a-form-item-rest>
                        <jsonForm @backResult="backResult" :jsonContent="form.jsons"  :shop="shopCode"></jsonForm>
                    </a-form-item-rest>
                </a-form-item>
                <a-form-item label="视频：">
                    <div>
                        <a-tag type="success" effect="dark" class="text-16px">！说明</a-tag>
                        <span style="color: #9fa0a2" class="text-16px">
                            最小尺寸：640x640像素。最大文件大小：100mb。支持的格式：mp4,MOV。产品视频最多上传5个。
                        </span>
                        <br />
                    </div>
                    <div class="flex mt-2.5">
                        <div>
                            <span class="text-16px">封面视频：</span>
                            <a-upload v-if="!form.coverUrl" :maxCount="1" :action="uploadImageVideoUrl"
                                accept=".mp4,.mov" list-type="picture-card" @change="handleChange" :disabled="!shopCode"
                                :data="{
                                    shortCode: shopCode
                                }" :headers="headers" :showUploadList="false">
                                <div>
                                    <AsyncIcon icon="PlusOutlined" />
                                    <div style="margin-top: 8px">Upload</div>
                                </div>
                            </a-upload>
                            <div class="cover-item w-50 h-50" v-if="form.coverUrl">
                                <video controls :src="form.coverUrl" class="avatar" width="100%" height="200px">
                                </video>
                                <div class="image-wrap">
                                    <span></span>
                                    <a-button type="link" danger size="middle" @click="removeVideo">
                                        <AsyncIcon size="15px" icon="DeleteOutlined" />
                                    </a-button>
                                </div>
                            </div>
                        </div>
                        <div class="ml-7.5 flex flex-col">
                            <span class="text-16px">详情描述视频：</span>
                            <div class="flex">
                                <div class="video-item" v-if="form.video.length > 0">
                                    <div class="items" v-for="(item, index) in form.video" :key="index">
                                        <video controls :src="item.url" class="avatar" width="100%" height="200px">
                                        </video>
                                        <div class="image-wrap">
                                            <span></span>
                                            <a-button type="link" danger size="middle" @click="removeVideoList(index)">
                                                <AsyncIcon size="15px" icon="DeleteOutlined" />
                                            </a-button>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="form.video.length < 5">
                                    <a-upload ref="uploadVideo" list-type="picture-card" class="avatar-uploader"
                                        :action="uploadVideoUrl" :data="{
                                            shortCode: shopCode,
                                        }" :headers="headers" :disabled="!shopCode" accept=".mp4,.mov"
                                        @change="msgHandleChange" :showUploadList="false">
                                        <div>
                                            <AsyncIcon icon="PlusOutlined" />
                                            <div style="margin-top: 8px">Upload</div>
                                        </div>
                                    </a-upload>
                                </div>
                            </div>
                        </div>
                    </div>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup name='OzonNewImageInfo'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import { message, Modal } from "ant-design-vue";
import jsonForm from "../../config/component/json/index.vue"
import { processImageSource } from "~/pages/ozon/config/commJs/index"
import { useOzonProductStore } from '~@/stores/ozon-product'
import { SyncOutlined } from '@ant-design/icons-vue';
import { templateList } from "../../config/api/product";

const ruleForm = ref(null)
const props = defineProps({
    shopCode: String
});
const form = reactive({
    video: [],
    coverUrl: "",
    description: "",
    jsons: "",
    jsonTemp: null
})

const tempList = ref([])

const headers = {
    'Authorization': 'Bearer ' + useAuthorization().value,
}
const uploadUrl =
    import.meta.env.VITE_APP_BASE_API +
    // "/platform-ozon/platform/ozon/file/upload/json/img",
    "/platform-ozon/platform/ozon/file/upload/img"
const uploadVideoUrl =
    import.meta.env.VITE_APP_BASE_API +
    "/platform-ozon/platform/ozon/file/upload/video"
const uploadImageVideoUrl =
    import.meta.env.VITE_APP_BASE_API +
    "/platform-ozon/platform/ozon/file/upload/video"
const uploadVideoLoading = ref(false)

const handleChange = info => {
    if (info.file.status === 'done') {
        if (info.file.response.code == 200) {
            form.coverUrl = processImageSource(info.file.response.url)
        } else {
            message.error(info.file.response.msg)
        }
    }
}
const msgHandleChange = info => {
    if (info.file.status === 'done') {
        if (info.file.response.code == 200) {
            form.video.push({
                url: processImageSource(info.file.response.url)
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
    form.jsons = JSON.stringify(res);
}
const submitForm = () => {
    if (!form.jsons) {
        message.error("JSON富文本未填写！")
        return false;
    }
    return true;
}

const changeJsonTemp = () => {
    console.log(form.jsonTemp,"121");
    Modal.confirm({
        title: '选择富内容模板',
        content: '切换富内容模板将清空已有内容，确定要切换吗？',
        onOk: () => {
            let content = tempList.value.find(item => item.value == form.jsonTemp)?.content || {}
            console.log(form.jsonTemp,"22");
            form.jsons = content.jsonRich || ""
            console.log("form.jsons",form.jsons);
        },
        onCancel: () => {
            console.log('cancel');
        },
    });
    // let content = tempList.value.find(item => item.value == form.jsonTemp)?.content || {}
    // form.jsons = content.jsonRich
}

const searchTemp = () => {
    templateList({
        account: "",
        type: 4,
        name: "",
        pageNum: 1,
        pageSize: 99,

    }).then(res => {
        if (res.code == 200) {
            tempList.value = res.rows.map(item => {
                return {
                    label: item.name,
                    value: item.id,
                    content: item.content,
                }
            }) || []
        }
    })
}
// 引用产品模板
watch(() => useOzonProductStore().productTemplate, (val) => {
    if (val) {
        const { account, content: {
            productTemplate: {
                productDesc
            },
            jsonRich
        } } = val;
        form.description = productDesc
        form.jsons = jsonRich
    }

})

// 抛出数据和方法，可以让父级用ref获取
defineExpose({
    form,
    submitForm
})
onMounted(() => {
    searchTemp();
})
</script>
<style lang="less" scoped>
:deep(.richForm) {
    .ant-form-item {
        .ant-row {
            .ant-form-item-label>label {
                font-size: 20px !important;
            }
        }
    }
}
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
</style>