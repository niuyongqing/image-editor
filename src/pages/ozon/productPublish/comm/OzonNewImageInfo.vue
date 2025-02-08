<template>
    <div id="OzonNewImageInfoCont">
        <a-card style="text-align: left;">
            <template #title>
                <span>描述信息<span style="color: #9fa0a2">（编辑视频时请先选择店铺）</span></span>
            </template>
            <a-form ref="ruleForm" :model="form" :label-col="{ span: 2 }" :rules="rules">
                <a-form-item label="产品描述：" prop="description">
                    <span style="color: #ff0a37">说明：描述区图片尺寸需大于330*330，小于5000x5000，图片大小不能超过3M</span>
                    <editor accept=".jpg,.jpeg,.png" v-model="form.description"
                        :uploadData="{ key: 'shortCode', value: shortCode }" ref="editor" :upload-url="uploadUrl">
                    </editor>
                </a-form-item>
                <a-form-item label="JSON 丰富内容：" prop="jsonDes">
                    <span style="color: #ff0a37">说明：描述区图片尺寸需大于330*330，小于5000x5000，图片大小不能超过3M</span>
                    <editor accept=".jpg,.jpeg,.png" v-model="form.jsonDes"
                        :uploadData="{ key: 'shortCode', value: shortCode }" ref="editor" :options="editorOptions"
                        :upload-url="uploadUrl"></editor>
                </a-form-item>
                <a-form-item label="视频：" v-loading="uploadVideoLoading" element-loading-text="视频上传中，请稍等！">
                    <div>
                        <a-tag type="success" effect="dark">！说明</a-tag>
                        <span style="color: #9fa0a2">
                            最小尺寸：480x480像素。最大视频长度：60秒。最大文件大小：100mb。支持的格式：mp4。新视频可能需要长达36小时才能获得批准
                        </span>
                        <br />
                    </div>
                    <div style="display: flex">
                        <div>
                            封面视频：
                            <a-upload style="width: 180px" class="avatar-uploader" :limit="1"
                                :action="uploadImageVideoUrl" :data="{
                                    shortCode: this.shortCode,
                                    coverUrl: this.form.coverUrl.url,
                                }" accept=".mp4" :headers="headers" :on-remove="delVideoImage"
                                :on-success="handleVideoImageSuccess">
                                <div v-if="JSON.stringify(form.coverUrl) !== '{}'">
                                    <video controls class="avatar">
                                        <source :src="form.coverUrl.url" type="video/mp4" />
                                    </video>
                                    <div v-if="JSON.stringify(product) !== '{}'">
                                        {{ form.coverUrl.name
                                        }}<a-button type="text" style="margin-left: 10px; font-size: 15px"
                                            @click.stop="delEditVideoHandle(1)">x</a-button>
                                    </div>
                                </div>
                                <i v-else class="a-icon-plus avatar-uploader-icon"></i>
                            </a-upload>
                        </div>
                        <div style="margin-left: 30px">
                            视频：
                            <a-upload style="width: 180px" :limit="1" ref="uploadVideo" class="avatar-uploader"
                                :action="uploadVideoUrl" :data="{
                                    shortCode: this.shortCode,
                                    coverUrl: this.form.video.url,
                                }" :headers="headers" accept=".mp4" :on-remove="delVideoHandle"
                                :on-success="handleVideoSuccess">
                                <!-- :before-upload="handleVideoBefore" -->
                                <div v-if="JSON.stringify(form.video) !== '{}'">
                                    <video controls class="avatar">
                                        <source :src="form.video.url" type="video/mp4" />
                                    </video>
                                    <div v-if="JSON.stringify(product) !== '{}'">
                                        {{ form.video.name
                                        }}<a-button type="text" style="margin-left: 10px; font-size: 15px"
                                            @click.stop="delEditVideoHandle(2)">x</a-button>
                                    </div>
                                </div>
                                <i v-else class="a-icon-plus avatar-uploader-icon"></i>
                            </a-upload>
                        </div>
                    </div>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup name='OzonNewImageInfo'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'

const form = reactive({
    video: {},
    coverUrl: {},
    description: "",
    jsons: "",
    jsonDes: "",
})
</script>
<style lang="less" scoped></style>