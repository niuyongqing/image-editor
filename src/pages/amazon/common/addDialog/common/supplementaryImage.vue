<template>
<div id="supplementaryImage" class="supplementaryImage">
  <div class="img-content">
    <div class="img-item"
      v-for="item in imageData.list"
      :key="item"
    >
      <a-image
        :width="200"
        :height="200"
        :src="item.path"
      />
      <div class="img-item-size">{{ `${item.width}*${item.height}` }}</div>
      <div class="image-item-foot">
        <a-checkbox v-model:checked="item.checked"></a-checkbox>
        <a-tooltip>
          <template #title>{{ item.name }}</template>
          <div class="image-name">{{ item.name }}</div>
        </a-tooltip>
        <DeleteOutlined style="color: red;" @click="delImage(item)"/>
      </div>
    </div>
    <div class="img-item uploadDom">
      <a-upload
        v-model:file-list="imageData.list"
        name="avatar"
        list-type="picture-card"
        class="avatar-uploader"
        multiple
        :show-upload-list="false"
        :customRequest="customRequest"
        :action="''"
        :before-upload="beforeUpload"
        @change="handleChange"
      >
        <!-- <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
        <div v-else>
          <loading-outlined v-if="loading"></loading-outlined>
        </div> -->
        <PlusOutlined />
        <!-- <div class="ant-upload-text">Upload</div> -->
      </a-upload>
    </div>
  </div>
</div>
</template>

<script setup>
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import Sortable from 'sortablejs'
import { ref, reactive, onMounted, computed, watchPostEffect, nextTick } from 'vue'
// import { uploadImage } from '../js/api/addDialog.js';
import { uploadImage } from '~@/pages/amazon/js/api/addDialog';
defineOptions({ name: "supplementaryImage" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:imageList'])
onMounted(() => {
  tagDrop()
})
const props = defineProps({
  imageList: {
    type: Array,
    default: () => [],
  },
  maxNumber: Number,        // 最大数量
  maxSize: Number,          // 限制单个图片大小MB
})
const imageData = reactive({
  list: [],     // 图片列表
  loading: false
});     
watch(() => props.imageList, (val) => {
  imageData.list = val
}, {
  deep: true,
})
// 删除图片
function delImage(image) {
  imageData.list = imageData.list.filter(i => i.path !== image.path)
  emit('update:imageList', imageData.list)
}
// 上传文件变化
function handleChange({file, fileList}) {
  // console.log({file, fileList}, '56');
  if (file.status === 'uploading') {
    return;
  }
  if (file.status === 'done') {
    // Get this url from response in real world.
    console.log(file, fileList);
    let index = fileList.findIndex(i => i.uid === file.uid)
  }
  if (file.status === 'error') {
    console.log('upload error');
  }
};
// 上传之前校验
function beforeUpload(file, fileList) {
  let uid = file.uid
  if (props.maxSize) {
    let isLt2M = file.size / 1024 / 1024 < props.maxSize
    if (!isLt2M) {
      console.log(`图片大小不应超过${props.maxSize}M`);
      return false;
    }
  }
  if (props.maxNumber) {
    let maxNumber = (imageData.list.length + fileList.length) <= props.maxNumber
    if (!maxNumber) {
      setTimeout(() => {
        let index = imageData.list.findIndex(i => i.uid === uid);
        imageData.list.splice(index, 1);
      });
      return false
    }
  };
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    console.log('上传图片类型不正确!');
    return false;
  }
  // return isJpgOrPng && isLt2M;
};
// 自定义上传
async function customRequest({ file }) {
  // console.log({file});
  let data = new FormData()
  data.append('file', file)
  try {
    let res = await uploadImage(data)
    let obj = imageData.list.find(i => i.uid === file.uid)
    obj.name = res.newFileName
    obj.path = res.url
    obj.checked = false
    imageLoad(obj)
    emit('update:imageList', imageData.list)
  } catch (error) {
    console.log({ error });
  }
}
// 图片加载完成
function imageLoad(obj) {
  // console.log({obj});
  const img = new Image();  // 创建一个新的 Image 对象
  img.onload = () => {
    // 获取图片的宽高
    obj.width = img.naturalWidth;
    obj.height = img.naturalHeight;
  };
  img.src = obj.path;
}
// 拖拽
function tagDrop() {
  const _this = this;
  const tagBox = document.querySelector('.img-content')
  if (!tagBox) return;
  let sortable = Sortable.create(tagBox, {
    animation: 300,
    delay: 0,
    onEnd: evt => {
      if (evt.clone.className.includes('uploadDom')) {
        return;
      }
      let oldIndex = evt.oldIndex
      let oldItem = imageData.list[oldIndex]
      // 如果是调整最后一个位置
      if (!oldItem) {
        oldIndex--
        oldItem = imageData.list[oldIndex]
      }
      imageData.list.splice(oldIndex, 1)
      imageData.list.splice(evt.newIndex, 0, oldItem)
      // 在组件移除后，重新渲染组件
      nextTick(() => {
        setTimeout(() => {
          tagDrop() // 重新加载这个方法，否则刷新后无法使用
        }, 200)
      });
    }
  })
  // console.log(11, {tagBox, sortable});
}
</script>
<style lang="less" scoped>
.supplementaryImage {
  width: 100%;
  .img-content {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .img-item {
      width: 200px;
      height: 240px;
      margin: 0 15px 15px 0;
      position: relative;
      .img-item-size {
        width: 100%;
        height: 30px;
        position: absolute;
        bottom: 40px;
        background: #000000;
        opacity: 0.2;
        color: #fff;
        font-size: 18px;
        text-align: center;
      }
      .image-item-foot {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        align-items: center;
        border: 1px solid #dcdfe6;
        .image-name {
          padding: 0 10px;
          width: calc(100% - 50px);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
      ::v-deep(.avatar-uploader) {
        .ant-upload {
          width: 200px;
          height: 200px;
          margin: 0;
        }
      }
    }
  }
}
</style>