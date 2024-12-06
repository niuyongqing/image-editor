<template>
 <div  :style="{width:canvasWidth+'px',height:canvasHeight+'px'}" >
   <div style="justify-content: center;text-align: center">
     <canvas id="canvasElement" ref="canvasElement" :width="canvasWidth - 100" :height="canvasHeight - 100"></canvas>
   </div>
 </div>
</template>
<script lang="ts" setup>

import {ref} from 'vue'
import {createCanvas} from './painting.js'

const canvasElement = ref(null);


const props = defineProps({
  canvasWidth:{type:Number, required:true},
  canvasHeight:{type:Number, required:true},
  imgUrl:{type:String,required: true},
})

onMounted(async () => {
  if (canvasElement.value) {
    await createCanvas(canvasElement.value, props)
  }
});
</script>



<style scoped lang="less">
#canvasElement {

}

</style>