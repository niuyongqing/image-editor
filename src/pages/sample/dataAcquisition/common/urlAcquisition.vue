<template>
<div id="urlAcquisition" class="urlAcquisition text-left">
  <a-card class="text-left my-2.5">
    <template #title>
      采集地址--单品采集（目前仅支持插件采集，请
      <span 
        style="font-weight: 700; color: #1677ff; cursor: pointer;"
        @click="loadDescribe"
      >下载采集插件</span>
      ！）
    </template>
    <!-- <a-textarea v-model:value="dataUrl.url" placeholder="请填写产品的网址,多个网址用Enter换行" :auto-size="{ minRows: 7 }" />
    <div class="flex mt-2.5 justify-between">
      <div>
        <span style="color: #999;">您还未安装采集插件，建议使用</span>
        <span style="color: #1677ff;cursor: pointer;">采集插件</span><span style="color: #999;">，功能更稳定更快速！</span><span
          style="color: #1677ff;cursor: pointer;" @click="showTeps = true">如何使用插件采集>></span>
      </div>
      <div>
        <a-button type="primary" @click="acquisition">开始采集</a-button>
        <a-button class="ml-2.5" @click="clearArea">清空</a-button>
      </div>
    </div> -->
    <div class="mt-2.5">
      <a-form ref="ruleForm" :model="formData" :labelCol="{ span: 1 }">
        <a-form-item label="数据来源：">
          <div class="flex justify-between">
            <selectComm 
              class="ml-2.5" 
              :options="formBtnInfo.shopAccount" 
              :fieldObj="shopObj" 
              @backSelectAll="selectAll"
              @backSelectItem="selectItem"
            ></selectComm>
            <a-button @click="isShowSearch = !isShowSearch">{{ isShowSearch ? '收起' : '展开' }}</a-button>
          </div>
        </a-form-item>
        <a-form-item label="搜索类型:" v-show="isShowSearch">
          <div class="fBox flex align-start ml-2.5">
            <a-button 
              @click="selectTypes(item.prop)" 
              class="mr-2.5" 
              :type="item.prop === actives ? 'primary' : ''"
              v-for="(item, index) in formBtnInfo.searchType" 
              :key="index"
            >{{ item.label }}</a-button>
          </div>
        </a-form-item>
        <a-form-item label="搜索内容：" v-show="isShowSearch">
          <div class="searchs flex">
            <div class="searchInputs flex align-start ml-2.5">
              <a-input 
                v-if="actives == 1" 
                style="width: 400px;" 
                v-model:value="formData.name" 
                placeholder="请输入标题查询"
                allowClear 
                @clear="onSubmit"
              ></a-input>
              <a-input 
                v-if="actives == 2" 
                style="width: 400px;" 
                v-model:value="formData.url" 
                allowClear
                @clear="onSubmit" 
                placeholder="请输入url"
              ></a-input>
            </div>
            <a-button type="primary" class="ml-2.5" @click="onSubmit(true)">查询</a-button>
          </div>
        </a-form-item>
        <a-form-item label="采集时间：" v-show="isShowSearch">
          <selectComm 
            class="ml-2.5" :options="formBtnInfo.acquisitionTimes" 
            :fieldObj="timeObj" 
            @backSelectAll="selectTimeAll"
            @backSelectItem="selectTimeItem"
          ></selectComm>
        </a-form-item>
        <a-form-item label="时间选择：" v-show="formData.time === 'customize'">
          <a-range-picker 
            class="ml-2.5" 
            v-model:value="formData.searchTime" 
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="pickerChange"
          />
        </a-form-item>
        <a-form-item label="备注：" v-show="isShowSearch">
          <a-select
            v-model:value="formData.isRemark" 
            class="ml-2.5" 
            style="width: 150px"
            @select="isRemarkSelect"
          >
            <a-select-option value="1">有备注</a-select-option>
            <a-select-option value="0">无备注</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </div>
  </a-card>
  <a-card :loading="tableInfo.spinning">
    <div class="flex my-2.5">
      <a-space>
        <a-button @click="claim('acquisition')" type="primary">批量认领</a-button>
        <a-dropdown :trigger="['click']">
          <a-button type="primary" @click.prevent>
            批量操作
            <AsyncIcon icon="DownOutlined" class="ml-2.5" />
          </a-button>
          <template #overlay>
            <a-menu @click="({key}) => dropdownClick(key, tableInfo.selectedRowKeys)">
              <a-menu-item key="remarkModal">批量备注</a-menu-item>
              <a-menu-item key="del">批量删除</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-dropdown 
          :trigger="['click']"
          :destroyPopupOnHide="true"
          overlayClassName="urlAcquisition-typeTree_overlay"
        >
          <a-button type="primary" @click.prevent>
            移动分类
            <AsyncIcon icon="DownOutlined" class="ml-2.5" />
          </a-button>
          <template #overlay>
            <typeTree :platform="'ozon'" @nodeClick="typeNodeClick"></typeTree>
          </template>
        </a-dropdown>
      </a-space>
    </div>
    <a-tabs 
      v-model:activeKey="activeName" 
      style="width: 800px;"
      @change="tabsChange"
    >
      <a-tab-pane :key="item.prop" v-for="item in formBtnInfo.tabList">
        <template #tab>
          {{ item.label + `(${item.value})` }}
          <a-tooltip :overlayInnerStyle="{ width: '300px' }" color="#fff" placement="right">
            <template #title>
              <span class=" text-black">通用采集箱超过180天的采集数据将会被删除，请及时认领
              </span>
            </template>
            <AsyncIcon v-if="item.prop === 1" icon="QuestionCircleOutlined" class="ml-2.5" />
          </a-tooltip>
        </template>
      </a-tab-pane>
    </a-tabs>

    <a-table
      :data-source="tableInfo.data" 
      style="width: 100%;" 
      bordered 
      :columns="columns" 
      :pagination="false"
      ref="OzonProduct" 
      :row-selection="rowSelection" 
      :rowKey="(row) => row"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'imageList'">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <a-image :width="60" :src="record.imageList[0]" />
            <a-button @click="openUrl(record.originUrl)" type="link">{{ getSimpleName(record.platform) }}</a-button>
          </div>
        </template>
        <template v-else-if="column.dataIndex == 'productTitle'">
          <div style="display: flex; flex-direction: column;">
            <div>{{ record[column.dataIndex] }}</div>
            <div :style="record.remark ? `color: ${record.remark?.color};`:''">{{ record.remark ? `备注：${record.remark.content}`:'' }}</div>
          </div>
        </template>
        <template v-else-if="column.dataIndex == 'simpleDesc'">
          <a-tooltip 
            overlayClassName="rowBox-simpleDesc"
          >
            <template #title>
              <div 
                v-for="(val, key) in record.simpleDescTips"
                :key="key"
                class="rowBox-simpleDesc-tip-item"
              >
                {{ `${key}： ${val}` }}
              </div>
            </template>
            <div style="width: 200px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
              {{ record.simpleDesc }}
            </div>
          </a-tooltip>
        </template>
        <template v-else-if="column.dataIndex === 'currentPrice'">
          <span>{{ `${record.priceInfo.currencySymbol ? record.priceInfo.currencySymbol:''}${record.priceInfo.currentPrice}(${record.priceInfo.currency})` }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'option'">
          <div class="option-btn-box">
            <div class="option-btn" @click="claim('acquisition', record)">认领</div>
            <div class="option-btn" @click="openModal('acquisitionEdit', [record])">编辑</div>
            
            <a-dropdown>
              <div class="option-btn" type="link" @click.prevent>
                更多
                <AsyncIcon icon="DownOutlined" />
              </div>
              <template #overlay>
                <a-menu @click="({ key }) => dropdownClick(key, [record])">
                  <a-menu-item key="remarkModal">添加备注</a-menu-item>
                  <a-menu-item key="del">删除</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </template>
        <template v-else>
          <span>{{ record[column.dataIndex] }}</span>
        </template>
      </template>
    </a-table>
    <a-pagination 
      style="margin-top: 20px;text-align: right;" 
      :show-total="(total) => `共 ${total} 条`"
      v-model:current="pages.pageNum" 
      v-model:pageSize="pages.pageSize" 
      :total="tableInfo.total" 
      class="pages"
      :defaultPageSize="50" 
      :showSizeChanger="true" 
      :pageSizeOptions="[50, 100, 200]" 
      @change="pageChange"
    />
  </a-card>
  <!-- 弹窗组件 -->
  <component
    :is="modalInfo.name" 
    v-model:modalOpen="modalInfo.open"
    :modalData="modalInfo.data"
    @addRemark="addRemark"
  ></component>
  
  <!-- 认领弹窗 -->
  <ClaimModal v-model:open="openClaimModal" :claim-type="claimType" @draft="showEditCategoryModal" />

  <!-- 编辑采集箱弹窗 -->
  <EditCategoryModal ref="editCategoryModalRef" @edit="receiveProductToWaitPublish" />
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect, markRaw } from 'vue';
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import ClaimModal from './ClaimModal.vue';
import EditCategoryModal from './editCategoryModal.vue';
import remarkModal from './remarkModal.vue';
import acquisitionEdit from '@/pages/sample/dataAcquisition/common/acquisitionEdit/index.vue'
import typeTree from '~@/components/classificationTree/typeTree.vue';
// import { dataGathe } from "../../../ozon/config/commDic/defDic"
import { collectProductList, deleteProduct, productStatCount, updateCategoryProduct } from '../js/api';
import { receiveProductToWaitPublishApi } from '@/pages/ozon/config/api/draft.js';
import { acquisitionHeader } from '../js/header';
import { timestampToDateTime } from '~@/pages/lazada/fullyProduct/common';
import dayjs from 'dayjs';
import { message, Modal } from 'ant-design-vue';

