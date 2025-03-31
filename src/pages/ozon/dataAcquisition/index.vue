<template>
  <div id="dataAcquisitionCont">
    <a-card class="mt-2.5 text-left" title="数据搬家任务流程图">
      <a-steps v-model:current="current" type="navigation" :items="stepsList"></a-steps>
    </a-card>
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
              allowClear @clear="onSubmit"></a-input>
              <a-input v-if="actives == 2" style="width: 400px;" v-model:value="formData.sku" allowClear
                @clear="onSubmit" placeholder="请输入SKU查询,多个SKU间用逗号隔开，最多支持200个"></a-input>
              <a-input v-if="actives == 3" style="width: 400px;" allowClear v-model:value="formData.offerId"
                @clear="onSubmit" placeholder="请输入产品ID查询,多个ID间用逗号隔开，最多支持200个"></a-input>
            </div>
            <a-button type="primary" class="ml-[10px]" @click="onSubmit">查询</a-button>
          </div>
        </a-form-item>
        <a-form-item label="产品状态:">
          <div class="fBox flex align-start ml-[10px]">
            <a-button @click="productSelectTypes(item.prop)" class="mr-[10px]"
              :type="item.prop === prodActives ? 'primary' : ''" v-for="(item, index) in productType" :key="index">{{
                item.label }}</a-button>
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
    <a-card style="margin: 10px 0">
      <div style="width: 100%; height: 38px">
        <a-row :gutter="10" class="mb8">
          <a-col :span="1.5">
            <a-button type="primary" :disabled="selectedRows.length === 0">批量认领</a-button>
          </a-col>
        </a-row>
      </div>
      <div class="flex items-baseline justify-between">
        <a-tabs v-model:activeKey="activeName" type="card" style="width: 800px;" @tab-click="handleClick">
          <a-tab-pane :key="item.name" v-for="item in tabList" :tab="item.label + `(${item.value})`">
          </a-tab-pane>
        </a-tabs>
        <a-pagination style="margin: 20px 0 10px 0; text-align: right" :show-total="(total) => `共 ${total} 条`"
          v-model:current="paginations.pageNum" v-model:pageSize="paginations.pageSize" :total="paginations.total"
          class="pages" :show-quick-jumper="true" @change="getList" :showSizeChanger="true"
          :pageSizeOptions="[50, 100, 200]" />
      </div>
      <div class="outContent" v-loading="loading">
        <div class="topHeader">
          <a-checkbox style="margin-right: 90px;" v-model:checked="allChecked" @change="allChangeBox"></a-checkbox>
          <a-table style="width: 100%;height: 38px;" class="fixedTable" :columns="dropCol">
          </a-table>
        </div>
        <div v-if="selectedRows.length != 0" class="h-7.5 pl-5 lh-7.5 text-left" style="background-color: #ffffcd;">
          已选中{{ selectedRows.length }}条数据
        </div>
        <div v-if="tableData.length == 0">
          <a-empty class="flex flex-col justify-center" :image-size="200" style="height: 100vh;"></a-empty>
        </div>
        <div v-else v-for="(tbItem, index) in tableData" :key="tbItem.id" class="loopTable">
          <div class="loopTable-head" :key="tbItem.id">
            <a-checkbox v-model:checked="tbItem.tabAllChecked" @change="changeBox($event, tbItem, index)"
              class="mr-[10px]"></a-checkbox><span>总产品({{
                tbItem.count }})</span>
          </div>
          <a-table :data-source="tbItem.children" style="width: 100%;" row-key="id" :showHeader="false" bordered
            :columns="dropCol" :pagination="false" :data-index="index" ref="OzonProduct">
            <template #bodyCell="{ column, record }">
              <div v-if="column.dataIndex === 'name'" class="flex">
                <a-checkbox style="margin:0 10px;" @change="handelChecked($event, tbItem, record)"
                  v-model:checked="record.checked"></a-checkbox>
                <div class="flex text-left items-center">
                  <a-image style="width: 100px; height: 100px;" :src="record.primaryImage ? record.primaryImage : record.images[0]
                    ">
                  </a-image>
                  <div style="margin-left: 10px; display: block">
                    <a-tooltip class="item">
                      <template #title>
                        <span>{{ record.name }}</span>
                      </template>
                      <div class="w-110 truncate">{{ record.name }}</div>
                    </a-tooltip>
                    <div style="color: #999; float: left">
                      产品ID：<a style="color: #1677ff" href="#" @click="jumpTo(record.sku)">{{
                        record.sku }}</a>
                    </div>
                    <br />
                    <div style="color: #999; float: left">
                      店铺: {{ record.simpleName }}
                    </div>
                    <br />
                    <div style="color: #428bca; float: left; cursor: pointer" @click="
                      showChildren(
                        record.account,
                        tbItem.attributeId,
                        record.typeId
                      )
                      ">
                      已合并:{{ tbItem.count }}
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
              </div>
              <div v-if="column.dataIndex === 'state'">
                <a-tag :bordered="false" color="processing" v-if="record.state === '平台审核'">{{
                  record.state
                }}</a-tag>
                <a-tag :bordered="false" color="success" v-if="record.state === '在售'">{{ record.state
                  }}</a-tag>
                <a-tag :bordered="false" color="warning" v-if="record.state === '审核不通过'">{{ record.state
                  }}</a-tag>
                <a-tag :bordered="false" color="error" v-if="record.state === '准备出售'">{{ record.state
                  }}</a-tag>
                <a-tag :bordered="false" color="default" v-if="record.state === '已归档'">{{ record.state
                  }}</a-tag>
              </div>
              <div v-if="column.dataIndex === 'sku'" style="text-align: left">
                <div>
                  <div>
                    SKU: {{ record.offerId }}
                    <a-divider type="vertical"></a-divider>
                    促销活动价：<span style="color: #1677ff">{{
                      record.marketingPrice ? record.marketingPrice : "暂未参加活动"
                    }}</span>
                    <a-divider type="vertical"></a-divider>
                    库存：
                    <a-tooltip style="margin-right: 10px" effect="dark" placement="top" v-if="record.warehouse">
                      <template #title>
                        <div v-for="(item, index) in record.warehouse" :key="index">
                          <span>{{ item.warehouseName }}</span>:
                          <span>{{ item.present ? item.present : 0 }}</span>
                        </div>
                      </template>
                      <span style="color: #1677ff">{{ record.stock }}</span>
                    </a-tooltip>
                    <span v-else style="color: #1677ff; margin-right: 10px">{{
                      record.stock
                    }}</span>
                    <AsyncIcon style="cursor: pointer; color: #1677ff" icon="EditOutlined" v-if="
                      record.state != '审核不通过' && record.state != '已归档'
                    " @click="editStock(record)"></AsyncIcon>
                  </div>
                  <div>
                    最低价：<span style="color: #1677ff"
                      v-if="record.minPrice && !(minPriceVisible && itemId == record.id)">CNY {{
                        record.minPrice
                      }}</span><span v-if="!record.minPrice">---</span>
                    <div v-if="minPriceVisible" class="inline-block">
                      <a-input type="number" class="mr-2.5 w-30" v-model:value="record.minPrice"
                        placeholder="请输原价格"></a-input>
                      <a-button class="mr-2.5" @click="minPriceVisible = false">取消</a-button>
                      <a-button type="primary" :loading="loading"
                        @click="checkOldPrice(record, '', '', record.minPrice)">确定</a-button>
                    </div>
                    <AsyncIcon v-if="!(minPriceVisible && itemId == record.id) && record.minPrice"
                      style="cursor: pointer; color: #1677ff" icon="EditOutlined" @click="handelEditminPrice(record)">
                    </AsyncIcon>
                    <a-divider type="vertical"></a-divider>
                    原价：<span style="color: #1677ff" v-if="!(singleVisible && itemId == record.id)">CNY {{
                      record.oldPrice
                    }}</span>
                    <div v-else class="inline-block">
                      <a-input type="number" class="mr-2.5 w-30" v-model:value="record.oldPrice"
                        placeholder="请输原价格"></a-input>
                      <a-button class="mr-2.5" @click="singleVisible = false">取消</a-button>
                      <a-button type="primary" :loading="loading"
                        @click="checkOldPrice(record, record.oldPrice)">确定</a-button>
                    </div>
                    <AsyncIcon v-if="!(singleVisible && itemId == record.id)" style="cursor: pointer; color: #1677ff"
                      icon="EditOutlined" @click="handelEditPrice(record)">
                    </AsyncIcon>
                    <a-divider type="vertical"></a-divider>
                    当前售价：<span style="color: #1677ff" v-if="!(priceVisible && itemId == record.id)">CNY {{ record.price
                      }}</span>
                    <div v-else class="inline-block">
                      <a-input type="number" class="mr-2.5 w-30" v-model:value="record.price"
                        placeholder="请输原价格"></a-input>
                      <a-button class="mr-2.5" @click="priceVisible = false">取消</a-button>
                      <a-button type="primary" :loading="loading"
                        @click="checkOldPrice(record, '', record.price)">确定</a-button>
                    </div>
                    <AsyncIcon v-if="!(priceVisible && itemId == record.id)" icon="EditOutlined"
                      style="cursor: pointer; color: #1677ff" @click="editSinglePrice(record)">
                    </AsyncIcon>
                  </div>
                  <div>
                    <div style="display: flex">
                      <span>内容质量分:</span>
                      <div v-if="record.productsScore">
                        <a-popover placement="right" :overlayInnerStyle="{ width: '400px' }" trigger="click">
                          <template #content>
                            <div class="scoreItem">
                              <div class="flex justify-between">
                                <div>
                                  <span style="font-weight: bold">
                                    搜索属性</span>
                                  <a-tooltip placement="right" :overlayInnerStyle="{ width: '300px' }" color="#fff">
                                    <template #title>
                                      <span class="m-2.5 font-black text-black">{{
                                        discLists[0].title }}
                                      </span>
                                      <br />
                                      <div v-for="(e, ind) in discLists[0].list" :key="ind"
                                        class="m-2.5 flex justify-between text-black">
                                        <span>{{ e.sock }}</span><span>{{
                                          e.disc }}</span>
                                      </div>
                                    </template>
                                    <AsyncIcon icon="QuestionCircleOutlined" class="ml-2.5" />
                                  </a-tooltip>
                                </div>
                                <div>
                                  <span>分数:</span><span>{{
                                    record.productsScore[0].groups[0].score
                                  }}分</span>
                                </div>
                              </div>
                              <div>
                                <span style="color: #999">至少填写{{
                                  record.productsScore[0].groups[0]
                                    .improveAtLeast
                                }}个属性可得最大分数</span>
                                <ul>
                                  <li v-for="(item, index) in record
                                    .productsScore[0].groups[0]
                                    .improveAttributes" :key="index">
                                    {{ item.name }}
                                  </li>
                                </ul>
                              </div>
                            </div>

                            <div class="scoreItem">
                              <div class="flex justify-between">
                                <div><span style="font-weight: bold">其他属性</span>
                                  <a-tooltip placement="right" :overlayInnerStyle="{ width: '300px' }" color="#fff">
                                    <template #title>
                                      <span class="m-2.5 font-black text-black">{{
                                        discLists[1].title }}
                                      </span>
                                      <br />
                                      <div v-for="(e, ind) in discLists[1].list" :key="ind"
                                        class="m-2.5 flex justify-between text-black">
                                        <span>{{ e.sock }}</span><span>{{
                                          e.disc }}</span>
                                      </div>
                                    </template>
                                    <AsyncIcon icon="QuestionCircleOutlined" class="ml-2.5" />
                                  </a-tooltip>
                                </div>
                                <div>
                                  <span>分数:</span><span>{{
                                    record.productsScore[0].groups[1].score
                                  }}分</span>
                                </div>
                              </div>
                              <div>
                                <span style="color: #999">至少填写{{
                                  record.productsScore[0].groups[1]
                                    .improveAtLeast
                                }}个属性可得最大分数</span>
                                <ul>
                                  <li v-for="(item, index) in record
                                    .productsScore[0].groups[1]
                                    .improveAttributes" :key="index">
                                    {{ item.name }}
                                  </li>
                                </ul>
                              </div>
                            </div>

                            <div class="scoreItem">
                              <div class="flex justify-between">
                                <div><span style="font-weight: bold">描述和丰富内容</span>
                                  <a-tooltip placement="right" :overlayInnerStyle="{ width: '300px' }" color="#fff">
                                    <template #title>
                                      <span class="m-2.5 font-black text-black">{{
                                        discLists[2].title }}
                                      </span>
                                      <br />
                                      <div v-for="(e, ind) in discLists[2].list" :key="ind"
                                        class="m-2.5 flex justify-between text-black">
                                        <span>{{ e.sock }}</span><span>{{
                                          e.disc }}</span>
                                      </div>
                                    </template>
                                    <AsyncIcon icon="QuestionCircleOutlined" class="ml-2.5" />
                                  </a-tooltip>
                                </div>
                                <div>
                                  <span>分数:</span><span>{{
                                    record.productsScore[0].groups[2].score
                                  }}分</span>
                                </div>
                              </div>
                              <div>
                                <span style="color: #999">至少填写{{
                                  record.productsScore[0].groups[2]
                                    .improveAtLeast
                                }}个属性可得最大分数</span>
                                <ul>
                                  <li v-for="(item, index) in record
                                    .productsScore[0].groups[2]
                                    .improveAttributes" :key="index">
                                    {{ item.name }}
                                  </li>
                                </ul>
                              </div>
                            </div>

                            <div class="scoreItem">
                              <div class="flex justify-between">
                                <div><span style="font-weight: bold">图片和视频</span>
                                  <a-tooltip placement="right" :overlayInnerStyle="{ width: '300px' }" color="#fff">
                                    <template #title>
                                      <span class="m-2.5 font-black text-black">{{
                                        discLists[3].title }}
                                      </span>
                                      <br />
                                      <div v-for="(e, ind) in discLists[3].list" :key="ind"
                                        class="m-2.5 flex justify-between text-black">
                                        <span>{{ e.sock }}</span><span>{{
                                          e.disc }}</span>
                                      </div>
                                    </template>
                                    <AsyncIcon icon="QuestionCircleOutlined" class="ml-2.5" />
                                  </a-tooltip>
                                </div>
                                <div>
                                  <span>分数:</span><span>{{
                                    record.productsScore[0].groups[3].score
                                  }}分</span>
                                </div>
                              </div>
                              <div>
                                <span style="color: #999">至少填写{{
                                  record.productsScore[0].groups[3]
                                    .improveAtLeast
                                }}个属性可得最大分数</span>
                                <ul>
                                  <li>Ozon视频： 链接</li>
                                  <li>Ozon.视频封面：链接</li>
                                </ul>
                              </div>
                            </div>
                          </template>
                          <span style="margin-left: 10px;color: #1677ff;cursor: pointer;">{{
                            record.productsScore[0].rating
                          }}分</span>
                        </a-popover>
                      </div>
                      <span v-else>{{ 0.0 }}分</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="column.dataIndex === 'errorInfo'">
                <div v-if="record.errorInfo != null">
                  <div style="display: flex">
                    <div>商品状态描述:</div>
                    <div style="margin-left: 20px; color: red">
                      {{ record.errorInfo.stateDescription }}
                    </div>
                  </div>
                  <div style="display: flex">
                    <div>
                      详细描述:
                      <a-popover :overlayInnerStyle="{ width: '1000px' }" trigger="click">
                        <template #content>
                          <a-table :pagination="false" :data-source="record.errorInfo.itemErrors &&
                            record.errorInfo.itemErrors
                            " bordered :scroll="{ x: 200, y: 300 }" :columns="errorColumns">
                          </a-table>
                        </template>
                        <a-button type="primary" :disabled="record.errorInfo.itemErrors &&
                          record.errorInfo.itemErrors.length == 0
                          " style="margin-left: 20px">更多信息</a-button>
                      </a-popover>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="column.dataIndex === 'createdAt'"
                style="display: flex;flex-direction: column;align-items: flex-start;">
                <div>
                  创建时间：<span style="color: #9e9f9e">{{
                    timestampToDateTime(record.createdTime)
                  }}</span>
                </div>
                <div>
                  更新时间：<span style="color: #9e9f9e">{{
                    timestampToDateTime(record.updatedTime)
                  }}</span>
                </div>
              </div>
              <div v-if="column.dataIndex === 'option'">
                <a-row :gutter="3">
                  <a-col :span="6">
                    <a-button type="text" @click="copyProductVis = true">认领</a-button>
                  </a-col>
                </a-row>
              </div>
            </template>
          </a-table>
        </div>
      </div>

      <a-pagination style="margin: 20px 0 10px 0; text-align: right" :show-total="(total) => `共 ${total} 条`"
        v-model:current="paginations.pageNum" v-model:pageSize="paginations.pageSize" :total="paginations.total"
        class="pages" :show-quick-jumper="true" @change="getList" :showSizeChanger="true"
        :pageSizeOptions="[50, 100, 200]" />
    </a-card>
    <!-- 复制 -->
    <copyProduct :copyProductVis="copyProductVis" @handleCopyProductClose="handleCopyProductClose">
    </copyProduct>
  </div>
