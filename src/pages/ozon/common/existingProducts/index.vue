<template>
  <div id="existingProducts_ozon" class="existingProducts_ozon">
    <a-modal 
      v-model:open="modalOpen" 
      :style="{ top: '10px', padding: 0, height: '90vh' }" 
      :title="'现有产品'"
      :footer="false" 
      :maskClosable="false" 
      width="95%"
    >
      <div class="dialog-box">
        <a-card class="mt-2.5">
          <a-spin :spinning="loading">
            <a-form ref="ruleForm" :model="formData" class="form-padding">
              <a-form-item label="店铺账号：">
                <selectComm 
                  style="margin-left: 10px" 
                  :options="shopAccount" 
                  :fieldObj="shopObj"
                  @backSelectAll="selectItem" 
                  @backSelectItem="selectItem"
                ></selectComm>
              </a-form-item>
              <a-form-item label="搜索类型:">
                <div class="fBox flex align-start ml-2.5">
                  <a-button 
                    @click="selectTypes(item.prop)" 
                    class="mr-2.5"
                    :type="item.prop === searchType.actives ? 'primary' : ''" 
                    v-for="(item, index) in searchType.options"
                    :key="index"
                  >{{ item.label }}</a-button>
                </div>
              </a-form-item>
              <a-form-item label="搜索内容：">
                <div class="searchs flex">
                  <div class="searchInputs flex align-start ml-2.5">
                    <a-input 
                      v-if="searchType.actives == 1" 
                      style="width: 400px" 
                      v-model:value="formData.name"
                      placeholder="请输入标题查询" 
                      allowClear 
                      @clear="onSubmit"
                    ></a-input>
                    <a-input 
                      v-if="searchType.actives == 2" 
                      style="width: 400px" 
                      v-model:value="formData.sku" 
                      allowClear
                      @clear="onSubmit" 
                      placeholder="请输入SKU查询,多个SKU间用逗号隔开，最多支持200个"
                    ></a-input>
                    <a-input 
                      v-if="searchType.actives == 3" 
                      style="width: 400px" 
                      allowClear v-model:value="formData.id"
                      @clear="onSubmit" 
                      placeholder="请输入产品ID查询,多个ID间用逗号隔开，最多支持200个"
                    ></a-input>
                  </div>
                  <a-button type="primary" class="ml-2.5" @click="onSubmit(true)">查询</a-button>
                </div>
              </a-form-item>
              <a-form-item label="排序方式：">
                <div class="flex align-start">
                  <a-button 
                    v-for="item in storInfo.strList" 
                    :key="item.prop" style="margin: 0 10px"
                    :type="item.prop === storInfo.active.prop ? 'primary' : ''" 
                    @click="storChange(item)"
                  >
                    <span>{{ item.label }}</span>
                    <asyncIcon icon="CaretUpOutlined" v-if="item.prop === storInfo.active.prop && storInfo.active.type == 'bottom'" />
                    <asyncIcon icon="CaretDownOutlined" v-if="item.prop === storInfo.active.prop && storInfo.active.type == 'top'" />
                  </a-button>
                </div>
              </a-form-item>
            </a-form>
          </a-spin>
        </a-card>
        <br />
        <div class="flex items-baseline justify-between">
          <a-tabs
            v-model:activeKey="activeName"
            type="card"
            style="width: 800px"
            @tab-click="handleClick"
          >
            <a-tab-pane
              :key="item.name"
              v-for="item in tabList"
              :tab="item.label + `(${item.value})`"
            >
            </a-tab-pane>
          </a-tabs>
        </div>
        <a-table 
          :columns="tableHead" 
          :data-source="tableData" 
          :scroll="{ y: 'calc(80vh - 240px)' }" 
          :pagination="false"
          rowKey="commodityId" 
          :loading="loading" 
          class="existingProducts-table"
        >
          <template #bodyCell="{ column, record }">
            <div v-if="column.dataIndex === 'name'" class="flex">
              <div class="flex text-left items-center">
                <a-image style="width: 100px; height: 100px" :src="processImageSource(
                    (record.primaryImage?.length && record.primaryImage[0]) ||
                    (record.images?.length && record.images[0]) ||
                    ''
                  )">
                </a-image>
                <div style="margin-left: 10px; display: block">
                  <a-tooltip class="item">
                    <template #title>
                      <span>{{ record.name }}</span>
                    </template>
                    <div class="truncate prodTitle" style="width: 350px;">{{ record.name }}</div>
                  </a-tooltip>
                  <div style="color: #999; float: left">
                    产品ID：{{ record.sku }}
                  </div>
                  <br />
                  <div style="color: #999; float: left">
                    店铺: {{ record.simpleName }}
                  </div>
                  <br />

                  <div :style="{
                        color: remarkColor(record.remarkColor),
                        float: 'left',
                      }">
                    备注:{{ record.remark }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="column.dataIndex === 'state'">
              <a-tag :bordered="false" :color="getStateColor(record.state)">
                {{ record.state || " " }}
              </a-tag>
            </div>
            <div 
              v-else-if="column.dataIndex === 'createdAt'" 
              style=" display: flex; flex-direction: column; align-items: flex-start;"
            >
              <div>创建时间：<span style="color: #9e9f9e">{{ record.createTime ? record.createTime : '无' }}</span></div>
              <div>更新时间：<span style="color: #9e9f9e">{{ record.updateTime ? record.updateTime : '无' }}</span></div>
            </div>
            <div v-else-if="column.dataIndex === 'option'">
              <a-button @click="handleSelect(record)" type="link">选中</a-button>
            </div>
          </template>
        </a-table>
        <div class="pagination-box">
          <a-pagination
            :show-total="(total) => `共 ${total} 条`"
            @update:current="pageNumChange"
            @update:page-size="pageSizeChange"
            :current="paginations.pageNum"
            :pageSize="paginations.pageSize"
            :total="paginations.total"
            class="pages"
            :show-quick-jumper="true"
            :showSizeChanger="true"
            :pageSizeOptions="[50, 100, 200]"
          />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import asyncIcon from '~@/layouts/components/menu/async-icon.vue';
import { accountCache, byState, list } from '../../config/api/product';
import tableHead from './js/header.js';
import { colors, tabDicList } from '../../config/commDic/defDic.js';
import _ from 'lodash';
defineOptions({ name: "existingProducts_ozon" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['handleSelect']);
const modalOpen = ref(false);
const { state: formData, reset } = useResetReactive({
  id: "",
  account: "",
  sku: "",
  name: "",
  prop: "created_time",
  order: "desc",
  state: "",
});
const paginations = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0,
});

