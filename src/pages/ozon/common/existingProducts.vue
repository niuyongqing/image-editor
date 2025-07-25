<template>
<div id="existingProducts_ozon" class="existingProducts_ozon">
  <a-modal 
    v-model:open="modalOpen" 
    :style="{ top: '10px', padding: 0, height: '99vh' }" 
    :title="'现有产品'"
    :footer="false" 
    :maskClosable="false"
    width="95%"
  >
    <div class="dialog-box">
      <a-card class="mt-2.5">
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
                >{{ item.label }}</a-button
              >
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
                  allowClear
                  v-model:value="formData.id"
                  @clear="onSubmit"
                  placeholder="请输入产品ID查询,多个ID间用逗号隔开，最多支持200个"
                ></a-input>
              </div>
              <a-button type="primary" class="ml-2.5" @click="onSubmit(true)"
                >查询</a-button
              >
            </div>
          </a-form-item>
          <a-form-item label="排序方式：">
            <div class="flex align-start">
              <a-button
                v-for="item in storInfo.strList"
                :key="item.prop"
                style="margin: 0 10px"
                :type="item.prop === storInfo.active.prop ? 'primary' : ''"
                @click="storChange(item)"
              >
                <span>{{ item.label }}</span>
                <asyncIcon
                  icon="CaretUpOutlined"
                  v-if="item.prop === storInfo.active.prop && storInfo.active.type == 'bottom'"
                />
                <asyncIcon
                  icon="CaretDownOutlined"
                  v-if="item.prop === storInfo.active.prop && storInfo.active.type == 'top'"
                />
              </a-button>
            </div>
          </a-form-item>
        </a-form>
      </a-card>
      <br/>
    </div>
  </a-modal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { accountCache, byState, list } from '../config/api/product';
import asyncIcon from '~@/layouts/components/menu/async-icon.vue';
defineOptions({ name: "existingProducts_ozon" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['handleSelect']);
const modalOpen = ref(false);
const formData = reactive({
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
    let productDatabaseTable = document.querySelector('.productDatabase-table')
    antTableBody = productDatabaseTable?.querySelector('.ant-table-body')
  })
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
      value: "old_price",
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
  getList();
};
const shopAccount = ref([]);// 店铺数据
const getAccount = () => {
  accountCache().then((res) => {
    shopAccount.value = res.data ?? [];
    getList();
  });
};
// 表单搜索
const onSubmit = (type = false) => {
  getList(type);
  // setUncheck();
};
// 排序方式
const storChange = (item) => {
  item.type = item.type === "top" ? "bottom" : "top";
  storInfo.active = item;
  formData.order = item.type === "top" ? "desc" : "asc";
  formData.prop = item.value;
  getList();
};

const tabQuantity = ref([]);
const tableData = ref([]);
const loading = ref(false);
// 获取店铺数据
const getList = async (isSearch = false) => {
  loading.value = true;
  let params = {
    ...formData,
    // ...advancedForm,
    pageNum: paginations.pageNum,
    pageSize: paginations.pageSize,
    isSearch,
  };
  try {
    let tableRes = await list(params)
    tableRes.data = tableRes.data || []
    tableData.value = tableRes.data.map((item) => {
      item.show = false;
      item.children.forEach((e) => {
        e.errors = e.errors || [];
        e.errors = e.errors.map((el) => {
          el.texts = el.texts ?? {};
          return {
            attributeName: el.texts.attributeName,
            description: el.texts.description,
            message: el.texts.message,
          };
        });
      });
      return item;
    }) ?? [];
    let byRes = await byState(params)
    tabQuantity.value = byRes.data?.rows || [];
    paginations.total = byRes.data?.total || 0;
  } catch (error) {
    console.error(error)
  }
  loading.value = false;
};
defineExpose({
  modalOpenFn
})
</script>
<style lang="less" scoped>

</style>