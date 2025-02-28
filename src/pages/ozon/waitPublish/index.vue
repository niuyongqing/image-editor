<template>
  <div id="waitPublishCont">
    <a-card class="mt-2.5">
      <a-form ref="ruleForm2" :model="formData" class="form-padding">
        <a-form-item label="店铺账号：">
          <selectComm style="margin-left: 10px" :options="shopAccount" :fieldObj="shopObj" @backSelectAll="selectAll"
            @backSelectItem="selectItem"></selectComm>
        </a-form-item>
        <a-form-item label="搜索类型:">
          <div class="fBox flex align-start ml-[10px]">
            <a-button @click="selectTypes(item.prop)" class="mr-[10px]" :type="item.prop === actives ? 'primary' : ''"
              v-for="(item, index) in searchType" :key="index">{{ item.label }}</a-button>
          </div>
        </a-form-item>
        <a-form-item label="搜索内容：">
          <div class="searchs flex">
            <div class="searchInputs flex align-start ml-[10px]">
              <a-input v-if="actives == 1" style="width: 400px;" v-model:value="formData.name" placeholder="请输入标题查询"
                clearable @clear="onSubmit"></a-input>
              <a-input v-if="actives == 2" style="width: 400px;" v-model:value="formData.sku" clearable
                @clear="onSubmit" placeholder="请输入SKU查询,多个SKU间用逗号隔开，最多支持200个"></a-input>
            </div>
            <a-button type="primary" class="ml-[10px]" @click="onSubmit()">查询</a-button>
          </div>
        </a-form-item>
        <a-form-item label="排序方式：">
          <div class="flex align-start">
            <a-button v-for="item in strList" :key="item.prop" style="margin: 0 10px;"
              :type="item.prop === active.prop ? 'primary' : ''" @click="storChange(item)">
              <span>{{ item.label }}</span>
              <AsyncIcon icon="CaretUpOutlined" v-if="item.prop === active.prop && active.type == 'bottom'" />
              <AsyncIcon icon="CaretDownOutlined" v-if="item.prop === active.prop && active.type == 'top'" />
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card class="my-2.5">
      <div style="width: 100%; height: 38px">
        <a-row :gutter="10" class="mb8">
          <a-col :span="1.5">
            <a-button type="primary" @click="add">创建产品</a-button>
          </a-col>
          <a-col :span="1.5">
            <a-dropdown :disabled="selectedRowList.length === 0">
              <template #overlay>
                <a-menu @click="handleMenuClick">
                  <a-menu-item key="title">
                    批量修改标题
                  </a-menu-item>
                  <a-menu-item key="vat">
                    批量修改税额
                  </a-menu-item>
                  <a-menu-item key="stock">
                    批量修改库存
                  </a-menu-item>
                  <a-menu-item key="price">
                    批量修改售价
                  </a-menu-item>
                  <a-menu-item key="oldPrice">
                    批量修改原价
                  </a-menu-item>
                  <a-menu-item key="minPrice">
                    批量修改最低价
                  </a-menu-item>
                  <a-menu-item key="weight">
                    批量修改重量
                  </a-menu-item>
                  <a-menu-item key="size">
                    批量修改尺寸
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button>
                批量操作
              </a-button>
            </a-dropdown>
          </a-col>
          <a-col :span="1.5">
            <a-button type="primary" @click="addRemark()" :disabled="selectedRowList.length === 0">批量修改备注</a-button>
          </a-col>
          <a-col :span="1.5">
            <a-button type="primary" :disabled="selectedRowList.length !== 1">编 辑</a-button>
          </a-col>

          <a-col :span="1.5">
            <a-popconfirm title="确定下架吗？" @confirm="deactivate">
              <a-button type="primary" :disabled="selectedRowList.length === 0"
                :loading="deactivateLoading">批量归档</a-button>
            </a-popconfirm>
          </a-col>

          <a-col :span="1.5">
            <a-popconfirm title="删除代表该产品在ozon平台删除，确定删除吗？" @confirm="del()">
              <a-button type="primary" danger :disabled="selectedRowList.length === 0" :loading="delLoading">删
                除</a-button>
            </a-popconfirm>
          </a-col>
          <a-col :span="1.5">
            <a-button type="primary" @click="editPriceVisible = true">数据采集</a-button>
          </a-col>
        </a-row>
      </div>
      <a-table :row-selection="rowSelection" :rowKey="(row) => row" :data-source="tableData" bordered :columns="columns"
        :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            <div class="flex text-left">
              <a-image :width="100" :src="record.primaryImage" />
              <div class="ml-2.5 block">
                <a-tooltip class="item" effect="dark" :title="record.name" placement="top"
                  style="overflow-wrap: break-word">
                  <div>{{ record.name }}</div>
                </a-tooltip>
                <div style="color: #999; float: left">
                  店铺: {{ record.simpleName }}
                </div>
                <br />
                <div :style="{
                  color: record.remarkColor ? 'green' : 'red',
                  float: 'left',
                }">
                  备注:{{ record.remark }}
                </div>
              </div>
            </div>
          </template>
          <template v-if="column.dataIndex === 'waitState'">
            <a-tag color="success" v-if="record.waitState == 'published'">{{ state[record.waitState] }}</a-tag>
            <a-tag color="warning" v-else-if="record.waitState == 'wait_publish'">{{ state[record.waitState]
            }}</a-tag>
            <a-tag color="error" v-else-if="record.waitState == 'publish_failed'">{{ state[record.waitState]
            }}</a-tag>
          </template>
          <template v-if="column.dataIndex === 'sku'">
            <div class="text-left">
              <div v-for="(item, index) in displayedSkus(record)" :key="index">
                SKU： <span>{{ item.offerId }}</span>
                <a-divider type="vertical"></a-divider>
                原价：<span style="color: #9e9f9e">{{ item.oldPrice }}</span>
                当前售价：<span style="color: #9e9f9e">{{ item.price }}</span>
                <a-divider type="vertical"></a-divider>
                库存：
                <a-tooltip style="margin-right:10px" effect="dark" v-if="item.warehouse">
                  <template #title>
                    <span>{{ item.warehouse[0].warehouseName }}</span>:
                    <span>{{ item.warehouse[0].present }}</span>
                  </template>
                  <span style="color: #3c8dbc">{{ item.stock }}</span>
                </a-tooltip>
                <span v-else style="color: #3c8dbc;margin-right:10px">{{ item.stock }}</span>
              </div>
              <div v-if="record.skuList && record.skuList.length > 3">
                <a-button type="text" @click="record.show = !record.show">共{{ record.skuList && record.skuList.length
                }}条SKU，{{
                    !record.show ? "展开" : "收起"
                  }}</a-button>
              </div>
            </div>
          </template>
          <template v-if="column.dataIndex === 'createTime'">
            <div class="flex items-start flex-col">

              <div>
                创建时间：<span style="color: #9e9f9e">{{
                  record.createTime
                }}</span>
              </div>
              <div>
                更新时间：<span style="color: #9e9f9e">{{
                  record.updateTime
                }}</span>
              </div>
            </div>


          </template>
          <template v-if="column.dataIndex === 'option'">
            <a-row :gutter="3">
              <a-col :span="8">
                <a-button type="link" @click.stop="publish(record)">发布</a-button>
              </a-col>
              <a-col :span="8">
                <a-button @click.stop="edit(record)" type="text" v-if="record.listState !== '档案'">编辑</a-button>
              </a-col>
              <a-col :span="8">
                <a-button type="text" @click="addRemark(record)">备注</a-button>
              </a-col>
              <a-col :span="8">
                <a-popconfirm title="确定删除吗？" @confirm="del(record)">
                  <a-button type="link" danger>删除</a-button>
                </a-popconfirm>
              </a-col>
            </a-row>
          </template>
        </template>
      </a-table>
      <a-pagination style="margin: 20px 0 10px 0; text-align: right" :show-total="(total) => `共 ${total} 条`"
        v-model:current="paginations.pageNum" v-model:pageSize="paginations.pageSize" :total="paginations.total"
        class="pages" :show-quick-jumper="true" @change="getList" :showSizeChanger="true"
        :pageSizeOptions="[50, 100, 200]" />
    </a-card>
    <editRemark :remarkVisible="remarkVisible" :remarkId="remarkId" @backCloseRemark="backCloseRemark"></editRemark>
    <dataCrawli :editPriceVisible="editPriceVisible" @handleDataCrawliClose="editPriceVisible = false"></dataCrawli>
  </div>
