<template>
    <div w-full>
        <div flex justify-end items-center mt-15px v-if="showRightTool">
            <a-dropdown>
                <a-button type="link" link style="width: 90px; height: 31px;">
                    普通水印
                    <DownOutlined />
                </a-button>
                <template #overlay>
                    <a-menu>
                        <a-menu-item v-for="item in waterList" :key="item" @click="watermark(item)">
                            {{ item.title }}
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
            <span pl-10px>|</span>
            <a-dropdown>
                <a-button type="link" style="width: 90px; height: 31px; margin-left: 10px;">
                    编辑图片
                    <DownOutlined />
                </a-button>
                <template #overlay>
                    <a-menu>
                        <a-menu-item @click="handleEditImagesSize">
                            批量修改图片尺寸
                        </a-menu-item>
                        <a-menu-item @click="clearAllImages">
                            清空图片
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </div>

        <div>
            <slot></slot>
        </div>
        <!-- SKU 图片上传可拖拽 :multiple="true" -->
        <div flex justify-between w-full>
            <a-upload name="file" :customRequest="customRequest" :before-upload="beforeUpload" :headers="headers"
                :accept="getProps.accept" :multiple="true" :maxCount="getProps.maxCount" :action="getProps.actionUrl" :showUploadList="false" :disabled="disabled">
                <a-button type="primary" v-if="fileList.length < getProps.maxCount" style="width: 90px; height: 31px;">
                    <UploadOutlined></UploadOutlined>
                    选择图片
                </a-button>
            </a-upload>

            <div>
                <slot name="variantInfo"> </slot>
            </div>
            <div>
                <slot name="skuInfo"> </slot>
            </div>
            <div></div>
            <div></div>
        </div>


        <div flex flex-wrap mt-10px>
            <draggable v-if="fileList.length > 0" v-model="fileList" @end="handleDragEnd" tag="div" class="flex"
                item-key="url">
                <template #item="{ element }">
                    <a-card ml-10px p-0px rounded-none class="file-card" hoverable>
                        <div :key="element.uid">
                            <div class="file-item">
                                <div v-if="element.loading" w-160px h-160px flex items-center justify-center>
                                    <loading-outlined></loading-outlined>
                                </div>
                                <div v-else class="file-img">
                                    <img :src="element.url" alt="" class="file-img"
                                        @load="handleImageLoad(element, $event)" @click="handlePreview(element)"
                                        :key="element.key" />
                                    <div class="image-mask"> {{ element.height }} X {{ element.width }} </div>
                                </div>
                            </div>
                        </div>
                        <div w-full>
                            <div flex justify-end w-full>
                                <a-button type="text" color="#428bca" @click="handleRemove(element)">
                                    <DeleteOutlined />
                                </a-button>
                            </div>
                        </div>
                    </a-card>
                </template>
            </draggable>
            <!-- 暂无图片 -->
            <div class="empty-img" v-else>
                <img src="@/assets/images/kong.png" alt="" />
            </div>

            <a-modal v-model:open="previewVisible" :footer="null">
                <template #title>
                    <div flex justify-between>
                        <span>图片预览</span>
                    </div>
                    <img :src="previewImage" alt="" style="width: 100%" />
                </template>
            </a-modal>
        </div>
        <!-- 批量修改图片尺寸弹窗 -->
        <BacthSkuEditImg ref="BacthEditImgSizeRef" :fileList="fileList" />
    </div>
</template>

