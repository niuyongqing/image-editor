<template>
  <a-modal :open="props.open" :title="title"  :confirm-loading="loading" html-type="submit" :footer="null" :closable="false">
    <a-card>
      <a-form :model="formData"  label-align="right" @finish="handleOk" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="上一级" name="parentId"  :rules="[{ required: true}]" v-if="formData.deptId !== 100">
          <a-tree-select v-model:value="formData.parentId" :tree-data="dept" :fieldNames="{children:'children',label:'deptName',value:'deptId'}" allow-clear></a-tree-select>
        </a-form-item>
        <a-form-item label="名称" name="deptName" :rules="[{ required: true}]" >
          <a-input v-model:value="formData.deptName"></a-input>
        </a-form-item>
        <a-form-item label="排序" name="orderNum" :rules="[{ required: true,message:'显示排序不能为空'}]" >
          <a-input-number v-model:value="formData.orderNum" style="width: 100%"></a-input-number>
        </a-form-item>
        <a-form-item label="负责人" name="leader" >
           <a-select
            v-model:value="formData.leader"
            show-search
            allow-clear
            placeholder="请选择用户"
            :default-active-first-option="false"
            :show-arrow="false"
            :not-found-content="null"
            :options="getAccountUserArr"
            :filter-option="filterOption"
            :field-names="{
              label: 'userName',
              value: 'userId',
            }"></a-select>
        </a-form-item>
        <a-form-item label="电话" name="phone" >
          <a-input v-model:value="formData.phone"></a-input>
        </a-form-item>
        <a-form-item label="邮箱" name="email" >
          <a-input v-model:value="formData.email"></a-input>
        </a-form-item>
        <a-form-item label="部门状态" name="status" >
          <a-radio-group v-model:value="formData.status">
            <a-radio value="0">正常</a-radio>
            <a-radio value="1">停用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item style="display: flex; text-align: right; justify-content: flex-end;">
          <a-button @click="close" style="margin-right: 10px">取消</a-button>
          <a-button type="primary" html-type="submit">确定</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </a-modal>
</template>

<script lang="js" setup>
import {ref} from 'vue'
import {addDept, editDept} from "~/api/common/dept";
import {message} from "ant-design-vue";
import {
  getAccountUser,
} from "@/pages/ozon/config/api/accountConfig";
const emit = defineEmits(['close']);
const props = defineProps({
  open:{ type: Boolean, required: true, default:false },
  title:{type:String, required: true, default:''},
  data:{type:Object,required: false, default:{}},
  dept:{type:Array, required: true, default:[]},
})
const formData = ref({})
const labelCol = {
  span: 4,
}
const wrapperCol = {
  span: 20,
}
const loading = ref(false)
let userData = []
watchEffect(()=>{
  formData.value.status = '0'
  if(props.data.deptId){
    formData.value = JSON.parse(JSON.stringify(props.data))
    if(props.title === '新增子部门'){
      formData.value = {}
      formData.value.parentId = props.data.deptId
    }
    if(props.data.parentId === 0){
      formData.value.parentId = null
    }
  }
})


const filterOption = (input, option) => {
  return option.userName.indexOf(input) >= 0;
};


const getAccountUserArr = ref([])
const userLabels = {
  label: "userName",
  value: "userId",
};
function getUserList() {
     getAccountUser({ userName: "" }).then((res) => {
      // 处理userId为str类型 跟接口回显保持类型一致
      res.data.forEach(item => {
        if(item.userId){
          item.userId = item.userId 
          + ''
        }
      })
    getAccountUserArr.value = res.data;
  });
}
function handleOk(){
  loading.value = true;
  if(props.title === '编辑部门'){
    if(formData.value.leader === undefined){
      formData.value.leader = ''
    }
    editDept(formData.value).then(res => {
      if(res.code === 200){
        message.success(res.msg);
        close()
      }else {
        message.error(res.msg);
      }
    }).finally(()=>{
      loading.value = false;
    })
  }
  if(props.title === '新增部门' || props.title === '新增子部门'){
    addDept(formData.value).then(res => {
      if(res.code == 200){
        message.success(res.msg);
        close()
      }else {
        message.error(res.msg);
      }
    }).finally(()=>{
      loading.value = false;
    })
  }

}
function close() {
  formData.value = {}
  props.data.value = {}
  emit('close', false);
}
onMounted(() => {
  getUserList()
})
</script>

<style scoped lang="less">

</style>