</template>

<script setup name='dataAcquisition'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import { accountCache } from "../config/api/product";
import { relocationList } from '../config/api/dataAcquisition';
import tableHead from "../config/tabColumns/product"
import { dataMove, attrList, tabDicList } from "../config/commDic/defDic"
import copyProduct from "./comm/copyProduct.vue";
const paginations = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0,
});
const activeName = ref(" ")
const actives = ref(1);
const prodActives = ref(1);
const current = ref(0)
const stepsList = [
  {
    status: 'finish',
    title: '同步产品',
    disabled: true,
  },
  {
    status: 'wait',
    title: '认领产品',
    disabled: true,
  },
  {
    status: 'wait',
    title: '选择店铺',
    disabled: true,
  },
  {
    status: 'wait',
    title: '进入采集箱',
    disabled: true,
  },
]
const dropCol = tableHead
let tabList = dataMove
const productType = tabDicList
const formData = reactive({
  offerId: "",
  account: "",
  sku: "",
  name: "",
  prop: "created_time",
  order: "desc",
  state: ""
})
const shopAccount = ref([])
const tableData = ref([])
const selectedRows = ref([])
const tabQuantity = ref([])
const loading = ref(false)
const allChecked = ref(false)
const minPriceVisible = ref(false)
const editPriceVisible = ref(false)
const singleVisible = ref(false)
const priceVisible = ref(false)
const copyProductVis = ref(false)
const errorColumns = [
  {
    title: "错误字段",
    dataIndex: "attributeName",
    width: 200
  },
  {
    title: "错误描述1",
    dataIndex: "description",
    width: 200
  },
  {
    title: "错误描述2",
    dataIndex: "message",
    width: 200
  }
]
const sortObj = reactive({
  sortField: "created_time",
  sortType: "desc"
})
const shopObj = {
  fieldKey: "account",
  fieldLabel: "simpleName",
}
const active = ref({
  label: "按创建时间",
  value: "created_time",
  type: "top",
  prop: 1,
  isDefault: true,
}); // 默认按下单时间查询
const strList = ref([
  {
    label: "按更新时间",
    type: "bottom",
    value: "update_tiem",
    prop: 1,
    isDefault: false,
  },
  {
    label: "按创建时间",
    value: "created_time",
    type: "top",
    prop: 2,
    isDefault: true,
  }

]);
const searchType = [
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

const productSelectTypes = (index) => {
  prodActives.value = index;
}

// 排序方式
const storChange = (val) => {
  val.type = val.type === "top" ? "bottom" : "top";
  active.value = val;
  sortObj.sortField = val.sortField
  sortObj.sortType = val.type === "top" ? "asc" : "desc"
  getList();
};

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

// 获取店铺数据
const getList = () => {
  loading.value = true;
  let params = {
    ...formData,
    pageNum: paginations.pageNum,
    pageSize: paginations.pageSize,
  }
  relocationList(params)
    .then((res) => {
      tableData.value =
        res?.rows[0]?.productList?.map((item) => {
          item.show = false;
          return item;
        }) ?? [];
      tabQuantity.value = res?.rows[0]?.quantity ?? [];
      paginations.total = res?.total ?? 0;
    })
    .finally(() => {
      loading.value = false;
    });
}

// 标签页切换
const handleClick = activeKey => {
  formData.state = activeKey
  getList()
}

// 提取去重逻辑
const uniqueArray = (arr1, arr2) => [...new Set([...arr1, ...arr2])];
// 公共处理批量所需的数据格式
const commFn = (tableItem, type = 'single', record = {}) => {
  const existingItem = syncOneList.value.find((e) => e.account === tableItem.account);
  if (existingItem) {
    const offerIdsToAdd = type === 'single' ? [record.offerId] : tableItem.children.map((el) => el.offerId);
    const productIdsToAdd = type === 'single' ? [record.id] : tableItem.children.map((el) => el.id);

    existingItem.offerIds = uniqueArray(existingItem.offerIds, offerIdsToAdd);
    existingItem.productIds = uniqueArray(existingItem.productIds, productIdsToAdd);
  } else {
    const newOfferIds = type === 'single' ? [record.offerId] : [...new Set(tableItem.children.map((e) => e.offerId))];
    const newProductIds = type === 'single' ? [record.id] : [...new Set(tableItem.children.map((e) => e.id))];

    const newObj = {
      account: tableItem.account,
      offerIds: newOfferIds,
      productIds: newProductIds
    };
    syncOneList.value.push(newObj);
  }

  console.log('syncOneList', syncOneList.value);

}


//单个选择
const handelChecked = (e, tbItem, record) => {
  if (e.target.checked) {
    selectedRows.value.push(record)
    commFn(tbItem, 'single', record)
  } else {
    selectedRows.value = selectedRows.value.filter(item => item.id !== record.id);
    syncOneList.value = syncOneList.value.map(item => {
      if (item.account === record.account) {
        item.offerIds = item.offerIds.filter(id => !(id == record.offerId));
        item.productIds = item.productIds.filter(id => !(id == record.id));
      }
      return item;
    });
  }
  const checkItem = tbItem.children.every((child) =>
    child.checked
  );
  tbItem.tabAllChecked = checkItem
}

// 数据全选
const allChangeBox = (e) => {
  const isChecked = e.target.checked;
  if (isChecked) {
    // 清空 selectedRows
    if (selectedRows.value.length > 0) {
      selectedRows.value = [];
    }
    // 遍历 tableData 并添加符合条件的子元素
    tableData.value.forEach((item) => {
      item.tabAllChecked = true;
      item.children.forEach((child) => {
        child.checked = true;
        selectedRows.value.push(child);
      });
      commFn(item, 'multiple')
    });
    console.log('syncOneList', syncOneList.value);

  } else {
    // 取消选中时，移除所有相关子元素
    tableData.value.forEach((item) => {
      item.tabAllChecked = false;
      item.children.forEach((child) => {
        child.checked = false;
        selectedRows.value = selectedRows.value.filter(row => row.id !== child.id);
      });
    });
  }
  console.log('selectedRows*-*', selectedRows.value);

}

// 总产品全选
const changeBox = (e, tbItem, index) => {
  tbItem.children.forEach((child) => child.checked = tbItem.tabAllChecked);
  allChecked.value = tableData.value.every(item => item.tabAllChecked)
  if (tbItem.tabAllChecked) {
    tbItem.children.forEach((child) => selectedRows.value.push(child));
    commFn(tbItem, 'multiple')
  } else {
    tbItem.children.forEach((child) => selectedRows.value = selectedRows.value.filter(item => item.id !== child.id));
    syncOneList.value = syncOneList.value.map(item => {
      if (item.account === tbItem.account) {
        const childrenOfferIds = tbItem.children.map(child => child.offerId);
        const childrenProductIds = tbItem.children.map(child => child.id);
        item.offerIds = item.offerIds.filter(id => !childrenOfferIds.includes(id));
        item.productIds = item.productIds.filter(id => !childrenProductIds.includes(id));
      }
      return item;
    });
  }
}

const timestampToDateTime = (timestamp) => {
  if (timestamp == null || timestamp == "") {
    return "无";
  }
  return timestamp;
}

const handleCopyProductClose = () => {
  copyProductVis.value = false
}


onMounted(() => {
  getAccount()
})
</script>
<style lang="less" scoped>
.outContent {
  border: 1px solid #ccc;
  width: 100%;

  .el-loading-mask {
    top: -5%;
  }
}

:deep(.topHeader) {
  display: flex;
  //background-color: #fff;
  padding: 0 0 0 20px;
  height: 40px;
  align-items: center;
  border-bottom: 1px solid #ccc;

  .ant-spin-nested-loading {
    width: 100%;
  }

  .ant-table {
    .ant-table-thead tr th {
      background-color: #fff !important;
    }

    .ant-table-tbody {
      display: none;
    }
  }

  div {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
}

.loopTable {
  display: flex;
  flex-direction: column;
  align-items: baseline;

  &-head {
    width: -webkit-fill-available;
    // background-color: #f5f5f5;
    height: 50px;
    display: flex;
    padding-left: 20px;
    align-items: center;

    .el-checkbox {
      margin-right: 20px;
    }
  }

  .el-table {
    border-bottom: none;
  }
}

:deep(.fixedTable) {
  height: 38px;

  table {
    height: 38px;
  }
}
</style>