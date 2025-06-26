<template>
  <div>
    <a-upload name="file" v-if="images.length < 30" style="width: 100px; height: 100px;" :headers="headers"
      accept=".jpg,.jpeg,.png" :action="uploadUrl" :showUploadList="false" :before-upload="beforeUpload"
      @change="handleChange" :multiple="true" :max-count="30">
      <a-button>
        <AsyncIcon icon="UploadOutlined" />
        上传图片
      </a-button>
    </a-upload>
    <draggable v-if="images.length > 0" item-key="url" v-model="images" class="flex flex-wrap"
      style="width: 1600px;margin-top: 10px;">
      <template #item="{ element }">
        <a-card class="file-card" style="margin-right: 10px;margin-bottom: 10px;" hoverable>
          <div :key="element.uid">
            <div class="file-img">
              <a-image :src="element.url" alt="" :width="150" :height="150" />
              <div class="image-mask text-center"> {{ element.height }} X {{ element.width }} </div>
            </div>
          </div>
          <div w-full>
            <div flex justify-between w-full>
              <a-checkbox v-model:checked="element.checked" @change="handleSelectImg(element)"></a-checkbox>
              <AsyncIcon icon="DeleteOutlined" size="15px" color="#428bca" @click="handleRemove(element)" />
            </div>
          </div>
        </a-card>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import draggable from 'vuedraggable';
import { UploadOutlined, DownOutlined, DownloadOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from "ant-design-vue";
import { ref } from 'vue';
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";

const emit = defineEmits(['changeImg', "singleSelectImg"])
const props = defineProps({
  imageList: {
    type: Array,
    default: () => []
  },
  max: {
    type: Number,
    default: 30
  },

})
const images = ref([]);
const headers = {
  'Authorization': 'Bearer ' + useAuthorization().value,
}
const uploadUrl =
  import.meta.env.VITE_APP_BASE_API +
  "/platform-ozon/platform/ozon/file/upload/img"

const handleChange = info => {
  if (info.file.status === 'done') {
    // images.value.push(
    //   {
    //     name: info.file.response.originalFilename,
    //     url: '/prod-api' + info.file.response.url,
    //     checked: false,
    //     width: info.file.response.width,
    //     height: info.file.response.height,
    //   }
    // )
    images.value = [
      ...images.value,
      {
        name: info.file.response.originalFilename,
        url: '/prod-api' + info.file.response.url,
        checked: false,
        width: info.file.response.width,
        height: info.file.response.height,
      }
    ]
    emit('changeImg', JSON.parse(JSON.stringify(images.value)))
  }
  if (info.file.status === 'error') {
    message.error('图片上传有误！');
  }
  emit('changeImg', images)
  // emit('changeImg', JSON.parse(JSON.stringify(images.value)))
}

const handleImageLoad = (el, event) => {
  nextTick(() => {
    const img = event.target;
    el.width = img ? img.naturalWidth : '';
    el.height = img ? img.naturalHeight : '';
  })
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
  if (images.value.length >= 30) {
    message.error(`最多上传30张图片`);
    return false;
  }
  return true;
};
const handleRemove = (file) => {
  const index = images.value.indexOf(file);
  images.value.splice(index, 1);
}

const handleSelectImg = (e) => {
  // console.log('e', e);
  emit("singleSelectImg", e)
}

// 新增图片加载方法
const loadImage = (item) => {
  return new Promise(resolve => {
    const image = new Image();
    image.src = item.url;
    
    image.onload = () => {
      resolve({
        ...item,
        width: image.width,
        height: image.height
      });
    };
    
    image.onerror = () => {
      console.error(`图片加载失败: ${item.url}`);
      resolve(null);
    };
  });
};

// 新增合并方法
const mergeImages = (existing, newImages) => {
  const existingUrls = new Set(existing.map(img => img.url))
  return [
    ...existing,
    ...newImages.filter(img => !existingUrls.has(img.url))
  ]
}

// 分块函数
const chunk = (arr, size) => 
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  )


watch(() => props.imageList, async (val) => {

  if (val.length) {
    // 合并新旧图片（关键修复）
    const mergedImages = mergeImages(images.value, val)
    
    // 过滤无效URL并创建映射
    const urlMap = new Map(mergedImages.map(img => [img.url, img]))
    
    // 分批次加载
    const BATCH_SIZE = 5;
    const loadedImages = [];
    
    for (const batch of chunk([...urlMap.values()], BATCH_SIZE)) {
      const results = await Promise.allSettled(
        batch.map(item => loadImage(item))
      )
      loadedImages.push(...results.filter(r => r.status === 'fulfilled').map(r => r.value))
    }
    
    // 原子更新
    images.value = loadedImages
  }

  // if (val.length) {
  //   const promiseList1 = val.map(item => {
  //     return new Promise(resolve => {
  //       const image = new Image()
  //       image.src = item.url ?? ""
  //       image.onload = () => {
  //         resolve({
  //           url: item.url ?? "",
  //           width: image.width,
  //           height: image.height,
  //           checked: item.checked,
  //         })
  //       }
  //     })
  //   })
  //   Promise.all(promiseList1).then(list => {
  //     images.value = list
  //     console.log('images', images.value);
  //   })
  // }
}, { immediate: true, deep: true })


</script>

<style scoped></style>