<template>
<div>
  <div  v-show="item.select" class="border">
    <div style="display: flex; flex-wrap: wrap; gap: 5px;padding: 0;margin:5px">
      <a-card v-for="chi in children" :key="chi.id" :style="{backgroundColor:chi.select?'#ffffff':'#f7f8fa', cursor: 'pointer', width: '110px'}"  class="card-hover" @click="selectChildren(chi)">
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <async-icon v-if="chi.icon && !chi.icon.includes('<svg')" :icon="chi.icon" size="15px"></async-icon>
          <div v-html="chi.icon" v-else></div>
          <span style="font-size: 13px">{{chi.title}}</span>
        </div>
      </a-card>
    </div>
  </div>
  <div v-show="item.select" style="margin-bottom: 10px">
    <div style="display: inline;height: 50px">
      <a-input-number :controls="false" @change="updateRectanglePositionXFunc" v-model:value="xRef" style="right: 5px" prefix="W"/>
      <async-icon icon="ApiOutlined" size="15px"></async-icon>
      <a-input-number :controls="false" @change="updateRectanglePositionYFunc" v-model:value="yRef" style="left: 5px" prefix="H"/>
    </div>
    <div style="display: flex;gap: 30px;margin-top: 5px;justify-content: center">
      <a-tooltip>
        <template #title>顺时针旋转90°</template>
        <async-icon icon="RedoOutlined" size="25px" @click="rotate(90)"></async-icon>
      </a-tooltip>
      <a-tooltip>
        <template #title>逆时针旋转90°</template>
        <async-icon icon="UndoOutlined" size="25px" @click="rotate(-90)"></async-icon>
      </a-tooltip>
      <a-tooltip>
        <template #title>垂直翻转</template>
        <div style="cursor: pointer" @click="flipImage('vertical')"><svg t="1733569966535" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6379" width="25" height="25"><path d="M213.333333 554.666667H128v-85.333334h85.333333v85.333334z m632.661334-384a42.666667 42.666667 0 0 1-18.218667 34.986666l-291.328 203.904a42.666667 42.666667 0 0 1-48.896 0l-291.328-203.946666A42.666667 42.666667 0 0 1 220.672 128h582.656a42.666667 42.666667 0 0 1 42.666667 42.666667z m0 682.666666a42.666667 42.666667 0 0 1-37.717334 42.368l-4.949333 0.298667H220.672a42.666667 42.666667 0 0 1-28.629333-74.24l4.181333-3.413333 291.328-203.904a42.666667 42.666667 0 0 1 43.861333-3.029334l5.034667 3.029334 291.328 203.946666a42.666667 42.666667 0 0 1 18.218667 34.944zM384 554.666667H298.666667v-85.333334h85.333333v85.333334z m320.896-358.4H307.2L512 335.957333l192.896-139.605333zM554.666667 554.666667h-85.333334v-85.333334h85.333334v85.333334z m170.666666 0h-85.333333v-85.333334h85.333333v85.333334z m170.666667 0h-85.333333v-85.333334h85.333333v85.333334z" fill="#2c2c2c" p-id="6380"></path></svg></div>
      </a-tooltip>
      <a-tooltip>
        <template #title>水平翻转</template>
        <div  style="cursor: pointer"  @click="flipImage('horizontal')"> <svg t="1733569875407" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6121" width="25" height="25"><path d="M554.666667 810.666667v85.333333h-85.333334v-85.333333h85.333334zM170.666667 178.005333a42.666667 42.666667 0 0 1 34.986666 18.218667l203.904 291.328a42.666667 42.666667 0 0 1 0 48.896l-203.946666 291.328A42.666667 42.666667 0 0 1 128 803.328V220.672a42.666667 42.666667 0 0 1 42.666667-42.666667z m682.666666 0a42.666667 42.666667 0 0 1 42.368 37.717334l0.298667 4.949333v582.656a42.666667 42.666667 0 0 1-74.24 28.629333l-3.413333-4.181333-203.904-291.328a42.666667 42.666667 0 0 1-3.029334-43.861333l3.029334-5.034667 203.946666-291.328A42.666667 42.666667 0 0 1 853.333333 178.005333zM554.666667 640v85.333333h-85.333334v-85.333333h85.333334zM196.266667 319.104V716.8L335.957333 512 196.309333 319.104zM554.666667 469.333333v85.333334h-85.333334v-85.333334h85.333334z m0-170.666666v85.333333h-85.333334V298.666667h85.333334z m0-170.666667v85.333333h-85.333334V128h85.333334z" fill="#2c2c2c" p-id="6122"></path></svg></div>
      </a-tooltip>
    </div>
    <div style="margin-top: 5px;display: flex;flex-wrap: wrap;gap: 5px;justify-content: center">
      <a-popconfirm title="确定要应用吗？" @confirm="saveCroppedImage">
        <a-button  type="primary" :loading="saveLoading">应 用</a-button>
      </a-popconfirm>
      <a-button @click="undo">还 原</a-button>
    </div>
  </div>
