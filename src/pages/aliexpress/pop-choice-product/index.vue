<!-- 半托管 列表 -->
<template>
  <div class="text-left">
    <!-- 搜索区 -->
    <a-card>
      <a-descriptions :column="1">
        <a-descriptions-item label="店铺账号">
          <TiledSelect
            v-model:value="watchedSearchForm.sellerId"
            :options="accountList"
            :field-names="{ label: 'simpleName', value: 'sellerId' }"
          />
        </a-descriptions-item>
        <a-descriptions-item label="搜索类型">
          <TiledSelect
            v-model:value="lazySearchForm.searchKey"
            :options="searchPropOptions"
            :append-all="false"
          />
        </a-descriptions-item>
        <a-descriptions-item
          label="搜索内容"
          :content-style="{ 'flex-direction': 'column' }"
        >
          <a-space align="start">
            <SearchContentInput
              v-model:value="lazySearchForm.searchValue"
              :hide-control="['productName'].includes(lazySearchForm.searchKey)"
              :placeholder="placeholderEnum[lazySearchForm.searchKey]"
              @enter="search"
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
        </a-descriptions-item>
        <a-descriptions-item label="商品状态">
          <TiledSelect
            v-model:value="watchedSearchForm.joinedProductTab"
            :options="STATUS_OPTIONS"
            :append-all="false"
          />
        </a-descriptions-item>
        <a-descriptions-item label="排序类型">
          <TiledSelectSort
            v-model:value="watchedSearchForm.prop"
            v-model:sortType="watchedSearchForm.order"
            :options="sortTypeOptions"
          />
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-space class="my-4">
      <a-button
        type="primary"
        title="选择店铺后同步"
        :loading="syncLoading"
        :disabled="!watchedSearchForm.sellerId"
        @click="handleSyncList"
        >批量同步店铺商品</a-button
      >
    </a-space>
    <!-- TABLE 区 -->
    <a-card>
      <div class="flex justify-between items-center">
        <a-tabs
          v-model:activeKey="activeTab"
          :animated="false"
          @change="tabChange"
        >
          <a-tab-pane
            v-for="item in TABS"
            :key="item.value"
            :tab="item.label"
          ></a-tab-pane>
        </a-tabs>
        <a-pagination
          v-model:current="tableParams.pageNum"
          v-model:pageSize="tableParams.pageSize"
          :total="total"
          :default-page-size="50"
          show-size-changer
          show-quick-jumper
          :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
          @change="getList"
        />
      </div>

      <a-table
        :loading="loading"
        :columns="displayHeader"
        :data-source="tableData"
        stripe
        ref="tableRef"
        row-key="productId"
        :pagination="false"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
        :scroll="{ x: 'max-content' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'productId'">
            <div class="flex text-left">
              <a-popover placement="right">
                <template #content>
                  <img
                    :src="record.images[0] || EmptyImg"
                    style="height: 400px; width: 400px"
                  />
                </template>
                <span>
                  <a-image-preview-group>
                    <a-image
                      style="width: 56px; height: 56px; border: 1px solid #ccc"
                      :src="record.images[0] || EmptyImg"
                      :fallback="EmptyImg"
                    />
                    <a-image
                      v-for="url in record.images.slice(1)"
                      :key="url"
                      :src="url"
                      class="hidden"
                    />
                  </a-image-preview-group>
                </span>
              </a-popover>
              <div style="margin-left: 10px; width: 90%">
                <a-tooltip :title="getTitle(record)">
                  <div
                    class="truncate cursor-pointer"
                    @click="goAliExpress(record.productId)"
                  >
                    {{ getTitle(record) }}
                  </div>
                </a-tooltip>
                <div style="color: #999">
                  商品ID:
                  <span
                    title="复制ID"
                    class="cursor-pointer"
                    @click="copyId(record.productId)"
                    >{{ record.productId }} <CopyOutlined
                  /></span>
                  <img
                    v-if="record.isSemiCustodial"
                    class="w-[56px] h-[18px] ml-5"
                    src="@/assets/images/aliexpress/choice.png"
                  />
                </div>
              </div>
            </div>
          </template>
          <div
            v-if="column.key === 'skus'"
            style="text-align: left"
          >
            <EditOutlined
              title="修改库存"
              class="text-[#1677ff] float-right"
              @click="editStock(record)"
            />
            <div
              v-for="(SKU, index) in displayedSkus(record)"
              :key="index"
            >
              <a-row>
                <span>{{ SKU.aeopSKUPropertyList && SKU.aeopSKUPropertyList[0].propertyValueDefinitionName }}</span>
                <a-divider type="vertical" />
                SKU编码：<span style="color: #9e9f9e">{{ SKU.skuCode }}</span>
                <a-divider type="vertical" />
                零售价：<span style="color: #9e9f9e">{{ SKU.skuPrice }}</span>
                <a-divider type="vertical" />
                库存：<span style="color: #9e9f9e">{{ SKU.ipmSkuStock }}</span>
              </a-row>
              <a-divider class="my-3" />
            </div>
            <div v-if="record.aeopAeProductSKUs.length > 3">
              <a-button
                type="link"
                @click="record.SKUExpand = !record.SKUExpand"
                >共{{ record.aeopAeProductSKUs.length }}条SKU，{{ !record.SKUExpand ? '展开' : '收起' }}</a-button
              >
            </div>
          </div>
          <div v-if="column.key === 'productStatusType'">
            <a-tag
              v-if="record.productStatusType === 'onSelling'"
              color="success"
              >销售中</a-tag
            >
            <a-tag v-else-if="record.productStatusType === 'offline'">已下架</a-tag>
            <span v-else>--</span>
          </div>
          <div v-if="column.key === 'time'">
            <div>
              创建时间: <span class="text-gray">{{ record.gmtCreate || '--' }}</span>
            </div>
            <div>
              编辑时间: <span class="text-gray">{{ record.gmtModified || '--' }}</span>
            </div>
          </div>
          <div v-if="column.key === 'option'">
            <a-button
              v-if="activeTab === '1'"
              type="text"
              style="color: #0b56fa"
              @click="goPublish(record, { isEdit: true })"
              >编辑</a-button
            >
            <a-button
              v-if="activeTab === '2'"
              type="text"
              style="color: #0b56fa"
              @click="goPublish(record, { isEdit: false })"
              >加入</a-button
            >
            <a-button
              type="text"
              style="color: #67c23a"
              @click="handleSyncOne(record)"
              >同步</a-button
            >
            <a-popconfirm
              v-if="activeTab === '1'"
              title="删除吗?"
              @confirm="del(record)"
            >
              <a-button
                type="text"
                danger
                >删除</a-button
              >
            </a-popconfirm>
          </div>
        </template>
      </a-table>
      <a-pagination
        v-model:current="tableParams.pageNum"
        v-model:pageSize="tableParams.pageSize"
        class="text-right mt-3"
        :total="total"
        :default-page-size="50"
        show-size-changer
        show-quick-jumper
        :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
        @change="getList"
      />
    </a-card>

    <!-- 同步进度条 -->
    <a-modal
      title="同步进度"
      v-model:open="syncProgressOpen"
      :footer="null"
    >
      <a-progress :percent="syncPercentage" />
    </a-modal>

    <!-- 修改库存弹窗 -->
    <StockDialog
      :dialog-visible="editStockDialogVisible"
      :raw-data="curRow"
      @refresh="getList"
      @close="handleStockDialogClose"
    />
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import { DEFAULT_TABLE_COLUMN } from './config'
  import { copyText } from '@/utils'
  import { accountCacheApi } from '../apis/common'
  import { listApi, waitPublishListApi, deleteSemiProductApi, syncListApi, syncOneApi, syncWaitPublishOneApi } from '../apis/pop-choice-product'
  import { CopyOutlined, EditOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'
  import EmptyImg from '@/assets/images/aliexpress/empty.png'
  import StockDialog from './components/StockDialog.vue'

  export default {
    name: 'PopChoiceProduct',
    components: { CopyOutlined, EditOutlined, StockDialog },
    data() {
      return {
        dayjs,
        EmptyImg,
        accountList: [],
        // 被 watch 监听的搜索表单; 外层, 点击即可搜索
        watchedSearchForm: {
          sellerId: undefined,
          joinedProductTab: 'onSelling',
          prop: 'create_time',
          order: 'desc'
        },
        isFold: true,
        // 高级搜索表单; 需点击'搜索'按钮再执行搜索动作
        lazySearchForm: {
          searchKey: 'productName',
          searchValue: undefined
        },
        searchPropOptions: [
          { label: '标题', value: 'productName' },
          { label: 'SKU编码', value: 'skuCode' },
          { label: '产品ID', value: 'productId' },
          { label: '货品编码', value: 'scItemCode' },
          { label: '货品条码', value: 'scItemBarCode' }
        ],
        placeholderEnum: {
          productName: '标题',
          skuCode: '商品编码, 多个SKU间用英文逗号隔开',
          productId: '商品ID; 支持批量，举例：ID1,ID2,ID3',
          scItemCode: '多个货品编码间用逗号隔开',
          scItemBarCode: '多个货品条码间用逗号隔开'
        },
        STATUS_OPTIONS: [
          { label: '销售中', value: 'onSelling' },
          { label: '已下架', value: 'offline' }
        ],
        sortTypeOptions: [
          { label: '按创建时间', value: 'create_time' },
          { label: '按更新时间', value: 'update_time' },
          { label: '按库存', value: 'stock' },
          { label: '按变种库存', value: 'sku_stock' },
          { label: '按价格', value: 'price' }
        ],
        TABS: [
          { label: '已加入', value: '1' },
          { label: '可加入', value: '2' }
        ],
        activeTab: '1', // '1'-已加入; '2'-可加入;
        requestApi: listApi,
        DEFAULT_TABLE_COLUMN,
        tableHeader: [],
        tableCode: 'PopChoiceProduct',
        tableParams: {
          pageNum: 1,
          pageSize: 50
        },
        tableData: [],
        total: 0,
        loading: false,
        selectedRowKeys: [],
        selectedRows: [],
        syncProgressOpen: false,
        syncLoading: false,
        syncPercentage: 0,
        editStockDialogVisible: false, // 修改库存弹窗显隐
        curRow: {}
      }
    },
    computed: {
      displayHeader() {
        return this.tableHeader.filter(column => column.show)
      }
    },
    watch: {
      watchedSearchForm: {
        handler: function () {
          this.search()
        },
        deep: true
      }
    },
    mounted() {
      this.getTableHeader()
      this.getAccountList()
    },
    methods: {
      tabChange() {
        this.tableParams.pageNum = 1
        this.requestApi = this.activeTab === '1' ? listApi : waitPublishListApi
        this.getList()
      }, 
      // 获取表头
      getTableHeader() {
        this.tableHeader = this.DEFAULT_TABLE_COLUMN
      },
      onSelectChange(keys, rows) {
        this.selectedRowKeys = keys
        this.selectedRows = rows
      },
      getAccountList() {
        accountCacheApi()
          .then(res => {
            this.accountList = res.data.accountDetail || []
            if (this.accountList.length === 0) {
              message.error('当前账号没有配置店铺, 请前往「账号配置」添加, 或联系管理员')
            }
          })
          .finally(() => {
            this.getList()
          })
      },
      getList() {
        this.loading = true
        // 重置选择的数据
        this.selectedRowKeys = []
        this.selectedRows = []

        const params = {
          ...this.watchedSearchForm,
          ...this.lazySearchForm,
          [this.lazySearchForm.searchKey]: this.lazySearchForm.searchValue,
          ...this.tableParams
        }
        delete params.searchKey
        delete params.searchValue

        this.requestApi(params)
          .then(res => {
            const list = res.data.rows || []
            list.forEach(item => {
              item.SKUExpand = false
              item.images = item.imageURLs ? item.imageURLs.split(';') : ''
              // 将[已加入]列表数据格式转换成[可加入]格式
              if (this.activeTab === '1') {
                const popChoiceProduct = item.result.popChoiceProduct || {}

                // SKU info
                const aeopAeProductSKUs = popChoiceProduct.productSkuList.map(SKU => {
                  const ipmSkuStock = SKU.popChoiceSkuWarehouseStockList[0].sellableQuantity
                  const warehouseCode = SKU.popChoiceSkuWarehouseStockList[0].warehouseCode
                  return {
                    skuCode: SKU.skuCode,
                    skuPrice: SKU.basePrice,
                    ipmSkuStock,
                    warehouseCode,
                    skuId: SKU.skuId,
                    aeopSKUPropertyList: SKU.skuPropertyList
                  }
                })

                item.gmtModified = item.updateTime
                item.productId = popChoiceProduct.productId
                item.aeopAeProductSKUs = aeopAeProductSKUs
              }
            })

            this.tableData = list
            this.total = res.data.total
          })
          .finally(() => {
            this.loading = false
          })
      },
      toggleFold() {
        if (this.isFold) {
          this.isFold = false
        } else {
          this.foldExtendSearch()
        }
      },
      // 高级搜索重置
      resetExtendSearchForm() {
        this.$refs.extendSearchFormRef.resetFields()
      },
      // 收起高级搜索
      foldExtendSearch() {
        this.resetExtendSearchForm()
        this.isFold = true
      },
      search() {
        this.tableParams.pageNum = 1
        this.getList()
      },
      reset() {
        this.$refs.searchFormRef.resetFields()
        this.tableParams.pageNum = 1
        this.getList()
      },
      handleSyncOne(record) {
        const params = {
          sellerId: record.sellerId,
          productId: record.productId
        }
        const requestApi = this.activeTab === '1' ? syncOneApi : syncWaitPublishOneApi
        requestApi(params).then(res => {
          message.success(res.msg)
          this.getList()
        })
      },
      // 同步店铺商品
      handleSyncList() {
        this.syncProgressOpen = true
        syncListApi({ sellerId: this.watchedSearchForm.sellerId })
          .then(res => {
            this.getSyncProgress(res.data)
          })
          .catch(e => {
            this.syncProgressOpen = false
          })
      },
      // 同步进度条
      getSyncProgress(progressToken) {
        const params = {
          sellerId: this.watchedSearchForm.sellerId,
          progressToken
        }
        syncProgressApi(params)
          .then(res => {
            if (res.data) {
              const resList = res.data.split(':')
              if (resList[0] === 'undone') {
                this.syncPercentage = Number(((resList[2] / resList[1]) * 100).toFixed())
                setTimeout(() => {
                  this.getSyncProgress(progressToken)
                }, 3 * 1000)
              } else {
                this.syncPercentage = 0
                this.syncProgressOpen = false
                this.search()
              }
            } else {
              setTimeout(() => {
                this.getSyncProgress(progressToken)
              }, 2 * 1000)
            }
          })
          .catch(e => {
            this.syncProgressOpen = false
          })
      },
      getTitle(record) {
        const locale = record.locale || 'en_US'
        return record.subjectList.filter(item => item.locale === locale)[0].value
      },
      // 复制产品ID到剪贴板
      copyId(id) {
        copyText(id)
          .then(() => {
            message.success('已复制')
          })
          .catch(err => {
            message.error(err)
          })
      },
      displayedSkus(record) {
        return record.SKUExpand ? record.aeopAeProductSKUs : record.aeopAeProductSKUs.slice(0, 3)
      },
      SKUStock(SKU) {
        let sum = 0
        SKU.warehouseList.forEach(item => {
          sum += item.sellableQuantity
        })
        return sum
      },
      // 修改 SKU 库存相关
      editStock(row) {
        this.curRow = row
        this.editStockDialogVisible = true
      },
      // 关闭弹窗
      handleStockDialogClose() {
        this.curRow = {}
        this.editStockDialogVisible = false
      },
      del(record) {
        const params = {
          products: [
            {
              sellerId: record.sellerId,
              productId: record.productId
            }
          ]
        }
        deleteSemiProductApi(params).then(res => {
          this.getList()
        })
      },
      goAliExpress(productId) {
        window.open(`https://vi.aliexpress.com/item/${productId}.html`)
      },
      goPublish(record, { isEdit = true }) {
        let query = ''
        if (record) {
          query = `?sellerId=${record.sellerId}&productId=${record.productId}&isEdit=${isEdit}`
        }
        window.open(location.origin + '/platform/aliexpress/pop-choice-product-publish' + query)
      }
    }
  }
</script>
