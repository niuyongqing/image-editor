<template>
  <div id="waitPublishCont">
    <div class="flex">
      <!-- 左侧边栏 -->
      <SideBar class="w-70" page-type="waitPublish" :default-active="defaultActive" :total-count="totalCount"
        :publish-failed-count="publishFailedCount" @draft-emit="handleDraftEmit" @wait-emit="handleWaitEmit"
        @online-emit="handleOnlineEmit" />

      <div class="w-[calc(100%-290px)] ml-3">
        <AppTableForm
          v-model:formData="formData"
          reset-set-menu="waitPublish"
          :hide-name-list="['price', 'oldPrice', 'stock', 'updateTime']"
          @on-submit="search"
        >
          <template #formItemBox>
            <a-form-item
              label="创建时间"
              name="createTime"
            >
              <a-range-picker
                v-model:value="formData.createTime"
                :presets="presets"
                :disabled-date="cur => cur && cur > Date.now()"
              />
            </a-form-item>
            <a-form-item
              label="更新时间"
              name="updateTime"
            >
              <a-range-picker
                v-model:value="formData.updateTime"
                :presets="presets"
                :disabled-date="cur => cur && cur > Date.now()"
              />
            </a-form-item>
            <a-form-item label="售价" name="price">
              <div class="flex">
                <a-input-number :min="0" :max="99999" :controls="false"
                  v-model:value="formData.minPrice" allowClear placeholder="最小" class="w-22!" />
                <span class="mx-2.5">-</span>
                <a-form-item-rest>
                  <a-input-number :min="0" :max="99999" :controls="false" v-model:value="formData.maxPrice" allowClear placeholder="最大" class="w-22!" />
                </a-form-item-rest>
              </div>
            </a-form-item>
            <a-form-item label="原价" name="oldPrice">
              <div class="flex">
                <a-input-number :min="0" :max="99999" :controls="false"
                v-model:value="formData.minOldPrice" allowClear placeholder="最小" class="w-22!" />
                <span class="mx-2.5">-</span>
                <a-form-item-rest>
                  <a-input-number :min="0" :max="99999" :controls="false" v-model:value="formData.maxOldPrice" allowClear placeholder="最大" class="w-22!" />
              </a-form-item-rest>
              </div>
            </a-form-item>
            <a-form-item label="总库存" name="stock">
              <div class="flex">
                <a-input-number :min="0" :max="99999" :controls="false"
                v-model:value="formData.minStock" allowClear placeholder="最小" class="w-22!" />
                <span class="mx-2.5">-</span>
                <a-form-item-rest>
                  <a-input-number :min="0" :max="99999" :controls="false" v-model:value="formData.maxStock" allowClear placeholder="最大" class="w-22!" />
              </a-form-item-rest>
              </div>
            </a-form-item>
            <a-form-item label="店铺账号" name="account">
              <AppCardSelect
                v-model:account="formData.account"
                :options="shopAccount"
                :field-obj="{ label: 'simpleName', value: 'account' }"
                @selectItem="search"
              />
            </a-form-item>
          </template>

          <template #formItemRow>
            <a-form-item
              label="模糊查询"
              name="mult"
            >
              <a-form-item-rest>
                <a-space>
                  <a-input
                    v-model:value="formData.name"
                    placeholder="标题"
                    allow-clear
                  />
                  <a-input
                    v-model:value="formData.sku"
                    placeholder="SKU, 多个SKU间用逗号隔开，最多支持200个"
                    allow-clear
                  />
                </a-space>
              </a-form-item-rest>
            </a-form-item>
          </template>
        </AppTableForm>
        
        <AppTableBox
          :loading="loading"
          :table-header="columns"
          :data-source="tableData"
          stripe
          row-key="waitId"
          :scroll="{ x: 'max-content' }"
          reset-set-menu="waitPublish"
          :row-selection="rowSelection"
          @change="handleTableChange"
        >
          <template #otherCount>
            <a-tabs v-model:activeKey="activeName" type="card" style="width: 800px" @tab-click="handleClick">
              <a-tab-pane :key="item.name" v-for="item in tabList" :tab="item.label + `(${item.value})`">
              </a-tab-pane>
            </a-tabs>
          </template>

          <template #leftTool>
            <a-space :size="10">
              <a-dropdown :disabled="selectedRowList.length === 0">
                <template #overlay>
                  <a-menu @click="handleMenuClick">
                    <a-menu-item key="batchEdit">批量编辑</a-menu-item>
                    <a-menu-item key="publish"> 批量发布 </a-menu-item>
                    <a-menu-item key="addWatermark">批量加水印</a-menu-item>
                    <!-- <a-menu-item key="deactivate">
                      批量归档
                    </a-menu-item> -->
                    <a-menu-item key="remark"> 批量备注 </a-menu-item>
                    <a-menu-item key="delete"> 批量删除 </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item key="stock"> 批量修改库存 </a-menu-item>
                    <a-menu-item key="price"> 批量修改售价 </a-menu-item>
                    <a-menu-item key="oldPrice"> 批量修改原价 </a-menu-item>
                    <a-menu-item key="all"> 全属性修改 </a-menu-item>
                  </a-menu>
                </template>
                <a-button>
                  批量操作
                  <DownOutlined />
                </a-button>
              </a-dropdown>

              <a-dropdown v-model:open="moveCategoryOpen" :disabled="!selectedRowList.length" trigger="click">
                <a-button type="primary">
                  移动分类
                  <DownOutlined />
                </a-button>
                <template #overlay>
                  <a-menu>
                    <typeTree platform="ozon" @nodeClick="typeNodeClick" />
                  </a-menu>
                </template>
              </a-dropdown>

              <a-button type="link" @click="shopSet">
                <AsyncIcon icon="SettingOutlined" />
                店铺设置
              </a-button>
              <a-button type="primary" @click="add">创建产品</a-button>
              <a-dropdown>
                <template #overlay>
                  <a-menu @click="handleExport">
                    <a-menu-item key="page"> 按页导出 </a-menu-item>
                    <a-menu-item key="number" :disabled="selectedRowList.length === 0">
                      按勾选导出
                    </a-menu-item>
                  </a-menu>
                </template>
                <a-button type="primary">
                  导出
                  <DownOutlined />
                </a-button>
              </a-dropdown>
            </a-space>
          </template>

          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'name'">
              <div class="flex text-left">
                <a-image style="width: 100px; height: 100px" :src="processImageSource(
                  (record.skuList[0]?.primaryImage?.length > 0 && record.skuList[0]?.primaryImage[0]) ||
                  (record.skuList[0]?.images?.length > 0 && record.skuList[0]?.images[0]) ||
                  ''
                )" />
                <div class="ml-2.5 block">
                  <div class="min-w-200px">{{ record.name ? record.name : record.skuList[0].name }}</div>
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
            </template>
            <template v-if="column.dataIndex === 'waitState'">
              <a-tag color="success" v-if="record.waitState == 'published'">{{
                state[record.waitState]
              }}</a-tag>
              <a-tag color="warning" v-else-if="record.waitState == 'wait_publish'">{{ state[record.waitState]
              }}</a-tag>
              <a-tag color="error" v-else-if="record.waitState == 'publish_failed'">{{ state[record.waitState]
              }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'sku'">
              <div class="record-sku-container pb-30px" text-center>
                <div v-for="(item, index) in displayedSkus(record)" :key="index" class="record-sku">
                  <span>{{ item.offerId }}</span>
                </div>
              </div>
            </template>
            <template v-if="column.dataIndex === 'sku.price'">
              <div>
                <div v-for="(item, index) in displayedSkus(record)" :key="index">
                  <span style="color: #9e9f9e">{{ item.price }}</span>
                </div>
              </div>
            </template>
            <template v-if="column.dataIndex === 'oldPrice'">
              <div>
                <div v-for="(item, index) in displayedSkus(record)" :key="index">
                  <span style="color: #9e9f9e">{{ item.oldPrice }}</span>
                </div>
              </div>
            </template>
            <template v-if="column.dataIndex === 'sku.stock'">
              <div>
                <div v-for="(item, index) in displayedSkus(record)" :key="index">
                  <a-tooltip style="margin-right: 10px" effect="dark" placement="top">
                    <template #title>
                      <div v-for="(el, ind) in item.warehouseList" :key="ind">
                        <span>{{ el.warehouseName }}</span>:
                        <span>{{ el.present || 0 }}</span>
                      </div>
                    </template>
                    <span style="color: #1677ff">{{ item.stock || 0 }}</span>
                  </a-tooltip>
                </div>
              </div>
              <div v-if="record.skuList.length > 5" class="w-full flex flex-end flex-end more">
                <a-button type="link" @click="record.show = !record.show">{{ !record.show ? "展开" : "收起" }}
                </a-button>
              </div>
            </template>
            <div v-else-if="column.dataIndex === 'create_time'">
              <span class="text-gray">{{ record.createTime || '--' }}</span>
            </div>
            <div v-else-if="column.dataIndex === 'update_time'">
              <span class="text-gray">{{ record.updateTime || '--' }}</span>
            </div>
            <template v-if="column.dataIndex === 'option'">
              <div>
                <a-button @click.stop="edit(record)" type="link" v-if="record.listState !== '档案'">编辑</a-button>
              </div>
              <div>
                <a-button type="link" @click.stop="publish(record)">发布</a-button>
              </div>
              <a-dropdown>
                <a class="ant-dropdown-link">
                  更多
                  <DownOutlined />
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="addRemark(record)">
                      <a-button type="link">添加备注</a-button>
                    </a-menu-item>
                    <a-menu-item>
                      <a-popconfirm title="确定删除吗？" @confirm="del(record)">
                        <a-button type="link" danger>删除产品</a-button>
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </template>

          <template #pagination>
            <AppTablePagination
              v-model:current="paginations.pageNum"
              v-model:pageSize="paginations.pageSize"
              :total="paginations.total"
              @change="getList"
            />
          </template>
        </AppTableBox>
      </div>
    </div>

    <editRemark :remarkVisible="remarkVisible" :remarkId="remarkId" @backCloseRemark="backCloseRemark"></editRemark>
    <!-- 店铺设置 -->
    <shopSetModal :shopSetVisible="shopSetVisible" :shopCurryList="shopCurryList"
      @handleShopSetClose="shopSetVisible = false" @refreshShopSet="getShopSet"></shopSetModal>

    <!-- 批量加水印 -->
    <BatchAddWatermarkModal v-model:open="watermarkModalOpen" @ok="watermarkOk" />

    <!-- 统一修改价格库存等 -->
    <editPriceModal :selectedRows="selectedRowList" :editPriceVisible="editPriceVisible" :brandList="brandList"
      @handleEditPriceClose="handleEditPriceClose" :editStockList="editStockList" :defType="defType">
    </editPriceModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from "vue";
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import {
  accountCache,
  shopCurrency,
  productWarehouse,
} from "../config/api/product";
import { groupProductCountApi } from '../config/api/draft'
import { batchAddWatermarkToWaitProductApi } from '../config/api/batch-edit'
import {
  ozonProductList,
  ozonProductDel,
  ozonProductPublish,
  waitExport,
  brandCategory
} from "../config/api/waitProduct";
import tableHeard from "../config/tabColumns/waitPublish";
import editRemark from "./comm/editRemark.vue";
import { message, Modal } from "ant-design-vue";
import dayjs from "dayjs";
import { processImageSource } from "~/pages/ozon/config/commJs/index";
import { SettingOutlined, DownOutlined } from "@ant-design/icons-vue";
import shopSetModal from "../product/comm/shopSetModal.vue";
import { tabAllDicList, colors } from "../config/commDic/defDic";
import download from "~/api/common/download";
import editPriceModal from "./comm/editPriceModal.vue";
import typeTree from '@/components/classificationTree/typeTree.vue';
import { moveWaitCategoryApi } from '@/components/classificationTree/api.js';
import SideBar from '@/pages/ozon/config/component/SideBar/index.vue';
import BatchAddWatermarkModal from '@/pages/ozon/config/component/BatchAddWatermarkModal/index.vue'

const formData = reactive({
  offerId: "",
  account: "",
  sku: "",
  name: "",
  state: "",
  minPrice: null,
  maxPrice: null,
  minOldPrice: null,
  maxOldPrice: null,
  minStock: null,
  maxStock: null,
  createTime: [],
  updateTime: [],
});
const paginations = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0,
});
const presets = ref([
  { label: '昨天', value: [dayjs().add(-1, 'd'), dayjs()] },
  { label: '7天内', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '30天内', value: [dayjs().add(-30, 'd'), dayjs()] },
])
const shopAccount = ref([]);
const actives = ref(1);
const selectedRowList = ref([]);
const selectedRowKeys = ref([]);
const tableData = ref([]);
let columns = tableHeard;

