<template>
<div id="activeProduct" class="activeProduct">
  <!-- <a-button @click="toAdd" type="primary">新增 Button</a-button> -->
  <!-- 搜索区 -->
  <a-card>
    <a-descriptions :column="1">
      <a-descriptions-item label="店铺账号">
        <TiledSelect
          v-model:value="searchForm.shopId"
          :options="options.shopList"
          :field-names="{ label: 'simpleName', value: 'id' }"
          :append-all="false"
          @change="shopChange"
        />
      </a-descriptions-item>
      <a-descriptions-item label="站点">
        <TiledSelect
          v-model:value="searchForm.marketId"
          :options="options.marketList"
          :append-all="false"
          :field-names="{ label: 'countryZhName', value: 'marketId' }"
          @change="marketChange"
        />
      </a-descriptions-item>
      <a-descriptions-item label="搜索类型">
        <TiledSelect
          v-model:value="searchForm.prop"
          :options="options.propList"
          :append-all="false"
          :field-names="{label: 'label', value: 'code'}"
        />
      </a-descriptions-item>
      <a-descriptions-item
        label="搜索内容"
        :content-style="{ 'flex-direction': 'column' }"
      >
        <a-space align="start">
          <SearchContentInput
            v-model:value="searchForm.content"
              :hide-control="true"
              :placeholder="placeholderEnum[searchForm.prop]"
          />
          <a-button
            type="primary"
            @click="search"
            >搜索</a-button
          >
          <a-button
            type="link"
            @click="toggleFold"
            >高级搜索</a-button
          >
        </a-space>
        <a-form
          v-show="!isFold"
          ref="extendSearchFormRef"
          :model="extendSearchForm"
          :label-col="{ style: { width: '130px' } }"
          class="mt-4 p-3 bg-[--pro-ant-color-primary-bg]"
        >
          <!-- <a-form-item
            name="category"
            label="商品状态"
          >
            <a-cascader
              v-model:value="extendSearchForm.category"
              :options="[]"
              placeholder="请选择"
            />
          </a-form-item>
          <a-form-item
            name="reason"
            label="订单配送方"
          >
            <a-select
              v-model:value="extendSearchForm.reason"
              placeholder="请选择"
              allow-clear
              :options="[]"
            >
            </a-select>
          </a-form-item>
          <a-form-item
            name="withVideo"
            label="状况"
          >
            <a-select
              v-model:value="extendSearchForm.withVideo"
              placeholder="请选择"
              allow-clear
              :options="withVideoOpions"
            >
            </a-select>
          </a-form-item>
          <a-form-item
            name="createTime"
            label="开始/结束时间："
          >
            <a-range-picker
              v-model:value="extendSearchForm.createTime"
              allow-clear
            >
            </a-range-picker>
          </a-form-item> -->
          <a-form-item class="text-right">
            <a-space>
              <a-button
                type="link"
                @click="foldExtendSearch"
                >取消</a-button
              >
              <a-button
                type="link"
                @click="resetExtendSearchForm"
                >重置</a-button
              >
              <a-button
                type="primary"
                @click="extendSearch"
                >搜索</a-button
              >
            </a-space>
          </a-form-item>
        </a-form>
      </a-descriptions-item>
      <a-descriptions-item label="排序类型">
        <TiledSelectSort
          v-model:value="searchForm.order"
          v-model:sortType="searchForm.sortType"
          :options="options.sortType"
          :field-names="{label: 'label', value: 'code'}"
        />
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
  <!-- TABLE 区 -->
  <a-card
    style="margin: 10px"
    id="table"
  >
    <div class="btns">
      <div class="left-group">
        <a-button type="primary" @click="toAdd">发布商品</a-button>
        <a-button type="primary" @click="syncFn">同步商品</a-button>
        <a-upload
          v-model:file-list="options.fileList"
          :show-upload-list="false"
          name="file"
          :action="options.uploadTemplateUrl"
          :headers="options.headers"
          @change="uploadTemplateFn"
        >
          <a-button type="primary">导入更新价格和库存</a-button>
        </a-upload>
        <a-button type="primary" @click="downloadTemplateFn">下载导入模板</a-button>
        <a-popconfirm
          title="是否删除勾选的sku?"
          ok-text="是"
          cancel-text="否"
          @confirm="batchDel"
        >
          <a-button type="primary" danger :disabled="tableInfo.selectedRows.length < 1">批量删除</a-button>
        </a-popconfirm>
      </div>
      <!-- <a-pagination
        size="small"
        v-model:current="tableInfo.params.pageNum"
        v-model:pageSize="tableInfo.params.pageSize"
        :total="tableInfo.total"
        :default-page-size="50"
        show-size-changer
        show-quick-jumper
        :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
        @change="onPaginationChange"
      /> -->
      <div class="right-group">
        <a-dropdown :trigger="['click']">
          <a-button
            type="primary" 
            @click.prevent
            :disabled="tableInfo.selectedRows.length < 1"
          >批量操作</a-button>
          <template #overlay>
            <a-menu @click="onClickBatch">
              <a-menu-item 
                v-for="item in batchData.itemList"
                :key="item.key"
              >{{ item.label }}</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
    <a-table
      :columns="displayHeader"
      :data-source="tableInfo.data"
      :loading="tableInfo.loading"
      stripe
      ref="tableRef"
      :scroll="{ y: 850 }"
      :row-key="record => record.key"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <!-- <button @click="columnFn(column, record)">fsdfasdfas</button> -->
        <template v-if="column.key === 'type'">
          <div>变体：{{ record.amazonProducts.length }}</div>
        </template>
        <template v-if="column.key === 'info'">
          <div class="column-info">
            <!-- <div class="info-name">
              变体系列：<span>{{  }}</span>
            </div> -->
            <div class="info-text">
              <div class="info-asin">
                <span class="info-text-label">Parent ASIN：</span>
                {{ record.parentAsin }}
              </div>
              <div class="info-sku">
                <span class="info-text-label">父 SKU：</span>
                {{ record.parentSKu }}
              </div>
            </div>
          </div>
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <a-table 
          :columns="displayChildHead" 
          :data-source="record.amazonProducts" 
          :pagination="false"
          :ref="record.key"
          :row-key="record => record.key"
          :row-selection="{ 
            selectedRowKeys: tableInfo.childData[record.key]?.selectedRowKeys, 
            onChange: (keys, rows) => onChildSelectChange(keys, rows, record.key) 
          }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'info'">
              <div class="column-info">
                <div class="info-image">
                  <a-image
                    :width="100"
                    :src="record.attribute.main_product_image_locator[0].media_location"
                  >
                    <template #placeholder>
                      <a-image
                        :src="record.attribute.main_product_image_locator[0].media_location"
                        :width="200"
                        :preview="false"
                      />
                    </template>
                  </a-image>
                </div>
                <div class="info-text">
                  <div class="info-name">
                    <span class="info-text-label">标题：</span>  
                    {{ record.itemName }}
                  </div>
                  <div class="info-asin"> 
                    <span class="info-text-label">ASIN：</span> 
                    {{ record.asin }}
                  </div>
                  <div class="info-sku">                    
                    <span class="info-text-label">SKU：</span> 
                    {{ record.sku }}
                  </div>
                </div>
              </div>
            </template>
            <template v-if="column.key === 'state'">
              <span>{{ record.status }}</span>
            </template>
            <template v-if="column.key === 'ourPrice'">
              <span> {{ record.ourPrice }}_{{ record.currency }} </span>
            </template>
            <template v-else-if="column.key === 'options'">
              <a-popconfirm
                title="是否删除商品sku?"
                ok-text="是"
                cancel-text="否"
                @confirm="delSku(record)"
              >
                <a-button type="text" danger>删除</a-button>
              </a-popconfirm>
            </template>
          </template>
        </a-table>
      </template>
    </a-table>
    <a-pagination
      size="small"
      v-model:current="tableInfo.params.pageNum"
      v-model:pageSize="tableInfo.params.pageSize"
      :total="tableInfo.total"
      :default-page-size="50"
      show-size-changer
      show-quick-jumper
      :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
      @change="onPaginationChange"
    />
  </a-card>
  <a-modal 
    v-model:open="modalInfo.sync.open" 
    title="同步商品" 
    :footer="false"
    :closable="false"
    :keyboard="false"
    :maskClosable="false"
  >
    <div>{{ modalInfo.sync.str || '正在同步……' }}</div>
  </a-modal>

  <quantity-dialog 
    v-model:open="batchData.modal.quantity.open" 
    :rows="batchData.modal.quantity.rows"
    @editDone="editDone"
  ></quantity-dialog>
  <ourPrice-dialog 
    v-model:open="batchData.modal.ourPrice.open" 
    :rows="batchData.modal.ourPrice.rows"
    @editDone="editDone"
  ></ourPrice-dialog>
  <listPrice-dialog 
    v-model:open="batchData.modal.listPrice.open" 
    :rows="batchData.modal.listPrice.rows"
    @editDone="editDone"
  ></listPrice-dialog>
  <discountedPriceDialog 
    v-model:open="batchData.modal.discountedPrice.open" 
    :rows="batchData.modal.discountedPrice.rows"
    @editDone="editDone"
  ></discountedPriceDialog>
  <image-dialog 
    v-model:open="batchData.modal.image.open" 
    :rows="batchData.modal.image.rows"
    @editDone="editDone"
  ></image-dialog>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getShopList, getMarketList, getList, sync, syncProportion, del, uploadTemplate, downloadTemplate } from '../js/api/activeProduct';
