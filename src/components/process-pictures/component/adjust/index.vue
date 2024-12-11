<template>
<div>
  <div v-for="item in element" :key="item.id" style="user-select: none;">
    <div>
      <a-card class="card" style="background-color: #ebeef5;cursor: pointer;margin-bottom: 20px" @click="select(item)">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="text-align: left;">
            <div v-if="item.icon.includes('<svg')" v-html="item.icon" style="display: inline-block; vertical-align: middle; line-height: 1;"></div>
            <async-icon :icon="item.icon" size="15px" v-else></async-icon>
            <span style="margin-left: 5px">{{item.title}}</span>
          </div>
          <div style="text-align: right;">
            <async-icon v-show="item.select" :icon="selectNotChick" size="15px"></async-icon>
            <async-icon v-show="!item.select" :icon="selectChick" size="15px"></async-icon>
          </div>
        </div>
      </a-card>
      <cropping-template :item="item" @select="select" @select-children="selectChildren" v-if="cur === 1"></cropping-template>
      <resize-template :item="item" @select="select" @select-children="selectChildren" v-if="cur === 2"></resize-template>
      <eliminate-template :item="item" @select="select" @select-children="selectChildren" v-if="cur === 3"></eliminate-template>
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
  {id: 3, title: '消除笔', select:false, icon:'<svg t="1733877054459" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4260" width="20" height="20"><path d="M724.32 768l259.472-259.472a72.56 72.56 0 0 0 0-102.624L695.152 117.28a72.56 72.56 0 0 0-102.624 0L218.512 491.248a145.12 145.12 0 0 0 0 205.248l98.88 98.88h0.608L407.008 864H992v-96H724.32zM444.88 400.656l198.944-198.944 255.52 255.52L700.384 656.16 444.88 400.656z m-67.888 67.888l255.52 255.52L588.56 768H432l-145.6-139.36a49.12 49.12 0 0 1 0-69.488l90.592-90.608zM112 784H16v80h96v-80zM160 784h96v80h-96v-80z" fill="#515151" p-id="4261"></path></svg>'},
  {id: 4, title: '色彩调节', icon:'RadiusSettingOutlined', select:false},
  {id: 5, title: '颜色叠加', icon:'RadiusSettingOutlined', select:false},
  {id: 6, title: '滤镜', icon:'RadiusSettingOutlined', select:false},
  {id: 7, title: '马赛克', icon:'RadiusSettingOutlined', select:false},
  {id: 8, title: '标尺', icon:'RadiusSettingOutlined', select:false}
])
const selectChick = ref('RightOutlined')
const selectNotChick = ref('DownOutlined')
const cur = ref(1)

function select(item) {
  undo()
  if(!item.select){
    cur.value = item.id
  }else {
    cur.value = undefined
  }
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