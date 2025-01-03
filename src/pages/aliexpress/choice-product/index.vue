<!-- 全托管 列表 -->
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
          <a-form
            v-show="!isFold"
            ref="extendSearchFormRef"
            :model="lazySearchForm"
            :label-col="{ style: { width: '130px' } }"
            class="mt-4 p-3 bg-[--pro-ant-color-primary-bg]"
          >
            <!-- <a-form-item
              name="category"
              label="产品分类"
            >
              <a-cascader
                v-model:value="lazySearchForm.category"
                :options="[]"
                :field-names="{ value: 'id' }"
                show-search
                placeholder="请选择"
              />
            </a-form-item> -->
            <a-form-item
              name="auditFailureType"
              label="审核不通过原因"
            >
              <a-select
                v-model:value="lazySearchForm.auditFailureType"
                placeholder="请选择"
                allow-clear
                :options="auditFailureTypeOptions"
              >
              </a-select>
            </a-form-item>
            <!-- <a-form-item
              name="brand"
              label="品牌"
            >
              <a-select
                v-model:value="lazySearchForm.brand"
                placeholder="请选择"
                allow-clear
                :options="[]"
              >
              </a-select>
            </a-form-item> -->
            <a-form-item
              name="commentType"
              label="有无备注"
            >
              <a-select
                v-model:value="lazySearchForm.commentType"
                placeholder="请选择"
                allow-clear
                :options="remarkOpions"
              >
              </a-select>
            </a-form-item>
            <a-form-item
              v-if="lazySearchForm.commentType === '1'"
              name="commentContent"
              label="备注内容"
            >
              <a-input
                v-model:value="lazySearchForm.commentContent"
                allow-clear
                placeholder="请输入"
              />
            </a-form-item>
            <a-form-item
              name="createTime"
              label="创建时间："
            >
              <a-range-picker
                v-model:value="lazySearchForm.createTime"
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
                v-model:value="lazySearchForm.updateTime"
                :disabled-date="cur => cur > Date.now()"
                allow-clear
              >
              </a-range-picker>
            </a-form-item>

            <a-form-item class="text-right mb-0">
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
                  @click="search"
                  >搜索</a-button
                >
              </a-space>
            </a-form-item>
          </a-form>
        </a-descriptions-item>
        <a-descriptions-item label="备货类型">
          <TiledSelect
            v-model:value="watchedSearchForm.productType"
            :options="productTypeOptions"
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
        @click="goPublish()"
        >发布商品</a-button
      >
      <a-button
        type="primary"
        title="选择店铺后同步"
        class="ml-2.5"
        :loading="syncProgressOpen"
        :disabled="!watchedSearchForm.sellerId"
        @click="handleSyncList"
        >批量同步店铺商品</a-button
      >
    </a-space>
    <!-- TABLE 区 -->
    <a-card>
      <div class="flex justify-between items-center">
        <a-tabs
          v-model:activeKey="watchedSearchForm.productStatus"
          :animated="false"
        >
          <a-tab-pane
            v-for="item in statusTabs"
            :key="item.value"
            :tab="`${item.label}(${statusCountEnum[item.value]})`"
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
                    class="truncate cursor-pointer"
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
                <a-divider type="vertical"/>
                货品条码：<span style="color: #9e9f9e">{{ SKU.productSkuScItemInfoDto.scItemBarCode || '--' }}</span>
                <a-divider type="vertical"/>
                货品ID：<span style="color: #9e9f9e">{{ SKU.productSkuScItemInfoDto.scItemId || '--' }}</span>
                <template v-if="SKU.productSkuScItemInfoDto.unbindRefuseReason">
                  <a-divider type="vertical"/>
                  解绑拒绝原因：<span style="color: #fd7159ff">{{ SKU.productSkuScItemInfoDto.unbindRefuseReason }}</span>
                </template>
              </a-row>
              <a-row>
                <template v-if="SKU.skuAuditStatus === null || SKU.skuAuditStatus === '1'">
                  <a-tag color="green">审核通过</a-tag>
                  <a-divider type="vertical"/>
                  供货价：<span style="color: #9e9f9e">{{ SKU.supplyPrice }}</span>
                </template>
                <template v-else>
                  <a-tag color="red">审核不通过</a-tag>
                  <a-divider type="vertical"/>
                  建议供货价：<span style="color: #9e9f9e">{{ SKU.suggestPrice || '--' }}</span>
                  <a-divider type="vertical"/>
                  建议标签：<span style="color: #9e9f9e">{{ SKU.suggestNote || '--' }}</span>
                </template>
                <a-divider type="vertical"/>
                库存：<span style="color: #9e9f9e">{{ SKU.skuStock }}</span>
              </a-row>
              <a-divider class="my-3"/>
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
              @click.stop="goPublish(record)"
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
  import { useAliexpressChoiceProductStore } from '@/stores/aliexpress-choice-product'
  import dayjs from 'dayjs'
  import { copyText } from '@/utils'
  import { accountCacheApi } from '../apis/common'
  import { listApi, syncListApi, syncOneApi, syncProgressApi, detailApi, queryStockApi, editStockApi, stockRuleApi, copyToDraftApi } from '../apis/choice-product'
  import { CopyOutlined, InfoCircleOutlined, EditOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'
  import EmptyImg from '@/assets/images/aliexpress/empty.png'
  import TiledSelect from '~/components/tiled-select/index.vue'
  import TiledSelectSort from '~/components/tiled-select-sort/index.vue'
  import SearchContentInput from '~/components/search-content-input/index.vue'

  export default {
    name: 'ChoiceProduct',
    components: { CopyOutlined, InfoCircleOutlined, EditOutlined },
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
          skuCode: '商品编码, 多个SKU间用英文逗号隔开',
          productIds: '产品ID, 多个ID间用英文逗号隔开'
        },
        productTypeOptions: [
          { label: '国内履约', value: '1' },
          { label: '海外备货', value: '2', disabled: true }
        ],
        sortTypeOptions: [
          { label: '按创建时间', value: 'create_time' },
          { label: '按更新时间', value: 'update_time' }
        ],
        isFold: true, // 高级搜索状态 折叠/展开
        // 被 watch 监听的搜索表单; 外层, 点击即可搜索
        watchedSearchForm: {
          sellerId: undefined,
          prop: 'create_time',
          order: 'desc',
          productType: undefined,
          productStatus: 'ONLINE'
        },
        // 高级搜索表单; 需点击'搜索'按钮再执行搜索动作
        lazySearchForm: {
          searchKey: 'productName',
          searchValue: undefined,
          // category: undefined,
          auditFailureType: undefined,
          brand: undefined,
          commentType: undefined,
          commentContent: undefined,
          createTime: null,
          updateTime: null
        },
        tableParams: {
          pageNum: 1,
          pageSize: 50
        },
        total: 0,
        tableHeader: [],
        DEFAULT_TABLE_COLUMN,
        tableCode: 'ChoiceProduct',
        tableData: [],
        loading: false,
        selectedRowKeys: [],
        selectedRows: [],
        syncProgressOpen: false,
        syncPercentage: 0,
        auditFailureTypeOptions: [
          { label: '商品基础信息审核', value: 'audit_sub_status_basic' },
          { label: '商品供应价格审核', value: 'audit_sub_status_supply_price' },
          { label: '商品CRO审核', value: 'audit_sub_status_cro' },
          { label: '商品资质审核', value: 'audit_sub_status_qf' },
          { label: '商品零售价审核', value: 'audit_sub_status_sale_price' },
          { label: '商品上架审核', value: 'up_shelf_product' },
          { label: '商品下架审核', value: 'down_shelf_product' },
          { label: '商品删除审核', value: 'delete_product' },
          { label: '商品审核通过', value: 'audit_approve' },
          { label: '商品审核拒绝', value: 'audit_reject' }
        ],
        statusTabs: [
          { label: '在线', value: 'ONLINE' },
          { label: '待上架', value: 'PENDING_LAUNCH' },
          { label: '审核中', value: 'PENDING_APPROVAL' },
          { label: '审核不通过', value: 'VIOLATION_QC_FAILED' },
          { label: '已下架', value: 'OFFLINE' }
        ],
        statusCountEnum: {
          ONLINE: 0,
          PENDING_LAUNCH: 0,
          PENDING_APPROVAL: 0,
          VIOLATION_QC_FAILED: 0,
          OFFLINE: 0
        },
        remarkOpions: [
          { label: '有备注', value: '1' },
          { label: '无备注', value: '2' }
        ],
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
      displayHeader() {
        return this.tableHeader.filter(column => column.show)
      },
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
      // 获取表头
      getTableHeader() {
        this.tableHeader = this.DEFAULT_TABLE_COLUMN
      },
      onSelectChange(keys, rows) {
        this.selectedRowKeys = keys
        this.selectedRows = rows
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
        this.lazySearchForm.createTime = null
        this.lazySearchForm.updateTime = null
      },
      // 收起高级搜索
      foldExtendSearch() {
        this.resetExtendSearchForm()
        this.isFold = true
      },
      getAccountList() {
        accountCacheApi(true)
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
          ...this.tableParams,
          createAfter: this.lazySearchForm.createTime ? dayjs(this.lazySearchForm.createTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
          createBefore: this.lazySearchForm.createTime ? dayjs(this.lazySearchForm.createTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
          updateAfter: this.lazySearchForm.updateTime ? dayjs(this.lazySearchForm.updateTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
          updateBefore: this.lazySearchForm.updateTime ? dayjs(this.lazySearchForm.updateTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined
        }
        delete params.createTime
        delete params.updateTime
        delete params.searchKey
        delete params.searchValue

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
        this.watchedSearchForm.createTime = null
        this.watchedSearchForm.updateTime = null
        this.search()
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
      goPublish(record) {
        let query = ''
        if (record) {
          query = `?sellerId=${record.sellerId}&productId=${record.productId}`
        }
        window.open(location.origin + '/platform/aliexpress/choice-product-publish' + query)
      }
    }
  }
</script>