const loading = ref(false);
const remarkVisible = ref(false);
const shopSetVisible = ref(false);
const advancedType = ref(false);
const editPriceVisible = ref(false); //全属性
const editStockList = ref([]); //修改库存
const remarkId = ref([]);
const shopCurryList = ref([]);
const tabList = ref(tabAllDicList);
const activeName = ref(" ");
const tabQuantity = ref([]);
const defType = ref([]);
const stockShops = ref([]);
const brandList = ref([])

const state = {
  wait_publish: "待发布",
  published: "已发布",
  publish_failed: "发布失败",
};
const shopObj = {
  fieldKey: "account",
  fieldLabel: "simpleName",
};

const rowSelection = computed(() => {
  return {
    selectedRowKeys: selectedRowKeys.value,
    onChange: (rowKeys, rows) => {
      selectedRowKeys.value = rowKeys; //只接收ID
      selectedRowList.value = rows; //接收每一行
    },
  };
});

const add = () => {
  window.open("productPublish", "_blank");
};

// 标签页切换
const handleClick = (activeKey) => {
  formData.state = activeKey;
  getList();
};

const remarkColor = (param) => {
  const findItem = colors.find((item) => {
    return item.id === param;
  });
  return findItem ? findItem.color : "#000000";
};

// 库存
const getStore = () => {
  let params = {
    account: stockShops.value,
  };
  productWarehouse(params).then((res) => {
    editStockList.value =
      res?.data?.map((item) => {
        return {
          account: item.account,
          simpleName: item.simpleName,
          children: item.children,
          allStock: "",
        };
      }) ?? [];
  });
};

