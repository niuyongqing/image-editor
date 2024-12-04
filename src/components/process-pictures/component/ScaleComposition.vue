<template>
<div>
  <div v-for="item in element" :key="item.id" style="user-select: none;">
    <a-card class="card" style="background-color: #f1f1f1;cursor: pointer;margin-bottom: 20px" @click="select(item)">
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
    <div style="display: flex; flex-wrap: wrap; gap: 5px;margin-bottom: 10px;padding: 0" v-show="item.select">
      <a-card v-for="chi in item.children" :key="chi.id" :style="{backgroundColor: '#ffffff', cursor: 'pointer', width: '100px'}" @click="selectChildren(item, chi)">
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <async-icon v-if="chi.icon" :icon="chi.icon" size="15px"></async-icon>
          {{chi.title}}
        </div>
      </a-card>
    </div>
  </div>
</div>
</template>
<script lang="ts" setup>
// 裁剪
import {ref} from 'vue'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
const selectChick = ref('RightOutlined')
const selectNotChick = ref('DownOutlined')
const element = ref([
  {id: 1, title: '裁剪/旋转', icon:'ScissorOutlined', select:false,
    children:[
      {id:1, title: '自由比例', icon:'RadiusSettingOutlined', select:false},
      {id:2, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:3, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:4, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:5, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:6, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:7, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:8, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:9, title: '自由比例', icon:'ScissorOutlined', select:false,}
    ]
  },
  {id: 2, title: '调整尺寸', icon:'RadiusSettingOutlined', select:false,
    children:[
        {id:2, title: '自由比例',icon:'ScissorOutlined',  select:false}
    ]
  },
  {id: 3, title: '消除笔', icon:'RadiusSettingOutlined', select:false,
    children:[
      {id:2, title: '自由比例',icon:'ScissorOutlined',  select:false}
    ]
  },
  {id: 4, title: '色彩调节', icon:'RadiusSettingOutlined', select:false,
    children:[
      {id:2, title: '自由比例',icon:'ScissorOutlined',  select:false}
    ]
  },
  {id: 5, title: '颜色叠加', icon:'RadiusSettingOutlined', select:false,
    children:[
      {id:2, title: '自由比例',icon:'ScissorOutlined',  select:false}
    ]
  },
  {id: 6, title: '滤镜', icon:'RadiusSettingOutlined', select:false,
    children:[
      {id:2, title: '自由比例',icon:'ScissorOutlined',  select:false}
    ]
  },
  {id: 7, title: '马赛克', icon:'RadiusSettingOutlined', select:false,
    children:[
      {id:2, title: '自由比例',icon:'ScissorOutlined',  select:false}
    ]
  },
  {id: 8, title: '标尺', icon:'RadiusSettingOutlined', select:false,
    children:[
      {id:2, title: '自由比例',icon:'ScissorOutlined',  select:false}
    ]
  },
])

function select(item) {
  item.select = !item.select
  element.value.filter((v) => v.id !== item.id).map((m)=>m.select = false)
}

function selectChildren(item,chi){
  console.log(item,chi)
}
</script>



<style scoped lang="less">

</style>