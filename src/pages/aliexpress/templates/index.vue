<!-- 刊登用的模板集合 -->
<template>
  <div class="templates text-left">
    <div class="left">
      <a-card
        title="常用模版"
        :bordered="false"
        style="width: 200px"
      >
        <div
          :class="['template-item', activedValue === item.value && 'active']"
          v-for="item in TEMPLATE_TYPE_LIST"
          :key="item.value"
          @click="toggle(item.value)"
        >
          {{ item.label }}
        </div>
      </a-card>
    </div>
    <div class="right">
      <!-- 搜索区 -->
      <a-card>
        <a-descriptions :column="1">
          <!-- 为区域调价模版时, 不显示 -->
          <a-descriptions-item
            label="店铺账号"
            v-if="activedValue !== 'nationalQuote'"
          >
            <TiledSelect
              v-model:value="watchedSearchForm.sellerId"
              :options="accountList"
              :field-names="{ label: 'simpleName', value: 'sellerId' }"
            />
          </a-descriptions-item>
          <a-descriptions-item label="搜索类型">
            <TiledSelect
              v-model:value="lazySearchForm.searchKey"
              :options="SEARCH_PROP_OPTIONS"
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
                :hide-control="['templateName'].includes(lazySearchForm.searchKey)"
                :placeholder="PLACEHOLDER_ENUM[lazySearchForm.searchKey]"
                @enter="search"
              />
              <a-button
                type="primary"
                :loading="loading"
                @click="search"
                >搜索</a-button
              >
            </a-space>
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
      <a-space class="my-4">
        <a-button
          type="primary"
          @click="add"
          >新增模版</a-button
        >
        <a-popconfirm
          title="确定删除吗？"
          @confirm="batchDel"
        >
          <a-button
            type="primary"
            danger
            title="勾选模板后批量操作"
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
          class="text-right mb-2.5"
          :total="total"
          :default-page-size="50"
          show-size-changer
          show-quick-jumper
          :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
          @change="getList"
        />
        <a-table
          :columns="displayHeader"
          :data-source="tableData"
          :loading="loading"
          stripe
          ref="tableRef"
          row-key="id"
          :pagination="false"
          :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
          :scroll="{ x: 'max-content' }"
        >
          <template #bodyCell="{ column, record }">
            <!-- <div v-if="column.key === '模版分类'"></div> -->
            <div v-if="column.key === 'status'">
              <a-switch
                v-model:checked="record.state"
                :checked-value="1"
                :un-checked-value="2"
                checked-children="开"
                un-checked-children="关"
                @change="state => statusChange(state, record)"
              />
            </div>
            <div v-if="column.key === 'option'">
              <a-button
                type="text"
                style="color: #0b56fa"
                @click="goEdit(record)"
                >编辑</a-button
              >
              <a-button
                type="text"
                style="color: #28f728"
                @click="copy(record)"
                >复制</a-button
              >
              <a-popconfirm
                title="删除吗?"
                @confirm="del(record.id)"
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
    </div>

    <!-- 属性模版 弹窗 -->
    <AttributeModal
      v-if="attributeOpen"
      v-model:open="attributeOpen"
      :account-list="accountList"
      :detail="templateDetail"
      @refresh="search"
    />

    <!-- 变种模版 -->
    <VariantModal
      v-if="variantOpen"
      v-model:open="variantOpen"
      :account-list="accountList"
      :detail="templateDetail"
      @refresh="search"
    />

    <!-- 区域调价模版 -->
    <NationalQuoteModal
      v-if="nationalQuoteOpen"
      v-model:open="nationalQuoteOpen"
      :countries="countries"
      :detail="templateDetail"
      @refresh="search"
    />
  </div>
</template>

