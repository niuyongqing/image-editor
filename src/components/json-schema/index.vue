<template>
  <a-tabs v-model:activeKey="activeKey" type="card" style="width: 100%;">
    <a-tab-pane key="1" tab="产品识别">
      <BaseInfo :json="json"></BaseInfo>
    </a-tab-pane>
    <a-tab-pane key="2" tab="描述" force-render>

    </a-tab-pane>
    <a-tab-pane key="3" tab="产品详情">

    </a-tab-pane>
    <a-tab-pane key="4" tab="报价">

    </a-tab-pane>
    <a-tab-pane key="5" tab="安全与合规">

    </a-tab-pane>
  </a-tabs>
</template>
<script setup lang="js">
import BaseInfo from './components/BaseInfo.vue'
import {ref} from 'vue'
const props = defineProps({
  json:{required:true,type:JSON}
})
const activeKey = ref("1")

</script>



<style scoped lang="less">
.card-container p {
  margin: 0;
}
.card-container > .ant-tabs-card .ant-tabs-content {
  height: 120px;
  margin-top: -16px;
}
.card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
  padding: 16px;
  background: #fff;
}
.card-container > .ant-tabs-card > .ant-tabs-nav::before {
  display: none;
}
.card-container > .ant-tabs-card .ant-tabs-tab,
[data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab {
  background: transparent;
  border-color: transparent;
}
.card-container > .ant-tabs-card .ant-tabs-tab-active,
[data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab-active {
  background: #fff;
  border-color: #fff;
}
#components-tabs-demo-card-top .code-box-demo {
  padding: 24px;
  overflow: hidden;
  background: #f5f5f5;
}
[data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-content {
  height: 120px;
  margin-top: -8px;
}
[data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-tab {
  background: transparent;
  border-color: transparent;
}
[data-theme='dark'] #components-tabs-demo-card-top .code-box-demo {
  background: #000;
}
[data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
  background: #141414;
}
[data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-tab-active {
  background: #141414;
  border-color: #141414;
}
</style>