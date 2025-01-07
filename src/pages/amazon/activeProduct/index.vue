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
        <a-button
          type="primary"
          @click="toAdd"
        >发布商品</a-button>
        <!-- <a-button
          type="primary"
          @click="toAdd"
        >删除商品</a-button> -->
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
          >批量操作商品</a-button>
          <!-- <a class="ant-dropdown-link">
            Hover me, Click menu item
            <DownOutlined />
          </a> -->
          <template #overlay>
            <a-menu @click="onClickBatch">
              <a-menu-item 
                v-for="item in batchData.itemList"
                :key="item.key"
              >{{ item.label }}</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-dropdown :trigger="['click']">
          <a-button
            type="primary" 
            @click.prevent
          >批量操作SKU</a-button>
          <!-- <a class="ant-dropdown-link">
            Hover me, Click menu item
            <DownOutlined />
          </a> -->
          <template #overlay>
            <a-menu @click="onClickBatch">
              <a-menu-item key="quantity">批量修改库存</a-menu-item>
              <a-menu-item key="ourPrice">批量修改价格</a-menu-item>
              <!-- <a-menu-item key="2">批量修改促销价格</a-menu-item> -->
              <a-menu-item key="listPrice">批量修改ListPrice</a-menu-item>
              <a-menu-item key="name">批量修改标题</a-menu-item>
              <a-menu-item key="image">批量修改图片</a-menu-item>
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
      :row-selection="{ selectedRowKeys: tableInfo.selectedRowKeys, onChange: onSelectChange }"
    >
      <template #bodyCell="{ column, record }">
        <!-- <button @click="columnFn(column, record)">fsdfasdfas</button> -->
        <template v-if="column.key === 'options'">
          <div class="options-btns">
            <a-popconfirm
              title="是否删除商品?"
              ok-text="是"
              cancel-text="否"
              @confirm="delProduact(record)"
            >
              <a-button type="text" danger>删除</a-button>
            </a-popconfirm>
          </div>
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <a-table 
          :columns="displayHeader" 
          :data-source="tableInfo.childData[record.key].data" 
          :pagination="false"
          :ref="record.key"
          :row-key="record => record.key"
          :row-selection="{ 
            selectedRowKeys: tableInfo.childData[record.key].selectedRowKeys, 
            onChange: (keys, rows) => onChildSelectChange(keys, rows, record.key) 
          }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'state'">
              <span>
                <a-badge status="success" />
                Finished
              </span>
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
  <a-modal v-model:open="batchData.open" :title="batchData.actionItem.label" @ok="handleOk">
    <a-form
      layout="horizontal"
      :model="batchData.form"
      style="max-width: 600px"
      ref="batchForm"
    >
      <a-form-item 
        label=""
        name="num"
        :rules="[{ required: true, message: '请填写数字！' }]"
      >
        <a-input-number id="inputNumber" v-model:value="batchData.form.num" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="batchData.loading" @click="handleOk">确定</a-button>
    </template>
  </a-modal>
  <quantity-dialog v-model:open="batchData.modal.quantity.open" :rows="batchData.modal.quantity.rows"></quantity-dialog>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getShopList, getMarketList, getList } from '../js/api/activeProduct';

import activeProduct from '../js/tableHead/activeProduct';
import quantityDialog from '../common/activeProduct/quantityDialog.vue';

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
// 表头
const displayHeader = computed(() => {
  return tableInfo.head.filter(column => column.show)
})
const tableInfo = reactive({
  head: activeProduct,
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
  allSelectedRows: []         // 全部勾选的行
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
    name: {
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
      key: 'listPrice',
      label: '批量修改ListPrice',
      rows: [],
    },
    {
      key: 'image',
      label: '批量修改图片',
    }
  ],
  form: {
    num: ''
  }
});
const router = useRouter;
function toAdd() {
  // router.push('/amazon/activeProduct/add')
  window.open('/platform/amazon/activeProduct/add')
}
// 批量操作
function onClickBatch({ key }) {
  console.log({ key });
  // batchData.actionItem = batchData.itemList.find(i => i.key === key)
  // openModal()
  batchData.modal[key].open = true
  batchData.modal[key].rows = tableInfo.selectedRows
}
// function openModal() {
//   batchData.open = true
// }
// // 弹窗保存
// async function handleOk() {
//   _this.$refs.batchForm
//   console.log(_this.$refs.batchForm);
//   try {
//     let res = await _this.$refs.batchForm.validateFields()
//     console.log({res});
//   } catch (error) {
//     console.log(error);
    