</template>

<script setup name='waitPublish'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import { accountCache } from "../config/api/product";
import { ozonProductList, ozonProductDel } from "../config/api/waitProduct";
import tableHeard from "../config/tabColumns/waitPublish"
import editRemark from './comm/editRemark.vue';
import { message } from 'ant-design-vue';
import dataCrawli from './comm/dataCrawli.vue';

const formData = reactive({
  offerId: "",
  account: "",
  sku: "",
  name: "",
  prop: "created_time",
  order: "desc",
  state: ""
})
const paginations = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0,
});
const shopAccount = ref([])
const actives = ref(1);
const selectedRowList = ref([])
const tableData = ref([])
let columns = tableHeard
const deactivateLoading = ref(false)
const delLoading = ref(false)
const loading = ref(false)
const remarkVisible = ref(false)
const editPriceVisible = ref(false)
const remarkId = ref([])
const state = {
  wait_publish: "待发布",
  published: "已发布",
  publish_failed: "发布失败",
}
const shopObj = {
  fieldKey: "account",
  fieldLabel: "simpleName",
}

const searchType = [
  {
    label: "标题",
    prop: 1,
  },
  {
    label: "SKU",
    prop: 2,
  }
]
const active = ref({
  label: "按创建时间",
  value: "created_time",
  type: "top",
  prop: 1,
  isDefault: true,
}); // 默认按创建时间查询
const strList = ref([
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
]);