</div>
</template>
<script lang="js" setup>
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import {
  Cropping,
  flipImage,
  rotate,
  saveCroppedImage, saveLoading, toRatio,
  undo, updateRectanglePositionX, updateRectanglePositionY,
  xRef,
  yRef
} from "~/components/process-pictures/component/adjust/cropping";
import {ref} from 'vue'
const emit = defineEmits(["selectChildren"]);
const props = defineProps({
  item:{type:Object,required:true,default:{id: undefined, title: '', icon:'', select:false}}
})
const children = ref([
  {id:1, title: '自由', select:false,func:Cropping, icon:'<svg x="1733477465958" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5232" width="20" height="20"><path d="M832 728V250.5c0-8.5 3.4-16.6 9.4-22.6L1001 68.3c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L796.1 182.6c-6 6-14.1 9.4-22.6 9.4H296c-4.4 0-8-3.6-8-8V8c0-4.4-3.6-8-8-8h-80c-4.4 0-8 3.6-8 8v176c0 4.4-3.6 8-8 8H8c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h176c4.4 0 8 3.6 8 8v472c0 35.3 28.7 64 64 64h472c4.4 0 8 3.6 8 8v176c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8V840c0-4.4 3.6-8 8-8h176c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8H840c-4.4 0-8-3.6-8-8zM296 288h375.4c7.1 0 10.7 8.6 5.7 13.7L301.7 677.1c-5 5-13.7 1.5-13.7-5.7V296c0-4.4 3.6-8 8-8z m432 448H352.6c-7.1 0-10.7-8.6-5.7-13.7l375.4-375.4c5-5 13.7-1.5 13.7 5.7V728c0 4.4-3.6 8-8 8z" p-id="5233"></path></svg>'},
  {id:2, title: '1X1', select:false,func:toRatio,parameter:[1,1], icon:'<svg x="1733477435776" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4152" width="20" height="20"><path d="M853.333333 170.666667v682.666666H170.666667V170.666667h682.666666m85.333334-85.333334H85.333333v853.333334h853.333334V85.333333z" fill="" p-id="4153"></path></svg>'},
  {id:3, title: '3X2', select:false,func:toRatio,parameter:[3,2], icon:'<svg t="1733477412913" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3897" width="30" height="30"><path d="M851.626667 320.853333v381.44H172.373333V320.853333h679.253334m69.973333-69.12H102.4v521.386667h819.2V251.733333z" fill="#231815" p-id="3898"></path></svg>'},
  {id:4, title: '2X3', select:false,func:toRatio, parameter:[2,3], icon:'<svg t="1733478303781" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="42304" width="25" height="25"><path d="M802 62L802 962 222 962l0-900 580 0zM702 862l0-700L322 162 322 862l380 0z" p-id="42305"></path></svg>'},
  {id:5, title: '4X3', select:false,func:toRatio, parameter:[4,3], icon:'<svg t="1733478349912" class="icon" viewBox="0 0 1133 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="42604" width="25" height="25"><path d="M109.714286 164.571429v658.285714h914.285714v-658.285714h-914.285714z m-109.714286-18.285715A91.428571 91.428571 0 0 1 91.428571 54.857143h950.857143A91.428571 91.428571 0 0 1 1133.714286 146.285714v694.857143a91.428571 91.428571 0 0 1-91.428572 91.428572H91.428571A91.428571 91.428571 0 0 1 0 841.142857V146.285714z" fill="#0D0D0D" fill-opacity=".9" p-id="42605"></path></svg>'},
  {id:6, title: '3X4', select:false,func:toRatio, parameter:[3,4], icon:'<svg t="1733478404923" class="icon" viewBox="0 0 1228 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="46374" width="25" height="25"><path d="M1075.2 51.2a102.4 102.4 0 0 1 102.4 102.4v716.8a102.4 102.4 0 0 1-102.4 102.4H153.6A102.4 102.4 0 0 1 51.2 870.4V153.6A102.4 102.4 0 0 1 153.6 51.2h921.6zM153.6 0A153.6 153.6 0 0 0 0 153.6v716.8A153.6 153.6 0 0 0 153.6 1024h921.6a153.6 153.6 0 0 0 153.6-153.6V153.6A153.6 153.6 0 0 0 1075.2 0H153.6z" p-id="46375"></path></svg>'},
  {id:7, title: '16X9', select:false,func:toRatio, parameter:[16,9], icon:'<svg t="1733478251283" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="38775" width="20" height="20"><path d="M896 832H128a64.07 64.07 0 0 1-64-64V256a64.07 64.07 0 0 1 64-64h768a64.07 64.07 0 0 1 64 64v512a64.07 64.07 0 0 1-64 64zM128 256v512h768V256z" fill="#5C5C66" p-id="38776"></path></svg>'},
  {id:8, title: '9X16', select:false,func:toRatio, parameter:[9,16], icon:'<svg t="1733478452763" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="49141" width="25" height="25"><path d="M222.088 32c-12.71 0-22.904 10.062-22.904 22.454l0.001 914.113c0 12.394 10.723 23.433 23.43 23.433h578.378c12.637 0 23.43-11.040 23.43-23.433l-0.001-913.138c0.002-12.322-10.791-23.429-23.429-23.429h-578.905zM246.048 944.288l-0.98-16.232 0.98-849.192 533.056 0.080v865.424l-533.056-0.080z" p-id="49142"></path></svg>'}
])

function updateRectanglePositionXFunc(x){
  return  updateRectanglePositionX(x)
}

function updateRectanglePositionYFunc(y){
  return updateRectanglePositionY(y)
}
function selectChildren(chi){
  chi.select = true
  children.value.filter((v) => v.id !== chi.id).map((m)=>m.select = false)
  if (typeof chi.func === 'function') {
    if(chi.parameter){
      chi.func(...chi.parameter);
    }else {
      chi.func();
    }
  }
}


</script>

<style scoped lang="less">
.border{
  border-style: dotted;border-width: 1px;border-color: #a7a7a8;margin-bottom: 5px;margin-top: -10px
}
</style>