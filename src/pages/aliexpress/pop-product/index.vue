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
              name="shelvesKinds"
              label="下架原因"
            >
              <a-select
                v-model:value="lazySearchForm.shelvesKinds"
                placeholder="请选择"
                allow-clear
                :options="SHELVE_KIND_OPTIONS"
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
              name="productType"
              label="有无加入半托管"
            >
              <a-select
                v-model:value="lazySearchForm.productType"
                placeholder="请选择"
                allow-clear
                :options="PRODUCT_TYPE_OPTIONS"
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
              name="commentType"
              label="有无备注"
            >
              <a-select
                v-model:value="lazySearchForm.commentType"
                placeholder="请选择"
                allow-clear
                :options="REMARK_OPTIONS"
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
        @click="goPublish()"
        >发布商品</a-button
      >
      <a-dropdown :disabled="selectedRows.length === 0">
        <a-button type="primary">快捷操作 <DownOutlined /></a-button>
        <template #overlay>
          <a-menu @click="handleCommand">
            <a-menu-item disabled>产品信息</a-menu-item>
            <a-menu-divider />
            <a-menu-item key="title">批量修改标题</a-menu-item>
            <a-menu-divider />
            <a-menu-item disabled>变种信息</a-menu-item>
            <a-menu-divider />
            <a-menu-item key="nationalQuote">批量修改区域调价</a-menu-item>
            <a-menu-divider />
            <a-menu-item disabled>模版信息</a-menu-item>
            <a-menu-divider />
            <a-menu-item key="freightTemplate">批量改运费模版</a-menu-item>
            <a-menu-divider />
            <a-menu-item key="ALL">全属性修改</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a-popconfirm
        title="确定下架吗？"
        @confirm="deactivate"
      >
        <a-button
          type="primary"
          title="勾选商品后批量操作"
          :disabled="selectedRows.length === 0"
          :loading="deactivateLoading"
          >批量下架</a-button
        >
      </a-popconfirm>
      <a-popconfirm
        title="确定上架吗？"
        @confirm="activate"
      >
        <a-button
          type="primary"
          title="勾选商品后批量操作"
          :disabled="selectedRows.length === 0"
          :loading="activateLoading"
          >批量上架</a-button
        >
      </a-popconfirm>
      <a-button
        type="primary"
        title="勾选商品后批量操作"
        :disabled="selectedRows.length === 0"
        @click="noteDialogVisible = true"
        >批量添加备注</a-button
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
      <div class="flex justify-between items-center">
        <a-tabs
          v-model:activeKey="watchedSearchForm.productStatus"
          :animated="false"
        >
          <a-tab-pane
            v-for="item in PRODUCT_STATUS_TABS"
            :key="item.value"
            :tab="`${item.label}(${STATUS_COUNT_ENUM[item.value]})`"
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
                <div
                  v-if="record.notes"
                  class="text-gray"
                >
                  <a-tooltip :title="record.notes">
                    <div class="truncate">备注: {{ record.notes }}</div>
                  </a-tooltip>
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
            <EditOutlined
              title="修改价格和库存"
              class="text-[#1677ff] float-right"
              @click="editPriceAndStock(record)"
            />
            <div
              v-for="(SKU, index) in displayedSkus(record)"
              :key="index"
            >
              <span>{{ SKU.aeopSKUPropertyList && SKU.aeopSKUPropertyList[0].propertyValueDefinitionName }}</span>
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
          <div v-if="column.key === 'productStatusType'">
            <a-tag
              v-if="record.productStatusType === 'onSelling'"
              color="success"
              >上架</a-tag
            >
            <a-tag v-else-if="record.productStatusType === 'offline'">下架</a-tag>
            <a-tag
              v-else-if="record.productStatusType === 'auditing'"
              color="warning"
              >审核中</a-tag
            >
            <a-tag
              v-else-if="record.productStatusType === 'editingRequired'"
              color="error"
              >审核不通过</a-tag
            >
            <a-tag v-else-if="record.productStatusType === 'service_delete'">客服删除</a-tag>
            <a-tag v-else-if="record.productStatusType === 'service_deleted'">疑似删除</a-tag>
            <span v-else>--</span>
          </div>
          <template v-if="column.key === 'freightTemplateId'">
            <a-spin :spinning="groupLoading">
              <span>{{ generateFreightText(record.freightTemplateId) }}</span>
            </a-spin>
          </template>
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
              @click.stop="copy(record)"
              type="text"
              style="color: #0d9888"
              >复制</a-button
            >
            <a-popconfirm
              v-if="record.productStatusType === 'onSelling'"
              title="下架吗?"
              @confirm="deactivate(record)"
            >
              <a-button
                type="text"
                style="color: #e6a23c"
                >下架</a-button
              >
            </a-popconfirm>
            <a-popconfirm
              v-if="record.productStatusType === 'offline'"
              title="上架吗?"
              @confirm="activate(record)"
            >
              <a-button
                type="text"
                style="color: #e6a23c"
                >上架</a-button
              >
            </a-popconfirm>
            <a-button
              type="text"
              style="color: #4ca8ec"
              @click="addNote(record)"
              >备注</a-button
            >
            <a-popconfirm
              title="删除吗?"
              @confirm="del(record)"
            >
              <a-button
                type="text"
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
    <!-- 同步进度条 -->
    <a-modal
      title="同步进度"
      v-model:open="syncProgressOpen"
      :footer="null"
    >
      <a-progress :percent="syncPercentage" />
    </a-modal>
    <!-- 修改价格和库存弹窗 -->
    <PriceAndStockDialog
      :dialog-visible="editPriceAndStockDialogVisible"
      :raw-data="curRow"
      @refresh="getList"
      @priceAndStockDialogClose="handlePriceAndStockDialogClose"
    />
    <!-- 全属性修改弹窗 -->
    <!-- <WholeAttrEditDialog
      v-if="wholeAttrEditDialogVisible"
      :dialog-visible="wholeAttrEditDialogVisible"
      :command="command"
      :accounts="accounts"
      :selected-rows="selectedRows"
      @dialogClose="handleWholeAttrEditDialogClose"
    /> -->
    <!-- 备注弹窗 -->
    <a-modal
      title="添加备注"
      v-model:open="noteDialogVisible"
      width="30%"
      :after-close="handleNoteDialogClose"
      :confirm-loading="noteLoading"
      @ok="noteConfirm"
    >
      <a-textarea
        v-model:value="note"
        :rows="4"
        placeholder="请输入备注内容"
      />
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
        >
          <span class="inline-block w-30 align-middle truncate">{{ item.simpleName }}</span>
        </a-checkbox>
      </a-checkbox-group>
      <p class="mt-4 text-gray">提示: 不同店铺下的产品分类、模板信息、产品分组等信息可能不同, 复制后请注意调整</p>
    </a-modal>
  </div>
