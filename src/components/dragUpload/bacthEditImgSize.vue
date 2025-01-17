<template>
  <div>
    <BaseModal @register="register" @close="cancel" title="批量修改图片尺寸" width="1000px" @submit="submit">
      <div>
        <a-form layout="inline" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" labelAlign="">
          <a-form-item label="宽度:">
            <a-input-number placeholder="宽度" v-model:value="state.imgW" addon-after="px" :controls="false"
              :precision="0"></a-input-number>
          </a-form-item>

          <a-form-item label="高度:">
            <a-input-number placeholder="高度" v-model:value="state.imgH" addon-after="px" :controls="false"
              :precision="0"></a-input-number>
          </a-form-item>
        </a-form>
      </div>

      <div mt-10px>
        <a-form-item-rest label="选择水印:">
          <a-checkbox v-model:checked="checkedAll" @change="handleCheckAllChange"> 选择全部</a-checkbox>
        </a-form-item-rest>
      </div>

      <div class="flex flex-wrap  mt-10px">
        <a-card v-for="element in fileList" :key="element.uid" mb-10px ml-10px p-0px rounded-none class="file-card"
          hoverable style="width: 125px;">
          <div :key="element.url">
            <div class="file-item">
              <div class="file-img">
                <a-image :src="element.url" alt="" class="file-img" />
                <div class="image-mask"> {{ element.height }} X {{ element.width }} </div>

                <div class="image-check" v-if="element.checked">
                  <CheckOutlined style="color: #00B903;font-size: 20px; font-weight: bold;" />
                </div>
                <!-- <div class="image-tooltip" @click="check(element)">
                  点击{{ element.checked ? '取消' : '选中' }}
                </div> -->
              </div>
            </div>
          </div>
          <div w-full>
            <div flex justify-between w-full>
              <a-checkbox v-model:checked="element.checked" v-if="!element.url.includes('http')"
                @change="check(element, $event)"></a-checkbox>
              <div></div>
              <!-- <a-button type="text" color="#428bca" @click="handleRemove(element)">
                <DeleteOutlined />
              </a-button> -->
            </div>
          </div>
          <template #tabBarExtraContent></template>
        </a-card>
      </div>
    </BaseModal>
  </div>
</template>
<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { DeleteOutlined, CheckOutlined } from '@ant-design/icons-vue';
import { useResetReactive } from '@/composables/reset';
import { scaleApi, watermarkApi } from '@/api/common/water-mark.js';
import { message } from "ant-design-vue";

const props = defineProps({
  shortCode: {
    type: String,
    default: ""
  },
  waterList: {
    type: Array,
    default: () => []
  }
});

const { state, reset } = useResetReactive({
  imgW: 800,
  imgH: 800,
});

const fileList = ref([]); // 图片列表
const modalMethods = ref();
const register = (modal) => {
  modalMethods.value = modal;
}

const checkedAll = ref(false);

const handleCheckAllChange = (e) => {
  fileList.value.forEach(item => {
    if (!item.url.includes('http')) {
      item.checked = checkedAll.value
    }
  })
};

const showModal = (list) => {
  fileList.value = list || [];
  fileList.value.forEach((item) => {
    item.checked = false;
  })
  modalMethods.value.openModal();
};

const cancel = () => {
  reset();
};

const handleRemove = (element) => {
  fileList.value = fileList.value.filter(item => item.url !== element.url);
}

// 点击选中
const check = (element, value) => {
  const list = fileList.value.filter((item) => {
    return !item.url.includes('http')
  });
  const isAllChecked = list.every(item => item.checked);
  checkedAll.value = isAllChecked;
};

//  点击确定
const submit = async () => {
  if (!state.imgW || !state.imgH) {
    message.error('请选择图片宽高');
    return
  }
  const checkedList = fileList.value.filter(item => item.checked);
  if (checkedList.length === 0) {
    message.error('请选择图片');
    return
  };
  const imagePathList = checkedList.map((item) => {
    return item.url
  });
  const scaleRes = await scaleApi({
    imagePathList: imagePathList,
    newWidth: state.imgW,
    newHeight: state.imgH,
  });
  if (scaleRes.code === 200) {
    const data = scaleRes.data || [];
    data.forEach((item) => {
      fileList.value.forEach(v => {
        if (item.originalFilename === v.url) {
          v.url = item.fileName
          v.name = item.newFileName
          v.checked = false
          v.width = state.imgW
          v.height = state.imgH
        }
      })
    })
  };

  checkedAll.value = false;
  modalMethods.value.closeModal();
};


defineExpose({
  showModal
})
</script>
<style lang="less" scoped>
:deep(.ant-card-body) {
  padding: 1px;
}

.file-item {
  margin-right: 8px;
  position: relative;
}

.file-img {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  object-fit: cover;
}

:deep(.ant-card-body) {
  width: 120px;
}

.image-mask {
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 120px;
  height: 20px;
  background-color: rgba(0, 0, 0, .2);
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 14px;
  padding: 5px;
}

.image-check {
  position: absolute;
  top: 0;
  right: 0px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
}

.image-tooltip {
  position: absolute;
  top: 0;
  right: 0px;
  left: 0px;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
  color: #fff;
  font-size: 14px;
  background-color: rgba(0, 0, 0, .2);
  display: none;
}

.file-img:hover .image-tooltip {
  display: block;
}
</style>