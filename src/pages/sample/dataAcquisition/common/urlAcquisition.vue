<template>
<div id="urlAcquisition" class="urlAcquisition">
  
  <a-card title="采集地址--单品采集" class="text-left my-2.5">
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
            <selectComm class="ml-2.5" :options="shopAccount" :fieldObj="shopObj" @backSelectAll="selectAll"
              @backSelectItem="selectItem"></selectComm>
            <a-button @click="isShowSearch = !isShowSearch">{{ isShowSearch ? '收起' : '展开' }}</a-button>
          </div>
        </a-form-item>
        <a-form-item label="搜索类型:" v-show="isShowSearch">
          <div class="fBox flex align-start ml-2.5">
            <a-button @click="selectTypes(item.prop)" class="mr-2.5" :type="item.prop === actives ? 'primary' : ''"
              v-for="(item, index) in searchType" :key="index">{{
                item.label }}</a-button>
          </div>
        </a-form-item>
        <a-form-item label="搜索内容：" v-show="isShowSearch">
          <div class="searchs flex">
            <div class="searchInputs flex align-start ml-2.5">
              <a-input v-if="actives == 1" style="width: 400px;" v-model:value="formData.name" placeholder="请输入标题查询"
                allowClear @clear="onSubmit"></a-input>
              <a-input v-if="actives == 2" style="width: 400px;" v-model:value="formData.url" allowClear
                @clear="onSubmit" placeholder="请输入url"></a-input>
            </div>
            <a-button type="primary" class="ml-2.5" @click="onSubmit(true)">查询</a-button>
          </div>
        </a-form-item>
        <a-form-item label="采集时间：" v-show="isShowSearch">
          <selectComm class="ml-2.5" :options="acquisitionTimes" :fieldObj="timeObj" @backSelectAll="selectTimeAll"
            @backSelectItem="selectTimeItem"></selectComm>
        </a-form-item>
        <a-form-item label="时间选择：" v-show="formData.time === 5">
          <a-range-picker class="ml-2.5" v-model:value="formData.searchTime" />
        </a-form-item>
        <a-form-item label="备注：" v-show="isShowSearch">
          <a-select v-model:value="formData.isRemark" class="ml-2.5" style="width: 150px">
            <a-select-option value="1">有备注</a-select-option>
            <a-select-option value="0">无备注</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="责任人员：" v-show="isShowSearch">
          <a-select v-model:value="formData.isRemark" :options="resperson" class="ml-2.5" style="width: 150px">
          </a-select>
        </a-form-item>
      </a-form>
    </div>
  </a-card>
  <a-card>
    <div class="flex my-2.5">
      <a-button type="primary">批量认领</a-button>
    </div>
    <a-tabs v-model:activeKey="activeName" style="width: 800px;">
      <a-tab-pane :key="item.prop" v-for="item in tabList">
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

    <a-table :data-source="tableData" style="width: 100%;" bordered :columns="columns" :pagination="false"
      ref="OzonProduct" :row-selection="rowSelection" :rowKey="(row) => row">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'imageURLs'">
          <a-image :width="100" :src="record.imageURLs.split(';')[0]" />
        </template>
        <template v-if="column.dataIndex == 'subjectList'">
          <span>{{ record.subjectList[0].value }}</span>
        </template>
        <template v-if="column.dataIndex == 'detailSourceList'">
          <span></span>
        </template>
        <template v-if="column.dataIndex == 'aeopAeProductSKUs'">
          <div v-for="(SKU, index) in displayedSkus(record)" :key="index">
            <span>{{ SKU.aeopSKUPropertyList && SKU.aeopSKUPropertyList[0].propertyValueDefinitionName }}</span>
            <a-divider type="vertical" />
            SKU编码： <span style="color: #9e9f9e">{{ SKU.skuCode }}</span>
            <a-divider type="vertical" />
            零售价：<span style="color: #9e9f9e">{{ SKU.skuPrice }}</span>
            <a-divider type="vertical" />
            库存：<span style="color: #9e9f9e">{{ SKU.ipmSkuStock }}</span>
            <a-divider class="my-3" />
          </div>
          <div v-if="record.aeopAeProductSKUs.length > 3">
            <a-button type="link" @click="record.SKUExpand = !record.SKUExpand">共{{ record.aeopAeProductSKUs.length
              }}条SKU，{{ !record.SKUExpand ? '展开' : '收起' }}</a-button>
          </div>
        </template>
        <template v-if="column.dataIndex === 'time'">
          <div>
            <div>
              创建时间: <span class="text-gray">{{ record.gmtCreate || '--' }}</span>
            </div>
            <div>
              编辑时间: <span class="text-gray">{{ record.gmtModified || '--' }}</span>
            </div>
          </div>
        </template>
      </template>
    </a-table>
    <a-pagination style="margin-top: 20px;text-align: right;" :show-total="(total) => `共 ${total} 条`"
      v-model:current="pages.pageNum" v-model:pageSize="pages.pageSize" :total="pages.total" class="pages"
      :defaultPageSize="50" :showSizeChanger="true" :pageSizeOptions="[50, 100, 200]" />
  </a-card>
  <a-modal v-model:open="showTeps" :width="'30%'" title="采集插件使用流程" @ok="handleOk">

  </a-modal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue';
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import { dataGathe } from "../../../ozon/config/commDic/defDic"
import { productListApi } from "~/pages/aliexpress/apis/product"
defineOptions({ name: "urlAcquisition" })
const { proxy: _this } = getCurrentInstance()

