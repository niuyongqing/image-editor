<!-- 全托管 列表 -->
<template>
  <div class="choice-product">
    <!-- 搜索区 -->
    <a-card>
      <a-descriptions :column="1">
        <a-descriptions-item label="店铺账号">
          <TiledSelect
            v-model:value="searchForm.sellerId"
            :options="accountList"
            :field-names="{ label: 'simpleName', value: 'sellerId' }"
          />
        </a-descriptions-item>
        <a-descriptions-item label="搜索类型">
          <TiledSelect
            v-model:value="searchForm.prop"
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
              v-model:value="searchForm.content"
              :hide-control="['productName'].includes(searchForm.prop)"
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
            <a-form-item
              name="category"
              label="产品分类"
            >
              <a-cascader
                v-model:value="extendSearchForm.category"
                :options="[]"
                expand-trigger="hover"
                placeholder="请选择"
              />
            </a-form-item>
            <a-form-item
              name="reason"
              label="审核不通过原因"
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
              label="视频筛选"
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
              name="rules"
              label="合规内容"
            >
              <a-select
                v-model:value="extendSearchForm.rules"
                placeholder="请选择"
                allow-clear
                :options="[]"
              >
              </a-select>
            </a-form-item>
            <a-form-item
              name="gpsr"
              label="欧盟GPSR合规标签"
            >
              <a-select
                v-model:value="extendSearchForm.gpsr"
                placeholder="请选择"
                allow-clear
                :options="gpsrOpions"
              >
              </a-select>
            </a-form-item>
            <a-form-item
              name="brand"
              label="品牌"
            >
              <a-select
                v-model:value="extendSearchForm.brand"
                placeholder="请选择"
                allow-clear
                :options="[]"
              >
              </a-select>
            </a-form-item>
            <a-form-item
              name="remark"
              label="备注"
            >
              <a-select
                v-model:value="extendSearchForm.remark"
                placeholder="请选择"
                allow-clear
                :options="remarkOpions"
              >
              </a-select>
            </a-form-item>
            <a-form-item
              name="createTime"
              label="创建时间："
            >
              <a-range-picker
                v-model:value="extendSearchForm.createTime"
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
                v-model:value="extendSearchForm.updateTime"
                :disabled-date="cur => cur > Date.now()"
                allow-clear
              >
              </a-range-picker>
            </a-form-item>

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
        <a-descriptions-item label="备货类型">
          <TiledSelect
            v-model:value="searchForm.productType"
            :options="productTypeOptions"
          />
        </a-descriptions-item>
        <a-descriptions-item label="排序类型">
          <TiledSelectSort
            v-model:value="searchForm.order"
            v-model:sortType="searchForm.sortType"
            :options="sortTypeOptions"
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
            @click="goPublish"
            >发布商品</a-button
          >
          <a-button
            type="primary"
            title="选择店铺后同步"
            class="ml-[10px]"
            :loading="syncProgressOpen"
            :disabled="!searchForm.sellerId"
            @click="handleSyncList"
            >批量同步店铺商品</a-button
          >
        </div>
        <a-pagination
          size="small"
          v-model:current="tableParams.pageNum"
          v-model:pageSize="tableParams.pageSize"
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
        :data-source="tableData"
        :loading="loading"
        stripe
        ref="tableRef"
        row-key="productId"
        :pagination="false"
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
      <a-pagination
        size="small"
        v-model:current="tableParams.pageNum"
        v-model:pageSize="tableParams.pageSize"
        :total="total"
        :default-page-size="50"
        show-size-changer
        show-quick-jumper
        :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
        @change="onPaginationChange"
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
          :scroll="{ y: 800 }"
          :pagination="{ defaultPageSize: 50, hideOnSinglePage: true }"
        >
          <template #bodyCell="{ column, record, text }">
            <template v-if="skuPropertyList.includes(column.dataIndex)">
              <a-popover
                v-if="getImageUrl(record, column.dataIndex)"
                placement="right"
              >
                <template #content>
                  <img
                    :src="getImageUrl(record, column.dataIndex)"
                    style="height: 400px; width: 400px"
                  />
                </template>
                <a-image
                  style="width: 56px; height: 56px; border: 1px solid #ccc"
                  :src="getImageUrl(record, column.dataIndex)"
                />
              </a-popover>
              <span class="ml-2">{{ getLabel(record, column.dataIndex) }}</span>
            </template>
            <span v-else-if="column.dataIndex === 'skuCode'">{{ text || '--' }}</span>
            <a-input-number
              v-else
              v-model:value="record.skuWarehouseStockList[getIndex(column.dataIndex)].sellableQuantity"
              :controls="false"
              :min="0"
              :max="999999"
              :precision="0"
              :disabled="record.skuWarehouseStockList[getIndex(column.dataIndex)].warehouseType !== 'jit_warehouse'"
            />
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
  import { CopyOutlined, InfoCircleOutlined, EditOutlined, UpSquareOutlined, DownSquareOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'
  import EmptyImg from '@/assets/images/aliexpress/empty.png'
  import TiledSelect from '~/components/tiled-select/index.vue'
  import TiledSelectSort from '~/components/tiled-select-sort/index.vue'
  import SearchContentInput from '~/components/search-content-input/index.vue'

  export default {
    name: 'ChoiceProduct',
    components: { CopyOutlined, InfoCircleOutlined, EditOutlined, UpSquareOutlined, DownSquareOutlined, TiledSelect, TiledSelectSort, SearchContentInput },
    mixins: [mixinTable],
    data() {
      return {
        store: useAliexpressChoiceProductStore(),
        EmptyImg,
        accountList: [],
        searchPropOptions: [
          { label: '标题', value: 'productName' },
          { label: '商品编码', value: 'skuCode' },
          { label: '产品ID', value: 'productIds' }
        ],
        placeholderEnum: {
          productName: '标题',
          skuCode: '商品编码',
          productIds: '产品ID; 支持批量，举例：ID1,ID2,ID3'
        },
        productTypeOptions: [
          { label: '国内履约', value: '1' },
          { label: '海外备货', value: '2', disabled: true }
        ],
        sortTypeOptions: [
          { label: '按创建时间', value: '1' },
          { label: '按更新时间', value: '2' }
        ],
        isFold: true, // 高级搜索状态 折叠/展开
        // 高级搜索表单
        extendSearchForm: {
          category: undefined,
          reason: undefined,
          withVideo: undefined,
          rules: undefined,
          gpsr: undefined,
          brand: undefined,
          remark: undefined,
          createTime: null,
          updateTime: null
        },
        searchForm: {
          sellerId: undefined,
          productIds: undefined,
          productName: undefined,
          skuCode: undefined,
          productStatus: undefined,
          createTime: null,
          updateTime: null,
          prop: 'productName',
          content: undefined,
          order: undefined,
          sortType: undefined,
          productType: undefined
        },
        DEFAULT_TABLE_COLUMN,
        tableCode: 'ChoiceProduct',
        tableData: [],
        loading: false,
        selectedRowKeys: [],
        selectedRows: [],
        syncProgressOpen: false,
        syncPercentage: 0,
        statusOptions: [
          { label: '在线', value: 'ONLINE' },
          { label: '待上架', value: 'PENDING_LAUNCH' },
          { label: '审核中', value: 'PENDING_APPROVAL' },
          { label: '审核不通过', value: 'VIOLATION_QC_FAILED' },
          { label: '已下架', value: 'OFFLINE' }
        ],
        withVideoOpions: [
          { label: '有视频的产品', value: '1' },
          { label: '无视频的产品', value: '2' }
        ],
        gpsrOpions: [
          { label: '未上传', value: '1' },
          { label: '已上传', value: '2' }
        ],
        remarkOpions: [
          { label: '有备注', value: '1' },
          { label: '无备注', value: '2' }
        ],
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
      skuPropertyList() {
        return this.stockTable[0] && this.stockTable[0].skuPropertyList ? this.stockTable[0].skuPropertyList.map(property => property.skuPropertyName) : []
      }
    },
    watch: {
      searchForm: {
        handler: function () {
          // this.getList()
        },
        deep: true
      }
    },
    mounted() {
      this.getAccountList()
    },
    methods: {
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
        this.extendSearchForm.createTime = null
        this.extendSearchForm.updateTime = null
      },
      // 收起高级搜索
      foldExtendSearch() {
        this.resetExtendSearchForm()
        this.isFold = true
      },
      extendSearch() {
        console.log('ExtendSearch')
      },
      filterOption(input, option) {
        return option.simpleName.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      getAccountList() {
        accountCache(true)
          .then(res => {
            this.accountList = res.data.accountDetail || []
            if (this.accountList.length === 0) {
              this.$alert('当前账号没有配置店铺, 请前往「账号配置」添加, 或联系管理员', '提示')
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
        this.syncProgressOpen = true
        syncListApi({ sellerId: this.searchForm.sellerId })
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
                this.syncProgressOpen = false
                this.getList()
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
      // 获取仓库下标
      getIndex(dataIndex) {
        return this.stockTable[0].skuWarehouseStockList.findIndex(item => item.warehouseCode === dataIndex)
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
        this.curRow = {}
        this.copyTargetSellerList = []
        this.copyDialogVisible = false
      },
      goPublish() {
        window.open(location.origin + '/aliexpress/choice-product-publish')
      }
    }
  }
</script>

<style lang="less" scoped>
  .choice-product {
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
