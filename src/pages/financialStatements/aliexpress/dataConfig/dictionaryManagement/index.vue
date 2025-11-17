<template>
<div id="dictionaryManagement_index" class="dictionaryManagement_index">
  <div class="index-box left">
    <a-card>
      <a-menu
        v-model:selectedKeys="dictionary.selectedKeys"
        mode="inline"
        :items="dictionary.itemList"
        @select="itemSelect"
      ></a-menu>
    </a-card>
  </div>
  <div class="index-box right">
    <appTableForm 
      v-model:formData="formData" 
      @onSubmit="onSubmit"
      @formHeightChange="formHeightChange" 
      resetSetMenu="dictionaryManagement"
      label-width="100"
    >
      <template #formItemBox>
        <a-form-item label="字典名称" name="itemName">
          <a-input v-model:value="formData.itemName" placeholder="请输入字典名称"></a-input>
        </a-form-item>
      </template>
    </appTableForm>
    <appTableBox 
      :table-header="dictionaryManagement_header" 
      :data-source="dictionary.data"
      reset-set-menu="dictionaryManagement" 
      :scroll="{y: tableScrollHeihth}"
      :loading="tableLoading"
    >
      <template #bodyCell="{ column: { key }, record: row }">
        <template v-if="key === 'dictType'">
          {{ row.dictName }}
        </template>
        <template v-else-if="key === 'status'">
          <a-switch 
            v-model:checked="row.status" 
            checked-children="已启用" 
            un-checked-children="已停用" 
            :checkedValue="'enabled'"
            :unCheckedValue="'disabled'"
            @change="(checked, event) => statusChange(checked, row)"
          />
        </template>
      </template>
      <template #options="{ record: row }">
        <a-button type="link" @click="rowEdit(row)">编辑</a-button>
      </template>
      <template #leftTool>
        <a-button type="primary" @click="modalInfo.uploadOpen = !modalInfo.uploadOpen">导入新增</a-button>
        <a-button type="primary" @click="rowEdit()">新增</a-button>
      </template>
      <template #pagination>
        <app-table-pagination
          v-model:current="dictionary.tableParams.pageNum"
          v-model:page-size="dictionary.tableParams.pageSize"
          :total="dictionary.total"
          @pageNumChange="pageNumChange"
          @pageSizeChange="pageSizeChange"
        ></app-table-pagination>
      </template>
    </appTableBox>
  </div>
  <editModal 
    v-model:open="modalInfo.editOpen" 
    :row-info="modalInfo.row"
    :dictItem="dictionary.itemInfo"
    @save="getItemList"
  ></editModal>
  <appModal 
    v-model:openValue="modalInfo.uploadOpen" 
    :width="'600px'"
    title="上传新增"
    :closable="false"
  >
    <template #appContent>
      <a-spin :spinning="uploadInfo.loading">
        <a-steps
          direction="vertical"
          :current="null"
          class="custom-steps-no-hover"
          v-if="!uploadInfo.result"
        >
          <a-step title="导出">
            <!-- <template #icon>
              <a-icon type="safety-certificate" />
            </template> -->
            <template #description>
              <div>
                <p>点击导出模板按钮下载导出模板</p>
                <a-button type="primary" @click="itemTempExportFn">导出模板</a-button>
              </div>
            </template>
          </a-step>
          <a-step title="导入">
            <!-- <template #icon>
              <a-icon type="safety-certificate" />
            </template> -->
            <template #description>
              <div>
                <p>点击上传按钮导入Excel文件</p>
                <a-upload
                  v-model:file-list="uploadInfo.fileList"
                  :show-upload-list="false"
                  :action="''"
                  :customRequest="customRequest"
                  :before-upload="beforeUpload"
                >
                  <a-button type="primary">
                    <async-icon :icon="'UploadOutlined'"></async-icon>
                    上传
                  </a-button>
                </a-upload>
              </div>
            </template>
          </a-step>
        </a-steps>
        <div v-if="uploadInfo.result">
          <a-result
            :status="uploadInfo.result"
            :title="uploadInfo.message"
          >
            <template #extra v-if="uploadInfo.result === 'error'">
              <a-upload
                v-model:file-list="uploadInfo.fileList"
                :show-upload-list="false"
                :action="''"
                :customRequest="customRequest"
                :before-upload="beforeUpload"
              >
                <a-button type="primary">
                  <async-icon :icon="'UploadOutlined'"></async-icon>
                  重新上传
                </a-button>
              </a-upload>
            </template>
          </a-result>
        </div>
      </a-spin>
    </template>
    <template #appFooter>
      <a-button type="primary" @click="modalInfo.uploadOpen = !modalInfo.uploadOpen">确认</a-button>
    </template>
  </appModal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue';
