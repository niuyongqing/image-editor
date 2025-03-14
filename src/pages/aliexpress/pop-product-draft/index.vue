<!-- 普通商品 列表 -->
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
            <a-form-item label="价格区间">
              <a-form-item
                name="priceLift"
                class="inline-block mb-0"
              >
                <a-input-number
                  v-model:value="lazySearchForm.priceLift"
                  placeholder="最小价格"
                  :min="0"
                  :max="999999"
                  :precision="2"
                />
              </a-form-item>
              <span class="mx-2">-</span>
              <a-form-item
                name="priceRight"
                class="inline-block mb-0"
              >
                <a-input-number
                  v-model:value="lazySearchForm.priceRight"
                  placeholder="最大价格"
                  :min="0"
                  :max="999999"
                  :precision="2"
                />
              </a-form-item>
            </a-form-item>
            <a-form-item label="库存区间">
              <a-form-item
                name="quantityLift"
                class="inline-block mb-0"
              >
                <a-input-number
                  v-model:value="lazySearchForm.quantityLift"
                  placeholder="最小库存"
                  :min="0"
                  :max="999999"
                  :precision="0"
                />
              </a-form-item>
              <span class="mx-2">-</span>
              <a-form-item
                name="quantityRight"
                class="inline-block mb-0"
              >
                <a-input-number
                  v-model:value="lazySearchForm.quantityRight"
                  placeholder="最大库存"
                  :min="0"
                  :max="999999"
                  :precision="0"
                />
              </a-form-item>
            </a-form-item>
            <a-form-item label="发货期">
              <a-form-item
                name="deliveryTimeLift"
                class="inline-block mb-0"
              >
                <a-input-number
                  v-model:value="lazySearchForm.deliveryTimeLift"
                  placeholder="最小发货期"
                  :min="0"
                  :max="999999"
                  :precision="0"
                />
              </a-form-item>
              <span class="mx-2">-</span>
              <a-form-item
                name="deliveryTimeRight"
                class="inline-block mb-0"
              >
                <a-input-number
                  v-model:value="lazySearchForm.deliveryTimeRight"
                  placeholder="最大发货期"
                  :min="0"
                  :max="999999"
                  :precision="0"
                />
              </a-form-item>
            </a-form-item>
            <a-form-item label="包装后重量(kg)">
              <a-form-item
                name="grossWeightLift"
                class="inline-block mb-0"
              >
                <a-input-number
                  v-model:value="lazySearchForm.grossWeightLift"
                  placeholder="最小重量"
                  :min="0"
                  :max="999999"
                  :precision="2"
                />
              </a-form-item>
              <span class="mx-2">-</span>
              <a-form-item
                name="grossWeightRight"
                class="inline-block mb-0"
              >
                <a-input-number
                  v-model:value="lazySearchForm.grossWeightRight"
                  placeholder="最大重量"
                  :min="0"
                  :max="999999"
                  :precision="2"
                />
              </a-form-item>
            </a-form-item>
            <a-form-item
              name="freightTemplateId"
              label="运费模版"
            >
              <a-select
                v-model:value="lazySearchForm.freightTemplateId"
                placeholder="请选择"
                allow-clear
                show-search
                option-filter-prop="templateName"
                :options="allFreightOptions"
                :field-names="{ label: 'templateName', value: 'templateId' }"
              />
            </a-form-item>
            <a-form-item
              name="hasVideo"
              label="有无视频"
            >
              <a-select
                v-model:value="lazySearchForm.hasVideo"
                placeholder="请选择"
                allow-clear
                :options="VIDEO_OPTIONS"
              />
            </a-form-item>
            <a-form-item
              name="gpsrType"
              label="合格内容"
            >
              <a-select
                v-model:value="lazySearchForm.gpsrType"
                placeholder="请选择"
                allow-clear
                :options="GPSR_TYPE_OPTIONS"
              />
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
              label="创建时间"
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
              label="编辑时间"
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
                  :loading="loading"
                  @click="search"
                  >搜索</a-button
                >
              </a-space>
            </a-form-item>
          </a-form>
        </a-descriptions-item>
        <a-descriptions-item label="排序类型">
          <TiledSelectSort
            v-model:value="watchedSearchForm.prop"
            v-model:sortType="watchedSearchForm.order"
            :options="SORT_TYPE_OPTIONS"
          />
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-space class="my-4">
      <a-button
        type="primary"
        title="勾选商品后批量操作"
        :disabled="selectedRows.length === 0"
        :loading="batchPublishLoading"
        @click="batchPublish"
        >批量发布</a-button
      >
      <a-popconfirm
        title="确定删除吗？"
        @confirm="del"
      >
        <a-button
          type="primary"
          danger
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
        row-key="draftsId"
        :pagination="false"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :scroll="{ x: 'max-content' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'product'">
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
                  <div class="truncate">
                    {{ getTitle(record) }}
                  </div>
                </a-tooltip>
                <div style="color: #999">
                  草稿ID:
                  <span
                    title="复制ID"
                    class="cursor-pointer"
                    @click="copyId(record.draftsId)"
                    >{{ record.draftsId }} <CopyOutlined
                  /></span>
                </div>
                <div style="color: #999">
                  商品ID:
                  <span
                    v-if="record.draftId"
                    title="复制ID"
                    class="cursor-pointer"
                    @click="copyId(record.draftId)"
                    >{{ record.draftId }} <CopyOutlined
                  /></span>
                  <span v-else>--</span>
                </div>
              </div>
            </div>
          </template>
          <template v-if="column.key === 'groupIds'">
            <a-spin :spinning="groupLoading">
              <span>{{ generateGroupText(record.groupIds) }}</span>
            </a-spin>
          </template>
          <div
            v-if="column.key === 'skus'"
            style="text-align: left"
          >
            <div
              v-for="(SKU, index) in displayedSkus(record)"
              :key="index"
            >
              <span>{{ SKU.aeopSKUProperty && SKU.aeopSKUProperty[0].propertyValueDefinitionName }}</span>
              <a-divider type="vertical" />
              SKU编码： <span style="color: #9e9f9e">{{ SKU.skuCode }}</span>
              <a-divider type="vertical" />
              零售价：<span style="color: #9e9f9e">{{ SKU.skuPrice }}</span>
              <a-divider type="vertical" />
              库存：<span style="color: #9e9f9e">{{ SKU.ipmSkuStock }}</span>
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
          <template v-if="column.key === 'freightTemplateId'">
            <a-spin :spinning="groupLoading">
              <span>{{ generateFreightText(record.freightTemplateId) }}</span>
            </a-spin>
          </template>
          <div v-if="column.key === 'time'">
            <div>
              创建时间: <span class="text-gray">{{ record.createTime || '--' }}</span>
            </div>
            <div>
              编辑时间: <span class="text-gray">{{ record.updateTime || '--' }}</span>
            </div>
          </div>
          <div v-if="column.key === 'option'">
            <a-button
              type="text"
              style="color: #0b56fa"
              @click="goPublish(record)"
              >编辑</a-button
            >
            <a-button
              type="text"
              style="color: #28f728"
              @click="publish(record)"
              >发布</a-button
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
</template>

