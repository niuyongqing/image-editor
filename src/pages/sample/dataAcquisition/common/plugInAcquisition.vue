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
        <div class="custom-content">
          <p>点击下载插件并安装</p>
          <a-button @click="getTutorial">获取安装教程</a-button>
        </div>
      </template>
    </a-step>
    <a-step title="开始采集">
      <!-- <template #icon>
        <a-icon type="safety-certificate" />
      </template> -->
      <template #description>
        <div class="custom-content">
          <p>在已安装插件的浏览器中打开要采集的货源平台，选择要采集的产品使用插件采集</p>
        </div>
      </template>
    </a-step>
    <a-step title="采集完成">
      <template #description>
        <div class="custom-content">
          <p>采集的产品自动放入采集箱，根据需求自行领取到指定平台</p>
        </div>
      </template>
    </a-step>
  </a-steps>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
defineOptions({ name: "plugInAcquisition" })
const { proxy: _this } = getCurrentInstance()
function loadDescribe(key) {
  console.log('下载对应插件' + key);
  
}
// todo 下载教程视频
function getTutorial() {
  console.log('下载教程视频');
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
  }
}
</style>