import { itemImport, itemList, itemStatus, itemTempExport, typeList } from './js/api';
import { dictionaryManagement_header } from './js/tableHeader';
import asyncIcon from '~@/layouts/components/menu/async-icon.vue';
import appTableForm from '~@/components/common/appTableForm.vue';
import appTableBox from '~@/components/common/appTableBox.vue';
import appTablePagination from '~@/components/common/appTablePagination.vue';
import appModal from '~@/components/common/appModal.vue';
import editModal from './components/editModal.vue';
import { message } from 'ant-design-vue';
import download from '~@/api/common/download';
defineOptions({ name: "dictionaryManagement_index" });
const { proxy: _this } = getCurrentInstance();
const dictionary = reactive({
  data: [],
  total: 0,
  itemList: [],
  itemInfo: {},

  selectedKeys: [],
  tableParams: {
    "pageNum": 1,
    "pageSize": 20,
    "order": "DESC",
    "prop": "create_time"
  }
});
const tableLoading = ref(false);
const modalInfo = reactive({
  row: {},
  editOpen: false,
  uploadOpen: false,
});
const formData = reactive({
  itemName: undefined,
});
const formParams = {};
const uploadInfo = reactive({
  fileList: [],
  result: '',
  message: '',
  loading: false,
})
const formHeight = ref(0);
const innerHeight = computed(() => {
  return (window.innerHeight * 0.95) + 'px';
});
const tableScrollHeihth = computed(() => {
  return ((window.innerHeight * 0.96) - 20 - 24 - 24 - 8 - 40 - 56 - formHeight.value);
});
watch(() => modalInfo.uploadOpen, (val, oldVal) => {
  if (!val) {
    let obj = {
      fileList: [],
      result: '',
      message: '',
      loading: false,
    }
    Object.assign(uploadInfo, obj)
  }
})
onMounted(async () => {
  await getTypeList();
  await getItemList();
});
// 获取字典类型列表
async function getTypeList() {
  try {
    let res = await typeList();
    res.data = res.data ?? [];
    res.data.forEach(item => {
      item.key = item.dictType;
      item.label = item.dictName;
      item.title = item.dictName;
    });
    dictionary.itemList = res.data;
    dictionary.selectedKeys.push(res.data[0]?.dictType);
    dictionary.itemInfo = res.data[0];
  } catch (error) {
    console.error(error);
  }
}
// 点击字典类型
function itemSelect({ item, key, selectedKeys }) {
  // console.log({ item, key, selectedKeys });
  dictionary.itemInfo = item;
  formData.itemName = '';
  onSubmit();
}
// 分页器页数变化
function pageNumChange(val) {
  dictionary.tableParams.pageNum = val;
  getItemList();
}
// 分页器每页条数变化
function pageSizeChange(val) {
  dictionary.tableParams.pageSize = val;
  pageNumChange(1);
}
// 点击搜索
function onSubmit(val) {
  Object.assign(formParams, formData);
  pageNumChange(1);
}
async function statusChange(val, row) {
  // console.log({val, row});
  let params = {
    "itemId": row.itemId,
    "status": val,
  };
  try {
    await itemStatus(params);
    message.success(val === 'enabled' ? '启用成功！' : '停用成功！');
  } catch (error) {
    row.status = val !== 'enabled' ? 'enabled' : 'disabled';
  }
}
// 新增/编辑字典数据
function rowEdit(row = {}) {
  // console.log({ row });
  modalInfo.row = row;
  modalInfo.editOpen = !modalInfo.editOpen;
}
function formHeightChange(val) {
  formHeight.value = val;
}
// 获取字典数据
async function getItemList(val) {

  let params = {
    "itemName": formParams.itemName,
    "itemValue": "",
    "dictType": dictionary.selectedKeys[0],
    "status": "",
    "remark": "",
    "pageNum": dictionary.tableParams.pageNum,
    "pageSize": dictionary.tableParams.pageSize,
    "order": "DESC",
    "prop": "create_time"
  };
  tableLoading.value = true;
  try {
    let res = await itemList(params);
    let data = res.data;
    data.map((item, index) => {
      item.rowIndex = index + 1;
      item.dictName = dictionary.itemList.find(i => i.dictType === item.dictType).dictName;
      // item.statusType = (item.status === 'enabled');
    });
    dictionary.total = res.total;
    dictionary.data = data;
  } catch (error) {
    console.error(error);
  }
  tableLoading.value = false;
}
// 下载导入模板
async function itemTempExportFn(params) {
  try {
    let res = await itemTempExport()
    // console.log({res});
    download.name(res.data)
  } catch (error) {
    console.error(error);
  }
}
// 上传前校验
function beforeUpload(file) {
  let suffix = file.name.split('.')[file.name.split('.').length - 1].toLocaleLowerCase();
  return suffix === 'xlsx';
};
// 自定义上传
async function customRequest({ file }) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('dictType', dictionary.selectedKeys[0]);
  try {
    uploadInfo.loading = true;
    let res = await itemImport(formData)
    // console.log({ res });
    uploadInfo.message = res.msg;
    uploadInfo.result = 'success'
  } catch (error) {
    console.log({ error });
    uploadInfo.message = error.msg;
    uploadInfo.result = 'error'
  }
  uploadInfo.loading = false;
}
</script>
<style lang="less" scoped>
.dictionaryManagement_index {
  display: flex;
  height: v-bind(innerHeight);
  .index-box {
    height: 100%;
    &.left {
      padding: 4px;
      width: 150px;
      :deep(.ant-card) {
        width: 100%;
        height: 100%;
      }
    }
    &.right {
      width: calc(100% - 150px);
    }
  }
  :deep(.ant-menu.ant-menu-root) {
    border-inline-end: transparent;
  }
}
</style>