</template>

<script>
  import { DEFAULT_TABLE_COLUMN, PRODUCT_STATUS_TABS, SHELVE_KIND_OPTIONS, SORT_TYPE_OPTIONS } from './config'
  import { useAliexpressPopProductStore } from '@/stores/aliexpress-pop-product'
  import dayjs from 'dayjs'
  import { copyText } from '@/utils'
  import { accountCacheApi, getAllFreightTemplateApi, getAllProductGroupsApi } from '../apis/common'
  import { productListApi, syncOneApi, syncListApi, syncProgressApi, deleteProductApi, productsOffShelfApi, productsShelvesApi, copyProductApi, addNotesApi, productDetailApi } from '../apis/product'
  import { DownOutlined, CopyOutlined, InfoCircleOutlined, EditOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'
  import EmptyImg from '@/assets/images/aliexpress/empty.png'
  import TiledSelect from '~/components/tiled-select/index.vue'
  import TiledSelectSort from '~/components/tiled-select-sort/index.vue'
  import SearchContentInput from '~/components/search-content-input/index.vue'
  import PriceAndStockDialog from './components/PriceAndStockDialog.vue'
  import WholeAttrEditDialog from './components/WholeAttrEditDialog.vue'

  export default {
    name: 'PopProduct',
    components: { DownOutlined, CopyOutlined, InfoCircleOutlined, EditOutlined, PriceAndStockDialog, WholeAttrEditDialog },
    data() {
      return {
        store: useAliexpressPopProductStore(),
        EmptyImg,
        accountList: [],
        isFold: true, // 高级搜索状态 折叠/展开
        // 被 watch 监听的搜索表单; 外层, 点击即可搜索
        watchedSearchForm: {
          sellerId: undefined,
          prop: 'gmt_modified_time',
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
          // productCategory: undefined,
          freightTemplateId: undefined,
          shelvesKinds: undefined,
          hasVideo: undefined,
          productType: undefined,
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
        tableCode: 'PopProduct',
        tableData: [],
        loading: false,
        selectedRowKeys: [],
        selectedRows: [],
        syncProgressOpen: false,
        syncPercentage: 0,
        SHELVE_KIND_OPTIONS,
        PRODUCT_STATUS_TABS,
        SEARCH_PROP_OPTIONS: [
          { label: '标题', value: 'title' },
          { label: '商品编码', value: 'sku' },
          { label: '产品ID', value: 'productId' }
        ],
        PLACEHOLDER_ENUM: {
          title: '标题',
          sku: '商品编码, 多个SKU间用英文逗号隔开',
          productId: '产品ID, 多个ID间用英文逗号隔开'
        },
        STATUS_COUNT_ENUM: {
          onSelling: 0,
          offline: 0,
          auditing: 0,
          editingRequired: 0,
          service_delete: 0,
          service_deleted: 0,
          deleted: 0
        },
        allFreightOptions: [],
        REMARK_OPTIONS: [
          { label: '有备注', value: '1' },
          { label: '无备注', value: '2' }
        ],
        VIDEO_OPTIONS: [
          { label: '有视频', value: '1' },
          { label: '无视频', value: '0' }
        ],
        PRODUCT_TYPE_OPTIONS: [
          { label: '已加入半托管', value: 'POP_CHOICE' },
          { label: '未加入半托管', value: 'POP' }
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
        deactivateLoading: false,
        activateLoading: false,
        delLoading: false,
        note: '',
        noteDialogVisible: false,
        noteLoading: false,
        curRow: {}, // 当前点击的行
        syncLoading: false,
        selectedRows: [],
        syncPercentage: 0,
        editPriceAndStockDialogVisible: false, // 修改价格和库存显隐
        wholeAttrEditDialogVisible: false, // 全属性修改弹窗显隐
        command: '', // 批量操作指令
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
          gmtCreateStart: this.lazySearchForm.createTime ? dayjs(this.lazySearchForm.createTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
          gmtCreateEnd: this.lazySearchForm.createTime ? dayjs(this.lazySearchForm.createTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
          gmtModifiedStart: this.lazySearchForm.updateTime ? dayjs(this.lazySearchForm.updateTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
          gmtModifiedEnd: this.lazySearchForm.updateTime ? dayjs(this.lazySearchForm.updateTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined
        }
        delete params.createTime
        delete params.updateTime
        delete params.searchKey
        delete params.searchValue

        productListApi(params)
          .then(res => {
            const list = res.rows || []
            list.forEach(item => {
              item.SKUExpand = false
              item.images = item.imageURLs ? item.imageURLs.split(';') : []
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
      // 下架
      deactivate(record) {
        let params
        if (record) {
          params = [{ sellerId: record.sellerId, productId: record.productId }]
        } else {
          params = this.selectedRows.map(item => {
            return {
              sellerId: item.sellerId,
              productId: item.productId
            }
          })
        }
        this.deactivateLoading = true
        productsOffShelfApi({ products: params })
          .then(res => {
            this.getList()
          })
          .finally(() => {
            this.deactivateLoading = false
          })
      },
      // 上架
      activate(record) {
        let params
        if (record) {
          params = [{ sellerId: record.sellerId, productId: record.productId }]
        } else {
          params = this.selectedRows.map(item => {
            return {
              sellerId: item.sellerId,
              productId: item.productId
            }
          })
        }
        this.activateLoading = true
        productsShelvesApi({ products: params })
          .then(res => {
            this.getList()
          })
          .finally(() => {
            this.activateLoading = false
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
      getTitle(record) {
        return record.subjectList.filter(item => item.locale === record.locale)[0].value
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
      /** 备注 */
      addNote(record) {
        this.curRow = record
        this.note = record.notes
        this.noteDialogVisible = true
      },
      noteConfirm() {
        this.noteLoading = true
        let params
        if (Object.keys(this.curRow).length !== 0) {
          params = [{ sellerId: this.curRow.sellerId, productId: this.curRow.productId, notes: this.note }]
        } else {
          params = this.selectedRows.map(item => {
            return {
              sellerId: item.sellerId,
              productId: item.productId,
              notes: this.note
            }
          })
        }
        addNotesApi(params)
          .then(res => {
            this.getList()
            this.handleNoteDialogClose()
          })
          .finally(() => {
            this.noteLoading = false
          })
      },
      handleNoteDialogClose() {
        this.curRow = {}
        this.note = ''
        this.noteDialogVisible = false
      },
      del(record) {
        let params
        if (record) {
          params = [{ sellerId: record.sellerId, productId: record.productId }]
        } else {
          params = this.selectedRows.map(item => {
            return {
              sellerId: item.sellerId,
              productId: item.productId
            }
          })
        }
        this.delLoading = true
        deleteProductApi({ products: params })
          .then(res => {
            this.getList()
          })
          .finally(() => {
            this.delLoading = false
          })
      },
      // 修改 SKU 价格和库存相关
      editPriceAndStock(row) {
        this.curRow = row
        this.editPriceAndStockDialogVisible = true
      },
      // 关闭修改价格和库存弹窗
      handlePriceAndStockDialogClose() {
        this.curRow = {}
        this.editPriceAndStockDialogVisible = false
      },
      handleCommand(command) {
        this.command = command
        this.wholeAttrEditDialogVisible = true
      },
      // 关闭全属性修改弹窗
      handleWholeAttrEditDialogClose() {
        this.command = ''
        this.wholeAttrEditDialogVisible = false
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
          copySellerId: this.curRow.sellerId,
          productId: this.curRow.productId,
          targetSellerIds: this.copyTargetSellerList
        }
        copyProductApi(params)
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
        window.open(location.origin + '/platform/aliexpress/pop-product-publish' + query)
      }
    }
  }
</script>
