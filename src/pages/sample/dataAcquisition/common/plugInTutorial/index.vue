<template>
<div id="plugInTutorial" class="plugInTutorial">
  <a-modal 
    v-model:open="modalOpen" 
    title="插件安装教程"
    :maskClosable="false"
    :width="1250"
  >
    <div class="plugInTutorial_index-modal-box">
      <div class="process-item">
        <div class="item-title">下载对应浏览器插件</div>
        <div class="item-i">
          <div class="item-i-text">一、下载后保存并解压！</div>
          <a-image width="900" :src="Snipaste_2025_06_17_14_50_21" alt="" />
        </div>
      </div>
      <div class="process-item">
        <div class="item-title">谷歌浏览器插件安装</div>
        <div class="item-i">
          <div class="item-i-text">一、首先打开扩展程序页面</div>
          <a-image width="900" :src="Snipaste_2025_06_17_15_02_36" alt="" />
        </div>
        <div class="item-i">
          <div class="item-i-text">二、在扩展程序页面安装插件</div>
          <a-image width="900" :src="Snipaste_2025_06_17_15_20_27" alt="" />
          <a-image width="900" :src="Snipaste_2025_06_17_15_23_47" alt="" />
        </div>
        <div class="item-i">
          <div class="item-i-text">三、安装完成，进行数据采集，采集时注意需要登录当前需要采集的平台，否则会采集失败！</div>
          <a-image width="900" :src="Snipaste_2025_06_17_15_33_58" alt="" />
          <a-image width="900" :src="Snipaste_2025_06_17_15_40_37" alt="" />
        </div>
      </div>
      <div class="process-item">
        <div class="item-title">360浏览器插件安装</div>
        <div class="item-i">
          <div class="item-i-text">一、首先打开扩展程序页面</div>
          <a-image width="900" :src="Snipaste_2025_06_17_16_33_04" alt="" />
          <a-image width="900" :src="Snipaste_2025_06_17_16_52_23" alt="" />
        </div>
        <div class="item-i">
          <div class="item-i-text">二、在扩展程序页面安装插件</div>
          <a-image width="900" :src="Snipaste_2025_06_17_16_36_21" alt="" />
          <a-image width="900" :src="Snipaste_2025_06_17_16_38_56" alt="" />
        </div>
        <div class="item-i">
          <div class="item-i-text">三、安装完成，进行数据采集，采集时注意需要登录当前需要采集的平台，否则会采集失败！</div>
          <a-image width="900" :src="Snipaste_2025_06_17_16_42_30" alt="" />
        </div>
      </div>
      <div class="process-item">
        <div class="item-title">Edge浏览器插件安装</div>
        <div class="item-i">
          <div class="item-i-text">一、首先打开扩展程序页面</div>
          <a-image width="900" :src="Snipaste_2025_06_17_17_24_19" alt="" />
          <a-image width="900" :src="Snipaste_2025_06_17_17_25_23" alt="" />
        </div>
        <div class="item-i">
          <div class="item-i-text">二、在扩展程序页面安装插件</div>
          <a-image width="900" :src="Snipaste_2025_06_17_17_29_17" alt="" />
          <a-image width="900" :src="Snipaste_2025_06_17_17_33_26" alt="" />
        </div>
        <div class="item-i">
          <div class="item-i-text">三、安装完成，进行数据采集，采集时注意需要登录当前需要采集的平台，否则会采集失败！</div>
          <a-image width="900" :src="Snipaste_2025_06_17_17_37_22" alt="" />
        </div>
      </div>
    </div>
    <template #footer>
      <a-button key="submit" type="primary" @click="modalCloseFn">关闭</a-button>
    </template>
  </a-modal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue';
