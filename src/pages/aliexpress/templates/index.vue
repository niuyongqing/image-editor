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
                :hide-control="['title'].includes(lazySearchForm.searchKey)"
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
          @confirm="del"
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
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :scroll="{ x: 'max-content' }"
        >
          <template #bodyCell="{ column, record }">
            <!-- <div v-if="column.key === '模版分类'"></div> -->
            <div v-if="column.key === 'status'">
              <a-switch
                v-model:checked="record.status"
                checked-value="1"
                un-checked-value="0"
                checked-children="开"
                un-checked-children="关"
                @change="statusChange"
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
    </div>

    <!-- 属性模版 弹窗 -->
    <AttributeModal
      v-if="attributeOpen"
      v-model:open="attributeOpen"
      :account-list="accountList"
      :id="attributeTemplateId"
    />
  </div>
</template>

<script>
  import { ALL_TABLE_COLUMN } from './config'
  import { accountCacheApi } from '../apis/common'
  import { message } from 'ant-design-vue'
  import AttributeModal from './components/AttributeModal.vue'

  export default {
    name: 'Templates',
    components: { AttributeModal },
    data() {
      return {
        TEMPLATE_TYPE_LIST: [
          { label: '属性模版', value: 'attribute' },
          { label: '变种模版', value: 'variant' },
          { label: '调价模版', value: 'nationalQuote' }
        ],
        SEARCH_PROP_OPTIONS: [{ label: '模版名称', value: 'title' }],
        PLACEHOLDER_ENUM: {
          title: '模版名称'
        },
        activedValue: 'attribute',
        accountList: [],
        // 被 watch 监听的搜索表单; 外层, 点击即可搜索
        watchedSearchForm: {
          sellerId: undefined
        },
        // 高级搜索表单; 需点击'搜索'按钮再执行搜索动作
        lazySearchForm: {
          searchKey: 'title', // 搜索类型
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
        attributeTemplateId: ''
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
      this.getTableHeader()
      this.getAccountList()
    },
    methods: {
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
        // this.loading = true
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

        // 根据当前选择的模板类型, 获取不同的数据列表
        /* const requestApi = {
          attribute: '',
          variant: '',
          nationalQuote: ''
        }[this.activedValue]
        requestApi(params)
          .then(res => {
            const list = res.rows || []
            this.tableData = list
            this.total = res.total
          })
          .finally(() => {
            this.loading = false
          }) */
        this.tableData = [
          {
            id: '1',
            name: 'test1',
            category: '钥匙链>流行饰品>珠宝',
            variant: '变种主题',
            time: '2025-02-27',
            status: '1'
          },
          {
            id: '13',
            name: 'test13',
            category: '钥匙链>流行饰品>珠宝',
            variant: '变种主题',
            time: '2025-02-27',
            status: '0'
          }
        ]
        this.total = 2
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
      statusChange(checked) {},
      add() {
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
      goEdit(record) {
        this.attributeTemplateId = record.id
      },
      copy(record) {},
      del(record) {}
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
