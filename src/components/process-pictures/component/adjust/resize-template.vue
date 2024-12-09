<template>
  <div v-show="item.select" style="margin-bottom: 20px">
    <div style="overflow: auto;overflow-x: hidden;height: 300px;" class="border">
      <div style="width: 208px; height: 40px; background-color: #ebeef5; margin: 5px; border-radius: 10px" v-for="chi in children" :key="chi.id" :style="{ border: chi.select ? `2px solid ${setting.colorPrimary}` : 'none' }" @click="selectChildren(chi)">
        <div style="font-size: 12px; color: #363637; display: flex; align-items: center; justify-content: space-between; height: 100%; margin-left: 5px; margin-right: 10px; cursor: pointer">
          <span>{{`${chi.title}`}}{{chi.width? `(${chi.width}X${chi.height})`: ''  }}</span>
          <async-icon  v-if="chi.icon" :icon="chi.icon" size="15px"></async-icon>
          <a-popconfirm title="确定要删除这个自定义尺寸吗？" ok-text="Yes" cancel-text="No" @confirm="del(chi)" v-if="chi.userId">
            <a-button style="color: #f5222d" type="text" >x</a-button>
          </a-popconfirm>
        </div>
      </div>
    </div>
    <div>
      <a-modal v-model:open="open" title="添加自定义调整尺寸" :footer="null" :closable="false" >
        <a-form :model="formData"  label-align="right" @finish="handleOk" :label-col="labelCol">
          <a-form-item label="标题" name="title" :rules="[{ required: true}]" >
            <a-input v-model:value="formData.title"></a-input>
          </a-form-item>
          <a-form-item label="宽度（px）" name="width" :rules="[{ required: true}]" >
            <a-input-number v-model:value="formData.width" style="width: 100%"></a-input-number>
          </a-form-item>
          <a-form-item label="高度（px）" name="height" :rules="[{ required: true}]" >
            <a-input-number v-model:value="formData.height" style="width: 100%"></a-input-number>
          </a-form-item>
          <a-form-item style="display: flex; text-align: right">
            <a-button @click="closeAdd" style="margin-right: 10px">取消</a-button>
            <a-button type="primary" html-type="submit">添加</a-button>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>
<script lang="js" setup>
import setting from "~/config/default-setting.js";
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import {ref} from 'vue'
import {addEliminateApi, delEliminateApi, getEliminateListApi} from "~/api/ps/eliminate.js";
import {message} from "ant-design-vue";
import {resize} from "~/components/process-pictures/component/adjust/cropping.js";
const props = defineProps({item:{type:Object,required:true,default:{id: undefined, title: '', icon:'', select:undefined}},})
const labelCol = {style: {width: '80px'}};
const children = ref([])
const open = ref(false)
const formData = ref({})

onMounted(()=>{
  getCustomize()
})

function selectChildren(chi){
  chi.select = true
  children.value.filter((v) => v.id !== chi.id).map((m)=>m.select = false)
  if (typeof chi.func === 'function') {
    if(chi.width){
      chi.func(chi.width,chi.height);
    }else {
      chi.func();
    }
  }
}

function openAdd(){
  open.value = true
}


function closeAdd() {
  open.value = false
  formData.value = {
    width:undefined,height:undefined,title:''
  }
}

function del(chi) {
  if(chi.userId){
    delEliminateApi({id:chi.id}).then(res=>{
      if(res.code === 200){
        for(let i =0;i<children.value.length;i++){
          if(chi.id === children.value[i].id){
            getCustomize()
          }
        }
        message.success(res.msg);
        open.value = false
      }else {
        message.error(res.msg);
      }
    })
  }
}

function handleOk() {
  addEliminateApi(formData.value).then(res=>{
    if(res.code === 200){
      children.value.splice(1,0,res.data);
      formData.value = {
        width:undefined,height:undefined,title:''
      }
      message.success(res.msg);
      open.value = false
    }else {
      message.error(res.msg);
    }
  })
}

function getCustomize() {
  getEliminateListApi().then(res=>{
    children.value = [
      {id:1, title: '自定义', select:false, icon:'SettingOutlined',func:openAdd},
      {id:2, title: `方形主图`,width:800,height:800, select:false,func:resize},
      {id:3, title: `Temu服装图`,width:1340,height:1785, select:false,func:resize},
      {id:4, title: `方形主图`,width:1000,height:1000, select:false,func:resize},
      {id:5, title: `竖版主图`,width:1000,height:1200, select:false,func:resize},
      {id:6, title: `Youtubel视频封面`,width:1280,height:720, select:false,func:resize},
      {id:7, title: `Pinterest帖子`,width:750,height:1120, select:false,func:resize},
      {id:8, title: `Facebook封面`,width:851,height:315, select:false,func:resize}
    ]
    children.value.splice(1,0,...res.data)
    children.value.forEach((v)=>{
      if(v.id !== 1){
        v.func = resize
      }
    })
  })
}


</script>
<style scoped lang="less">
.border{
  border-style: dotted;border-width: 1px;border-color: #a7a7a8;margin-bottom: 5px;margin-top: -10px
}
</style>