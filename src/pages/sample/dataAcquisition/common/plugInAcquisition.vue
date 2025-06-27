<template>
<div id="plugInAcquisition" class="plugInAcquisition">
  <div class="describe-box">
    <div class="text h1">通过插件实现产品即时采集</div>
    <div class="text h2">边浏览产品边采集，采集后产品放入通用采集箱，或自动认领到平台采集箱</div>
    <div class="text h3">
      <div class="text-h3-item">请点击您所使用的浏览器，下载对应的插件</div>
      <div class="text-h3-item">
        <a-space>
          <a-button primary @click="loadDescribe('chrome')">谷歌浏览器</a-button>
          <a-button primary @click="loadDescribe('360')">360浏览器</a-button>
          <a-button primary @click="loadDescribe('edge')">Edge浏览器</a-button>
        </a-space>
      </div>
    </div>
  </div>
  <a-steps
    direction="vertical"
    :current="null"
    class="custom-steps-no-hover"
  >
    <a-step title="安装插件">
      <!-- <template #icon>
        <a-icon type="safety-certificate" />
      </template> -->
      <template #description>
        <div>
          <p>点击下载插件并安装</p>
          <a-button @click="getTutorial">查看安装教程</a-button>
        </div>
      </template>
    </a-step>
    <a-step title="开始采集">
      <!-- <template #icon>
        <a-icon type="safety-certificate" />
      </template> -->
      <template #description>
        <div>
          <p>在已安装插件的浏览器中打开要采集的货源平台，选择要采集的产品使用插件采集</p>
        </div>
      </template>
    </a-step>
    <a-step title="采集完成">
      <template #description>
        <div class="custom-content">
          <p>采集的产品自动放入采集箱，根据需求自行领取到指定平台</p>
          <img 
            class="custom-content-img" 
            src="../common/plugInTutorial/img/Snipaste_2025-06-17_15-41-25.png" 
            alt=""
          >
          <img 
            class="custom-content-img" 
            src="../common/plugInTutorial/img/Snipaste_2025-06-17_15-42-09.png" 
            alt=""
          >
        </div>
      </template>
    </a-step>
  </a-steps>
  <div class="platform-box">
    <div class="platform-title">支持平台</div>
    <div class="platform-item-box">
      <div class="platform-item" 
        v-for="item in platformList" 
        :key="item.account"
      >
        {{ item.simpleName }}
      </div>
    </div>
  </div>
  <!-- <a-button type="primary" @click="pluginData.modalOpen = !pluginData.modalOpen">图片空间</a-button> -->
  <plugInTutorial v-model:modal-open="plugInTutorialOpen"></plugInTutorial>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { dataGathe } from "../../../ozon/config/commDic/defDic"
import pictureLibrary from '@/components/pictureLibrary/index.vue'
import plugInTutorial from '@/pages/sample/dataAcquisition/common/plugInTutorial/index.vue'
import download from '~@/api/common/download';
defineOptions({ name: "plugInAcquisition" })
const { proxy: _this } = getCurrentInstance()
const platformList = [
  {
    account: "shopee",
    simpleName: "Shopee"
  },
  {
    account: "al",
    simpleName: "阿里巴巴国际站"
  },
  {
    account: "amazon",
    simpleName: "Amazon"
  },
  {
    account: "tb",
    simpleName: "淘宝"
  },
  {
    account: "tm",
    simpleName: "天猫"
  },
  {
    account: "smt",
    simpleName: "速卖通"
  },
  {
    account: "lazada",
    simpleName: "Lazada"
  },
]
const pluginData = reactive({
  modalOpen: false,
  imageList: [],
})
const plugInTutorialOpen = ref(false)
function loadDescribe(key) {
  // console.log('下载对应插件' + key);
  download.url('/profile/static/chrome-plugin.zip');
}
// todo 下载教程视频
function getTutorial() {
  // console.log('下载教程视频');
  plugInTutorialOpen.value = !plugInTutorialOpen.value
}

const description = 'This is a description.';
</script>
<style lang="less" scoped>
.plugInAcquisition {
  .describe-box {
    width: 100%;
    // margin: 10px;
    padding: 10px;
    background: #e8f8ff;
    text-align: left;
    margin-bottom: 20px;
    .text {
      width: 100%;
      height: 30px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      &.h1 {
        font-weight: 500;
        font-size: 20px;
      }
      &.h3 {
        color: #b4bac0;
        font-size: 14px;
        flex-direction: column;
        height: 40px;
        .text-h3-item {
          width: 100%;
          margin-bottom: 6px;
          display: flex;
          justify-content: flex-start;
          // :deep(.ant-btn) {
          //   margin-right: 8px;
          // }
        }
      }
    }
  }
  :deep(.custom-steps-no-hover) {
    .ant-steps-item:hover {
      background: transparent;
      // cursor: no-drop;
      .ant-steps-item-title {
        color: rgba(0, 0, 0, 0.85) !important; /* 默认文字颜色 */
      }
      .ant-steps-item-description {
        background: #fff !important;
        color: rgba(0, 0, 0, 0.25) !important;
      }
    }
    .custom-content {
      display: flex;
      flex-direction: column;
      .custom-content-img {
        width: 500px;
        margin: 10px 0;
        border: 1px black solid;
      }
    }
  }
  .platform-box {
    .platform-title {
      height: 40px;
      text-align: left;
      font-size: 20px;
      font-weight: 700;
    }
    .platform-item-box {
      display: flex;
      .platform-item {
        height: 40px;
        padding: 10px;
        margin: 0 8px 8px 0;
        border: #e8f8ff 1px solid;
        border-radius: 3px;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
    }
  }
}
</style>