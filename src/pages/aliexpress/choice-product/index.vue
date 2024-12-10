<!-- 全托管 列表 -->
<template>
  <div class="choice-product">
    <!-- 搜索区 -->
    <a-card>
      <a-form
        layout="inline"
        ref="searchFormRef"
        :model="searchForm"
      >
        <a-form-item
          name="sellerId"
          label="店铺："
        >
          <a-select
            v-model:value="searchForm.sellerId"
            placeholder="请选择店铺"
            show-search
            allow-clear
            :options="accountList"
            :field-names="{ label: 'simpleName', value: 'sellerId' }"
            :filter-option="filterOption"
            style="width: 200px; text-align: left"
          >
          </a-select>
        </a-form-item>
        <a-form-item
          name="productIds"
          label="商品ID："
        >
          <a-textarea
            v-model:value="searchForm.productIds"
            placeholder="支持批量，举例：ID1,ID2,ID3"
            :auto-size="{ minRows: 1, maxRows: 5 }"
            style="width: 200px"
          ></a-textarea>
        </a-form-item>
        <a-form-item
          name="productName"
          label="商品标题："
        >
          <a-input
            v-model:value="searchForm.productName"
            placeholder="商品标题"
            style="width: 200px"
          ></a-input>
        </a-form-item>
        <a-form-item
          name="skuCode"
          label="SKU编码："
        >
          <a-input
            v-model:value="searchForm.skuCode"
            placeholder="SKU编码"
            style="width: 200px"
          ></a-input>
        </a-form-item>
        <a-form-item
          name="productStatus"
          label="状态："
        >
          <a-select
            v-model:value="searchForm.productStatus"
            placeholder="请选择状态"
            allow-clear
            :options="statusOptions"
            style="width: 200px; text-align: left"
          >
          </a-select>
        </a-form-item>
        <a-form-item
          name="createTime"
          label="创建时间："
        >
          <a-range-picker
            v-model:value="searchForm.createTime"
            :disabled-date="cur => cur > Date.now()"
            allow-clear
          >
          </a-range-picker>
        </a-form-item>
        <a-form-item
          name="updateTime"
          label="编辑时间："
        >
          <a-range-picker
            v-model:value="searchForm.updateTime"
            :disabled-date="cur => cur > Date.now()"
            allow-clear
          >
          </a-range-picker>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            @click="search"
            >查询</a-button
          >
          <a-button
            class="ml-[10px]"
            @click="reset"
            >重置</a-button
          >
        </a-form-item>
      </a-form>
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
            @click="dialogVisible = true"
            >发布商品</a-button
          >
          <a-button
            type="primary"
            title="选择店铺后同步"
            class="ml-[10px]"
            :loading="syncLoading"
            :disabled="!searchForm.sellerId"
            @click="handleSyncList"
            >批量同步店铺商品</a-button
          >
        </div>
        <!-- <a-button-group>
          <a-button
            v-if="!tableSettingFlag"
            type="primary"
            :loading="tableSettingLoading"
            @click="startSetting"
            >表格设置</a-button
          >
          <a-button
            v-else
            type="primary"
            :loading="tableSettingLoading"
            @click="setTableHeader()"
            >保存表格设置</a-button
          >
          <a-popover width="800">
            <template #content>
              <a-row>
                <div
                  v-for="(item, index) in tableHeader"
                  :key="index"
                >
                  <a-col
                    :span="3"
                    style="margin-top: 5px"
                  >
                    <div>{{ item.label }}</div>
                  </a-col>
                  <a-col
                    :span="3"
                    style="margin-top: 5px"
                  >
                    <a-switch
                      v-model:value="item.show"
                      style="display: block"
                      @change="setTableHeader()"
                    ></a-switch>
                  </a-col>
                </div>
              </a-row>
            </template>
            <a-button type="primary">隐藏/显示列</a-button>
          </a-popover>
          <a-popconfirm
            title="确定要重置当前页面表格的所有设置吗？"
            @confirm="setTableHeader(true)"
          >
            <a-button
              danger
              :loading="tableSettingLoading"
              >重置表格设置</a-button
            >
          </a-popconfirm>
        </a-button-group> -->
      </div>
      <a-table
        :height="tableHeight"
        :columns="displayHeader"
        :data-source="tableData"
        :loading="loading"
        stripe
        ref="tableRef"
        row-key="productId"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
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
                <a-tooltip :title="record.title">
                  <div
                    class="text-overflow cursor-pointer"
                    @click="goAliExpress(record.productId)"
                  >
                    {{ record.title }}
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
                </div>
              </div>
            </div>
          </template>
          <div v-if="column.key === 'productType'">
            <span>{{ { 0: '国内仓发', 1: '国内即时补货模式（JIT）', 2: '海外备仓' }[record.productType] }}</span>
          </div>
          <div
            v-if="column.key === 'skus'"
            style="text-align: left"
          >
            <div
              v-for="(SKU, index) in displayedSkus(record)"
              :key="index"
            >
              <p>SKU属性：{{ SKU.variation }}</p>
              <a-row>
                SKU编码：<span style="color: #9e9f9e">{{ SKU.sellerSku }}</span>
                <a-divider type="vertical"></a-divider>
                货品条码：<span style="color: #9e9f9e">{{ SKU.productSkuScItemInfoDto.scItemBarCode || '--' }}</span>
                <a-divider type="vertical"></a-divider>
                货品ID：<span style="color: #9e9f9e">{{ SKU.productSkuScItemInfoDto.scItemId || '--' }}</span>
                <template v-if="SKU.productSkuScItemInfoDto.unbindRefuseReason">
                  <a-divider type="vertical"></a-divider>
                  解绑拒绝原因：<span style="color: #fd7159ff">{{ SKU.productSkuScItemInfoDto.unbindRefuseReason }}</span>
                </template>
              </a-row>
              <a-row>
                <template v-if="SKU.skuAuditStatus === null || SKU.skuAuditStatus === '1'">
                  <a-tag color="green">审核通过</a-tag>
                  <a-divider type="vertical"></a-divider>
                  供货价：<span style="color: #9e9f9e">{{ SKU.supplyPrice }}</span>
                </template>
                <template v-else>
                  <a-tag color="red">审核不通过</a-tag>
                  <a-divider type="vertical"></a-divider>
                  建议供货价：<span style="color: #9e9f9e">{{ SKU.suggestPrice || '--' }}</span>
                  <a-divider type="vertical"></a-divider>
                  建议标签：<span style="color: #9e9f9e">{{ SKU.suggestNote || '--' }}</span>
                </template>
                <a-divider type="vertical"></a-divider>
                库存：<span style="color: #9e9f9e">{{ SKU.skuStock }}</span>
              </a-row>
            </div>
            <div v-if="record.searchSkuInfoList.length > 3">
              <a-button
                type="link"
                @click="record.SKUExpand = !record.SKUExpand"
                >共{{ record.searchSkuInfoList.length }}条SKU，{{ !record.SKUExpand ? '展开' : '收起' }}</a-button
              >
            </div>
          </div>
          <div v-if="column.key === 'productStatus'">
            <a-tag
              v-if="record.productStatus === 'ONLINE'"
              color="success"
              >在线</a-tag
            >
            <a-tag v-else-if="record.productStatus === 'PENDING_LAUNCH'">待上架</a-tag>
            <a-tag
              v-else-if="record.productStatus === 'PENDING_APPROVAL'"
              color="warning"
              >审核中</a-tag
            >
            <a-tag
              v-else-if="record.productStatus === 'VIOLATION_QC_FAILED'"
              color="error"
              >审核不通过</a-tag
            >
            <a-tag v-else-if="record.productStatus === 'OFFLINE'">已下架</a-tag>
            <span v-else>--</span>
          </div>
          <div v-if="column.key === 'create_time'">
            <span>{{ record.createdTime || '--' }}</span>
          </div>
          <div v-if="column.key === 'update_time'">
            <span>{{ record.modifiedTime || '--' }}</span>
          </div>
          <div v-if="column.key === 'option'">
            <a-button
              type="text"
              style="color: #0b56fa"
              @click.stop="edit(record)"
              >编辑</a-button
            >
            <a-button
              type="text"
              style="color: #67c23a"
              @click.stop="handleSyncOne(record)"
              >同步</a-button
            >
            <a-button
              type="text"
              style="color: #07c4d1"
              @click.stop="handleEditStock(record)"
              >库存<EditOutlined
            /></a-button>
            <a-button
              @click.stop="copy(record)"
              type="text"
              style="color: #0d9888"
              >复制</a-button
            >
          </div>
        </template>
      </a-table>

      <!-- <Pagination
        :total="total"
        :page.sync="tableParams.pageNum"
        :limit.sync="tableParams.pageSize"
        @pagination="getList"
      /> -->
    </a-card>
    <!-- 同步进度条 -->
    <!-- <SyncProgress
      :sync-loading="syncLoading"
      :percentage="syncPercentage"
      target="#table"
    /> -->
    <!-- 发布弹窗 -->
    <!-- <PublishDialog
      :dialog-visible.sync="dialogVisible"
      :query="query"
      @refresh="getList"
      @queryReset="query = {}"
    /> -->
    <!-- 库存弹窗 -->
    <a-modal
      title="编辑库存"
      v-model:open="stockDialogVisible"
      width="50%"
      :confirm-loading="stockEditLoading"
      :after-close="handleStockDialogClose"
      @ok="editStock"
    >
      <div class="content">
        <p>
          <span>安全库存 </span>
          <a-popover>
            <template #content>
              <span>JIT 产品低于安全库存将会被下架</span>
            </template>
            <InfoCircleOutlined />
          </a-popover>
          <span> : {{ safetyThreshold }}</span>
        </p>
        <a-table
          :columns="stockColumn"
          :data-source="stockTable"
          :loading="stockLoading"
        >
          <template #bodyCell="{ column, record, text }">
            <template v-if="skuPropertyList.includes(column.dataIndex)">
              <a-popover v-if="getImageUrl(record, column.dataIndex)" placement="right">
                <template #content>
                  <img
                    :src="getImageUrl(record, column.dataIndex)"
                    style="height: 400px; width: 400px"
                  />
                </template>
                <a-image
                  style="width: 56px; height: 56px; border: 1px solid #ccc;"
                  :src="getImageUrl(record, column.dataIndex)"
                />
              </a-popover>
              <span class="ml-2">{{ getLabel(record, column.dataIndex) }}</span>
            </template>
            <span v-else-if="column.dataIndex === 'skuCode'">{{ text || '--' }}</span>
            <!-- <a-input-number
              v-else
              v-model:value="record.skuWarehouseStockList[index - stockStartIndex - 1].sellableQuantity"
              :controls="false"
              :min="0"
              :max="999999"
              :precision="0"
              :disabled="record.skuWarehouseStockList[index - stockStartIndex - 1].warehouseType !== 'jit_warehouse'"
            ></a-input-number> -->
          </template>
        </a-table>
      </div>
    </a-modal>
    <!-- 复制弹窗 -->
    <a-modal
      title="选择店铺"
      v-model:open="copyDialogVisible"
      width="30%"
      :confirm-loading="copyLoading"
      :after-close="handleCopyDialogClose"
      @ok="copyConfirm"
    >
      <a-checkbox
        v-model:checked="checkAll"
        :indeterminate="isIndeterminate"
        @change="handleCheckAllChange"
        >全选</a-checkbox
      >
      <div style="margin: 15px 0"></div>
      <a-checkbox-group
        v-model:value="copyTargetSellerList"
        @change="handleCheckedSellersChange"
      >
        <a-checkbox
          v-for="item in accountList"
          :value="item.sellerId"
          :key="item.sellerId"
          >{{ item.simpleName }}</a-checkbox
        >
      </a-checkbox-group>
    </a-modal>
  </div>