import download from '~@/api/common/download';

import { parentHead, childHead } from '../js/tableHead/activeProduct';

import quantityDialog from '../common/activeProduct/quantityDialog.vue';
import ourPriceDialog from '../common/activeProduct/ourPriceDialog.vue';
import listPriceDialog from '../common/activeProduct/listPriceDialog.vue';
import discountedPriceDialog from '../common/activeProduct/discountedPriceDialog.vue';
import imageDialog from '../common/activeProduct/imageDialog.vue';

import { message } from 'ant-design-vue';

defineOptions({
  name: "activeProduct"
})
// 获取当前实例
const { proxy: _this } = getCurrentInstance()
// console.log({_this});
onMounted(async () => {
  try {
    let res = await getShopList()
    options.shopList = res.data  
    searchForm.shopId = res.data[0].id
    shopChange(searchForm.shopId)
  } catch (error) {
    console.log(error)
  }
})
// 表头
const displayHeader = computed(() => {
  return tableInfo.head.filter(column => column.show)
})
const displayChildHead = computed(() => {
  return tableInfo.childHead.filter(i => i.show)
})
const tableInfo = reactive({
  head: parentHead,
  childHead: childHead,
  data: [],
  childData: {},
  total: 0,
  tableSettingFlag: false, // 表格设置状态 Boolean
  tableSettingLoading: false,
  params: {
    pageNum: 1,
    pageSize: 50
  },
  loading: false,
  selectedRowKeys: [],
  selectedRows: [],
});
const modalInfo = reactive({
  sync: {
    open: false,
    str: ''         // 展示字段
  }
})
// 获取站点列表
function shopChange(id) {
  getMarketList(id).then(res => {
    options.marketList = res.data
    if (res.data.length > 0) {
      marketChange(res.data[0].marketId)
    }
  })
}
const options = reactive({
  shopList: [],     
  marketList: [],
  propList: [         // 搜索类型
    {
      label: '所有',
      code: 'sdfsdvfsd'
    },
    {
      label: 'SKUS',
      code: 'asfdgsddgsdg'
    },
    {
      label: 'ASIN',
      code: 'DSGVSDF'
    },
    {
      label: 'FNSKU',
      code: 'SXDDFHDFSD'
    },
    {
      label: '商品名称/关键字',
      code: 'HDSDFHDFHDSF'
    },
    {
      label: 'UPC/EAN',
      code: 'JFASFSDFSD'
    }
  ],
  sortType: [
    {
      label: '销量',
      code: 'asfdgsddgsdg'
    },
    {
      label: '出售商品数量',
      code: 'dhggdfdf'
    },
    {
      label: 'SKU',
      code: 'wetdfsdgh'
    },
    {
      label: '商品名称',
      code: 'jhsdfsdf'
    },
    {
      label: '价格',
      code: 'w6efdsfsdf'
    },
    {
      label: '创建日期',
      code: 'dzsdtsef'
    },
    {
      label: '最后更新时间',
      code: 'ryassdfsd'
    },
    {
      label: '可售',
      code: 'rytczsfdsfgdg'
    }
  ],
  fileList: [],
  uploadTemplateUrl: import.meta.env.VITE_APP_BASE_API + '/platform-amazon/platform/amazon/product/export/batch/edit',
  headers: {
    'Authorization': 'Bearer ' + useAuthorization().value,
  }
})
const placeholderEnum = reactive({
  sdfsdvfsd: '所有',
  asfdgsddgsdg: 'skus',
  DSGVSDF: 'asin',
  SXDDFHDFSD: 'fnsku',
  HDSDFHDFHDSF: '商品关键字',
  JFASFSDFSD: 'upc/EAN',
})
// 搜索条件
const searchForm = reactive({
  shopId: '',     // 店铺ID
  marketId: '',   // 站点
  status: '',     // 状态
  itemName: '',   // 商品名称
  content: '',    // 搜索框内容
  prop: '',       // 搜索类型
  
  order: '',
  sortType: '',
})
const isFold = ref(true)
const extendSearchForm = reactive({ // 高级搜索表单
  category: undefined,
  reason: undefined,
  withVideo: undefined,
  rules: undefined,
  gpsr: undefined,
  brand: undefined,
  remark: undefined,
  createTime: null,
  updateTime: null
});
// 批量修改的数据
const batchData = reactive({
  open: false,
  loading: false,
  actionItem: {},
  modal: {
    quantity: {
      open: false,
      rows: [],
    },
    ourPrice: {
      open: false,
      rows: [],
    },
    listPrice: {
      open: false,
      rows: [],
    },
    discountedPrice: {
      open: false,
      rows: [],
    },
    image: {
      open: false,
      rows: [],
    },
  },
  itemList: [
    {
      key: 'quantity',
      label: '批量修改库存',
    },
    {
      key: 'ourPrice',
      label: '批量修改价格',
    },
    {
      key: 'listPrice',
      label: '批量修改ListPrice',
    },
    {
      key: 'discountedPrice',
      label: '批量修改促销价格',
    },
    {
      key: 'image',
      label: '批量修改主图/标题',
    }
  ]
});
const router = useRouter;
function toAdd() {
  // router.push('/amazon/activeProduct/add')
  window.open('/platform/amazon/activeProduct/add')
}
// 同步商品
async function syncFn() {
  modalInfo.sync.open = true
  let marketplaceId = options.marketList.find(i => i.marketId === searchForm.marketId).marketplaceId
  let params = {
    "shopId": searchForm.shopId,
    "marketIds":[marketplaceId]
  }
  try {
    let res = await sync(params)
    syncProportionFn(searchForm.shopId)
  } catch (error) {
    modalInfo.sync.open = false
  }
}
// 获取同步进度
async function syncProportionFn(shopId) {
  let str = ''
  try {
    let res = await syncProportion({ shopId })
    modalInfo.sync.str = res.data
  } catch (error) {
    message.error('同步失败，请稍后重试！', 3);
    modalInfo.sync.open = false
    console.log(error)
  }
  if (modalInfo.sync.str !== 'finish') {
    setTimeout(() => {
      syncProportionFn(shopId)
    }, 5000);
  } else {
    modalInfo.sync.open = false
    search()
  }
}
function uploadTemplateFn(info) {
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (info.file.status === 'done') {
    message.success(`${info.file.name} file uploaded successfully`);
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
}
async function downloadTemplateFn() {
  let url = import.meta.env.VITE_APP_BASE_API + '/platform-amazon/platform/amazon/product/download/template'
  const response = await fetch(url, {
    headers: {
      'Authorization': 'Bearer ' + useAuthorization().value,
    },
  });
  const blob = await response.blob();
  const allBlob = new Blob([blob], { type: "application/octet-stream" });
  const bolbUrl = window.URL.createObjectURL(allBlob);
  const a = document.createElement("a");
  a.href = bolbUrl;
  a.download = 'import_product_price_stock_amazon.xlsx';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(bolbUrl);
  }, 0);
}
// 批量操作
function onClickBatch({ key }) {
  batchData.modal[key].open = true
  batchData.modal[key].rows = tableInfo.selectedRows
}
// 批量操作完成
function editDone() {
  tableInfo.selectedRows = []
  for (const key in tableInfo.childData) {
    if (Object.prototype.hasOwnProperty.call(tableInfo.childData, key)) {
      if (tableInfo.childData[key].selectedRowKeys.length > 0) {
        tableInfo.childData[key].selectedRowKeys = []
        tableInfo.childData[key].selectedRows = []
      }
    }
  }
  search()
}
// 站点变更
function marketChange(val) {
  searchForm.marketId = val
  search()
}
function search() {
  tableInfo.params.pageNum = 1
  getListFn()
}
// 高级搜索
function extendSearch() {

}
function toggleFold() { 
  if (isFold.value) {
    isFold.value = false
  } else {
    foldExtendSearch()
  }
}
// 高级搜索重置
function resetExtendSearchForm() {
  // console.log(_this.$refs);
  
  _this.$refs.extendSearchFormRef.resetFields()
  // this.extendSearchForm.createTime = null
  // this.extendSearchForm.updateTime = null
}
// 收起高级搜索
function foldExtendSearch() {
  resetExtendSearchForm()
  isFold.value = true
}
// 子表勾选
function onChildSelectChange(keys, rows, parentKey) {
  // console.log(keys, rows, parentKey);
  tableInfo.childData[parentKey].selectedRowKeys = keys
  tableInfo.childData[parentKey].selectedRows = rows
  tableInfo.selectedRows = []
  tableInfo.selectedRowKeys = []
  for (const key in tableInfo.childData) {
    if (Object.prototype.hasOwnProperty.call(tableInfo.childData, key)) {
      if (tableInfo.childData[key].selectedRowKeys.length > 0) {
        tableInfo.selectedRows = [...tableInfo.selectedRows, ...tableInfo.childData[key].selectedRows]
        tableInfo.selectedRowKeys = [...tableInfo.selectedRowKeys, ...tableInfo.childData[key].selectedRowKeys]
      }
    }
  }
}
// 翻页变化
function onPaginationChange() {
  getListFn()
}
// 删除商品
async function batchDel() {
  for (let index = 0; index < tableInfo.selectedRows.length; index++) {
    const item = tableInfo.selectedRows[index];
    let params = {
      "sku": item.sku,
      "shopId": item.shopId,
      "marketplaceIds": item.marketId
    }
    try {
      await del(params)
    } catch (error) {
      console.log(error)
    }
  }
  search()
}
// 删除单个sku
async function delSku(row) {
  let params = {
    "sku": row.sku,
    "shopId": row.shopId,
    "marketplaceIds": row.marketId
  }
  try {
    await del(params)
    search()
  } catch (error) {
    console.log(error)
  }
}
function getListFn() {
  let params = {
    ...searchForm,
    ...tableInfo.params
  }
  tableInfo.childData = {}
  tableInfo.selectedRows = []
  tableInfo.selectedRowKeys = []
  getList(params).then(res => {
    let rows = res.data.rows
    if (res.data.rows.length > 0) {
      rows.forEach(item => {
        let key = createRandom()
        item.key = key
        item.amazonProducts = item.amazonProducts || []
        if (item.amazonProducts && item.amazonProducts.length > 0) {
          item.amazonProducts.forEach(i => {
            let k = createRandom()
            i.key = k
            i.parentKey = key
          })
        }
        let obj = {
          selectedRowKeys: [],
          selectedRows: [],
          // data: item.amazonProducts || []
        }
        tableInfo.childData[key] = obj
      });
      tableInfo.data = res.data.rows
      tableInfo.total = res.data.total
    }
  })
}
// 生成一个随机数
function createRandom() {
  return Math.floor(Math.random() * 10000000000) + ''
}
</script>
<style lang="less" scoped>
.activeProduct {
  text-align: left;
  .btns {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .ant-btn {
      margin-right: 10px;
    }
  }
  .text-overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ant-pagination {
    text-align: right;
  }
  .column-info {
    text-align: left;
    display: flex;
    .info-text-label {
      display: inline-block;
      min-width: 60px;
      text-align: right;
    }
  }
}
</style>