// 店铺单选多选
const selectAll = () => {
  formData.account = "";
  getList();
  getGroupProductCount()
};
const selectItem = (val) => {
  formData.account = val;
  getList();
  getGroupProductCount()
};

// 搜索内容
const selectTypes = (index) => {
  actives.value = index;
  switch (index) {
    case 1:
      formData.sku = "";
      formData.offerId = "";
      break;
    case 2:
      formData.name = "";
      formData.offerId = "";
      break;
    case 3:
      formData.sku = "";
      formData.name = "";
      break;
    default:
      break;
  }
};

const shopSet = () => {
  shopSetVisible.value = true;
  getShopSet();
};

const getShopSet = () => {
  shopCurrency().then((res) => {
    shopCurryList.value = res?.data ?? [];
  });
};

// 表单搜索
const onSubmit = () => {
  getList();
};

/** 移动分类 */
const moveCategoryOpen = ref(false)
// 点击分类树
async function typeNodeClick(node) {
  moveCategoryOpen.value = false
  if (selectedRowList.value.length < 1) return message.warning('请选择商品！')
  try {
    let waitId = selectedRowList.value.map(i => i.waitId)
    let params = {
      waitId,
      customCategoryId: node.id //分类ID
    }
    await moveWaitCategoryApi(params)
    message.success('移动分类成功')
    getList()
  } catch (error) {
    console.error(error)
  }
}

