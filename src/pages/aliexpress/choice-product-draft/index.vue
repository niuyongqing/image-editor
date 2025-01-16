<!-- 待发布全托管 列表 -->
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
        title="勾选商品后批量操作"
        :disabled="selectedRows.length === 0"
        @click="batchPublish"
        >批量发布</a-button
      >
      <a-popconfirm
        okText="好的"
        cancelText="不用了"
        title="确定删除吗？"
        @confirm="del"
      >
        <a-button
          type="primary"
          danger
          class="ml-[10px]"
          title="勾选商品后批量操作"
          :disabled="selectedRows.length === 0"
          :loading="delLoading"
          >批量删除</a-button
        >
      </a-popconfirm>
    </a-space>
    <!-- TABLE 区 -->
    <a-card>
      <a-pagination
        v-model:current="tableParams.pageNum"
        v-model:pageSize="tableParams.pageSize"
        :total="total"
        class="text-right mb-3"
        :default-page-size="50"
        show-size-changer
        show-quick-jumper
        :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
        @change="getList"
      />

      <a-table
        :loading="loading"
        :columns="displayHeader"
        :data-source="tableData"
        stripe
        ref="tableRef"
        row-key="draftId"
        :pagination="false"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
        :scroll="{ x: 'max-content' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'draftId'">
            <div class="flex text-left">
              <a-popover placement="right">
                <template #content>
                  <img
                    :src="record.multimedia.mainImageList[0] || EmptyImg"
                    style="height: 400px; width: 400px"
                  />
                </template>
                <span>
                  <a-image-preview-group>
                    <a-image
                      style="width: 56px; height: 56px; border: 1px solid #ccc"
                      :src="record.multimedia.mainImageList[0] || EmptyImg"
                      :fallback="EmptyImg"
                    />
                    <a-image
                      v-for="url in record.multimedia.mainImageList.slice(1)"
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
                    class="truncate"
                  >
                    {{ getTitle(record) }}
                  </div>
                </a-tooltip>
                <div style="color: #999">
                  草稿ID:
                  <span
                    title="复制ID"
                    style="cursor: pointer"
                    @click="copyId(record.draftId)"
                    >{{ record.draftId }} <CopyOutlined
                  /></span>
                </div>
              </div>
            </div>
          </template>
          <div v-if="column.key === 'productType'">
            <span>{{ { 0: '国内仓发', 1: '国内即时补货模式（JIT）', 2: '海外备仓' }[record.productExtDto.productType] }}</span>
          </div>
          <div
            v-if="column.key === 'skus'"
            style="text-align: left"
          >
            <div
              v-for="(SKU, index) in displayedSkus(record)"
              :key="index"
            >
              <p>SKU属性：{{ SKUVariation(SKU) }}</p>
              <a-row>
                SKU编码：<span style="color: #9e9f9e">{{ SKU.skuCode }}</span>
                <a-divider type="vertical" />
                货品条码：<span style="color: #9e9f9e">{{ SKU.scItemInfoDto.scItemBarCode || '--' }}</span>
                <a-divider type="vertical" />
                供货价：<span style="color: #9e9f9e">{{ SKU.supplyPrice || '--' }}</span>
                <a-divider type="vertical" />
                库存：<span style="color: #9e9f9e">{{ SKUStock(SKU) }}</span>
              </a-row>
              <a-divider class="my-3" />
            </div>
            <div v-if="record.productSkuList.length > 3">
              <a-button
                type="link"
                @click="record.SKUExpand = !record.SKUExpand"
                >共{{ record.productSkuList.length }}条SKU，{{ !record.SKUExpand ? '展开' : '收起' }}</a-button
              >
            </div>
          </div>
          <div v-if="column.key === 'saveTime'">
            <span>{{ dayjs(record.saveTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
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
              style="color: #28f728"
              @click.stop="publish(record)"
              >发布</a-button
            >
            <a-popconfirm
              cancel-text="好的"
              ok-text="不用了"
              title="删除吗？"
              @confirm="del(record)"
            >
              <a-button
                type="text"
                class="ml-10px"
                style="color: red"
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
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import { DEFAULT_TABLE_COLUMN } from './config'
  import { copyText } from '@/utils'
  import { accountCacheApi } from '../apis/common'
  import { draftListApi, createBatchApi, delDraftApi } from '../apis/choice-product-draft'
  import { createApi } from '../apis/choice-product'
  import { CopyOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'
  import EmptyImg from '@/assets/images/aliexpress/empty.png'

  export default {
    name: 'ChoiceProductDraft',
    components: { CopyOutlined },
    data() {
      return {
        dayjs,
        EmptyImg,
        accountList: [],
        // 被 watch 监听的搜索表单; 外层, 点击即可搜索
        watchedSearchForm: {
          sellerId: undefined,
          prop: 'create_time',
          order: 'desc',
          productType: undefined,
          productStatus: 'ONLINE'
        },
        isFold: true,
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
        searchPropOptions: [
          { label: '标题', value: 'productName' },
          { label: '商品编码', value: 'skuCode' },
          { label: '草稿ID', value: 'draftId' }
        ],
        placeholderEnum: {
          productName: '标题',
          skuCode: '商品编码, 多个SKU间用英文逗号隔开',
          draftId: '草稿ID, 多个ID间用英文逗号隔开'
        },
        remarkOpions: [
          { label: '有备注', value: '1' },
          { label: '无备注', value: '2' }
        ],
        productTypeOptions: [
          { label: '国内履约', value: '1' },
          { label: '海外备货', value: '2', disabled: true }
        ],
        sortTypeOptions: [
          { label: '按创建时间', value: 'create_time' },
          { label: '按更新时间', value: 'update_time' }
        ],
        DEFAULT_TABLE_COLUMN,
        tableHeader: [],
        tableCode: 'ChoiceProductDraft',
        tableParams: {
          pageNum: 1,
          pageSize: 50
        },
        tableData: [],
        total: 0,
        loading: false,
        selectedRowKeys: [],
        selectedRows: [],
        delLoading: false
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
      // 获取表头
      getTableHeader() {
        this.tableHeader = this.DEFAULT_TABLE_COLUMN
      },
      onSelectChange(keys, rows) {
        this.selectedRowKeys = keys
        this.selectedRows = rows
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

        draftListApi(params)
          .then(res => {
            const list = res.rows || []
            list.forEach(item => {
              item.SKUExpand = false
            })
            this.tableData = list
            this.total = res.total
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
        this.lazySearchForm.createTime = null
        this.lazySearchForm.updateTime = null
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
      getTitle(record) {
        const locale = record.productInfoDto.locale || 'en_US'
        return record.productInfoDto.subjectList.filter(item => item.locale === locale)[0].value
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
        return record.SKUExpand ? record.productSkuList : record.productSkuList.slice(0, 3)
      },
      SKUVariation(SKU) {
        if (SKU.skuPropertyList) {
          return SKU.skuPropertyList.map(attr => `${attr.skuPropertyName}:${attr.skuPropertyValue}`).join(';')
        } else {
          return '<none>'
        }
      },
      SKUStock(SKU) {
        let sum = 0
        SKU.warehouseList.forEach(item => {
          sum += item.sellableQuantity
        })
        return sum
      },
      batchPublish() {
        const draftIds = this.selectedRows.map(row => record.draftId).join(',')
        createBatchApi({ draftIds }).then(res => {
          message.success('发布成功')
          this.getList()
        })
      },
      edit(record) {
        const query = `?draftId=${record.draftId}`
        window.open(location.origin + '/platform/aliexpress/choice-product-publish' + query)
      },
      publish(record) {
        const params = {
          ...row
        }
        delete params.SKUExpand
        delete params.saveTime

        createApi(params).then(res => {
          message.success('发布成功')
          this.getList()
        })
      },
      del(record) {
        let draftIds
        if (record) {
          draftIds = record.draftId
        } else {
          draftIds = this.selectedRows.map(item => item.draftId).join(',')
        }
        this.delLoading = true
        delDraftApi({ draftIds })
          .then(res => {
            this.getList()
          })
          .finally(() => {
            this.delLoading = false
          })
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
