<template>
<div id="uploadImg" class="uploadImg">
  <a-modal 
    v-model:open="modalOpen" 
    title="图片上传"
    :width="1200"
    :maskClosable="false"
  >
    <div class="modal-box">
      <div class="index-left">
        <div class="left-title box-title">
          <span>图片空间的分类</span>
          <!-- <a-button type="text">设置</a-button> -->
          <a-button 
            type="primary" 
            ghost
            @click="updateInfo.typeManageOpen = !updateInfo.typeManageOpen"
          >
            <SettingOutlined />
            设置
          </a-button>
        </div>
        <div class="left-tree-box">
          <typeTree 
            :platform="props.platform" 
            v-model:current-class="updateInfo.currentClass"
            v-model:node-path="updateInfo.nodePath"
            ref="typeTreeRef"
          ></typeTree>
        </div>
      </div>
      <div class="index-right">
        <div class="index-right-title">{{ `服务 > 上传至：图片空间 > ${updateInfo.nodePath}` }}</div>
        <a-tabs v-model:activeKey="updateInfo.activeKey">
          <a-tab-pane 
            tab="本地上传" 
            :key="1" 
            :disabled="uploading"
          >
            <div class="tab-pane-box">
              <div class="local-upload-btn">
                <a-upload 
                  :file-list="updateInfo.fileList" 
                  :before-upload="beforeUpload" 
                  :showUploadList="false"
                  multiple
                >
                  <a-button key="submit" type="primary">
                    <upload-outlined></upload-outlined>
                    点击选择图片
                  </a-button>
                </a-upload>
                <a-space>
                  <a-button 
                    type="primary"
                    :disabled="updateInfo.fileList.length === 0"
                    :loading="uploading"
                    @click="handleUpload"
                  >上传</a-button>
                  <a-button @click="modalCloseFn">返回</a-button>
                </a-space>
              </div>
              <a-table 
                :columns="columns" 
                :data-source="updateInfo.tableData"
                :pagination="false"
                :scroll="{ y: 580 }"
              >
                <template #bodyCell="{ column: { key }, record: row }">
                  <template v-if="key === 'size'">
                    <span>{{ (row[key]/1024).toFixed(2) }}KB</span>
                  </template>
                  <template v-else-if="key === 'state'">
                    <a-tag v-if="row.state === 1" color="blue">等待上传</a-tag>
                    <a-tag v-if="row.state === 2" color="orange">正在上传</a-tag>
                    <a-tag v-if="row.state === 3" color="green">上传成功</a-tag>
                    <a-tag v-if="row.state === 4" color="red">上传失败</a-tag>
                  </template>
                  <template v-else-if="key === 'option'">
                    <a-button type="primary" danger @click="delImg(row)">删除</a-button>
                  </template>
                </template>
              </a-table>
            </div>
          </a-tab-pane>
          <a-tab-pane 
            tab="网络上传" 
            :key="2" 
            force-render 
            :disabled="uploading"
          >
            <div class="tab-pane-box">
              <div class="url-upload-btn">
                <a-space>
                  <a-button 
                    type="primary"
                    :disabled="(updateInfo.urlUploadList.filter(i => i.url)).length < 1"
                    :loading="uploading"
                    @click="urlUploadFn"
                  >上传</a-button>
                  <a-button @click="modalCloseFn">返回</a-button>
                </a-space>
              </div>
              <div class="url-upload-content">
                <div 
                  class="url-upload-item" 
                  v-for="item in updateInfo.urlUploadList" 
                  :key="item.id"
                >
                  <a-image
                    :width="80"
                    :height="50"
                    :src="item.url"
                    :fallback="kong"
                  />
                  <div class="item-input">
                    <div>{{ `URL ${item.id}` }}</div>
                    <a-input 
                      style="width: 100%;" 
                      v-model:value="item.url" 
                      placeholder="" 
                      allowClear
                    />
                  </div>
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <typeManage 
        v-model:modal-open="updateInfo.typeManageOpen" 
        :platform="props.platform"
        @updateTree="updateTree"
      ></typeManage>
    </div>
    <template #footer>
      <a-button key="submit" type="primary" @click="modalCloseFn">关闭</a-button>
    </template>
  </a-modal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { UploadOutlined, SettingOutlined } from '@ant-design/icons-vue';
