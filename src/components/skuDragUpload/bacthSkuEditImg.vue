<template>
  <div>
    <BaseModal
      @register="register"
      @close="cancel"
      title="批量修改图片尺寸"
      width="1000px"
      @submit="submit"
      :submit-btn-loading="loading"
    >
      <div>
        <a-form
          layout="inline"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          labelAlign=""
        >
          <a-form-item label="宽度:">
            <a-input-number
              placeholder="宽度"
              v-model:value="state.imgW"
              addon-after="px"
              :controls="false"
              :precision="0"
            ></a-input-number>
          </a-form-item>
          <a-form-item label="高度:">
            <a-input-number
              placeholder="高度"
              v-model:value="state.imgH"
              addon-after="px"
              :controls="false"
              :precision="0"
            ></a-input-number>
          </a-form-item>
          <a-checkbox v-model:checked="rememberConfig">记住本次设置</a-checkbox>
        </a-form>
      </div>

      <div mt-10px>
        <a-form-item-rest>
          <a-checkbox
            v-model:checked="checkedAll"
            @change="handleCheckAllChange"
          >
            选择全部</a-checkbox
          >
        </a-form-item-rest>
      </div>
      <div class="flex flex-wrap mt-10px">
        <a-card
          v-for="element in fileList"
          :key="element.id"
          mb-10px
          ml-10px
          p-0px
          rounded-none
          class="file-card"
          hoverable
          style="width: 125px"
        >
          <div>
            <div class="file-item">
              <div class="file-img">
                <img
                  :src="element.url"
                  alt=""
                  class="file-img"
                />
                <div class="image-mask">{{ element.height }} X {{ element.width }}</div>

                <div
                  class="image-check"
                  v-if="element.checked"
                >
                  <CheckOutlined style="color: #00b903; font-size: 20px; font-weight: bold" />
                </div>
                <!-- <div class="image-tooltip" @click="check(element)">
                  点击{{ element.checked ? '取消' : '选中' }}
                </div> -->
              </div>
            </div>
          </div>
          <div w-full>
            <div
              flex
              justify-between
              w-full
            >
              <!-- v-if="!element.url.includes('http')" -->
              <a-checkbox
                v-model:checked="element.checked"
                @change="check(element, $event)"
              ></a-checkbox>
              <div></div>
            </div>
          </div>
          <template #tabBarExtraContent></template>
        </a-card>
      </div>
    </BaseModal>
  </div>
</template>
<script setup>
  import BaseModal from '@/components/baseModal/BaseModal.vue'
  import { DeleteOutlined, CheckOutlined } from '@ant-design/icons-vue'
  import { useResetReactive } from '@/composables/reset'
  import { scaleApi, watermarkApi } from '@/api/common/water-mark.js'
  import { message } from 'ant-design-vue'
  import { uploadImgFromNetApi } from '@/pages/aliexpress/apis/media'
  import { imageUrlUpload } from '@/pages/sample/acquisitionEdit/js/api.js'

  const { state, reset } = useResetReactive({
    imgW: undefined,
    imgH: undefined
  })

  const loading = ref(false) // 提交按钮loading
  const fileList = ref([]) // 图片列表
  const modalMethods = ref()
  const register = modal => {
    modalMethods.value = modal
  }

  const rememberConfig = ref(false) // 记住本次设置

  const checkedAll = ref(false)

  const handleCheckAllChange = e => {
    fileList.value.forEach(item => {
      item.checked = checkedAll.value
    })
  }

  const showModal = list => {
    fileList.value = list || []
    fileList.value.forEach(item => {
      item.checked = true
    })
    checkedAll.value = true

    const configInfo = JSON.parse(localStorage.getItem('modifyImageSizeConfigSimple'))
    if (configInfo) {
      rememberConfig.value = true

      state.imgW = configInfo.width
      state.imgH = configInfo.height
    } else {
      rememberConfig.value = false
    }

    modalMethods.value.openModal()
  }

  const cancel = () => {
    reset()
  }

  // 点击选中
  const check = element => {
    checkedAll.value = fileList.value.every(item => item.checked)
  }

  //  点击确定
  const submit = async () => {
    if (!state.imgW || !state.imgH) {
      message.error('请输入图片宽高')
      return
    }

    const checkedList = fileList.value.filter(item => item.checked)

    if (checkedList.length === 0) {
      message.error('请选择图片')
      return
    }
    // 本地图片
    const imgLocalList = checkedList.filter(item => !item.url.includes('http')).map(img => img.url)
    // 远端图片; 拿 url 先上传本地服务后再处理
    const netPathList = checkedList.filter(item => item.url.includes('http')).map(img => img.url)
    loading.value = true
    if (imgLocalList.length) {
      const scaleRes = await scaleApi({
        imagePathList: imgLocalList,
        newWidth: state.imgW,
        newHeight: state.imgH,
        isRatio: false
      })
      if (scaleRes.code === 200) {
        const data = scaleRes.data || []
        data.forEach(item => {
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
      }
    }

    if (netPathList.length) {
      //  有网络图片
      const res = await uploadImgFromNetApi({
        imgUrls: netPathList.join(',')
      })
      if (res.code === 200) {
        const data = res.data || []
        const imagePathList = data.map(item => item.url)
        const scaleRes = await scaleApi({
          imagePathList,
          newWidth: state.imgW,
          newHeight: state.imgH,
          isRatio: false
        })

        if (scaleRes.code === 200) {
          const scaleData = scaleRes.data || []
          scaleData.forEach(item => {
            fileList.value.forEach(v => {
              const urlSplit = v.url.split('/')
              const fileName = urlSplit[urlSplit.length - 1].split('.')[0]
              if (item.originalFilename.includes(fileName)) {
                v.url = item.url
                v.name = item.newFileName
                v.checked = false
                v.width = state.imgW
                v.height = state.imgH
              }
            })
          })
        }
      }
    }

    // 是否记住本次设置
    if (rememberConfig.value) {
      const configInfo = {
        width: state.imgW,
        height: state.imgH
      }
      localStorage.setItem('modifyImageSizeConfigSimple', JSON.stringify(configInfo))
    } else {
      localStorage.removeItem('modifyImageSizeConfigSimple')
    }

    loading.value = false
    checkedAll.value = false
    modalMethods.value.closeModal()
  }

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
    background-color: rgba(0, 0, 0, 0.2);
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
    background-color: rgba(0, 0, 0, 0.2);
    display: none;
  }

  .file-img:hover .image-tooltip {
    display: block;
  }
</style>