/** 左侧边栏 */
const defaultActive = ref('0')
let categoryId = '0'
const route = useRoute()
const router = useRouter()
if (route.query.categoryId) {
  categoryId = route.query.categoryId
  defaultActive.value = categoryId
  if (categoryId === 'fail') {
    activeName.value = 'publish_failed'
    formData.state = 'publish_failed'
  }
}
// 采集箱区域事件回调
const handleDraftEmit = val => {
  router.push('/platform/ozon/draft')
}
// 待发布区域事件回调
const handleWaitEmit = val => {
  if (categoryId === val) return

  categoryId = val
  if (val === 'fail') {
    activeName.value = 'publish_failed'
    formData.state = 'publish_failed'
  } else {
    activeName.value = ' '
    formData.state = ''
  }
  paginations.pageNum = 1
  getList();
}
// 店铺(在线)商品区域事件回调
const handleOnlineEmit = val => {
  router.push(`/platform/ozon/product?categoryId=${val}`)
}

// 获取左侧状态栏统计数量
const totalCount = ref(0)
const publishFailedCount = ref(0)
function getGroupProductCount() {
  const params = {
    account: formData.account
  }
  groupProductCountApi(params).then(res => {
    totalCount.value = res.data.totalCount
    publishFailedCount.value = res.data.publishFailedCount
  })
}

