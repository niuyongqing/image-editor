<template>
 <div style="display: flex;">
   <div style="width: 60px; height: 100% ;background:#ffffff;border: 1px solid #e4e4e4;border-radius: 10px">
     <div v-for="item in menu" :key="item.id"  style="width: 55px;cursor: pointer;height: 80px;border-radius: 10px" @click="check(item)">
       <div style="margin-top: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%;">
         <async-icon :icon="item.select?item.icon:item.iconChick" size="25px"></async-icon>
         <div :style="{fontWeight: item.select?'bolder':''}">{{item.title}}</div>
       </div>
     </div>
   </div>
   <a-card>
     <scale-component v-show="current.id === 1" style="width: 220px"></scale-component>
     <draw-component v-show="current.id === 2"  style="width: 220px"></draw-component>
     <frame-component v-show="current.id === 4"  style="width: 220px"></frame-component>
     <mark-component v-show="current.id === 6"  style="width: 220px"></mark-component>
     <material-component v-show="current.id === 5"  style="width: 220px"></material-component>
     <text-component v-show="current.id === 3"  style="width: 220px"></text-component>
   </a-card>
   <painting-component :img-url="imgUrl" :canvas-height="canvasHeight" :canvas-width="canvasWidth" style="margin-left: 10px"></painting-component>
 </div>
</template>
<script setup lang="js">
import {ref} from 'vue'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import PaintingComponent from "~/components/process-pictures/component/painting/index.vue";
import FrameComponent from "~/components/process-pictures/component/frame/index.vue";
import ScaleComponent from "~/components/process-pictures/component/adjust/index.vue";
import DrawComponent from "~/components/process-pictures/component/draw/index.vue";
import MarkComponent from "~/components/process-pictures/component/mark/index.vue";
import MaterialComponent from "~/components/process-pictures/component/material/index.vue";
import TextComponent from "~/components/process-pictures/component/text/index.vue";
const canvasHeight = ref(window.innerHeight - 80);
const canvasWidth = ref(window.innerWidth  - 400);
const current = ref({});
const menu = ref([
  {
    id:1,
    title:"调整",
    icon:"ControlFilled",
    iconChick:"ControlOutlined",
    select:true,
  },
  {
    id:2,
    title: "绘制",
    icon:"HighlightFilled",
    iconChick:"HighlightOutlined",
    select:false
  },
  {
    id:3,
    title: "文本",
    icon:"FileTextFilled",
    iconChick:"FileTextOutlined",
    select:false
  },
  {
    id:4,
    title: "边框",
    icon:"LayoutFilled",
    iconChick:"LayoutOutlined",
    select:false
  },
  {
    id:5,
    title: "素材",
    icon:"SlackCircleFilled",
    iconChick:"SlackOutlined",
    select:false
  },
  {
    id:6,
    title: "水印",
    icon:"BulbFilled",
    iconChick:"BulbOutlined",
    select:false
  }
])
function check(item) {
  current.value = item;
  item.select = true
  menu.value.filter((v) => v.id !== item.id).map((m)=>m.select = false)
}
const props =  defineProps({
  imgUrl:{type:String,required:true},
})
const updateCanvasSize = () => {
  canvasHeight.value = window.innerHeight - 200;
  canvasWidth.value = window.innerWidth - 300;
};
onMounted(() => {
  current.value = menu.value[0];
  window.addEventListener('resize', updateCanvasSize);
});
onUnmounted(() => {
  usePsStore().FabricCanvas.value = null;
  usePsStore().FabricImage.value = null;
  window.removeEventListener('resize', updateCanvasSize);
});
</script>

<style scoped lang="less">

</style>