<template>
<div>
  <div v-for="item in element" :key="item.id" style="user-select: none;">
    <div>
      <a-card class="card" style="background-color: #ebeef5;cursor: pointer;margin-bottom: 20px" @click="select(item)">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="text-align: left;">
            <async-icon :icon="item.icon" size="15px"></async-icon>
            <span style="margin-left: 5px">{{item.title}}</span>
          </div>
          <div style="text-align: right;">
            <async-icon v-show="item.select" :icon="selectNotChick" size="15px"></async-icon>
            <async-icon v-show="!item.select" :icon="selectChick" size="15px"></async-icon>
          </div>
        </div>
      </a-card>
      <cropping-template :item="item" @select="select" @select-children="selectChildren" v-if="item.id === 1"></cropping-template>
      <resize-template :item="item" @select="select" @select-children="selectChildren" v-if="item.id === 2"></resize-template>
    </div>
  </div>
</div>
</template>
<script lang="js" setup>
// 调整
import {ref} from 'vue'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import CroppingTemplate from "~/components/process-pictures/component/adjust/cropping-template.vue";
import ResizeTemplate from "~/components/process-pictures/component/adjust/resize-template.vue";
import {undo} from "~/components/process-pictures/component/adjust/cropping.js";
const element = ref([
  {id: 1, title: '裁剪/旋转', icon:'ScissorOutlined', select:false},
  {id: 2, title: '调整尺寸', select:false, icon:'RadiusSettingOutlined'},
  {id: 3, title: '消除笔', select:false, icon:'RadiusSettingOutlined',
    children:[
      {id:1, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:2, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:3, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:4, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:5, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:6, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:7, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:8, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:9, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
    ]
  },
  {id: 4, title: '色彩调节', icon:'RadiusSettingOutlined', select:false,
    children:[
      {id:1, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:2, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:3, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:4, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:5, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:6, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:7, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:8, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:9, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},

    ]
  },
  {id: 5, title: '颜色叠加', icon:'RadiusSettingOutlined', select:false,
    children:[
      {id:1, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:2, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:3, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:4, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:5, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:6, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:7, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:8, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:9, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
    ]
  },
  {id: 6, title: '滤镜', icon:'RadiusSettingOutlined', select:false,
    children:[
      {id:1, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:2, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:3, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:4, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:5, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:6, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:7, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:8, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:9, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
    ]
  },
  {id: 7, title: '马赛克', icon:'RadiusSettingOutlined', select:false,
    children:[
      {id:1, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:2, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:3, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:4, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:5, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:6, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:7, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:8, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:9, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
    ]
  },
  {id: 8, title: '标尺', icon:'RadiusSettingOutlined', select:false,
    children:[
      {id:1, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:2, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:3, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:4, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:5, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:6, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:7, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:8, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
      {id:9, title: '自由比例', select:false, icon:'RadiusSettingOutlined'},
    ]
  },
])
const selectChick = ref('RightOutlined')
const selectNotChick = ref('DownOutlined')

function select(item) {
  undo()
  item.select = !item.select
  element.value.filter((v) => v.id !== item.id).map((m)=>m.select = false)
}

function selectChildren(chi){
  chi.select = true
}


</script>



<style scoped lang="less">
.card-hover {
  transition: background-color 0.3s ease; /* 可选：平滑过渡 */
}

.card-hover:hover {
  background-color: #e0e0e0; /* 鼠标悬停时的背景色 */
}
:deep(.ant-input-number-prefix){
  color: #a7a7a8;
}

.border{
  border-style: dotted;border-width: 1px;border-color: #a7a7a8;margin-bottom: 5px;margin-top: -10px
}
</style>