// 谷歌浏览器
import Snipaste_2025_06_17_14_50_21 from '@/pages/sample/dataAcquisition/common/plugInTutorial/img/Snipaste_2025-06-17_14-50-21.png'
import Snipaste_2025_06_17_15_02_36 from '@/pages/sample/dataAcquisition/common/plugInTutorial/img/Snipaste_2025-06-17_15-02-36.png'
import Snipaste_2025_06_17_15_20_27 from '@/pages/sample/dataAcquisition/common/plugInTutorial/img/Snipaste_2025-06-17_15-20-27.png'
import Snipaste_2025_06_17_15_23_47 from '@/pages/sample/dataAcquisition/common/plugInTutorial/img/Snipaste_2025-06-17_15-23-47.png'
import Snipaste_2025_06_17_15_33_58 from '@/pages/sample/dataAcquisition/common/plugInTutorial/img/Snipaste_2025-06-17_15-33-58.png'
import Snipaste_2025_06_17_15_40_37 from '@/pages/sample/dataAcquisition/common/plugInTutorial/img/Snipaste_2025-06-17_15-40-37.png'
// 360浏览器
import Snipaste_2025_06_17_16_33_04 from '@/pages/sample/dataAcquisition/common/plugInTutorial/img/Snipaste_2025-06-17_16-33-04.png'
import Snipaste_2025_06_17_16_52_23 from '@/pages/sample/dataAcquisition/common/plugInTutorial/img/Snipaste_2025-06-17_16-52-23.png'
import Snipaste_2025_06_17_16_36_21 from '@/pages/sample/dataAcquisition/common/plugInTutorial/img/Snipaste_2025-06-17_16-36-21.png'
import Snipaste_2025_06_17_16_38_56 from '@/pages/sample/dataAcquisition/common/plugInTutorial/img/Snipaste_2025-06-17_16-38-56.png'
import Snipaste_2025_06_17_16_42_30 from '@/pages/sample/dataAcquisition/common/plugInTutorial/img/Snipaste_2025-06-17_16-42-30.png'
// Edge浏览器
import Snipaste_2025_06_17_17_24_19 from '@/pages/sample/dataAcquisition/common/plugInTutorial/img/Snipaste_2025-06-17_17-24-19.png'
import Snipaste_2025_06_17_17_25_23 from '@/pages/sample/dataAcquisition/common/plugInTutorial/img/Snipaste_2025-06-17_17-25-23.png'
import Snipaste_2025_06_17_17_29_17 from '@/pages/sample/dataAcquisition/common/plugInTutorial/img/Snipaste_2025-06-17_17-29-17.png'
import Snipaste_2025_06_17_17_33_26 from '@/pages/sample/dataAcquisition/common/plugInTutorial/img/Snipaste_2025-06-17_17-33-26.png'
import Snipaste_2025_06_17_17_37_22 from '@/pages/sample/dataAcquisition/common/plugInTutorial/img/Snipaste_2025-06-17_17-37-22.png'

defineOptions({ name: "plugInTutorial"})
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:modalOpen'])
const props = defineProps({
  modalOpen: Boolean,
})
const modalOpen = ref(false)
const tutorialData = reactive({
  modalOpen: false,
  list: [
    {
      title: '谷歌浏览器插件安装'
    }
  ]
})
watch(() => props.modalOpen, (val, oldVal) => {
  val && (modalOpen.value = val)
})
watch(() => modalOpen.value, (val, oldVal) => {
  !val && emit('update:modalOpen', false)
})
function modalCloseFn() {
  modalOpen.value = false
}
</script>
<style lang="less" scoped>
.plugInTutorial_index-modal-box {
  width: 100%;
  height: 800px;
  overflow-y: auto;
  .process-item {
    width: 100%;
    margin-bottom: 30px;
    .item-title {
      font-size: 30px;
      font-weight: 700;
    }
    .item-i {
      width: 100%;
      margin-bottom: 20px;
      .item-i-text {
        font-size: 24px;
        padding: 10px 0;
      }
      :deep(.ant-image) {
        border: 1px black solid;
        margin: 6px 0;
      }
    }
  }
}
</style>