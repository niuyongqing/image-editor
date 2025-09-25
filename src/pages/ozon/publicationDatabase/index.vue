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
          :field-names="{ label: 'label', value: 'value', children: 'children' }" 
        />
      </a-form-item>
      <a-form-item label="提交人" name="status">
        <a-select 
          v-model:value="formData.selectUserIdList" 
          :options="options.allUserList" 
          mode="tags"
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
          <a-button key="submit" type="primary" @click="onSubmit">查询</a-button>
          <a-button key="submit" @click="resetForm">重置</a-button>
        </a-space>
      </div>
    </a-form>
  </a-card>
  <a-card style="margin-top: 20px">
    <div class="table-btn-box">
      <a-space>
        <a-button type="primary" @click="submitEdit">提交编辑</a-button>
        <a-button type="primary">添加备注</a-button>
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
      rowKey="key_uid"
      :row-selection="{ selectedRowKeys: tableData.selectedRowKeys, onChange: onSelectChange }"
      :loading="tableData.loading"
      class="productDatabase-table"
    >
      <template #bodyCell="{ column: {key}, record: row }">
        <template v-if="key === 'mainImage'">
          <a-image :width="50" :src="row.mainImage"/>
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
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { categoryTree, getList, userList } from './js/api';
import { header } from './js/header';
import _ from "lodash";
import { v4 as uuidv4 } from 'uuid';
import detailsModal from './detailsModal.vue';
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
const tableData = reactive({
  data: [],
  total: 6000,
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
      item.key_uid = uuidv4()
      item.rowIndex = ((tableData.params.pageNum - 1) * tableData.params.pageSize + index + 1);
      item.skuCodeList = item.skuList?.map(i => i.skuCode).join() || '';
      item.averageWeight = null;
      item.averagePrice = null;
      item.mainImage = '';
      item.classify = classify(item)
      if (item.skuList?.length) {
        let weight = 0
        let price = 0
        item.skuList.forEach(i => {
          weight += (i.weight ? Number(i.weight) : 0)
          price += (i.price ? Number(i.price) : 0)
        })
        item.averageWeight = (weight / item.skuList.length);
        item.averagePrice = (price / item.skuList.length);
        item.mainImage = item.skuList[0].mainImages;
      }
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
  console.log({ row });
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
function submitEdit() {
  let ids = tableData.selectedRows.map(i => i.id)
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