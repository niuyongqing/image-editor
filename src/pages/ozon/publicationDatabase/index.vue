<template>
<div id="ozon_publicationDatabase" class="ozon_publicationDatabase">
  <a-card>
    <a-form :model="formData" layout="inline">
      <a-form-item label="产品分类" name="categoryId">
        <a-cascader 
          placeholder="产品分类" 
          allowClear 
          style="width: 300px;"
          v-model:value="formData.categoryId" 
          :options="options.commodityTypeList"
          :allow-clear="true" 
          :field-names="{ value: 'descriptionCategoryId', label: 'categoryName', children: 'children' }" 
        />
      </a-form-item>
      <a-form-item label="提交人" name="status">
        <a-select 
          v-model:value="formData.selectUserIdList" 
          :options="options.allUserList" 
          mode="multiple"
          :maxTagCount="2"
          :optionFilterProp="'label'"  
          :filterOption="userFilterOption"  
          placeholder="请选择提交人" 
          style="width: 260px;"
          allowClear
        ></a-select>
      </a-form-item>
      <a-form-item label="审核时间" name="completeTime">
        <a-range-picker 
          v-model:value="formData.completeTime" 
          allowClear 
          format="YYYY-MM-DD"
          valueFormat="YYYY-MM-DD"
        />
      </a-form-item>
      <a-form-item class="tradeName-item" label="模糊查找" name="tradeName">
        <a-form-item-rest>
          <div flex gap-10px style="width: 300px;">
            <a-input v-model:value="formData.productName" placeholder="商品名"></a-input>
            <a-input v-model:value="formData.skuCode" placeholder="SKU"></a-input>
          </div>
        </a-form-item-rest>
      </a-form-item>
      <div class="formItem-row-i right">
        <a-space>
          <a-button key="submit" type="primary" @click="onSubmit" v-if="checkPermi(['ozon:intelligent:product-store:list'])">查询</a-button>
          <a-button key="submit" @click="resetForm">重置</a-button>
        </a-space>
      </div>
    </a-form>
  </a-card>
  <a-card style="margin-top: 20px">
    <div class="table-btn-box">
      <a-space>
        <a-button 
          :disabled="tableData.selectedRows.length < 1" 
          type="primary" 
          @click="submitEditFn"
          v-if="checkPermi(['ozon:intelligent:product-store:submit-edit'])"
        >提交编辑</a-button>
        <a-button 
          :disabled="tableData.selectedRows.length < 1" 
          type="primary" 
          @click="() => (remarkData.open = true)"
          v-if="checkPermi(['ozon:intelligent:product-store:add-remark'])"
        >添加备注</a-button>
        <a-button 
          v-if="checkPermi(['ozon:intelligent:product-store:submit-publish'])"
          type="primary" 
          :disabled="tableData.selectedRows.length === 0" 
          @click="openPublicationModal()"
        >批量刊登</a-button>
        <!-- <a-button type="primary">Primary Button</a-button> -->
      </a-space>
    </div>
    <br/>
    <a-table 
      :columns="header" 
      :data-source="tableData.data" 
      :scroll="{ y: 'calc(80vh - 120px)', x: '2000px' }"
      :pagination="false"
      :customRow="customRow" 
      rowKey="id"
      :row-selection="{ selectedRowKeys: tableData.selectedRowKeys, onChange: onSelectChange }"
      :loading="tableData.loading"
      class="productDatabase-table"
    >
      <template #bodyCell="{ column: {key}, record: row }">
        <template v-if="key === 'mainImage'">
          <a-image :width="50" :src="row.mainImage || EmptyImg" :fallback="EmptyImg"/>
        </template>
        <template v-else-if="key === 'skuList'">
          <a-tooltip>
            <template #title>{{ row.skuCodeList }}</template>
            <div class="row-skuList">
              {{ row.skuCodeList }}
            </div>
          </a-tooltip>
        </template>
        <template v-else-if="key === 'categoryId'">
          <!-- <div>{{ classify(row) }}</div> -->
          <a-tag color="success" v-if="row.classify">
            <div style="white-space: pre-wrap;">{{ row.classify }}</div>
          </a-tag>
          <div v-else></div>
        </template>
        <template v-else-if="key === 'operation'">
          <a-button v-if="checkPermi(['ozon:intelligent:product-store:submit-publish'])" type="link" @click="openPublicationModal(row)">刊登</a-button>
          <a-button
                type="link"
                @click="openLogModal(row)"
                >日志</a-button
              >
        </template>
      </template>
    </a-table>
    <br/>
    <div class="pagination-box">
      <a-pagination 
        @update:current="pageNumChange" 
        @update:page-size="pageSizeChange"
        :current="tableData.params.pageNum" 
        :page-size="tableData.params.pageSize"
        :page-size-options="[10,50,100,200]" 
        :total="tableData.total" 
        :show-total="total => `共 ${total} 条`"
        show-size-changer 
        showQuickJumper 
      />
    </div>
  </a-card>
  <detailsModal ref="publicationDatabase_detailsModal"></detailsModal>
  <!-- 添加备注弹窗 -->
  <a-modal v-model:open="remarkData.open" title="添加备注" @ok="addRemarkFn">
    <a-textarea v-model:value="remarkData.remark" placeholder="请输入备注" :rows="4" />
  </a-modal>

  <!-- 刊登弹窗 -->
  <PublicationModal
    v-model:open="publicationModalOpen"
    :id-list="idList"
    @refresh="tableData.selectedRowKeys = []"
  />
