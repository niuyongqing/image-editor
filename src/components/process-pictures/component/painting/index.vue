<template>
 <div>
   <canvas :width="canvasWidth" :height="canvasHeight" id="canvasElement" ref="canvasElement"></canvas>
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
  border: 1px solid #f30606;
  border-radius: 10px;
}
</style>