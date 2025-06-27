<template>
  <div id="dataAcquisitionCont">
    <a-card>
      <a-steps :current="1" :percent="30" :items="items" />
    </a-card>
    <a-card>
      <a-tabs v-model:activeKey="tabsData.activeKey" @change="tabsChange">
        <a-tab-pane
          v-for="item in tabsData.list"
          :key="item.key" 
          :tab="item.tab"
        >
          <component 
            :is="tabsData.activeComponent"
            @loadDescribe="loadDescribe"
          ></component>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <!-- <urlAcquisition></urlAcquisition> -->
  </div>
</template>

<script setup name='dataAcquisition'>
import { ref, reactive, onMounted, computed, watchPostEffect, markRaw } from 'vue'
import urlAcquisition from './common/urlAcquisition.vue';
import plugInAcquisition from './common/plugInAcquisition.vue';
const { proxy: _this } = getCurrentInstance()

const items = ref([
  {
    title: '数据采集',
    status: 'wait',
    disabled: true
  },
  {
    title: '认领产品',
    status: 'wait',
    disabled: true
  },
  {
    title: '编辑数据',
    status: 'wait',
    disabled: true
  },
  {
    title: '完成发布',
    status: 'wait',
    disabled: true
  },
]);
const tabsData = reactive({
  activeKey: 'urlAcquisition',
  activeComponent: null,
  list: [
    {
      key: 'urlAcquisition',
      tab: '采集数据'
    },
    {
      key: 'plugInAcquisition',
      tab: '插件采集'
    }
  ],
  components: {
    urlAcquisition: markRaw(urlAcquisition),
    plugInAcquisition: markRaw(plugInAcquisition)
  }
})
onMounted(() => {
  tabsData.activeKey = 'urlAcquisition'
  tabsChange(tabsData.activeKey)
})
function tabsChange(key) {
  // console.log({key});
  tabsData.activeComponent = tabsData.components[key]
}
function loadDescribe() {
  tabsData.activeKey = 'plugInAcquisition'
  tabsChange(tabsData.activeKey)
}
</script>
<style lang="less" scoped></style>