<script setup>
import draggable from 'vuedraggable';
import { UploadOutlined, DownOutlined, DownloadOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { useAuthorization } from '~/composables/authorization'
import { getBase64 } from '@/pages/lazada/product/common'
import BaseModal from '@/components/baseModal/BaseModal.vue'
import BacthSkuEditImg from './bacthSkuEditImg.vue';
import { message } from "ant-design-vue";
import { scaleApi, watermarkApi } from '@/api/common/water-mark.js';
const props = defineProps({
    disabled: {
        type: Boolean,
        default: false
    },
    //  水印列表
    waterList: {
        type: Array,
        required: true
    },
    actionUrl: {
        type: String,
        default: ''
    },
    //  后端接口
    api: {
        type: Function,
        required: true
    },
    //  后端接口 传参
    apiParams: {
        type: Object,
    },
    //  额外的 上传前处理
    extraBeforeUpload: {
        type: Function,
        default: () => {
            return true
        }
    },
    //  
    showRightTool: {
        type: Boolean,
        default: true
    }
});
const bacthEditImgSizeEl = useTemplateRef('BacthEditImgSizeRef');
const attrs = useAttrs();
const fileList = defineModel('file-list'); // 图片列表
const previewVisible = ref(false);
const previewImage = ref('');
const headers = computed(() => {
    return {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + useAuthorization().value
    }
});

const getProps = computed(() => {
    return {
        ...attrs,
        ...unref(props)
    }
});
const customRequest = (options) => {
    if (!options.file) return;
    const formData = new FormData();
    formData.append('file', options.file);
    if (props.apiParams) {
        for (const key in props.apiParams) {
            formData.append(key, props.apiParams[key]);
        }
    };
    props.api(formData, options.headers).then(res => {
        if (res.code === 200) {
            fileList.value.push({
                ...res,
                uid: res.url,
                name: res.originalFilename,
                url: import.meta.env.VITE_APP_BASE_API + res.url,
            });
        }
    })
};
// 图片预览
const handlePreview = (file) => {
    previewImage.value = file.url;
    previewVisible.value = true;
};

const handleRemove = (file) => {
    const index = fileList.value.indexOf(file);
    const newFileList = fileList.value;
    newFileList.splice(index, 1);
    fileList.value = newFileList;
};

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('上传图片只能是 JPG、PNG 格式!');
        return false;
    };
    // 不能超过2MB
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('上传图片大小不能超过 2MB!');
        return false;
    };

    // 不能超过最大限制
    if (fileList.value.length >= getProps.value.maxCount) {
        message.error(`最多上传${getProps.value.maxCount}张图片`);
        return false;
    }
    if (props.extraBeforeUpload) {
        return props.extraBeforeUpload();
    }
    return true;
};



const handleImageLoad = (el, event) => {
    nextTick(() => {
        const img = event.target;
        el.width = img ? img.naturalWidth : '';
        el.height = img ? img.naturalHeight : '';
        el.key = 1;
    });
};
// 导出全部图片
const downloadAllImages = () => {

};

// 批量修改图片尺寸
const handleEditImagesSize = () => {
    console.log('批量修改图片尺寸');
    bacthEditImgSizeEl.value.showModal(fileList.value);
};
//  清空图片
const clearAllImages = () => {
    fileList.value = [];
};

const handleDragEnd = (event) => {
    console.log('拖拽结束', event);
};
// 点击水印
const watermark = async (item) => {
    //  添加水印
    const imagePathList = fileList.value.filter((file) => !file.url.includes('http')).map((item) => {
        return item.url
    });
    if (!imagePathList.length) {
        message.error('请先本地上传图片');
        return
    }
    const waterRes = await watermarkApi({
        imagePathList: imagePathList,
        id: item.id,
    });
    if (waterRes.code === 200) {
        const data = waterRes.data || [];
        data.forEach((item) => {
            fileList.value.forEach(v => {
                if (item.originalFilename === v.url) {
                    v.url = item.url
                    v.name = item.newFileName
                    v.checked = false
                }
            })
        })
    }
};

watch(() => fileList.value, (newVal) => {
    if (newVal.length > getProps.value.maxCount) {
        const overCount = newVal.length - getProps.value.maxCount;
        fileList.value = newVal.slice(0, getProps.value.maxCount);
        message.warning(`最多上传 ${getProps.value.maxCount} 张，已自动移除最后 ${overCount} 张`);
    }
}, { deep: true })
</script>

<style scoped lang="less">
:deep(.ant-card-body) {
    padding: 1px;
}

.custom-upload .ant-upload {
    width: 160px;
    height: 160px;
    margin: 0 auto;
}

.file-item {
    margin-right: 8px;
    position: relative;
}

.file-img {
    width: 160px;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    object-fit: cover;
}


.delete-icon,
.download-icon {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    color: red;
}

.download-icon {
    right: 20px;
    color: blue;
}

:deep(.ant-card-body) {
    width: 160px;
}

.delete-icon,
.download-icon {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    color: red;
}

.download-icon {
    right: 20px;
    color: blue;
}

.image-mask {
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 160px;
    height: 20px;
    background-color: rgba(0, 0, 0, .2);
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 14px;
    padding: 5px;
}

.empty-img {
    width: 160px;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
    }
}
</style>