<!-- 日志弹窗 -->
  <LogModal
      ref="logModalRef"
      :visible="logModalVisible"
      :loading="logLoading"
      :log-data="logData"
      @update:visible="logModalVisible = $event"
      @open="handleLogModalOpen"
    />
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { addRemark, categoryTree, getList, submitEdit, userList,getLogListApi } from './js/api';
import { header } from './js/header';
import EmptyImg from '@/assets/images/aliexpress/empty.png'
import _ from "lodash";
import { v4 as uuidv4 } from 'uuid';
import detailsModal from './detailsModal.vue';
import { message, Modal } from 'ant-design-vue';
import { processImageSource } from '../config/commJs/index';
import { checkPermi } from '~@/utils/permission/component/permission';
import PublicationModal from './common/PublicationModal.vue'
import LogModal from "./common/LogModal.vue";
defineOptions({ name: "ozon_publicationDatabase" })
const { proxy: _this } = getCurrentInstance();

const { state: formData, reset } = useResetReactive({
  categoryId: [],                       // 分类
  selectUserIdList: [],
  completeTime: [],                     // 完成时间
  skuCode: '',
  productName: '',    // 商品名称
})
let copyFormData = {};   // 表单参数
const options = reactive({
  commodityTypeList: [],            // 产品分类
  allUserList: [],            // 人员列表
})
const remarkData = reactive({
  open: false,
  remark: '',
})
watch(() => remarkData.open, (val, oldVal) => {
  !val && (remarkData.remark = '')
})
const tableData = reactive({
  data: [],
  total: 0,
  loading: false,
  selectedRowKeys: [],
  selectedRows: [],

  params: {
    "pageNum": 1,
    "pageSize": 50,
    // "order": "descending", // 倒正序，必须 descending/ascending
    // "prop": "complete_time" // 排序列，必须
  }
})
let antTableBody = null   // 表格滚动区域

