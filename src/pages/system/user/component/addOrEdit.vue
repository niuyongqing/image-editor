<template>
<div>
  <a-modal :open="open" :title="title"  :confirm-loading="loading" html-type="submit" :footer="null" :closable="false" :destroyOnClose="true">
      <a-form :model="formData"  label-align="right" @finish="title === '新增用户'?addUser():editUser()" :label-col="labelCol">
        <a-card title="基本信息">
          <a-form-item label="昵称" name="nickName" :rules="[{required:true,message:'请输入用户昵称'}]">
            <a-input v-model:value="formData.nickName"></a-input>
          </a-form-item>
          <a-form-item label="姓名" name="userName" :rules="[{required:true,message:'请输入姓名'}]" v-if="title === '新增用户'">
            <a-input v-model:value="formData.userName"></a-input>
          </a-form-item>
          <a-form-item label="密码" name="password" :rules="[{required:true,message:'请输入密码'}]" v-if="title === '新增用户'">
            <a-input-password v-model:value="formData.password" ></a-input-password>
          </a-form-item>
          <!--        <a-form-item label="姓名" name="userName" :rules="{required:true,message:'请输入用户名'}">-->
          <!--          <a-input v-model:value="formData.userName"></a-input>-->
          <!--        </a-form-item>-->
          <a-form-item label="电话" name="phonenumber">
            <a-input v-model:value="formData.phonenumber"></a-input>
          </a-form-item>
          <a-form-item label="邮箱" name="email" >
            <a-input v-model:value="formData.email"></a-input>
          </a-form-item>
          <a-form-item label="性别" name="sex">
            <a-select v-model:value="formData.sex">
              <a-select-option value="0">男</a-select-option>
              <a-select-option value="1">女</a-select-option>
              <a-select-option value="2">未知</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="状态" name="status" >
            <a-radio-group v-model:value="formData.status">
              <a-radio value="0">正常</a-radio>
              <a-radio value="1">停用</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="部门" name="deptId" :rules="[{required:true}]">
            <a-cascader v-model:value="formData.deptId" :options="dept" :field-names="{ label: 'label', value: 'id', children: 'children' }"></a-cascader>
          </a-form-item>
          <a-form-item label="岗位" name="postIds" >
            <a-select v-model:value="postIds"  mode="multiple">
              <a-select-option  v-for="post in posts" :value="post.postId" :key="post.postKey" >{{post.postName}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="平台角色" name="platformRoleIds" :rules="[{required:true}]">
            <a-select v-model:value="formData.platformRoleIds"  mode="multiple" >
              <a-select-option  v-for="role in platformRoles" :value="role.roleId" :key="role.roleKey" >{{role.roleName}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="备注" name="remark" >
            <a-textarea v-model:value="formData.remark"></a-textarea>
          </a-form-item>
        </a-card>
        <a-form-item style="display: flex; text-align: right;margin-top: 10px">
          <a-button @click="close" style="margin-right: 10px">取消</a-button>
          <a-button type="primary" html-type="submit" >确定</a-button>
        </a-form-item>
      </a-form>
  </a-modal>
</div>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {getUserApi, editUserApi, addUserApi, getInfoApi} from '~/api/common/user'
import {message} from "ant-design-vue";
const loading = ref(false);
const emit = defineEmits(['close']);
const props = defineProps({
  open:{ type: Boolean, required: true, default:false },
  title:{type:String, required: true, default:''},
  data:{type:Object,required: false, default:{}},
  dept:{type:Array,required: false, default:[]}
})
const formData = ref({})
const platformRoles = ref([])
const posts = ref([])
const postIds = ref([])
watchEffect(()=>{
  if(props.title === '新增用户'){
    getInfoApi().then(res=>{
      platformRoles.value = res.platformRoles
      posts.value = res.posts
      formData.value.password = 123456
      formData.value.status = '0'
    })
  }
  if(props.data.userId){
    getUserApi(props.data.userId).then(res=>{
      formData.value = res.data
      let deptIds = formData.value.dept?formData.value.dept.ancestors.split(','):[]
      deptIds.length > 0 ? deptIds.push(formData.value.deptId) : ''
      deptIds = deptIds.filter((v)=> v !=='0')
      formData.value.deptId = deptIds.map(Number)
      platformRoles.value = res.platformRoles
      posts.value = res.posts
      postIds.value = res.postIds

    })
  }
})
const labelCol = {
  style: {
    width: '100px',
  },
};
function addUser(){
  loading.value = true;
  const data = JSON.parse(JSON.stringify(formData.value))
  data.postIds = postIds.value
  data.deptId = data.deptId.length > 0?data.deptId[data.deptId.length-1]:null
  delete data.roles
  delete data.platformRoles
  delete data.posts
  addUserApi(data).then(res=>{
    if(res.code === 200){
      close()
      message.success(res.msg);
    }else {
      message.error(res.msg);
    }
  }).finally(()=>{
    loading.value = false;
  })
}

function editUser() {
  loading.value = true;
  const data = JSON.parse(JSON.stringify(formData.value))
  data.postIds = postIds.value
  data.deptId = data.deptId.length > 0?data.deptId[data.deptId.length-1]:null
  delete data.roles
  delete data.platformRoles
  delete data.posts
  editUserApi(data).then(res=>{
    if(res.code === 200){
      close()
      message.success(res.msg);
    }else {
      message.error(res.msg);
    }

  }).finally(()=>{
    loading.value = false;
  })


}
function close() {
  formData.value = {}
  platformRoles.value = []
  posts.value = []
  postIds.value = []
  formData.value = {}
  emit('close', false);
}
</script>



<style scoped lang="less">

</style>