<template>
  <a-modal :open="props.open" :title="`分配${data.roleName}`"  :confirm-loading="loading" html-type="submit" :footer="null" :closable="false" :destroyOnClose="true" >
    <a-form :model="formData"  label-align="right" @finish="handleOk" :label-col="labelCol" >
      <a-form-item label="姓名" name="userId" >
        <a-select style="width: 100%"
                  mode="multiple"
                  show-search
                  placeholder="搜索姓名"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="false"
                  :options="userData"
                  v-model:value="formData.userIds"
                  :fieldNames="{label:'userName',value:'userId'}"
                  @search="outInput"
        ></a-select>
      </a-form-item>
      <a-form-item style="display: flex; text-align: right">
        <a-button @click="close" style="margin-right: 10px">取消</a-button>
        <a-button type="primary" html-type="submit">确定</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
import {ref} from 'vue'
const loading = ref(false)
const props = defineProps({
  open:{ type: Boolean, required: true, default:false },
  data:{type:Object,required: false, default:{}},
})
const emit = defineEmits(['close']);
import useDebounce from "@/utils/useDebounce";
import { editRoleEditUserApi, getRoleUserApi, getUserListApi} from '~/api/common/role'
import {message} from "ant-design-vue";
const userData = ref([])
const formData = ref({roleId:null,userIds:[]})
const  outInput = useDebounce((a) => {
  getUserList(a);
}, 500,true)

watchEffect(()=>{
  if(props.data.roleId){
    getRoleUserApi({roleId: props.data.roleId}).then(res=>{
      formData.value.roleId = props.data.roleId
      for (let i = 0; i < res.data.length; i++) {
        userData.value.push({userId:res.data[i].userId,userName:res.data[i].userName})
        formData.value.userIds.push(res.data[i].userId)
      }
    })
  }
})

function getUserList(e){
  if(e){
    getUserListApi(e).then((res)=>{
      userData.value = res.data
    })
  }
}

function handleOk(){
  editRoleEditUserApi(formData.value).then((res)=>{
    if(res.code == 200){
      message.success(res.msg);
      close()
    }else
      message.error(res.msg);
  })
}

function close() {
  formData.value = {roleId:null,userIds:[]};
  userData.value = []
  emit('close', false);
}
const labelCol = {
  style: {
    width: '80px',
  },
};

</script>


<style scoped lang="less">

</style>