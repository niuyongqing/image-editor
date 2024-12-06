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
      <div  v-show="item.select" style="border-style: dotted;border-width: 1px;border-color: #a7a7a8;margin-bottom: 5px;margin-top: -10px">
        <div style="display: flex; flex-wrap: wrap; gap: 5px;padding: 0;margin:5px">
          <a-card v-for="chi in item.children" :key="chi.id" :style="{backgroundColor:chi.select?'#ffffff':'#f7f8fa', cursor: 'pointer', width: '100px'}"  class="card-hover" @click="selectChildren(chi,item.children)">
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
              <async-icon v-if="chi.icon" :icon="chi.icon" size="15px"></async-icon>
              {{chi.title}}
            </div>
          </a-card>
        </div>
      </div>
      <div v-show="item.select" style="margin-bottom: 10px">
        <div style="display: inline">
          <a-input-number :controls="false" @change="updateRectanglePositionXFunc" v-model:value="xRef" style="right: 5px" prefix="W"/>
          <async-icon icon="ApiOutlined" size="15px"></async-icon>
          <a-input-number :controls="false" @change="updateRectanglePositionYFunc" v-model:value="yRef" style="left: 5px" prefix="H"/>
        </div>
        <div style="margin-top: 5px;display: flex;flex-wrap: wrap;gap: 5px;justify-content: center">
          <a-button @click="saveCroppedImage" type="primary">应 用</a-button>
          <a-button @click="undo">取 消</a-button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script lang="ts" setup>
// 裁剪
import {ref} from 'vue'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import {
  FreeProportion,
  updateRectanglePositionX,
  updateRectanglePositionY,
  xRef,
  yRef,
  saveCroppedImage,
  undo, to1and1,
} from "~/components/process-pictures/component/scale/FreeProportion";
const selectChick = ref('RightOutlined')
const selectNotChick = ref('DownOutlined')
const element = ref([
  {id: 1, title: '裁剪/旋转', icon:'ScissorOutlined', select:false,
    children:[
      {id:1, title: '自由裁剪', icon:'RadiusSettingOutlined', select:false,func:FreeProportion,parameter:[0,0,0,0]},
      {id:2, title: '1X1', icon:'ScissorOutlined', select:false,func:to1and1,parameter:[100,100,100,100]},
      {id:3, title: '3X2', icon:'ScissorOutlined', select:false},
      {id:4, title: '2X3', icon:'ScissorOutlined', select:false},
      {id:5, title: '4X3', icon:'ScissorOutlined', select:false},
      {id:6, title: '3X4', icon:'ScissorOutlined', select:false},
      {id:7, title: '16X9', icon:'ScissorOutlined', select:false},
      {id:8, title: '9X16', icon:'ScissorOutlined', select:false}
    ]
  },
  {id: 2, title: '调整尺寸', icon:'RadiusSettingOutlined', select:false,
    children:[
      {id:1, title: '自由比例', icon:'RadiusSettingOutlined', select:false},
      {id:2, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:3, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:4, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:5, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:6, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:7, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:8, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:9, title: '自由比例', icon:'ScissorOutlined', select:false}
    ]
  },
  {id: 3, title: '消除笔', icon:'RadiusSettingOutlined', select:false,
    children:[
      {id:1, title: '自由比例', icon:'RadiusSettingOutlined', select:false},
      {id:2, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:3, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:4, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:5, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:6, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:7, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:8, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:9, title: '自由比例', icon:'ScissorOutlined', select:false}
    ]
  },
  {id: 4, title: '色彩调节', icon:'RadiusSettingOutlined', select:false,
    children:[
      {id:1, title: '自由比例', icon:'RadiusSettingOutlined', select:false},
      {id:2, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:3, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:4, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:5, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:6, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:7, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:8, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:9, title: '自由比例', icon:'ScissorOutlined', select:false}
    ]
  },
  {id: 5, title: '颜色叠加', icon:'RadiusSettingOutlined', select:false,
    children:[
      {id:1, title: '自由比例', icon:'RadiusSettingOutlined', select:false},
      {id:2, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:3, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:4, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:5, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:6, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:7, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:8, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:9, title: '自由比例', icon:'ScissorOutlined', select:false}
    ]
  },
  {id: 6, title: '滤镜', icon:'RadiusSettingOutlined', select:false,
    children:[
      {id:1, title: '自由比例', icon:'RadiusSettingOutlined', select:false},
      {id:2, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:3, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:4, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:5, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:6, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:7, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:8, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:9, title: '自由比例', icon:'ScissorOutlined', select:false}
    ]
  },
  {id: 7, title: '马赛克', icon:'RadiusSettingOutlined', select:false,
    children:[
      {id:1, title: '自由比例', icon:'RadiusSettingOutlined', select:false},
      {id:2, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:3, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:4, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:5, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:6, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:7, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:8, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:9, title: '自由比例', icon:'ScissorOutlined', select:false}
    ]
  },
  {id: 8, title: '标尺', icon:'RadiusSettingOutlined', select:false,
    children:[
      {id:1, title: '自由比例', icon:'RadiusSettingOutlined', select:false},
      {id:2, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:3, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:4, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:5, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:6, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:7, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:8, title: '自由比例', icon:'ScissorOutlined', select:false},
      {id:9, title: '自由比例', icon:'ScissorOutlined', select:false}
    ]
  },
])

function select(item) {
  item.select = !item.select
  element.value.filter((v) => v.id !== item.id).map((m)=>m.select = false)
}

function updateRectanglePositionXFunc(x){
  updateRectanglePositionX(x)
}

function updateRectanglePositionYFunc(y){
  updateRectanglePositionY(y)
}

function selectChildren(chi,children){
  chi.select = !chi.select
  children.filter((v) => v.id !== chi.id).map((m)=>m.select = false)
  if (typeof chi.func === 'function') {
    chi.func(...chi.parameter);
  }
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
</style>