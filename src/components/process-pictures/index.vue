
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
   <a-card style="width: 320px">
     <scale-composition v-show="current.id === 1"></scale-composition>
     <draw-composition v-show="current.id === 2"></draw-composition>
     <frame-composition v-show="current.id === 4"></frame-composition>
     <mark-composition v-show="current.id === 6"></mark-composition>
     <material-composition v-show="current.id === 5"></material-composition>
     <text-composition v-show="current.id === 3"></text-composition>
   </a-card>
   <canvas-component :img-url="imgUrl" :canvas-height="canvasHeight" :canvas-width="canvasWidth" style="margin-left: 10px"></canvas-component>
 </div>
</template>
<script setup lang="js">
import CanvasComponent from "~/components/process-pictures/component/CanvasComponent.vue";
import {ref} from 'vue'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import DrawComposition from "~/components/process-pictures/component/DrawComposition.vue";
import MarkComposition from "~/components/process-pictures/component/MarkComposition.vue";
const canvasHeight = ref(window.innerHeight - 80);
const canvasWidth = ref(window.innerWidth  - 350);
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
  window.removeEventListener('resize', updateCanvasSize);
});

</script>

<style scoped lang="less">

</style>