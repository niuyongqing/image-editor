<template>
<div id="acquisitionEdit_descriptionInfo" class="acquisitionEdit_descriptionInfo">
  <a-card style="text-align: left;">
    <template #title>
      描述信息
    </template>
    <a-form :model="formData" ref="ERPformRef" :label-col="{ span: 3 }">
      <a-form-item label="简易描述" name="simpleDesc">
        <a-textarea 
          v-model:value="formData.simpleDesc" 
          placeholder="" 
          :rows="10" 
          style="width: 60%;"
        />
      </a-form-item>
      <a-form-item label="详细描述" name="detailDesc">
        <a-form-item-rest>
          <descriptionEditor
            style="width: 60%;"
            v-model="formData.detailDesc"
            v-model:isFocused="pictureLibraryModal.btnDisabled"
            ref="webDetailRef"
            :editor-config="editorConfig"
            @edit-image-size="sizeModalOpen"
            :platform="props.productData?.classPlatform"
          />
        </a-form-item-rest>
      </a-form-item>
    </a-form>
  </a-card>
  <!-- 批量修改图片尺寸 -->
  <bacthImageEdit 
    v-model:modal-open="sizeModal.modalOpen"
    :iamge-list="sizeModal.imageList"
    @bacthImageEditSize="bacthImageEditSize"
  ></bacthImageEdit>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue';
import AsyncIcon from '~@/layouts/components/menu/async-icon.vue'
import descriptionEditor from '@/components/wang-editor-plus/index.vue';
import bacthImageEdit from './modal/bacthImageEdit.vue';
import { imageUpload, imageUrlUpload } from '../js/api';
import { replaceTagsWithRegex, extractTextFromHTML, extractImageUrls } from '@/utils'
import { v4 as uuidv4 } from 'uuid'
import { message } from 'ant-design-vue';
defineOptions({ name: "acquisitionEdit_descriptionInfo" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:descriptionInfoData'])
const props = defineProps({
  descriptionInfoData: {
    type: Object,
    default: () => {}
  },
  productData: {
    type: Object,
    default: () => {}
  }
})
const formData = reactive({
  simpleDesc: '', // 建议描述
  detailDesc: "", // 详细描述
  detailImageList: [],
})
const sizeModal = reactive({
  modalOpen: false,
  imageList: [],
});
const pictureLibraryModal = reactive({
  modalOpen: false,
  btnDisabled: false,
})
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      maxFileSize: 10 * 1024 * 1024, // 10M
      // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
      allowedFileTypes: ['image/*'],
      customUpload(file, insertFn) {
        // console.log({file});
        let params = new FormData();
        params.append('file', file);
        imageUpload(params).then(res => {
          let src = import.meta.env.VITE_APP_BASE_API + res.data.url
          insertFn(src)
        })
      },
    },
    // insertImage: {
    //   onInsertedImage(val) {
    //     formData.detailImageList.push(val.src)
    //   },
    // },
  }
}
watch(() => props.productData?.id, (val) => {
  // console.log(111);
  openFn()
})
watch(() => formData, (val) => {
  // console.log({ val });
  let obj = {
    simpleDesc: val.simpleDesc,
    detailDesc: val.detailDesc,
  }
  let detailImageList = _this.$refs.webDetailRef.editorRef.getElemsByType('image')
  // console.log({detailImageList});
  obj.detailImageList = detailImageList.map(i => i.src)
  emit('update:descriptionInfoData', obj)
}, {
  deep: true
})
// 页面赋值
function openFn() {
  let simpleDesc = props.productData.simpleDesc
  try {
    let simpleDescTips = JSON.parse(simpleDesc)
    let arr = []
    for (const key in simpleDescTips) {
      if (Object.prototype.hasOwnProperty.call(simpleDescTips, key)) {
        const element = simpleDescTips[key];
        let str = `${key}：${element}`
        arr.push(str)
      }
    }
    formData.simpleDesc = arr.join('\n')
  } catch (error) {
    formData.simpleDesc = simpleDesc
  }
  formData.detailDesc = props.productData.detailDesc.includes('<iframe') ? '' : props.productData.detailDesc.replaceAll('\"', '"').replaceAll('&#10;', '\n').replaceAll('&amp;', '&')
  formData.detailImageList = [...props.productData.detailImageList]
}
function sizeModalOpen() {
  // 提取所有图片
  let imgUrls = extractImageUrls(formData.detailDesc)
  if (imgUrls.length === 0) {
    message.error('未检测到图片')
    return;
  }
  sizeModal.imageList = imgUrls.map(item => {
    let src = decodeURI(item)
    let obj = {
      id: uuidv4(),
      src: src,
      url: src.includes('http') ? src : src.replace('/prod-api', ''),
      oldSrc: src
    }
    return obj;
  })
  sizeModal.modalOpen = !sizeModal.modalOpen
}
// 批量修改图片尺寸
function bacthImageEditSize(newImage) {
  newImage.forEach(item => {
    formData.detailDesc = formData.detailDesc.replace(item.oldSrc, item.src)
  })
}
</script>
<style lang="less" scoped>
.pictureLibrary-btn {
  display: flex; 
  align-items: center;
  &.disabled {
    cursor: no-drop;
    color: #999;
  }
}
</style>