//   }
//   return;
//   batchData.loading = true
//   setTimeout(() => {
//     batchData.open = false
//     batchData.loading = false
//   }, 2000);
// }
// // 关闭弹窗
// function handleCancel() {
//   batchData.open = false
//   batchData.loading = false
// }
// 批量修改库存
function quantityBatch(num) {

}
// 批量修改价格
function ourPriceBatch(num) {

}
// 批量修改listPrice
function listPriceBatch() {

}
// 批量修改标题
function nameBatch() {

}
// 批量修改图片
function imageBatch() {

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
// 勾选表格行
function onSelectChange(keys, rows) {
  console.log({keys, rows});
  
  let old = tableInfo.selectedRowKeys
  let changeKey = []
  let flag = keys.length > old.length
  let arr = flag ? keys : old
  let contrast = flag ? old : keys
  // 找出差别
  arr.forEach(item => {
    if (!contrast.includes(item)) {
      changeKey.push(item)
    }
  })

  // changeKey.forEach(item => {
  //   if (!tableInfo.childData[item].data) return;
  //   if (flag) {
  //     tableInfo.childData[item].selectedRowKeys = tableInfo.childData[item].data.map(i => i.key)
  //     tableInfo.childData[item].selectedRows = tableInfo.childData[item].data.map(i => i)
  //   } else {
  //     tableInfo.childData[item].selectedRowKeys = []
  //     tableInfo.childData[item].selectedRows = []
  //   }
  // })
  tableInfo.selectedRowKeys = keys
  tableInfo.selectedRows = rows
}
// 子表勾选
function onChildSelectChange(keys, rows, parentKey) {
  console.log(keys, rows, parentKey);
  tableInfo.childData[parentKey].selectedRowKeys = keys
  tableInfo.childData[parentKey].selectedRows = rows
  // if (keys.length === 0) {
  //   tableInfo.selectedRowKeys = tableInfo.selectedRowKeys.filter(i => i !== parentKey)
  // } else if (keys.length > 0) {
  //   if (!tableInfo.selectedRowKeys.includes(parentKey)) {
  //     tableInfo.selectedRowKeys.push(parentKey)
  //   }
  // }
}
// 翻页变化
function onPaginationChange() {
  getListFn()
}
function columnFn(a, b) {
  console.log({a,b});
  
}
// 删除商品
function delProduact(row) {
  console.log({row});
  
}
// 删除单个sku
function delSku(row) {

}
function getListFn() {
  let params = {
    ...searchForm,
    ...tableInfo.params
  }
  getList(params).then(res => {
    let rows = res.data.rows
    if (res.data.rows.length > 0) {
      for (let index = 0; index < 10; index++) {
        let i = {...rows[1]}
        rows.push(i)
      }
      rows.forEach(item => {
        let key = createRandom()
        item.key = key
        for (let index = 0; index < 3; index++) {
          if (item.amazonProducts) {
            let i = {...item.amazonProducts[0]}
            item.amazonProducts.push(i)
          }
        }
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
          data: item.amazonProducts
        }
        tableInfo.childData[key] = obj
      });
      tableInfo.data = res.data.rows
      tableInfo.total = res.data.total
      // tableInfo.data.forEach((item, index) => {
      //   if (index < 2) {
      //     tableInfo.selectedRowKeys.push(item.key)
      //   }
      // })
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
}
</style>