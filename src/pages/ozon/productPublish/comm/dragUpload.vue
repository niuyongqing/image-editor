<template>
  <div>
    <a-upload :before-upload="beforeUpload" :file-list="fileList" :custom-request="handleUpload"
      list-type="picture-card" @change="handleChange" multiple>
      <div v-if="fileList.length === 0">
        <!-- <a-icon type="plus" /> -->
        <div style="margin-top: 8px">上传图片</div>
      </div>
    </a-upload>
    <div class="image-list">
      <div v-for="(file, index) in fileList" :key="file.uid" class="image-item" draggable="true"
        @dragstart="handleDragStart(index)" @dragover.prevent @drop="handleDrop(index)">
        <img :src="file.url" alt="" />
        <!-- <a-icon type="close" @click="handleRemove(index)"
          style="cursor: pointer; position: absolute; top: 0; right: 0" /> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, ref } from 'vue';
import { message } from 'ant-design-vue';
const fileList = ref([]);
let dragIndex = null;

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('仅支持 JPG/PNG 格式的图片');
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB');
    return false;
  }
  return true;
};

const handleUpload = (options) => {
  // 这里可以自定义上传逻辑，比如使用 axios 上传到服务器
  // 假设上传成功后会返回一个包含图片 url 的对象，这里模拟一个 url
  const url = `https://example.com/images/${options.file.name}`;
  options.onSuccess({ ...options.file, url });
};

const handleChange = ({ fileList: newFileList }) => {
  fileList.value = newFileList;
};

const handleRemove = (index) => {
  fileList.value.splice(index, 1);
};

const handleDragStart = (index) => {
  dragIndex = index;
};

const handleDrop = (index) => {
  const newFileList = [...fileList.value];
  const temp = newFileList[dragIndex];
  newFileList[dragIndex] = newFileList[index];
  newFileList[index] = temp;
  fileList.value = newFileList;
  dragIndex = null;
};
</script>

<style scoped>
.image-list {
  display: flex;
  flex-wrap: wrap;
}

.image-item {
  position: relative;
  margin: 8px;
  width: 100px;
  height: 100px;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>