<script>
  import { ALL_TABLE_COLUMN } from './config'
  import { cloneDeep } from 'lodash'
  import { accountCacheApi } from '../apis/common'
  import { areaListApi } from '../apis/product'
  import { templateListApi, templateAddApi, templateUpdateApi, templateDelApi, templateBatchDelApi, templateUpdateStateApi } from '../apis/templates'
  import { message } from 'ant-design-vue'
  import AttributeModal from './components/AttributeModal.vue'
  import VariantModal from './components/VariantModal.vue'
  import NationalQuoteModal from './components/NationalQuoteModal.vue'

  export default {
    name: 'Templates',
    components: { AttributeModal, VariantModal, NationalQuoteModal },
    data() {
      return {
        TEMPLATE_TYPE_LIST: [
          { label: '属性模版', value: 'attribute' },
          { label: '变种模版', value: 'variant' },
          { label: '调价模版', value: 'nationalQuote' }
        ],
        SEARCH_PROP_OPTIONS: [{ label: '模版名称', value: 'templateName' }],
        PLACEHOLDER_ENUM: {
          templateName: '模版名称'
        },
        activedValue: 'attribute',
        // 后端定义: 1:产品模板 2:自定义模板 3:区域调价模板 4:尺码模板  5:汽配模板 6:产品属性模板 7:变种模板
        TEMPLATE_TYPE_ENUM: {
          attribute: 6,
          variant: 7,
          nationalQuote: 3
        },
        accountList: [],
        // 被 watch 监听的搜索表单; 外层, 点击即可搜索
        watchedSearchForm: {
          sellerId: undefined
        },
        // 高级搜索表单; 需点击'搜索'按钮再执行搜索动作
        lazySearchForm: {
          searchKey: 'templateName', // 搜索类型
          searchValue: undefined // 搜索内容
        },
        tableParams: {
          pageNum: 1,
          pageSize: 50
        },
        total: 0,
        tableHeader: [],
        ALL_TABLE_COLUMN,
        tableCode: 'Template',
        tableData: [],
        loading: false,
        selectedRowKeys: [],
        selectedRows: [],
        delLoading: false,
        /** 模版弹窗 */
        attributeOpen: false,
        variantOpen: false,
        nationalQuoteOpen: false,
        templateDetail: {},
        // 区域调价模版用的 国家(区域)
        countries: []
      }
    },
    computed: {
      displayHeader() {
        return this.tableHeader.filter(column => column.scope.includes(this.activedValue))
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
      // 获取区域数据
      this.getAreaList()
      this.getTableHeader()
      this.getAccountList()
    },
    methods: {
      getAreaList() {
        areaListApi().then(res => {
          this.countries = res.data || []
        })
      },
      // 获取表头
      getTableHeader() {
        this.tableHeader = this.ALL_TABLE_COLUMN
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
          templateType: this.TEMPLATE_TYPE_ENUM[this.activedValue],
          ...this.watchedSearchForm,
          ...this.lazySearchForm,
          [this.lazySearchForm.searchKey]: this.lazySearchForm.searchValue,
          ...this.tableParams
        }
        delete params.searchKey
        delete params.searchValue
        this.activedValue === 'nationalQuote' && delete params.sellerId

        templateListApi(params)
          .then(res => {
            const list = res.rows || []
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
      toggle(value) {
        if (value === this.activedValue) return

        this.activedValue = value
        this.search()
      },
      statusChange(state, record) {
        templateUpdateStateApi({ state, id: record.id }).catch(() => {
          record.state = state === 1 ? 2 : 1
        })
      },
      openModal() {
        switch (this.activedValue) {
          case 'attribute':
            this.attributeOpen = true
            break
          case 'variant':
            this.variantOpen = true
            break
          case 'nationalQuote':
            this.nationalQuoteOpen = true
            break
        }
      },
      add() {
        this.templateDetail = {}
        this.openModal()
      },
      goEdit(record) {
        this.templateDetail = cloneDeep(record)
        this.openModal()
      },
      copy(record) {
        this.templateDetail = cloneDeep(record)
        delete this.templateDetail.id
        this.openModal()
      },
      del(id) {
        templateDelApi({ id }).then(res => {
          this.getList()
        })
      },
      // 批量删除
      batchDel() {
        this.delLoading = true
        templateBatchDelApi(this.selectedRowKeys)
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
  .templates {
    display: flex;
    .left {
      user-select: none;
      flex: none;
      margin-right: 16px;
      .template-item {
        cursor: pointer;
        position: relative;
        height: 32px;
        line-height: 32px;
        padding-left: 12px;
      }
      .active {
        color: var(--pro-ant-color-primary);
        background-color: var(--pro-ant-color-primary-bg);
        &::before {
          content: '';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 100%;
          background-color: var(--pro-ant-color-primary);
        }
      }
    }
    .right {
      flex: 1;
    }
  }
</style>
