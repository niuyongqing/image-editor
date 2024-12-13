<template>
  <div  v-show="item.select" style="margin-bottom: 20px;" class="border">
    <div style="margin: 10px;">
      <div style=" display: flex; flex-direction: column; justify-content: center; align-items: flex-start; height: 100%;" >
        <div style="display: flex; width: 100%;font-size: 15px">
          <span style="flex: 1; text-align: left;color: black;">消除笔大小</span>
          <span style="flex: 1; text-align: right;color: black">{{value}}</span>
        </div>
      </div>
      <a-slider v-model:value="value" :reverse="false" @change="updateEraserSize"/>
      <a-button @click="undo();eliminate()" type="primary" style="margin-top: 10px">恢复原图</a-button>
    </div>
  </div>
</template>
<script setup lang="js">
import {ref} from 'vue'
import {eliminate, updateEraserSize} from "~/components/process-pictures/component/adjust/eliminate.js";
import {undo} from "~/components/process-pictures/component/adjust/cropping.js";
const emit = defineEmits(["selectChildren"]);
const props = defineProps({
  item:{type:Object,required:true,default:{id: undefined, title: '', icon:'', select:false}}
})
const value = ref(50)



onMounted(()=>{
  if(props.item.id === 3) {
    eliminate()
  }
})

</script>


<style scoped lang="less">
.border{
  border-style: dotted;border-width: 1px;border-color: #a7a7a8;margin: 5px;
}
</style>