import typeTree from '@/components/classificationTree/typeTree.vue';
import typeManage from '@/components/classificationTree/typeManage.vue';
import kong from './img/kong.png'
import { uploadListHeader } from './js/header';
import { imageUpload, urlUpload } from './js/api';
import { size } from 'lodash';
import { message } from 'ant-design-vue';
defineOptions({ name: "uploadImg" })
const { proxy: _this } = getCurrentInstance();
const emit = defineEmits(['update:modalOpen', 'uploadDone']);
const props = defineProps({
  modalOpen: Boolean,
  platform: {
    type: String,
    default: ''
  }
})
const modalOpen = ref(false);
const uploading = ref(false);
const columns = uploadListHeader
const updateInfo = reactive({
  currentClass: '',
  nodePath: '',
  activeKey: 1,
  fileList: [],
  tableData: [],
  urlUploadList: [],

  typeManageOpen: false,
})
// 打开弹窗
watch(() => props.modalOpen, val => {
  // console.log({val});
  modalOpen.value = val;
  val && modalOpenFn()
});
// 关闭弹窗
watch(() => modalOpen.value, val => {
  if (!val) {
    clearData();
    emit('update:modalOpen', false);
    emit('uploadDone')
  }
});
// 弹窗打开的回调
function modalOpenFn() {
  updateInfo.urlUploadList = []
  for (let index = 0; index < 10; index++) {
    let obj = {
      id: (index + 1) + '',
      url: ''
    }
    updateInfo.urlUploadList.push(obj)
  }
  nextTick(() => {
    _this.$refs.typeTreeRef.updateTree('all')
  })
}
// 更新类别树数据
function updateTree() {
  // console.log(_this.$refs.typeTreeRef);
  nextTick(() => {
    _this.$refs.typeTreeRef.updateTree()
  })
}
// 关闭弹窗
function modalCloseFn() {
  modalOpen.value = false
}
// 清空数据
function clearData() {
  updateInfo.currentClass = ''
  updateInfo.nodePath = ''
  updateInfo.activeKey = 1
  updateInfo.fileList = []
  updateInfo.tableData = []
  updateInfo.urlUploadList = []
}
function beforeUpload(file) {
  updateInfo.fileList = [...(updateInfo.fileList || []), file];
  updateInfo.fileList.forEach(item => {
    // state: 1未上传  2上传中  3上传完成  4上传失败
    item.state = item.state ? item.state : 1;
  });
  updateInfo.tableData = updateInfo.fileList.map(item => {
    let obj = {
      name: item.name,
      size: item.size,
      type: item.type,
      uid: item.uid,
      state: item.state ? item.state : 1,
      file: item,
    };
    return obj;
  })
  return false;
}
// 本地上传
async function handleUpload() {
  if (!updateInfo.currentClass) return message.error('请选择分类！');
  uploading.value = true;
  let list = updateInfo.tableData.filter(i => i.state === 1);
  // console.log(list);
  // return;
  for (let index = 0; index < list.length; index++) {
    const item = list[index];
    let formData = new FormData();
    formData.append('platform', props.platform);
    formData.append('classId', updateInfo.currentClass);
    formData.append('file', item.file);
    try {
      item.state = 2
      item.file.state = 2
      await imageUpload(formData)
      item.state = 3
      item.file.state = 3
    } catch (error) {
      item.state = 4
      item.file.state = 4
      console.error(error)
    }
  }
  uploading.value = false;
}
// 网络上传
async function urlUploadFn() {
  if (!updateInfo.currentClass) return message.error('请选择分类！');
  for (let index = 0; index < updateInfo.urlUploadList.length; index++) {
    const item = updateInfo.urlUploadList[index];
    if (item.url) {
      let params = {
        "classId": updateInfo.currentClass,
        "platform": props.platform,
        "url": item.url
      }
      try {
        await urlUpload(params)
        message.success(`URL ${item.id} 上传成功！`)
        item.url = ''
      } catch (error) {
        console.error(error)
        message.error(`URL ${item.id} 上传失败！`)
      }
    }
  }
}
// 删除表中的图片
function delImg(row) {
  updateInfo.fileList = updateInfo.fileList.filter(i => i.uid !== row.uid)
  updateInfo.tableData = updateInfo.tableData.filter(i => i.uid !== row.uid)
}
</script>
<style lang="less" scoped>
.modal-box {
  display: flex;
  padding: 10px;
  width: 100%;
  height: 760px;
  overflow-y: auto;
  .index-left {
    width: 20%;
    height: 100%;
    margin-right: 15px;
    .left-tree-box {
      width: 100%;
      height: calc(100% - 70px);
      margin: 10px 0;
    }
  }
  .index-right {
    width: 78%;
    .tab-pane-box {
      width: 100%;
      height: 100%;
      .local-upload-btn {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .url-upload-btn {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
      }
      .url-upload-content {
        .url-upload-item {
          display: flex;
          width: 100%;
          margin-bottom: 10px;
          .item-input {
            width: 100%;
            margin-left: 10px;
          }
        }
      }
    }
  }
  .box-title {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #eee;
    padding: 0 10px;
  }
}
</style>