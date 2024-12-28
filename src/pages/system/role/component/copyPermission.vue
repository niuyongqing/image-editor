<template>
  <a-modal :open="props.open" :title="`复制${data.roleName}的权限`"  :confirm-loading="loading" html-type="submit" :footer="null" :closable="false" :destroyOnClose="true" >
    <a-form :model="formData"  label-align="right" @finish="handleOk" :label-col="labelCol" >
      <a-form-item label="目标角色" name="roleIds" :rules="[{ required: true }]">
        <a-select style="width: 100%"
                  mode="multiple"
                  show-search
                  placeholder="搜索平台角色名称"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="false"
                  :options="roleData"
                  v-model:value="formData.roleIds"
                  :fieldNames="{label:'roleName',value:'roleId'}"
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
<script setup lang="js">
import {ref} from 'vue'
import useDebounce from "~/utils/useDebounce";
import { getSearchRoleListApi,copyPermission} from '~/api/common/role'
import {message} from "ant-design-vue";
const loading = ref(false)
const props = defineProps({
  open:{ type: Boolean, required: true, default:false },
  data:{type:Object,required: false, default:{}},
})
const emit = defineEmits(['close']);
const roleData = ref([])
const formData = ref({roleIds:[],source:null})

function handleOk(){
  copyPermission(formData.value).then((res)=>{
    if(res.code == 200){
      message.success(res.msg);
      close()
    }else
      message.error(res.msg);
  })
}

const  outInput = useDebounce((a) => {
  getRoleList(a);
}, 500,true)

function getRoleList(v){
  if(v){
    getSearchRoleListApi(v).then((res)=>{
      roleData.value = res.data.filter(v => v.roleId  !== props.data.roleId)
    })
  }
}

watchEffect(()=>{
  if(props.data.roleId){
   formData.value.source = props.data.roleId
  }
})

function close() {
  roleData.value = []
  formData.value = {roleIds:[],source:null}
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