let antTableBody = null;      // 表格滚动区域
function modalOpenFn() {
  modalOpen.value = true
  nextTick(() => {
    getAccount()
    let productDatabaseTable = document.querySelector('.existingProducts-table')
    antTableBody = productDatabaseTable?.querySelector('.ant-table-body')
  })
}
// 选中商品
function handleSelect(row) {
  emit('handleSelect', _.cloneDeep(row))
  reset()
  modalOpen.value = false;
}
const shopObj = {
  fieldKey: "account",
  fieldLabel: "simpleName",
};
const searchType = reactive({
  actives: 1,
  options: [
    {
      label: "标题",
      prop: 1,
    },
    {
      label: "SKU",
      prop: 2,
    },
    {
      label: "产品ID",
      prop: 3,
    },
  ]
});

const storInfo = reactive({
  // 默认按下单时间查询
  active: {
    label: "按创建时间",
    value: "created_time",
    type: "top",
    prop: 1,
    isDefault: true,
  },
  strList: [
    {
      label: "按创建时间",
      value: "created_time",
      type: "top",
      prop: 1,
      isDefault: true,
    },
    {
      label: "按更新时间",
      type: "bottom",
      value: "update_tiem",
      prop: 2,
      isDefault: false,
    },
    {
      label: "按售价",
      value: "price",
      type: "top",
      prop: 3,
      isDefault: false,
    },
    {
      label: "按总库存量",
      value: "stock",
      type: "top",
      prop: 4,
      isDefault: false,
    },
  ]
})
// 搜索内容
const selectTypes = (index) => {
  searchType.actives = index;
  switch (index) {
    case 1:
      formData.sku = "";
      formData.id = "";
      break;
    case 2:
      formData.name = "";
      formData.id = "";
      break;
    case 3:
      formData.sku = "";
      formData.name = "";
      break;
    default:
      break;
  }
};
const selectItem = (val) => {
  formData.account = val ?? '';
  pageNumChange(1);
};
const shopAccount = ref([]);// 店铺数据
const getAccount = async () => {
  try {
    loading.value = true
    let res = await accountCache()
    shopAccount.value = res.data ?? [];
    pageNumChange(1);
  } catch (error) {
    loading.value = false
    console.error(error)
  }
};
// 表单搜索
const onSubmit = (type = false) => {
  pageNumChange(1);
  // setUncheck();
};
// 排序方式
const storChange = (item) => {
  item.type = item.type === "top" ? "bottom" : "top";
  storInfo.active = item;
  formData.order = item.type === "top" ? "desc" : "asc";
  formData.prop = item.value;
  pageNumChange(1);
};
// 分页变化
function pageNumChange(val) {
  paginations.pageNum = val
  getList()
};
function pageSizeChange(val) {
  paginations.pageSize = val
  pageNumChange(1);
};