// 店铺数据
const getAccount = () => {
  accountCache().then((res) => {
    if (res.data) {
      shopAccount.value = res?.data ?? [];
      getList();
      getGroupProductCount()
    }
  });
};

// 单个和批量删除
const del = (row = {}) => {
  // loading.value = true;
  let waitIds = [];
  if (Object.keys(row).length != 0) {
    waitIds.push(row.waitId);
  } else {
    waitIds = selectedRowKeys.value;
  }
  ozonProductDel({ waitIds })
    .then((res) => {
      message.success("操作成功");
      getList();
    })
    .finally(() => {
      // loading.value = false;
    });
};

const displayedSkus = (row) => {
  return row.show ? row?.skuList : row?.skuList?.slice(0, 5);
};

// 备注
const addRemark = (row = {}) => {
  remarkVisible.value = true;
  if (Object.keys(row).length == 0) {
    const matchSet = new Set(selectedRowKeys.value);
    remarkId.value = tableData.value
      .filter((item) => matchSet.has(item.waitId))
      .map(({ waitId, account }) => ({ waitId, account }));
  } else {
    let remarkObj = {
      account: row.account,
      waitId: row.waitId,
    };
    remarkId.value.push(remarkObj);
  }
};

// 备注弹窗关闭
const backCloseRemark = () => {
  remarkVisible.value = false;
  remarkId.value = [];
  getList();
};

const edit = (row = {}) => {
  let newRow = Object.keys(row).length != 0 ? row : selectedRowList.value[0];
  window.open(
    "editWaitProduct" + `?id=${newRow.waitId}&account=${newRow.account}`,
    "_blank"
  );
};

// 批量操作
const handleMenuClick = (e) => {
  if (e.key == "batchEdit") {
    localStorage.setItem('waitIdList', JSON.stringify(selectedRowKeys.value))
    window.open('/platform/ozon/batch-edit-wait-product')
  } else if (e.key == "remark") {
    addRemark();
  } else if (e.key === "publish") {
    Modal.confirm({
      title: "是否批量发布？",
      onOk: () => {
        publish();
      },
      onCancel: () => {
        clearSelectList();
      },
    });
  } else if (e.key === 'addWatermark') {
    watermarkModalOpen.value = true
  }
  else if (e.key == "delete") {
    Modal.confirm({
      title: "确定在待发布删除吗？",
      onOk: () => {
        del();
      },
      onCancel: () => {
        clearSelectList();
      },
    });
  } else {
    defType.value = e.keyPath;
    editPriceVisible.value = true;
    stockShops.value = selectedRowList.value.map((e) => e.account);
    getStore();
    getBrandList();
  }
};

// 获取品牌相关数据
const getBrandList = () => {

  let list = selectedRowList.value.map((e) => {
    return {
      account: e.account,
      typeId: e.typeId,
      descriptionCategoryId: e.descriptionCategoryId
    }
  })
  brandCategory(list).then((res) => {
    brandList.value = res?.data ?? [];
  })
};

/** 批量加水印 */
const watermarkModalOpen = ref(false)
function watermarkOk(form) {
  const params = {
    waitId: selectedRowKeys.value,
    ...form
  }
  batchAddWatermarkToWaitProductApi(params).then(res => {
    selectedRowList.value = []
    selectedRowKeys.value = []
    getList()
    message.success('添加水印成功')
  }).catch(err => {
    message.warning('添加水印失败')
  })
}

// 关闭价格
const handleEditPriceClose = () => {
  defType.value = [];
  editPriceVisible.value = false;
  getList();
  editStockList.value = clearStock(editStockList.value);
};

function clearStock(data) {
  if (Array.isArray(data)) {
    data.forEach((item) => {
      if (item.children) {
        clearStock(item.children);
      }
      if (item.hasOwnProperty("stock")) {
        item.stock = null;
      }
    });
  }
  return data;
}

