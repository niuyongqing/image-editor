<template>
  <!-- 待发布全托管 列表 -->
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
            v-model="searchForm.sellerId"
            placeholder="请选择店铺"
            show-search
            allow-clear
            :options="accountList"
            :field-names="{ label: 'simpleName', value: 'sellerId' }"
            :filter-option="filterOption"
          >
          </a-select>
        </a-form-item>
        <a-form-item
          name="draftId"
          label="草稿ID："
        >
          <a-textarea
            v-model="searchForm.draftId"
            placeholder="支持批量，举例：ID1,ID2,ID3"
            :autosize="{ minRows: 1, maxRows: 5 }"
            style="width: 200px"
          ></a-textarea>
        </a-form-item>
        <a-form-item
          name="productName"
          label="商品标题："
        >
          <a-input
            v-model="searchForm.productName"
            placeholder="商品标题"
            style="width: 200px"
          ></a-input>
        </a-form-item>
        <a-form-item
          name="skuCode"
          label="SKU编码："
        >
          <a-input
            v-model="searchForm.skuCode"
            placeholder="SKU编码"
            style="width: 200px"
          ></a-input>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            @click="search"
            >查询</a-button
          >
          <a-button @click="reset">重置</a-button>
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
              class="ml-10"
              title="勾选商品后批量操作"
              :disabled="selectedRows.length === 0"
              :loading="delLoading"
              >批量删除</a-button
            >
          </a-popconfirm>
        </div>
        <a-space>
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
                      v-model="item.show"
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
              type="danger"
              :loading="tableSettingLoading"
              >重置表格设置</a-button
            >
          </a-popconfirm>
        </a-space>
      </div>

      <a-spin :spinning="loading">
        <s-table
          :height="tableHeight"
          :columns="displayHeader"
          :dataSource="tableData"
          stripe
          ref="tableRef"
          row-key="id"
          @selection-change="handleSelectionChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'draftId'">
              <div class="flex text-left">
                <a-popover placement="right">
                  <template #content>
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
                  </template>
                  <img
                    :src="record.multimedia.mainImageList[0] || EmptyImg"
                    style="height: 400px; width: 400px"
                  />
                </a-popover>
                <div style="margin-left: 10px; width: 90%">
                  <a-tooltip
                    :title="getTitle(record)"
                    placement="top"
                  >
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
              <div v-if="row.productSkuList.length > 3">
                <a-button
                  type="text"
                  @click="row.SKUExpand = !row.SKUExpand"
                  >共{{ row.productSkuList.length }}条SKU，{{ !row.SKUExpand ? '展开' : '收起' }}</a-button
                >
              </div>
            </div>
            <div v-if="column.key === 'saveTime'">
              <span>{{ dayjs(row.saveTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </div>
            <div v-if="column.key === 'option'">
              <a-button
                type="text"
                style="color: #0b56fa"
                @click.stop="edit(row)"
                >编辑</a-button
              >
              <a-button
                type="text"
                style="color: #28f728"
                @click.stop="publish(row)"
                >发布</a-button
              >
              <a-popconfirm
                cancel-text="好的"
                ok-text="不用了"
                title="删除吗？"
                @confirm="del(row)"
              >
                <a-button
                  type="text"
                  class="ml-10"
                  style="color: red"
                  >删除</a-button
                >
              </a-popconfirm>
            </div>
          </template>
        </s-table>
      </a-spin>
      <!-- <Pagination
        :total="total"
        :page.sync="tableParams.pageNum"
        :limit.sync="tableParams.pageSize"
        @pagination="getList"
      /> -->
    </a-card>
    <!-- 发布弹窗 -->
    <!-- <PublishDialog
      v-model:dialog-visible="dialogVisible"
      @refresh="getList"
    /> -->
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import { DEFAULT_TABLE_COLUMN } from './config'
  import mixinTable from '../mixinTable'
  import { copyText } from '@/utils'
  import { accountCache } from '../apis/account'
  import { draftListApi, createBatchApi, delDraftApi } from '../apis/choice-product-draft'
  import { createApi } from '../apis/choice-product'
  import { CopyOutlined } from '@ant-design/icons-vue'
  // import PublishDialog from '../choiceProduct/PublishDialog.vue'

  export default {
    name: 'ChoiceProductDraft',
    // components: { PublishDialog },
    mixins: [mixinTable],
    data() {
      return {
        EmptyImg: require('@/assets/images/aliexpress/empty.png'),
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
        tableHeight: `${window.innerHeight}` - 330,
        tableParams: {
          pageNum: 1,
          pageSize: 50
        },
        tableData: [],
        total: 0,
        loading: false,
        selectedRows: [],
        dialogVisible: false,
        delLoading: false
      }
    },
    // 如果是打开弹窗状态, 路由离开时校验一下是否编辑
    beforeRouteLeave(to, from, next) {
      const isEdited = true
      if (this.dialogVisible && isEdited) {
        this.$confirm('系统不会保存您所做的更改', '确定离开吗？', {
          type: 'warning'
        })
          .then(_ => {
            next()
          })
          .catch(_ => {
            next(false)
          })
      } else {
        next()
      }
    },
    mounted() {
      window.addEventListener('beforeunload', this.stopUnload)

      this.getAccountList()
    },
    beforeUnmount() {
      window.removeEventListener('beforeunload', this.stopUnload)
    },
    methods: {
      filterOption(input, option) {
        return option.simpleName.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      stopUnload(e) {
        // 如果刊登弹窗打开且有未保存内容, 页面卸载前弹出提醒
        const isEdited = true
        if (this.dialogVisible && isEdited) {
          e.preventDefault()
          e.returnValue = ''
        }
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
      getTitle(row) {
        const locale = row.productInfoDto.locale || 'en_US'
        return row.productInfoDto.subjectList.filter(item => item.locale === locale)[0].value
      },
      // 复制产品ID到剪贴板
      copyId(id) {
        copyText(id)
          .then(() => {
            this.$message.success('已复制')
          })
          .catch(err => {
            this.$message.error(err)
          })
      },
      displayedSkus(row) {
        return row.SKUExpand ? row.productSkuList : row.productSkuList.slice(0, 3)
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
        const draftIds = this.selectedRows.map(row => row.draftId).join(',')
        createBatchApi({ draftIds }).then(res => {
          this.$message.success('发布成功')
          this.getList()
        })
      },
      edit(row) {
        this.$store.commit('aliexpress/SET_SELLER_ID', row.sellerId)
        this.$store.commit('aliexpress/SET_IS_EDIT', true)
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$store.commit('aliexpress/SET_PRODUCT_DETAIL', row)
        })
      },
      publish(row) {
        const params = {
          ...row
        }
        delete params.SKUExpand
        delete params.saveTime

        createApi(params).then(res => {
          this.$message.success('发布成功')
          this.getList()
        })
      },
      del(row) {
        let draftIds
        if (row) {
          draftIds = row.draftId
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

<style lang="scss" scoped>
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
  }
</style>
