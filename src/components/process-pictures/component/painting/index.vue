<template>
 <div  :style="{width:canvasWidth+'px',height:canvasHeight+'px'}" >
   <div style="justify-content: center;text-align: center">
     <canvas id="canvasElement" ref="canvasElement" :width="canvasWidth" :height="canvasHeight"></canvas>
   </div>
 </div>
</template>
<script lang="ts" setup>

import {ref} from 'vue'
import {createCanvas} from './painting.js'
import {usePsStore} from "~/stores/ps";

const canvasElement = ref(null);


const props = defineProps({
  canvasWidth:{type:Number, required:true},
  canvasHeight:{type:Number, required:true},
  imgUrl:{type:String,required: true},
})

onMounted(async () => {
  if (canvasElement.value) {
    usePsStore().Props.value = {
      canvasWidth:props.canvasWidth,
      canvasHeight:props.canvasHeight,
      imgUrl:props.imgUrl,
    };
    await createCanvas(canvasElement.value)
  }
});
</script>



<style scoped lang="less">
#canvasElement {

}

</style>