<script>
  import { DEFAULT_TABLE_COLUMN, SORT_TYPE_OPTIONS } from './config'
  import { useAliexpressPopProductStore } from '@/stores/aliexpress-pop-product'
  import dayjs from 'dayjs'
  import { copyText } from '@/utils'
  import { accountCacheApi, getAllFreightTemplateApi, getAllProductGroupsApi } from '../apis/common'
  import { addProductApi } from '../apis/product'
  import { getProductDraftsListApi, deleteProductDraftsApi } from '../apis/pop-product-draft'
  import { CopyOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'
  import EmptyImg from '@/assets/images/aliexpress/empty.png'
  import TiledSelect from '~/components/tiled-select/index.vue'
  import TiledSelectSort from '~/components/tiled-select-sort/index.vue'
  import SearchContentInput from '~/components/search-content-input/index.vue'

  export default {
    name: 'PopChoiceProduct',
    components: { CopyOutlined },
    data() {
      return {
        store: useAliexpressPopProductStore(),
        EmptyImg,
        accountList: [],
        isFold: true, // 高级搜索状态 折叠/展开
        // 被 watch 监听的搜索表单; 外层, 点击即可搜索
        watchedSearchForm: {
          sellerId: undefined,
          prop: 'updateTime',
          order: 'desc',
          productType: undefined,
          productStatus: 'ONLINE'
        },
        // 高级搜索表单; 需点击'搜索'按钮再执行搜索动作
        lazySearchForm: {
          searchKey: 'title', // 搜索类型
          searchValue: undefined, // 搜索内容
          priceLift: undefined, // 最小价格 ('Lift' 为拼写错误, 但是后端不愿改, 就酱)
          priceRight: undefined, // 最大价格
          quantityLift: undefined, // 最小库存
          quantityRight: undefined, // 最大库存
          deliveryTimeLift: undefined, // 最小发货期
          deliveryTimeRight: undefined, // 最大发货期
          grossWeightLift: undefined, // 最小包装后重量
          grossWeightRight: undefined, // 最大包装后重量
          freightTemplateId: undefined,
          hasVideo: undefined,
          gpsrType: undefined,
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
        tableCode: 'PopChoiceProduct',
        tableData: [],
        loading: false,
        selectedRowKeys: [],
        selectedRows: [],
        SEARCH_PROP_OPTIONS: [
          { label: '标题', value: 'title' },
          { label: '商品编码', value: 'sku' },
          { label: '草稿ID', value: 'draftsId' }
        ],
        PLACEHOLDER_ENUM: {
          title: '标题',
          sku: '商品编码, 多个SKU间用英文逗号隔开',
          draftsId: '草稿ID, 多个ID间用英文逗号隔开'
        },
        allFreightOptions: [],
        VIDEO_OPTIONS: [
          { label: '有视频', value: '1' },
          { label: '无视频', value: '0' }
        ],
        GPSR_TYPE_OPTIONS: [
          { label: '已绑定欧盟责任人', value: '1' },
          { label: '已绑定品牌制造商', value: '2' },
          { label: '已绑定欧盟责任人&品牌制造商', value: '3' }
        ],
        SORT_TYPE_OPTIONS, // 排序类型
        groupLoading: false,
        allGroupOptions: [],
        allFreightOptions: [],
        delLoading: false,
        note: '',
        noteDialogVisible: false,
        noteLoading: false,
        batchPublishLoading: false
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
      this.getAllProductGroups()
      this.getAllFreightTemplate()
      this.getTableHeader()
      this.getAccountList()
    },
    methods: {
      // 获取全量分组数据
      getAllProductGroups() {
        this.groupLoading = true
        getAllProductGroupsApi()
          .then(res => {
            const rawList = []
            for (const key in res.data) {
              const targetList = res.data[key].result.targetList
              rawList.push(...targetList)
            }

            const resList = []
            flatRecursion(rawList, resList)
            this.allGroupOptions = resList

            // 扁平化方法
            function flatRecursion(rawList, resList) {
              rawList.forEach(item => {
                resList.push({ groupId: item.groupId, groupName: item.groupName })
                if (item.childGroupList) {
                  flatRecursion(item.childGroupList, resList)
                }
              })
            }
          })
          .finally(() => {
            this.groupLoading = false
          })
      },
      // 获取全量运费模版数据
      getAllFreightTemplate() {
        getAllFreightTemplateApi().then(res => {
          // 返回所有授权店铺下的数据; 合并到一起
          this.allFreightOptions = []
          // 返回所有授权店铺下的数据; 合并到一起
          for (const key in res.data) {
            this.allFreightOptions.push(...res.data[key])
          }
        })
      },
      // 生成列表展示的分组文本
      generateGroupText(groupIds) {
        if (groupIds && groupIds.length) {
          const textList = groupIds.map(id => {
            const obj = this.allGroupOptions.find(item => item.groupId === id)
            if (obj) {
              return obj.groupName
            } else {
              return id
            }
          })
          return textList.join(' & ')
        } else {
          return '--'
        }
      },
      // 运费模板文本
      generateFreightText(freightTemplateId) {
        const obj = this.allFreightOptions.find(item => item.templateId === freightTemplateId)
        return obj ? obj.templateName : '--'
      },
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
          ...this.tableParams,
          startCreateTime: this.lazySearchForm.createTime ? dayjs(this.lazySearchForm.createTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
          endCreateTime: this.lazySearchForm.createTime ? dayjs(this.lazySearchForm.createTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
          startUpdateTime: this.lazySearchForm.updateTime ? dayjs(this.lazySearchForm.updateTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
          endUpdateTime: this.lazySearchForm.updateTime ? dayjs(this.lazySearchForm.updateTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined
        }
        delete params.createTime
        delete params.updateTime
        delete params.searchKey
        delete params.searchValue

        getProductDraftsListApi(params)
          .then(res => {
            const list = res.rows || []
            list.forEach((item, i) => {
              list[i] = {
                ...item,
                ...item.result,
                SKUExpand: false,
                images: item.result.imageURLs ? item.result.imageURLs.split(';') : []
              }
              delete list[i].result
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
      getTitle(record) {
        return record.subjectList.filter(item => item.locale === record.locale)[0].value
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
      // 批量发布
      batchPublish() {
        this.batchPublishLoading = true
        // 调用新增产品的接口来发布, 循环调用来实现批量发布
        const promiseList = this.selectedRows.map(row => {
          return new Promise(resolve => {
            const params = {
              ...row,
              groupId: row.groupIds && row.groupIds.join(',')
            }
            delete params.SKUExpand
            delete params.images

            addProductApi(params)
              .then(_ => {
                resolve(row.draftsId)
              })
              .catch(() => {
                resolve()
              })
          })
        })
        Promise.all(promiseList).then(values => {
          const successList = values.filter(item => item)
          if (successList.length === values.length) {
            message.success('发布成功')
          } else {
            message.warning(`${successList.length} 条发布成功; ${values.length - successList.length} 条发布失败, 请调整后再发布`)
          }
          if (!successList.length) return

          // 删除成功发布的草稿
          this.delLoading = true
          deleteProductDraftsApi({ draftsIds: successList })
            .then(_ => {
              this.getList()
            })
            .finally(() => {
              this.delLoading = false
            })
          this.batchPublishLoading = false
        })
      },
      goPublish(record) {
        const query = `?draftsId=${record.draftsId}`
        window.open(location.origin + '/platform/aliexpress/pop-product-publish' + query)
      },
      publish(record) {
        const params = {
          ...record,
          groupId: record.groupIds && record.groupIds.join(',')
        }
        delete params.SKUExpand
        delete params.images

        addProductApi(params).then(_ => {
          message.success('发布成功')
          this.del(record)
        })
      },
      del(record) {
        let draftsIds
        if (record) {
          draftsIds = [record.draftsId]
        } else {
          draftsIds = this.selectedRows.map(item => item.draftsId)
        }
        this.delLoading = true
        deleteProductDraftsApi({ draftsIds })
          .then(_ => {
            this.getList()
          })
          .finally(() => {
            this.delLoading = false
          })
      }
    }
  }
</script>