// 导出
const handleExport = (e) => {
  let waitIds = [];
  if (e.key == "page") {
    waitIds = tableData.value.map((e) => e.waitId);
  } else {
    waitIds = selectedRowKeys.value;
  }
  waitExport({ waitIds }).then((res) => {
    download.name(res.msg);
    message.success("下载任务已开始！请耐心等待完成");
    clearSelectList();
  });
};

const clearSelectList = () => {
  selectedRowList.value = [];
  selectedRowKeys.value = [];
};

const getList = () => {
  if (formData.minPrice > formData.maxPrice) {
    message.error("最大售价必须大于最小售价！");
    return;
  }
  if (formData.minOldPrice > formData.maxOldPrice) {
    message.error("最大原价必须大于最小原价！");
    return;
  }
  if (formData.minStock > formData.maxStock) {
    message.error("最大库存必须大于最小库存！");
    return;
  }
  loading.value = true;
  let params = {
    ...formData,
    ...sortObj,
    customCategoryId: categoryId,
    startUpdateTime: formData.updateTime.length
      ? dayjs(formData.updateTime[0]).startOf("day").format("YYYY-MM-DD HH:mm:ss")
      : undefined,
    endUpdateTime: formData.updateTime.length
      ? dayjs(formData.updateTime[1]).endOf("day").format("YYYY-MM-DD HH:mm:ss")
      : undefined,
    startCreateTime: formData.createTime.length
      ? dayjs(formData.createTime[0]).startOf("day").format("YYYY-MM-DD HH:mm:ss")
      : undefined,
    endCreateTime: formData.createTime.length
      ? dayjs(formData.createTime[1]).endOf("day").format("YYYY-MM-DD HH:mm:ss")
      : undefined,
    pageNum: paginations.pageNum,
    pageSize: paginations.pageSize,
  };
  delete params.createTime;
  delete params.updateTime;

  ozonProductList(params)
    .then((res) => {
      tableData.value =
        res?.rows[0]?.waitPublishProductList?.map((item) => {
          item.show = false;
          return item;
        }) || [];
      paginations.total = res?.total || 0;
      tabQuantity.value = res?.rows[0]?.aggregationList || [];
    })
    .finally(() => {
      clearSelectList();
      loading.value = false;
    });
};

const search = () => {
  paginations.pageNum = 1
  getList()
}

const sortObj = reactive({
  prop: "create_time",
  order: "desc",
});
// 表格排序
const handleTableChange = (pagination, filters, sorter) => {
  console.log(sorter);
  if (sorter.order) {
    sortObj.prop = sorter.field;
    sortObj.order = sorter.order === "ascend" ? "asc" : "desc";
  } else {
    sortObj.prop = undefined;
    sortObj.order = undefined;
  }
  getList();
};

// tabs的商品统计条数赋值
watch(tabQuantity, (newValue, oldValue) => {
  if (newValue.length === 0) {
    tabList.value = [...tabAllDicList];
  } else {
    tabList.value = tabAllDicList.map((item) => {
      const match = newValue.find((q) => q.state === item.code);
      return {
        ...item,
        value: match ? match.count.toString() : "0",
      };
    });
  }
});

// 单个发布
const publish = (row = {}) => {
  let params = [];
  if (Object.keys(row).length != 0) {
    params = [
      {
        account: row.account,
        waitId: row.waitId,
      },
    ];
  } else {
    params = selectedRowList.value.map((item) => {
      return {
        account: item.account,
        waitId: item.waitId,
      };
    });
  }
  // loading.value = true;
  ozonProductPublish(params)
    .then((res) => {
      message.success(res.msg);
      getList();
    })
    .finally(() => {
      // loading.value = false;
      clearSelectList();
    });
};
onMounted(() => {
  getAccount();
});
</script>
<style lang="less" scoped>
.record-sku-container {
  width: 100%;
}

.record-sku {
  color: rgb(35, 82, 124);
  cursor: pointer;
  border-bottom: 1px dashed #e8e8e8;
  padding-bottom: 6px;
}

.more {
  position: absolute;
  height: 30px;
  bottom: 0px;
  display: flex;
  justify-content: end;
}
</style>