onMounted(async () => {
  let productDatabaseTable = document.querySelector('.productDatabase-table')
  antTableBody = productDatabaseTable.querySelector('.ant-table-body')
  // 权限校验
  if (!checkPermi(['ozon:intelligent:product-store:list'])) {
    return;
  }
  getUserList()
  await getCategoryTree()
  onSubmit()
})
async function getCategoryTree(params) {
  try {
    let res = await categoryTree()
    // console.log({ res });
    options.commodityTypeList = res.data
  } catch (error) {
    console.error(error);
  }
}
// 获取人员列表
async function getUserList() {
  options.allUserList = [];
  try {
    let params = {
      deptId: "",
      userName: '',
    };
    let res = await userList(params);
    options.allUserList = res.data.map(i => {
      return {
        label: i.userName,
        value: i.userId
      }
    })
  } catch (error) {
    console.error(error);
  }
}
function userFilterOption(val, option) {
  // 将输入值和选项的 label（姓名）都转为小写，实现不区分大小写的模糊匹配
  return option.label.toLowerCase().includes(val.toLowerCase());
}
// 分类还原
  function classify(row) {
  if (!row.categoryId) return '无'

  let commodity = row.categoryId.split(',').map(i => Number(i))
  let nameList = []
  let arr = options.commodityTypeList
  for (let index = 0; index < commodity.length; index++) {
    const descriptionCategoryId = commodity[index];
    let obj = arr.find(i => i.descriptionCategoryId === descriptionCategoryId)
    if (obj) {
      nameList.push(obj.categoryName);
      arr = obj.children
    } else {
      break;
    }
  }
  return nameList.join(` / `)
}
// 查询
async function onSubmit() {
  copyFormData = _.cloneDeep(formData);
  pageNumChange(1)
}
// 重置
function resetForm() {
  reset()
  copyFormData = _.cloneDeep(formData);
  pageNumChange(1)
}
function pageNumChange(val) {
  tableData.params.pageNum = val
  getTableList()
}
function pageSizeChange(val) {
  tableData.params.pageSize = val;
  pageNumChange(1)
}
// 查询列表
async function getTableList() {
  tableData.loading = true;
  try {
    copyFormData.completeTime = copyFormData.completeTime || []
    const completeTimeStart = copyFormData.completeTime[0]; // 开始时间
    const completeTimeEnd = copyFormData.completeTime[1]; // 结束时间
    let params = {
      categoryId: copyFormData.categoryId?.join(",") || null,
      selectUserIdList: copyFormData.selectUserIdList?.length > 0 ? copyFormData.selectUserIdList : null,
      productName: copyFormData.productName || '',
      skuCode: copyFormData.skuCode || '',
      completeTimeStart: completeTimeStart ? `${completeTimeStart} 00:00:00` : null,
      completeTimeEnd: completeTimeEnd ? `${completeTimeEnd} 23:59:59` : null,
      ...tableData.params
    }
    // console.log({ completeTimeStart, completeTimeEnd });
    let res = await getList(params)
    let data = res.data ?? []
    data.forEach((item, index) => {
      item.rowIndex = ((tableData.params.pageNum - 1) * tableData.params.pageSize + index + 1);
      item.skuCodeList = item.skuList?.map(i => i.skuCode).join() || '';
      item.averageWeight = null;
      item.averagePrice = null;
      item.mainImage = item.mainImage || '';
      item.classify = classify(item)
      if (item.skuList?.length) {
        let weight = 0
        let price = 0
        item.skuList.forEach(i => {
          weight += (i.weight ? Number(i.weight) : 0)
          price += (i.price ? Number(i.price) : 0)
        })
        item.averageWeight = (weight / item.skuList.length).toFixed(2);
        item.averagePrice = (price / item.skuList.length).toFixed(2);
        !item.mainImage && (item.mainImage = item.skuList[0].mainImages);
      }
      item.mainImage = processImageSource(item.mainImage);
    })
    tableData.data = data
    tableData.total = res.total
    // console.log({res});
    // 滚动条回到顶部
    antTableBody.scrollTop = 0
  } catch (error) {
    console.error(error)
  }
  tableData.loading = false;
}
let clickTimer = null;        // 处理单击和双击冲突的定时器
// 自定义行属性（同时绑定单击和双击）
function customRow(row) {
  return {
    onClick: () => {
      // 清除之前的定时器
      if (clickTimer) clearTimeout(clickTimer);
      // 设置新定时器（250ms内没有双击则视为单击）
      clickTimer = setTimeout(() => {
        // rowClick(row)
      }, 250);
    },
    onDblclick: () => {
      // 双击时立即清除单击定时器
      clearTimeout(clickTimer);
      // rowDblclick(row);
      detailsModalOpen(row)
    }
  };
}
function detailsModalOpen(row) {
  // console.log({ row });
  let obj = {
    row,
    // commodityTypeList: options.commodityTypeList,
  }
  _this.$refs.publicationDatabase_detailsModal.modalOpenFn(obj)
}
// 复选框
function onSelectChange(keys, rows) {
  tableData.selectedRowKeys = keys
  tableData.selectedRows = rows
}
// 提交编辑
function submitEditFn() {
  let productIdList = tableData.selectedRows.map(i => i.id)
  Modal.confirm({
    title: '提示',
    content: '是否提交编辑？',
    okText: '提交',
    cancelText: '取消',
    async onOk() {
      try {
        await submitEdit({ productIdList });
        tableData.selectedRowKeys = []
        tableData.selectedRows = []
        message.success('提交成功！')
        getTableList()
      } catch (error) {
        console.error(error);
      }
    },
  })
}
// 添加备注
async function addRemarkFn() {
  if (!remarkData.remark) {
    return message.warning('请输入备注！')
  }
  try {
    let productIdList = tableData.selectedRows.map(i => i.id)
    // console.log({productIdList});
    let params = {
      productIdList,
      remark: remarkData.remark,
    };
    await addRemark(params)
    message.success('添加成功！')
    getTableList()
    remarkData.open = false
  } catch (error) {
    console.error(error);
  }
}

/** 刊登 */
const publicationModalOpen = ref(false)
const idList = ref([])

function openPublicationModal(record) {
  if (record) {
    // 单项
    idList.value = [record.id]
  } else {
    // 批量
    idList.value = tableData.selectedRowKeys
  }
  publicationModalOpen.value = true
}

/** 日志 */
const logModalRef = ref();
const logModalVisible = ref(false);
const logLoading = ref(false);
const logData = ref([]);
const currentLogRecord = ref(null);
function openLogModal(record) {
  logModalRef.value.openModal(record);
}

// 处理日志弹窗打开事件
function handleLogModalOpen(record) {
  currentLogRecord.value = record;
  logModalVisible.value = true;
  fetchLogData(record);
}

// 获取日志数据
function fetchLogData(record) {
  logLoading.value = true;
  getLogListApi({ productIds: [record.id] })
    .then((res) => {
      if(res.code === 200) {
        logData.value = res.data || []
      }
    })
    .catch((error) => {
      console.error("获取日志数据失败:", error);
      logData.value = [];
    })
    .finally(() => {
      logLoading.value = false;
    });
}
</script>
<style lang="less" scoped>
.table-btn-box {
  display: flex;
  // padding: 10px 0 20px 0;
}
.row-skuList {
  word-break: break-all; 
  display: -webkit-box; 
  overflow: hidden; 
  -webkit-box-orient: vertical; 
  -webkit-line-clamp: 3;
}
.pagination-box {
  display: flex; 
  justify-content: flex-end;
  :deep(.ant-select-selector) {
    width: 100px !important;
  }
}
</style>