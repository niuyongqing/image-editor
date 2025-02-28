<template>
  <div id="">
    <a-upload accept=".jpg,.jpeg,.png" name="file" :action="uploadUrl" :headers="headers" :showUploadList="false"
      @change="handleChange($event)" multiple>
      <a-button>批量传图</a-button>
    </a-upload>
  </div>
</template>

<script setup name=''>
import { ref, reactive, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
const headers = {
  'Authorization': 'Bearer ' + useAuthorization().value,
}
const uploadUrl =
  import.meta.env.VITE_APP_BASE_API +
  "/platform-ozon/platform/ozon/file/upload/img"

const emits = defineEmits(['batchPicture'])
const newList = ref([])

async function handleChange(info) {
  const { file, fileList } = info;
  if (file.status === 'done') {
    // 当单个文件上传完成时，将其添加到已上传文件数组中
    newList.value.push(file.response);
    // 检查是否所有文件都已上传完成
    const allFilesUploaded = fileList.every((f) => f.status === 'done');
    if (allFilesUploaded) {
      // 所有文件上传完成后，通过 emit 抛出包含所有上传文件信息的数组
      emits('batchPicture', newList.value);
      // 清空已上传文件数组，以便下次上传
      newList.value = [];
    }
  }
  if (file.status === 'error') {
    message.error('图片上传失败！');
  }
}

</script>
<style lang="less" scoped></style>