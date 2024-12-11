<!-- 待发布全托管 列表 -->
<template>
  <div class="choice-product-draft">
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
          name="draftId"
          label="草稿ID："
        >
          <a-textarea
            v-model:value="searchForm.draftId"
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
          />
        </a-form-item>
        <a-form-item
          name="skuCode"
          label="SKU编码："
        >
          <a-input
            v-model:value="searchForm.skuCode"
            placeholder="SKU编码"
            style="width: 200px"
          />
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
    <a-card class="m-2.5">
      <div class="btns">
        <div class="left-group">
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
        :loading="loading"
        :columns="displayHeader"
        :data-source="tableData"
        stripe
        ref="tableRef"
        row-key="draftId"
        :pagination="false"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
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
                  <div class="text-overflow">
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
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import { DEFAULT_TABLE_COLUMN } from './config'
  import mixinTable from '../mixinTable'
  import { useAliexpressChoiceProductStore } from '@/stores/aliexpress-choice-product'
  import { copyText } from '@/utils'
  import { accountCache } from '../apis/account'
  import { draftListApi, createBatchApi, delDraftApi } from '../apis/choice-product-draft'
  import { createApi } from '../apis/choice-product'
  import { CopyOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'
  import EmptyImg from '@/assets/images/aliexpress/empty.png'

  export default {
    name: 'ChoiceProductDraft',
    components: { CopyOutlined },
    mixins: [mixinTable],
    data() {
      return {
        dayjs,
        store: useAliexpressChoiceProductStore(),
        EmptyImg,
        accountList: [],
        searchForm: {
          sellerId: undefined,
          draftId: undefined,
          productName: undefined,
          skuCode: undefined,
          prop: undefined,
          order: undefined
        },
        DEFAULT_TABLE_COLUMN,
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
              message.error('当前账号没有配置店铺, 请前往「账号配置」添加, 或联系管理员')
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
        // 重置选择的数据
        this.selectedRowKeys = []
        this.selectedRows = []

        const params = {
          ...this.searchForm,
          ...this.tableParams
        }

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
        this.store.$patch(state => {
          state.sellerId = record.sellerId
          state.isEdit = true
          state.productDetail = record
        })
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
      }
    }
  }
</script>

<style lang="less" scoped>
  .choice-product-draft {
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
    .pointer {
      cursor: pointer;
    }

    .ant-pagination {
      text-align: right;
    }
  }
</style>