const rowSelection = {
  onChange: (selectedRow) => {
    console.log('selectedRow', selectedRow);

    selectedRowList.value = selectedRow;
  },
};
const add = () => {
  window.open("productPublish", '_blank');
}
// 店铺单选多选
const selectAll = () => {
  formData.account = ""
  getList();
}
const selectItem = (val) => {
  formData.account = val
  getList();
}

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
}

// 表单搜索
const onSubmit = () => { getList() }

// 店铺数据
const getAccount = () => {
  accountCache().then((res) => {
    if (res.data) {
      shopAccount.value = res?.data ?? [];
      getList();
    }
  });
}


// 下架商品
const deactivate = (row = {}) => {
  let id = [];
  if (Object.keys(row).length == 0) {
    for (let i = 0; i < selectedRowList.value.length; i++) {
      if (selectedRowList.value[i].state == "已归档") {
        message.error("已归档商品不可重复归档，请取消！");
        return;
      }
    }
    id = syncOneList.value;
  } else {
    id.push({
      account: row.account,
      productIds: [row.id],
    });
  }
  let hasEmptyData = false;
  id.forEach((item) => {
    hasEmptyData = item.productIds.some((id) => id === "");
  });
  if (hasEmptyData) {
    message.error("产品ID为空,请同步后归档！");
    return;
  }
  console.log("hasEmptyData", hasEmptyData);

  deactivateLoading.value = true;
  batchArchive({ productArchive: id })
    .then((res) => {
      message.success(res.msg);
    })
    .finally(() => {
      getList();
      deactivateLoading.value = false;
      syncOneList.value = [];
    });
}

// 单个和批量删除
const del = (row = {}) => {
  console.log('row', row);

  loading.value = true;
  let waitIds = [];
  if (Object.keys(row).length != 0) {
    waitIds.push(row.waitId);
  } else {
    waitIds = selectedRowList.value.map((item) => item.waitId);
  }
  ozonProductDel({ waitIds })
    .then((res) => {
      message.success("操作成功");
      getList();
    })
    .finally(() => {
      loading.value = false;
    });
}

const displayedSkus = (row) => {
  return row.show ? row?.skuList : row?.skuList?.slice(0, 3);
}

// 备注
const addRemark = () => {
  remarkVisible.value = true
  if (Object.keys(row).length == 0) {
    remarkId.value = selectedRowList.value;
  } else {
    let remarkObj = {
      account: row.account,
      offerIds: [row.offerId],
    };
    remarkId.value.push(remarkObj);
  }
}

// 备注弹窗关闭
const backCloseRemark = () => {
  remarkVisible.value = false;
  selectedRowList.value = [];
  remarkId.value = [];
  getList();
}
const edit = (row = {}) => {
  let newRow = Object.keys(row).length != 0 ? row : selectedRowList.value[0];
  console.log('newRow', newRow);

  window.open("editWaitProduct" + `?id=${newRow.waitId}&account=${newRow.account}`, '_blank');

}
const getList = () => {
  loading.value = true;
  ozonProductList(formData)
    .then((res) => {
      tableData.value =
        res?.rows.map((item) => {
          item.show = false;
          return item;
        }) || [];
      paginations.total = res?.total || 0;
    })
    .finally(() => {
      loading.value = false;
    });
}
onMounted(() => {
  getAccount()
})
</script>
<style lang="less" scoped></style>