const activeName = ref(2)
const actives = ref(1)
const tabList = [
  {
    label: "全部",
    code: "all",
    value: "0",
    prop: 1,
  },
  {
    label: "未认领",
    code: "insale",
    value: "0",
    prop: 2,
  },
  {
    label: "已认领",
    code: "inreview",
    value: "0",
    prop: 3,
  },
]
const formData = reactive({
  url: "",
  name: "",
  isRemark: "",
  time: "",
  searchTime: [],
})
const pages = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0
});
const dataUrl = reactive({
  url: '',
  iframeList: []
})
const isShowSearch = ref(false)
const showTeps = ref(false)
const tableData = ref([])
const selectedRowKeys = ref([])
const shopAccount = [
{
    account: "shopee",
    simpleName: "Shopee"
  },
  {
    account: "al",
    simpleName: "阿里巴巴国际站"
  },
  {
    account: "amazon",
    simpleName: "Amazon"
  },
  {
    account: "tb",
    simpleName: "淘宝"
  },
  {
    account: "tm",
    simpleName: "天猫"
  },
  {
    account: "smt",
    simpleName: "速卖通"
  },
  {
    account: "lazada",
    simpleName: "Lazada"
  },
]
// const shopAccount = dataGathe
const columns = [
  {
    title: '图片',
    dataIndex: 'imageURLs',
    align: "center",
    width: 200,
  },
  {
    title: '标题',
    dataIndex: 'subjectList',
    align: "center",
    width: 400,
  },
  {
    title: '描述',
    dataIndex: 'detailSourceList',
    align: "center",
    width: 100,
  },
  {
    title: '售价(USD)',
    dataIndex: 'aeopAeProductSKUs',
    align: "center",
    width: 300,
  },
  {
    title: '责任人',
    dataIndex: 'people',
    align: "center",
    width: 200,
  },
  {
    title: '创建时间',
    dataIndex: 'time',
    align: "center",
    width: 150,
  },
  {
    title: '操作',
    dataIndex: 'options',
    align: "center",
    width: 300
  },
]
const searchType = [
  {
    label: "标题",
    prop: 1,
  },
  // {
  //   label: "来源URL",
  //   prop: 2,
  // }
]
const resperson = [
  {
    label: "张三",
    value: 1
  },
  {
    label: "李四",
    value: 2
  },
  {
    label: "王五",
    value: 3
  }
]
const acquisitionTimes = [
  {
    label: "昨天",
    value: 1,
  },
  {
    label: "今天",
    value: 2,
  },
  {
    label: "7天以内",
    value: 3,
  },
  {
    label: "30天以内",
    value: 4,
  },
  {
    label: "自定义",
    value: 5,
  }
]
const timeObj = {
  fieldKey: "value",
  fieldLabel: "label",
}
const shopObj = {
  fieldKey: "account",
  fieldLabel: "simpleName",
}
function acquisition() {
  let list = dataUrl.url.split('\n')
  let iframeList = list.map(i => {
    console.log(i);
    
    let obj = {
      url: i,
      id: (Math.floor(Math.random() * 10000000)) + '',
      iframeRef: null,
      isLoad: false
    }
    return obj
  })
  dataUrl.iframeList = iframeList
}
const clearArea = () => {
  dataUrl.value = ""
}

// 店铺单选多选
const selectAll = () => {
  formData.account = ""

}
const selectItem = (val) => {
  formData.account = val

}
const displayedSkus = (record) => {
  return record.SKUExpand ? record.aeopAeProductSKUs : record.aeopAeProductSKUs.slice(0, 3)
}

// 采集时间
const selectTimeAll = () => {
  formData.time = ""

}
const selectTimeItem = (val) => {
  formData.time = val

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
const onSubmit = () => { }

const rowSelection = {
  onChange: (selectedRow) => {
    selectedRowKeys.value = selectedRow;
  },
};

const handleOk = () => { }
const getList = () => {
  productListApi({
    pageNum: pages.pageNum,
    pageSize: pages.pageSize,
  }).then(res => {
    console.log(res);
    tableData.value = res.rows ?? []
    pages.total = res.total ?? 0
  })
}
onMounted(() => {
  getList()
})
</script>
<style lang="less" scoped>

</style>