defineOptions({ name: "urlAcquisition" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['loadDescribe'])
const formBtnInfo = {
  tabList: [
    {
      label: "全部",
      code: "allCount",
      value: 0,
      prop: 1,
    },
    {
      label: "未认领",
      code: "notReceiveCount",
      value: 0,
      prop: 2,
    },
    {
      label: "已认领",
      code: "receiveCount",
      value: 0,
      prop: 3,
    },
  ],
  shopAccount: [
    {
      account: "shopee",
      simpleName: "Shopee"
    },
    {
      account: "alibaba",
      simpleName: "阿里巴巴国际站"
    },
    {
      account: "amazaon",
      simpleName: "Amazon"
    },
    {
      account: "taobao",
      simpleName: "淘宝"
    },
    {
      account: "tmall",
      simpleName: "天猫"
    },
    {
      account: "aliexpress",
      simpleName: "速卖通"
    },
    {
      account: "lazada",
      simpleName: "Lazada"
    },
  ],
  searchType: [
    {
      label: "标题",
      prop: 1,
    },
    {
      label: "来源URL",
      prop: 2,
    }
  ],
  acquisitionTimes: [
    {
      label: "昨天",
      value: 1,
    },
    {
      label: "今天",
      value: 0,
    },
    {
      label: "7天以内",
      value: 7,
    },
    {
      label: "30天以内",
      value: 30,
    },
    {
      label: "自定义",
      value: 'customize',
    }
  ]
}

const editCategoryModalRef = ref(null);
const rowId = ref('');
const activeName = ref(2)
const actives = ref(1)
const formData = reactive({
  platform: '',
  status: 0,
  url: "",
  name: "",
  isRemark: "",
  time: "",
  searchTime: [],
  collectTimeStart: null, 
  collectTimeEnd: null, 
})
const formParams = reactive({
  platform: '',
  status: 0,
  url: "",
  name: "",
  isRemark: "",
  time: "",
  searchTime: [],
  collectTimeStart: null, 
  collectTimeEnd: null, 
})
const tableInfo = reactive({
  data: [],
  total: 0,

  selectedRowKeys: [],
  spinning: false,
})
const modalInfo = reactive({
  open: false,
  name: null,
  components: {
    remarkModal: markRaw(remarkModal),
    acquisitionEdit: markRaw(acquisitionEdit),
  },
  data: {
    selectedRow: []
  }
})
const pages = reactive({
  pageNum: 1,
  pageSize: 50,
});
const dataUrl = reactive({
  url: '',
  iframeList: []
})
// 搜索表单展开收起
const isShowSearch = ref(true)
// const shopAccount = dataGathe
const timeObj = {
  fieldKey: "value",
  fieldLabel: "label",
}
const shopObj = {
  fieldKey: "account",
  fieldLabel: "simpleName",
}
const columns = computed(() => {
  return acquisitionHeader
})
onMounted(() => {
  tabsChange(activeName.value)
  // getProductStatCount()
})
// async function getProductStatCount() {
//   let res = await productStatCount()
//   // console.log({res});
//   formBtnInfo.tabList.forEach(item => {
//     item.value = res.data[item.code]
//   })
// }
// 下载采集插件
function loadDescribe() {
  emit('loadDescribe')
}
// 获取数据列表
async function getList() {
  let params = {
    "platform": formParams.platform, //平台名称
    "status": formParams.status,      // 状态
    "productTitle": formData.name, // 产品标题
    "originUrl": formParams.url, // 来源URL
    "collectTimeStart": formParams.collectTimeStart, // 采集时间-开始
    "collectTimeEnd": formParams.collectTimeEnd, // 采集时间-结束
    "isRemark": formParams.isRemark, // 有无备注   1:有备注  0:无备注
    // "order": "DESC", // 排序规则   ASC；正序，DESC；倒序
    // "prop": "create_time", // 排序字段   create_time ...
    "pageNum": pages.pageNum, // 分页参数
    "pageSize": pages.pageSize // 每页数量
  }
  try {
    tableInfo.spinning = true;
    let res = await collectProductList(params);
    // console.log({ res });
    res.data.forEach(item => {
      item.simpleDescTips = JSON.parse(item.simpleDesc)
    })
    tableInfo.data = res.data;
    tableInfo.total = res.total;
    let CountRes = await productStatCount(params)
    // console.log({res});
    formBtnInfo.tabList.forEach(item => {
      item.value = CountRes.data[item.code]
    })
    formBtnInfo.tabList = [...formBtnInfo.tabList]
  } catch (error) {
    console.error(error)
  }
  tableInfo.spinning = false;
  // _this.$forceUpdate()
}
const clearArea = () => {
  dataUrl.value = ""
}

// 店铺单选多选
const selectAll = () => {
  formData.platform = ""
  onSubmit()
}
const selectItem = (val) => {
  formData.platform = val
  onSubmit()
}
function isRemarkSelect(val) {
  // console.log(val, formData.isRemark);
  formData.isRemark = val
  onSubmit()
}
// 采集时间
const selectTimeAll = () => {
  formData.collectTimeStart = null
  formData.collectTimeEnd = null
  onSubmit()
  // timestampToDateTime()
}
const selectTimeItem = (val) => {
  formData.time = val
  let end = ''
  let start = ''
  switch (val) {
    case 1:
      start = dayjs().add((0 - val), 'day').format('YYYY-MM-DD') + ' ' + '00:00:00'
      end = dayjs().add((0 - val), 'day').format('YYYY-MM-DD') + ' ' + '23:59:59'
      break;
    case 0:
      start = dayjs().format('YYYY-MM-DD') + ' ' + '00:00:00'
      end = dayjs().format('YYYY-MM-DD') + ' ' + '23:59:59'
      break;
    case 7:
    case 30:
      start = dayjs().add((0 - val), 'day').format('YYYY-MM-DD') + ' ' + '00:00:00'
      end = dayjs().format('YYYY-MM-DD') + ' ' + '23:59:59'
      break;
    default:
      break;
  }
  if (val === 'customize') return;
  formData.collectTimeEnd = end
  formData.collectTimeStart = start
  onSubmit()
}
function pickerChange(val) {
  // console.log({val});
  formData.collectTimeStart = val[0] + ' ' + '00:00:00'
  formData.collectTimeEnd = val[1] + ' ' + '23:59:59'
  onSubmit()
}
// 搜索内容
const selectTypes = (index) => {
  actives.value = index;
  switch (index) {
    case 1:
      formData.url = "";
      break;
    case 2:
      formData.name = "";
      break;
    default:
      break;
  }
}

// 表单搜索
function onSubmit() {
  Object.keys(formParams).forEach(key => {
    // console.log({key});
    formParams[key] = formData[key]
  })
  pageChange(1)
}
// 表格tabs切换
function tabsChange(activeKey) {
  // console.log(activeKey);
  switch (activeKey) {
    case 1:
      formData.status = null;
      break;
    case 2:
      formData.status = 'un_receive';
      break;
    case 3:
      formData.status = 'receive';
      break;
    default:
      break;
  }
  onSubmit()
}
function pageChange(val) {
  pages.pageNum = val
  getList()
}
function batchDropdownClick({ key }) {
  let selectedRow = [...tableInfo.selectedRowKeys];
  openModal(key, selectedRow);
}
// 下拉菜单选项
function dropdownClick(key, selectedRow) {
  // console.log({ key, selectedRow });
  if (selectedRow.length < 1) return message.warning('请选择商品！')
  switch (key) {
    case 'del':
      Modal.confirm({
        content: '是否删除？',
        cancelText: '取消',
        okText: '确认',
        closable: true,
        onOk() {
          deleteProductFn(selectedRow)
        },
        onCancel() {}
      })
      break;
    default:
      openModal(key, selectedRow);
      break;
  }
}
// 批量移动分类
async function typeNodeClick(node) {
  if (tableInfo.selectedRowKeys.length < 1) return message.warning('请选择商品！')
  // console.log({ node });
  try {
    let ids = tableInfo.selectedRowKeys.map(i => i.id);
    
    let params = {
      "ids": ids.join(), // 商品信息的唯一标识(多个用英文逗号分割)
      "productCategoryId": node.id   //分类ID
    }
    await updateCategoryProduct(params)
    getList()
  } catch (error) {
    console.error(error)
  }
}
// 删除商品
async function deleteProductFn(rowList) {
  try {
    let ids = rowList.map(i => i.id).join()
    await deleteProduct({ ids })
    message.success('删除成功！')
    onSubmit();
    // getProductStatCount();
  } catch (error) {
    console.error(error)
  }
}
function openModal(key, rowList) {
  modalInfo.name = modalInfo.components[key];
  modalInfo.data.selectedRow = rowList;
  nextTick(() => {
    modalInfo.open = !modalInfo.open;
  })
}
// 添加备注完成
function addRemark() {
  getList()
}
// 表格复选框
const rowSelection = {
  onChange: (selectedRow) => {
    tableInfo.selectedRowKeys = selectedRow;
  },
};
// 跳转商品页面
function openUrl(url) {
  window.open(url)
}
// 展示平台名称
function getSimpleName(account) {
  return formBtnInfo.shopAccount.find(i => i.account === account)?.simpleName ?? ''
}

const handleOk = () => {  }

/** 认领 */
const openClaimModal = ref(false)
const claimType = ref('acquisition')
// 认领采集产品至待发布接口数据
let claimModalParams = {}
let collectProductIdList = []

/** 
 * 打开认领弹窗
 * @param {string} type acquisition - 采集箱; draft - 待发布;
 * @returns {void}
 */
  function claim(type = 'acquisition', record) {
  collectProductIdList = []
  collectProductIdList.push(record.id)
  rowId.value = record.id
  claimType.value = type
  openClaimModal.value = true
}

/** 
 * 打开编辑采集箱弹窗
 * @returns {void}
 */
  function showEditCategoryModal(params) {
  claimModalParams = params
  editCategoryModalRef.value.open({
    account: params.checkedList[0].shopId,
    id: rowId.value
  })
}

function receiveProductToWaitPublish() {
const shopIdList = claimModalParams.checkedList.map(item => item.shopId)
const params = {
  shopIdList,
  repeatReceiveFlag: claimModalParams.repeatReceiveFlag,
  collectProductIdList
}
receiveProductToWaitPublishApi(params)
  .then(res => {
    message.success('认领至待发布成功')

    const query = `?id=${collectProductIdList[0]}&account=${shopIdList[0]}`
    window.open('/platform/ozon/edit-acquisition-product' + query)
  })
  .catch(err => {
    message.warning('认领至待发布失败')
  })
}
</script>

<style lang="less" scoped>
.option-btn-box {
  display: flex;
  flex-direction: column;
  .option-btn {
    cursor: pointer;
    color: #1677ff;
  }
}
</style>
<style lang="less">
.rowBox-simpleDesc {
  max-width: 400px !important;
  .ant-tooltip-content {
    width: 100%;
    .rowBox-simpleDesc-tip-item {
      width: 100%;
      word-wrap: break-word;
      word-break: break-all;
      display: flex;
      justify-content: space-between;
      justify-items: center;
      .simpleDesc-tip-item-key {
        width: 120px;
      }
      .simpleDesc-tip-item-val {
        width: calc(100% - 130px);
      }
    }
  }
}
.urlAcquisition-typeTree_overlay {
  max-width: 300px;
  height: 300px;
  background: #fff;
  padding: 10px;
}
</style>