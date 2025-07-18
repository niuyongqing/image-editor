<template>
  <div>
    <BaseModal @register="register" @close="cancel" title="批量修改图片尺寸" width="1400px" @submit="submit"
      :submit-btn-loading="loading">
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
        <a-form-item-rest>
          <a-checkbox v-model:checked="checkedAll" @change="handleCheckAllChange"> 选择全部</a-checkbox>
        </a-form-item-rest>
      </div>

      <div class="flex flex-wrap  mt-10px h-900px overflow-y-auto">
        <div v-for="(item, index) in tableData" :key="index" flex gap-15px h-150px>
          <a-card v-for="(element, i) in item.imageUrl" :key="element.url" mb-10px ml-10px p-0px rounded-none
            class="file-card flex" hoverable style="width: 125px;">
            <div :key="element.uid" @click="tabCheck(element)">
              <div class="file-item">
                <div class="file-img">
                  <img :src="processImageSource(element.url)" alt="" class="file-img" />
                  <div class="image-mask"> {{ element.height }} X {{ element.width }} </div>

                  <div class="image-check" v-if="element.checked">
                    <CheckOutlined style="color: #00B903;font-size: 20px; font-weight: bold;" />
                  </div>

                  <div class="image-tooltip">
                    点击{{ element.checked ? '取消' : '选中' }}
                  </div>
                </div>
              </div>
            </div>
            <!-- <div w-full>
              <div flex justify-between w-full>
                <a-checkbox v-model:checked="element.checked" @change="check(element, $event)"></a-checkbox>
              </div>
            </div> -->
          </a-card>
        </div>
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
import { imageUrlUpload } from '@/pages/sample/acquisitionEdit/js/api.js'
import { processImageSource } from "~/pages/ozon/config/commJs/index";

const props = defineProps({
  shortCode: {
    type: String,
    default: ""
  },
  watermarkList: {
    type: Array,
    default: () => []
  }
});

const { state, reset } = useResetReactive({
  imgW: undefined,
  imgH: undefined,
});

const loading = ref(false); // 提交按钮loading

const tableData = ref([]); // 图片列表
const modalMethods = ref();
const register = (modal) => {
  modalMethods.value = modal;
}

const checkedAll = ref(false);

const handleCheckAllChange = (e) => {
  tableData.value.forEach(item => {
    item.imageUrl.forEach(v => {
      v.checked = checkedAll.value
    })
  })

};

const showModal = (list) => {
  console.log('tableData', list);
  tableData.value = list || [];
  tableData.value.forEach((item) => {
    item.imageUrl.forEach(v => {
      v.checked = false
    })
  })
  modalMethods.value.openModal();
};

const cancel = () => {
  reset();
};

const handleRemove = (element) => {
  tableData.value = tableData.value.filter(item => item.uid !== element.uid);
}


// 点击选中
const tabCheck = (element) => {
  element.checked = !element.checked;
  const isAllChecked = tableData.value.every(item => item.imageUrl.every(v => v.checked));
  checkedAll.value = isAllChecked;
};

// 点击选中
// const check = (element) => {
//   const isAllChecked = tableData.value.every(item => item.imageUrl.every(v => v.checked));
//   checkedAll.value = isAllChecked;
// };

//  点击确定
const submit = async () => {
  if (!state.imgW || !state.imgH) {
    message.error('请输入图片宽高');
    return
  };

  const checkedList = tableData.value.flatMap((item, index) => item.imageUrl.filter(v => v.checked).map((img) => {
    return {
      ...img,
      index: index
    }
  }));

  if (checkedList.length === 0) {
    message.error('请选择图片');
    return
  };
  console.log('checkedList', checkedList);
  //  选中的图片只有本地图片
  const netPathList = checkedList.filter(item => item.url.includes('http')).map((img) => img.url);
  if (netPathList.length === 0) {
    loading.value = true;
    const scaleRes = await scaleApi({
      imagePathList: checkedList.map(img => img.url),
      newWidth: state.imgW,
      newHeight: state.imgH,
    });

    if (scaleRes.code === 200) {
      const data = scaleRes.data || [];
      checkedList.forEach((item) => {
        tableData.value[item.index].imageUrl.forEach((v) => {
          if (item.originalFilename === v.url) {
            v.url = item.fileName
            v.name = item.newFileName
            v.checked = false
            v.width = state.imgW
            v.height = state.imgH
          }
        })
      })
      data.forEach((dataItem) => {
        checkedList.forEach((item) => {
          tableData.value[item.index].imageUrl.forEach((v) => {
            if (dataItem.originalFilename === v.url) {
              v.url = dataItem.url
              v.name = dataItem.newFileName
              v.checked = false
              v.width = state.imgW
              v.height = state.imgH
              v.uid = dataItem.url
            }
          })
        })

      })
      loading.value = false;
      checkedAll.value = false;
      modalMethods.value.closeModal();

    };
  } else {
    loading.value = true;
    //   //  有网络图
    for (const tabbleItem of tableData.value) {
      const fileList = tabbleItem.imageUrl || [];
      if (fileList.length === 0) {
        continue;
      }

      for (let index = 0; index < fileList.length; index++) {
        const fileItem = fileList[index];

        try {
          let netImgs = [];
          const url = fileItem.url;
          if (!fileItem.checked) {
            continue;
          }
          if (url.includes('http')) {
            let res = await imageUrlUpload({ url });
            netImgs.push(res.data);
            const scaleRes = await scaleApi({
              imagePathList: netImgs.map(img => img.url),
              newWidth: state.imgW,
              newHeight: state.imgH,
            });
            if (scaleRes.code === 200) {
              const data = scaleRes.data || [];
              data.forEach((_item) => {
                fileItem.url = _item.url
                fileItem.name = _item.newFileName
                fileItem.checked = false
                fileItem.width = state.imgW
                fileItem.height = state.imgH
                fileItem.uid = _item.url
              });
            }
          } else {
            const scaleRes = await scaleApi({
              imagePathList: [fileItem.url],
              newWidth: state.imgW,
              newHeight: state.imgH,
            });
            if (scaleRes.code === 200) {
              const data = scaleRes.data || [];
              data.forEach((_item) => {
                fileItem.url = _item.url
                fileItem.name = _item.newFileName
                fileItem.checked = false
                fileItem.width = state.imgW
                fileItem.height = state.imgH
                fileItem.uid = _item.url
              });
            }



          }

        } catch {

        }

      }

    }
    message.success('操作成功');
    loading.value = false;
    checkedAll.value = false;
    modalMethods.value.closeModal();
  }

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