</template>

<script>
  import { DEFAULT_TABLE_COLUMN } from './config'
  import mixinTable from '../mixinTable'
  import { useAliexpressChoiceProductStore } from '@/stores/aliexpress-choice-product'
  import dayjs from 'dayjs'
  import { copyText } from '@/utils'
  import { accountCache } from '../apis/account'
  import { listApi, syncListApi, syncOneApi, syncProgressApi, detailApi, queryStockApi, editStockApi, stockRuleApi, copyToDraftApi } from '../apis/choice-product'
  // import SyncProgress from '../components/SyncProgress'
  // import PublishDialog from './PublishDialog'
  import { CopyOutlined, InfoCircleOutlined, EditOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'
  import EmptyImg from '@/assets/images/aliexpress/empty.png'

  export default {
    name: 'ChoiceProduct',
    // components: { SyncProgress, PublishDialog },
    components: { CopyOutlined, InfoCircleOutlined, EditOutlined },
    mixins: [mixinTable],
    data() {
      return {
        store: useAliexpressChoiceProductStore(),
        EmptyImg,
        accountList: [],
        searchForm: {
          sellerId: undefined,
          productIds: undefined,
          productName: undefined,
          skuCode: undefined,
          productStatus: undefined,
          createTime: null,
          updateTime: null,
          prop: undefined,
          order: undefined
        },
        DEFAULT_TABLE_COLUMN,
        tableCode: 'ChoiceProduct',
        tableHeight: `${window.innerHeight}` - 375,
        tableParams: {
          pageNum: 1,
          pageSize: 50
        },
        tableData: [],
        total: 0,
        loading: false,
        selectedRowKeys: [],
        selectedRows: [],
        syncLoading: false,
        syncPercentage: 0,
        statusOptions: [
          { label: '在线', value: 'ONLINE' },
          { label: '待上架', value: 'PENDING_LAUNCH' },
          { label: '审核中', value: 'PENDING_APPROVAL' },
          { label: '审核不通过', value: 'VIOLATION_QC_FAILED' },
          { label: '已下架', value: 'OFFLINE' }
        ],
        dialogVisible: false,
        query: {},
        // 编辑库存相关
        stockDialogVisible: false, // 库存弹窗显隐
        curRow: {},
        safetyThreshold: 0, // 安全库存
        stockLoading: false,
        stockEditLoading: false,
        stockTable: [], // JIT SKU 库存
        // 复制产品相关
        copyDialogVisible: false,
        checkAll: false,
        isIndeterminate: true,
        copyTargetSellerList: [],
        copyLoading: false
      }
    },
    computed: {
      stockColumn() {
        const list = []
        if (this.stockTable[0]) {
          if (this.stockTable[0].skuPropertyList) {
            this.stockTable[0].skuPropertyList.forEach(property => {
              list.push({
                title: property.skuPropertyName,
                dataIndex: property.skuPropertyName,
                key: property.skuPropertyName,
                fixed: true
              })
            })
          }
          list.push({
            title: 'SKU 编码',
            dataIndex: 'skuCode',
            key: 'skuCode',
            fixed: true
          })
          // 仓库
          this.stockTable[0].skuWarehouseStockList.forEach(stockItem => {
            list.push({
              title: stockItem.warehouseName,
              dataIndex: stockItem.warehouseCode,
              key: stockItem.warehouseCode
            })
          })
        }

        return list
      },
      variantList() {
        return this.stockTable[0].skuWarehouseStockList.map(stockItem => stockItem.warehouseCode)
      },
      skuPropertyList() {
        return this.stockTable[0] && this.stockTable[0].skuPropertyList ? this.stockTable[0].skuPropertyList.map(property => property.skuPropertyName) : []
      }
    },
    mounted() {
      this.getAccountList()
    },
    methods: {
      filterOption(input, option) {
        return option.simpleName.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      getAccountList() {
        accountCache(true)
          .then(res => {
            this.accountList = res.data.accountDetail || []
            if (this.accountList.length === 0) {
              this.$alert('当前账号没有配置店铺, 请前往「账号配置」添加, 或联系管理员', '提示')
            } else {
              this.searchForm.sellerId = this.accountList[0].sellerId
            }
          })
          .finally(() => {
            this.getList()
          })
      },
      getList() {
        this.loading = true
        const params = {
          ...this.searchForm,
          ...this.tableParams,
          createAfter: this.searchForm.createTime ? dayjs(this.searchForm.createTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
          createBefore: this.searchForm.createTime ? dayjs(this.searchForm.createTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
          updateAfter: this.searchForm.updateTime ? dayjs(this.searchForm.updateTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
          updateBefore: this.searchForm.updateTime ? dayjs(this.searchForm.updateTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined
        }
        delete params.createTime
        delete params.updateTime

        listApi(params)
          .then(res => {
            const list = res.rows || []
            list.forEach(item => {
              item.SKUExpand = false
              item.images = item.imageUrls ? item.imageUrls.split(';') : []
            })
            this.tableData = list
            this.total = res.total
          })
          .finally(() => {
            this.loading = false
          })
      },
      search() {
        this.tableParams.pageNum = 1
        this.getList()
      },
      reset() {
        this.$refs.searchFormRef.resetFields()
        this.searchForm.createTime = null
        this.searchForm.updateTime = null
        this.tableParams.pageNum = 1
        this.getList()
      },
      handleSyncOne(record) {
        const params = {
          sellerId: record.sellerId,
          productId: record.productId
        }
        syncOneApi(params).then(res => {
          message.success(res.msg)
          this.getList()
        })
      },
      // 同步店铺商品
      handleSyncList() {
        this.syncLoading = true
        syncListApi({ sellerId: this.searchForm.sellerId })
          .then(res => {
            this.getSyncProgress(res.data)
          })
          .catch(e => {
            this.syncLoading = false
          })
      },
      // 同步进度条
      getSyncProgress(progressToken) {
        const params = {
          sellerId: this.searchForm.sellerId,
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
                this.syncLoading = false
                this.getList()
              }
            } else {
              setTimeout(() => {
                this.getSyncProgress(progressToken)
              }, 2 * 1000)
            }
          })
          .catch(e => {
            this.syncLoading = false
          })
      },
      goAliExpress(productId) {
        window.open(`https://vi.aliexpress.com/item/${productId}.html`)
      },
      handleDblClick(record) {
        this.goAliExpress(record.productId)
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
        return record.SKUExpand ? record.searchSkuInfoList : record.searchSkuInfoList.slice(0, 3)
      },
      edit(record) {
        const query = {
          sellerId: record.sellerId,
          productId: record.productId
        }
        this.query = query
        // this.$store.commit('aliexpress/SET_SELLER_ID', record.sellerId)
        // this.$store.commit('aliexpress/SET_IS_EDIT', true)
        this.store.$patch(state => {
          state.sellerId = record.sellerId
          state.isEdit = true
        })
        this.dialogVisible = true
      },
      // 打开编辑库存弹窗
      handleEditStock(record) {
        this.stockDialogVisible = true
        this.stockLoading = true
        this.curRow = record
        this.getStockRule({ sellerId: record.sellerId, categoryId: record.leafCategoryId })
        const params = {
          sellerId: record.sellerId,
          productId: record.productId
        }
        // 产品 SKU 详情
        const PromiseSKU = new Promise((resolve, reject) => {
          detailApi(params)
            .then(res => {
              const productSkuList = res.data.productSkuList || []
              resolve(productSkuList)
            })
            .catch(err => {
              reject(err)
            })
        })
        // 查询 JIT 库存数据
        const PromiseStock = new Promise((resolve, reject) => {
          queryStockApi(params)
            .then(res => {
              const productSkuStockList = res.data.productSkuStockList || []
              resolve(productSkuStockList)
            })
            .catch(err => {
              reject(err)
            })
        })
        Promise.all([PromiseSKU, PromiseStock]).then(([SKUInfo, stockInfo]) => {
          const list = SKUInfo.map(item => {
            const stockItem = stockInfo.find(stockItem => stockItem.skuId === item.skuId)
            let skuWarehouseStockList = []
            if (stockItem) {
              skuWarehouseStockList = stockItem.skuWarehouseStockList.sort((a, b) => {
                if (a.warehouseType > b.warehouseType) {
                  return 1
                } else if (a.warehouseType === b.warehouseType) {
                  return 0
                } else if (a.warehouseType < b.warehouseType) {
                  return -1
                }
              })
            } else {
              skuWarehouseStockList = item.warehouseList
            }
            return {
              skuId: item.skuId,
              skuCode: item.skuCode,
              skuPropertyList: item.skuPropertyList,
              skuWarehouseStockList
            }
          })
          this.stockTable = list
          this.stockLoading = false
        })
      },
      // 查询 JIT 库存规则(安全库存数)
      getStockRule(params) {
        stockRuleApi(params).then(res => {
          this.safetyThreshold = res.data.result.productJitRuleDto.safetyThreshold
        })
      },
      // 编辑 JIT 库存
      editStock() {
        this.stockEditLoading = true
        const productSkuStockList = this.stockTable.map(item => {
          return {
            skuId: item.skuId,
            skuWarehouseStockList: item.skuWarehouseStockList.map(stockItem => ({
              warehouseCode: stockItem.warehouseCode,
              warehouseType: stockItem.warehouseType,
              sellableQuantity: stockItem.sellableQuantity
            }))
          }
        })
        const params = {
          sellerId: this.curRow.sellerId,
          productId: this.curRow.productId,
          productSkuStockList
        }
        editStockApi(params)
          .then(res => {
            this.handleSyncOne({ sellerId: this.curRow.sellerId, productId: this.curRow.productId })
            message.success('编辑库存成功')
          })
          .finally(() => {
            this.stockEditLoading = false
            this.handleStockDialogClose()
          })
      },
      // 关闭库存弹窗
      handleStockDialogClose() {
        this.curRow = {}
        this.safetyThreshold = 0
        this.stockTable = []
        this.stockDialogVisible = false
      },
      // 获取 SKU 展示的图片
      getImageUrl(record, prop) {
        const attr = record.skuPropertyList.find(item => item.skuPropertyName === prop)
        if (attr && attr.skuImage) {
          return attr.skuImage
        } else {
          return ''
        }
      },
      // 获取 SKU 展示的属性值
      getLabel(record, prop) {
        const attr = record.skuPropertyList.find(item => item.skuPropertyName === prop)
        if (attr) {
          return attr.propertyValueDefinitionName ? `${attr.skuPropertyValue} (${attr.propertyValueDefinitionName})` : attr.skuPropertyValue
        } else {
          return '--'
        }
      },
      // 复制商品弹窗相关
      handleCheckAllChange(e) {
        this.copyTargetSellerList = this.checkAll ? this.accountList.map(item => item.sellerId) : []
        this.isIndeterminate = false
      },
      handleCheckedSellersChange(value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.accountList.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.accountList.length
      },
      copy(record) {
        this.curRow = record
        this.copyDialogVisible = true
      },
      copyConfirm() {
        if (this.copyTargetSellerList.length === 0) {
          message.warning('请选择店铺')
          return
        }

        this.copyLoading = true
        const params = {
          sellerId: this.curRow.sellerId,
          productId: this.curRow.productId,
          targetSellerIds: this.copyTargetSellerList.join(',')
        }
        copyToDraftApi(params)
          .then(res => {
            message.success('复制成功, 请在待发布商品列表中查看')
            this.handleCopyDialogClose()
          })
          .finally(() => {
            this.copyLoading = false
          })
      },
      handleCopyDialogClose() {
        console.log('close hehe')
        this.curRow = {}
        this.copyTargetSellerList = []
        this.copyDialogVisible = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .choice-product {
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
  }
</style>
