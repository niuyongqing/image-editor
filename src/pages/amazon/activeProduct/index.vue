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
        <a-button
          type="primary"
          @click="toAdd"
        >发布商品</a-button>
      </div>
      <a-pagination
        size="small"
        v-model:current="tableInfo.params.pageNum"
        v-model:pageSize="tableInfo.params.pageSize"
        :total="total"
        :default-page-size="50"
        show-size-changer
        show-quick-jumper
        :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
        @change="onPaginationChange"
      />
    </div>
    <a-table
      :columns="displayHeader"
      :data-source="tableInfo.data"
      :loading="tableInfo.loading"
      stripe
      ref="tableRef"
      row-key="productId"
      :pagination="false"
      :row-selection="{ selectedRowKeys: tableInfo.selectedRowKeys, onChange: onSelectChange }"
    >
      <template #bodyCell="{ column, record }">
        {{ column, record }}
        
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
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getShopList, getMarketList, getList } from '../js/api/activeProduct';
import activeProduct from '../js/tableHead/activeProduct';

defineOptions({
  name: "activeProduct"
})
// 获取当前实例
const { proxy: _this } = getCurrentInstance()
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
const displayHeader = computed(() => {
  return tableInfo.head.filter(column => column.show)
})
const tableInfo = reactive({
  head: activeProduct,
  data: [],
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
})
// 获取站点列表
function shopChange(id) {
  getMarketList(id).then(res => {
    options.marketList = res.data
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
  ]
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
}) 
const router = useRouter()
function toAdd() {
  // router.push('/amazon/activeProduct/add')
  window.open('/platform/amazon/activeProduct/add')
}
function search() {
  getList()
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
  console.log(_this.$refs);
  
  _this.$refs.extendSearchFormRef.resetFields()
  // this.extendSearchForm.createTime = null
  // this.extendSearchForm.updateTime = null
}
// 收起高级搜索
function foldExtendSearch() {
  resetExtendSearchForm()
  isFold.value = true
}
function onSelectChange (keys, rows) {
  tableInfo.selectedRowKeys = keys
  tableInfo.selectedRows = rows
}
function onPaginationChange() {
  getListFn()
}
function getListFn() {
  let params = {
    ...searchForm,
    ...tableInfo.params
  }
  getList(params).then(res => {
    tableInfo.data = res.data.rows
    tableInfo.total = res.data.total
  })
}
</script>
<style lang="less" scoped>
.activeProduct {
  text-align: left;
  .btns {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .text-overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ant-pagination {
    text-align: right;
  }
}
</style>