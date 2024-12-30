<script setup lang="js">
import {ref} from 'vue'
import { useUserStore } from '~/stores/user'
import * as Icons from '@ant-design/icons-vue';
import {updatePwd,updateProfile} from '~/api/common/user'
import {message} from "ant-design-vue";
const fileList = ref([])
const userInfo = useUserStore().userInfo
const loading = ref(false)
const icon = Icons;
const formData = ref({})
const authorization = ref("")
const activeKey = ref("1")
const passwordFormData = ref({})

watchEffect(()=>{
  authorization.value = window.localStorage.getItem("Authorization");
  formData.value = userInfo.sysUser
})
const beforeUpload = (file) =>{
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('请上传JPG、PNG格式的图片!');
  }
  const isLt1M = file.size / 1024 / 1024 < 1;
  if (!isLt1M) {
    message.error('头像大小允许超过1M');
  }
  return isJpgOrPng && isLt1M;
}

const handleChange = info =>{
  if (info.file.status === 'uploading') {
    loading.value = true;
    return;
  }
  if (info.file.status === 'done') {
    if(info.file.response.code === 200){
      formData.value.avatar = info.file.response.fileName;
      loading.value = false;
    }
  }
  if (info.file.status === 'error') {
    loading.value = false;
    message.error('upload error');
  }
}

function handleOk(){
  updateProfile(formData.value).then(res=>{
    if(res.code === 200){
      message.success(res.msg);
    }else {
      message.error(res.msg);
    }
  })
}

function passwordHandleOk(){
  if(passwordFormData.value.newPassword !== passwordFormData.value.confirmPassword){
    message.error("两次密码不一致！");
    return
  }
  updatePwd(passwordFormData.value).then(res=>{
    if(res.code === 200){
      message.success(res.msg);
    }else {
      message.error(res.msg);
    }
  })
}

const labelCol = {
  style: {
    width: '80px',
  },
};

</script>

<template>
  <a-card>
    <a-tabs v-model:activeKey="activeKey" type="card" style="height: 600px">
      <a-tab-pane key="1" tab="资料信息">
        <div style="display: grid">
          <a-row>
            <a-col :span="8" >
              <a-card title="个人信息" style="height: 550px;">
                <a-descriptions :column="1" bordered style="">
                  <a-descriptions-item label="头像：" >
                    <a-upload
                        v-model:file-list="fileList"
                        name="avatarfile"
                        accept=".jpg,.png,.png"
                        :headers="{Authorization:authorization}"
                        list-type="picture-card"
                        class="avatar-uploader"
                        :show-upload-list="false"
                        action="/prod-api/system/user/profile/avatar"
                        :before-upload="beforeUpload"
                        @change="handleChange"
                    >
                      <img v-if="formData.avatar" :src="`/prod-api${formData.avatar}`" alt="avatar" style="width: 100px;height: 100px;" />
                      <div v-else>
                        <component :is="icon['LoadingOutlined']" v-if="loading"/>
                        <component :is="icon['PlusOutlined']" v-else/>
                        <div class="ant-upload-text">Upload</div>
                      </div>
                    </a-upload>
                  </a-descriptions-item>
                  <a-descriptions-item label="用户名称：">{{formData.userName}}</a-descriptions-item>
                  <a-descriptions-item label="手机号码：">{{formData.phonenumber}}</a-descriptions-item>
                  <a-descriptions-item label="用户邮箱：">{{formData.email}}</a-descriptions-item>
                  <a-descriptions-item label="所属部门：">{{formData.dept.deptName}}</a-descriptions-item>
                  <a-descriptions-item label="所属角色：" >
                    <div v-if="userInfo.roles.includes('admin')">超级管理员</div>
                    <div v-else v-for="(item,index) in userInfo.platformRoles" :key="index">
                      {{item.roleName}}
                    </div>
                  </a-descriptions-item>
                  <a-descriptions-item label="创建日期：">{{formData.createTime}}</a-descriptions-item>
                </a-descriptions>
              </a-card>
            </a-col>
            <a-col :span="16">
              <a-card title="基本资料" style="left: 5px;height: 550px;">
                <a-form :model="formData"  label-align="right" @finish="handleOk"  :label-col="labelCol" >

                  <a-form-item label="用户昵称" name="nickName" :rules="[{ required: true }]">
                    <a-input v-model:value="formData.nickName"></a-input>
                  </a-form-item>
                  <a-form-item label="手机号码" name="phonenumber" :rules="[{ required: true }]">
                    <a-input v-model:value="formData.phonenumber"></a-input>
                  </a-form-item>
                  <a-form-item label="邮箱" name="email" :rules="[{ required: true }]">
                    <a-input v-model:value="formData.email"></a-input>
                  </a-form-item>
                  <a-form-item label="性别" name="sex">
                    <a-select v-model:value="formData.sex" style="text-align: left">
                      <a-select-option value="0">男</a-select-option>
                      <a-select-option value="1">女</a-select-option>
                      <a-select-option value="2">未知</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item style="display: flex; text-align: right;right: 10px">
                    <a-button type="primary" html-type="submit">确定</a-button>
                  </a-form-item>
                </a-form>
              </a-card>
            </a-col>
          </a-row>

        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="修改密码">
        <a-form :model="passwordFormData"  label-align="right" @finish="passwordHandleOk"  :label-col="labelCol" style="width: 400px">
          <a-form-item label="旧密码" name="oldPassword" :rules="[{ required: true }]">
            <a-input-password v-model:value="passwordFormData.oldPassword"></a-input-password>
          </a-form-item>
          <a-form-item label="新密码" name="newPassword" :rules="[{ required: true }]">
            <a-input-password v-model:value="passwordFormData.newPassword"></a-input-password>
          </a-form-item>
          <a-form-item label="确认密码" name="confirmPassword" :rules="[{ required: true }]">
            <a-input-password v-model:value="passwordFormData.confirmPassword"></a-input-password>
          </a-form-item>
          <a-form-item style="display: flex; text-align: right;right: 10px">
            <a-button type="primary" html-type="submit">确定</a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </a-card>

</template>
<style scoped lang="less">

</style>
