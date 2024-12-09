<template>
<div id="dragFileUpload" class="dragFileUpload">
  <div class="img-content">
    <div class="img-item"
      v-for="item in imageList"
      :key="item"
    >
      <a-image
        :width="200"
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />
      <div class="image-item-foot">
        <a-checkbox v-model:checked="item.checked"></a-checkbox>
        <a-tooltip>
          <template #title>{{ 'dasfgsdfsdfgsdgfsdgsfasdfsadf' }}</template>
          <div class="image-name">dasfgsdfsdfgsdgfsdgsfasdfsadf</div>
        </a-tooltip>
        <DeleteOutlined @click="delImage(item)"/>
      </div>
    </div>
    <div class="img-item uploadDom">
      <a-upload
        v-model:file-list="fileList"
        name="avatar"
        list-type="picture-card"
        class="avatar-uploader"
        multiple
        :show-upload-list="false"
        :customRequest="customRequest"
        :action="'http://10.93.90.146:88/prod-api/platform-tiktok/platform/tiktok/global/file/upload/img'"
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
defineOptions({
  name: "dragFileUpload"
})
onMounted(() => {
  tagDrop()
})
const imageList = ref([
  {
    name: 'sdfsdfsf',
    path: 'asfrgsdfsfsdfsdf',
    checked: false,
  }
]);     // 图片列表
function delImage(image) {
  imageList.value = imageList.value.filter(i => i.path !== image.path)
}
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
const fileList = ref([]);
const loading = ref(false);
const imageUrl = ref('');
const handleChange = info => {
  console.log({info});
  
  if (info.file.status === 'uploading') {
    loading.value = true;
    return;
  }
  if (info.file.status === 'done') {
    // Get this url from response in real world.
    getBase64(info.file.originFileObj, base64Url => {
      imageUrl.value = base64Url;
      loading.value = false;
    });
  }
  if (info.file.status === 'error') {
    loading.value = false;
    console.log('upload error');
  }
};
const beforeUpload = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    console.log('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    console.log('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};
function customRequest(file) {
  console.log(file);
  let data = new FormData()
  data.append('openId', 'ekMlTQAAAAAB7XAM6zof9JRc66GwSVqUEP2Y23bBOIYal0FUXl8xkg')
  data.append('file', file.file)
  usePost('platform-tiktok/platform/tiktok/global/file/upload/img',data).then(res => {
    console.log(res);
    
  }).finally(() => {
    console.log(111);
    imageList.value.push({
      name: 'sdfsdfsf',
      path: 'asfrgsdfsfsdfsdf' + Math.floor(Math.random()*10000),
      checked: false,
    })
  })
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
      const oldItem = imageList.value[evt.oldIndex]
      imageList.value.splice(evt.oldIndex, 1)
      imageList.value.splice(evt.newIndex, 0, oldItem)
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
.dragFileUpload {
  width: 100%;
  .img-content {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .img-item {
      width: 200px;
      height: 240px;
      margin: 0 15px 15px 0;
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