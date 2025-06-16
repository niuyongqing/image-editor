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
                  <a-button @click="handleOk">返回</a-button>
                </a-space>
              </div>
              <a-table 
                :columns="columns" 
                :data-source="updateInfo.fileList"
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
                    :disabled="updateInfo.urlUploadList.length === 0"
                    :loading="uploading"
                    @click="handleUpload"
                  >上传</a-button>
                  <a-button @click="handleOk">返回</a-button>
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
      <a-button key="submit" type="primary" @click="handleOk">关闭</a-button>
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
defineOptions({ name: "uploadImg" })
const { proxy: _this } = getCurrentInstance();
const emit = defineEmits(['update:modalOpen']);
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
  currentClass: '0',
  nodePath: '',
  activeKey: 1,
  fileList: [],
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
  !val && emit('update:modalOpen', false);
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
}
// 更新类别树数据
function updateTree() {
  console.log(_this.$refs.typeTreeRef);
  _this.$refs.typeTreeRef.updateTree()
}
// 关闭弹窗
function handleOk() {
  modalOpen.value = false
}
function beforeUpload(file) {
  updateInfo.fileList = [...(updateInfo.fileList || []), file];
  updateInfo.fileList.forEach(item => {
    // state: 1未上传  2上传中  3上传完成  4上传失败
    item.state = 1
  })
  console.log(updateInfo.fileList);
  return false;
}
// 上传
async function handleUpload(params) {
  
}
// 删除表中的图片
function delImg(row) {
  updateInfo.fileList = updateInfo.fileList.filter(i => i.uid !== row.uid)
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