const activeName = ref(" ")
// 标签页切换
const handleClick = (activeKey) => {
  formData.state = activeKey;
  pageNumChange(1);
};

const tabQuantity = ref([]);
const tableData = ref([]);
const loading = ref(false);
const tabList = computed(() => {
  let list = tabDicList.map(item => {
    let val = tabQuantity.value.find(i => i.state === item.label) || {};
    return {
      ...item,
      value: (val.count || 0),
    }
  })
  return list;
})
// 获取店铺数据
const getList = async () => {
  loading.value = true;
  let params = {
    ...formData,
    // ...advancedForm,
    pageNum: paginations.pageNum,
    pageSize: paginations.pageSize,
  };
  try {
    let tableRes = await list(params)
    tableRes.data = tableRes.data || []
    let rows = []
    tableRes.data.forEach((item) => {
      rows = [...rows, ...item.children]
    });
    tableData.value = rows
    let byRes = await byState(params)
    tabQuantity.value = byRes.data?.rows || [];
    paginations.total = byRes.data?.total || 0;
    // 滚动条回到顶部
    antTableBody && (antTableBody.scrollTop = 0);
  } catch (error) {
    console.error(error)
  }
  loading.value = false;
};

const processImageSource = (source) => {
  if (source === undefined || source === null || source === "") return;
  const processUrl = (url) => {
    // 检查是否以 https:// 开头
    if (url.startsWith("https://") || url.includes('/prod-api')) {
      return url;
    } else {
      // 移除开头的斜杠以避免重复，并拼接 /prod-api/
      return `/prod-api/${url.replace(/^\//, "")}`;
    }
  };

  // 处理数组或字符串
  return Array.isArray(source) ? source.map(processUrl) : processUrl(source);
};
const remarkColor = (param) => {
  const findItem = colors.find((item) => {
    return item.id === param;
  });
  return findItem ? findItem.color : "#000000";
};
const getStateColor = (state) => {
  const colorMap = {
    "平台审核": "processing",
    "在售": "success",
    "审核不通过": "error",
    "准备出售": "warning",
  };
  return colorMap[state] || "default";
};
defineExpose({
  modalOpenFn
})
</script>
<style lang="less" scoped>
.pagination-box {
  display: flex; 
  justify-content: flex-end;
  margin: 20px 0 10px 0;
  :deep(.ant-select-selector) {
    width: 100px !important;
  }
}
</style>