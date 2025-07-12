<template>
    <div id="OzonNewImageInfoCont" v-if="showDescription">
        <a-card class="text-left">
            <template #extra>
                <a-button type="link" @click="removeDescription"> - 移除 </a-button>
            </template>
            <template #title>
                <span>描述信息<span style="color: #9fa0a2">（编辑视频时请先选择店铺）</span></span>
            </template>
            <a-form ref="ruleForm" :model="form" :label-col="{ span: 2 }" :rules="rules">
                <a-form-item label="产品描述：" name="description">
                    <div style="width: 90%;margin-top: 10px;">
                        <a-textarea v-model:value="form.description" :rows="10" :maxlength="6000" showCount />
                    </div>
                </a-form-item>
                <a-form-item label="JSON 丰富内容：" name="jsonDes">
                    <span style="color: #ff0a37">说明：描述区图片尺寸需大于330*330，小于5000x5000，图片大小不能超过3M</span>
                    <a-form-item-rest>
                        <jsonForm @backResult="backResult" :content="form.jsons" :shop="shopCode"></jsonForm>
                    </a-form-item-rest>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup name='OzonNewImageInfo'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import { message } from "ant-design-vue";
import jsonForm from "../../config/component/json/index.vue"
import { processImageSource } from "~/pages/ozon/config/commJs/index"
const ruleForm = ref(null)
const props = defineProps({
    shopCode: String,
    productDetail: Object,
    showDescription: Boolean,
});
const form = reactive({
    video: [],
    coverUrl: "",
    description: "",
    jsons: "",
    jsonDes: "",
});

const showDescription = defineModel('showDescription', {
    type: Boolean,
    default: false,
})

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

const rules = {
    jsonDes: [{ required: true }],
}

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
const submitForm = () => {
    if (Object.keys(form.jsons).length == 0) {
        message.error("JSON富文本未填写！")
        return false;
    }
    return true;
}

// 抛出数据和方法，可以让父级用ref获取
defineExpose({
    form,
    submitForm
})


const backResult = (res) => {
    form.jsons = JSON.stringify(res);
}

const removeDescription = () => {
    form.description = "";
    form.jsons = "";
    form.jsonDes = "";
    form.video = [];
    form.coverUrl = "";
    showDescription.value = false;
}

watch(() => props.productDetail, val => {
    if (Object.keys(val).length > 0) {
        const { attributes, complexAttributes } = val.skuList[0];

        if (attributes?.length == 0 || attributes == null) return;
        const copyAttr = attributes?.filter(
            (a) => a.id == 11254 || a.id == 4191
        );
        complexAttributes && complexAttributes.forEach((item) => {
            if (item.id === 21841) {
                form.video = item.values.map((e) => {
                    return {
                        url: processImageSource(e.value),
                    }
                })
            } else if (item.id === 21845) {
                form.coverUrl = processImageSource(item.values[0].value)
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
</style>