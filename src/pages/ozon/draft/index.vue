<template>
  <div flex>
    <!-- 左侧边栏 -->
    <SideBar class="w-70" :total-count="totalCount" :publish-failed-count="publishFailedCount" @draft-emit="handleDraftEmit" @wait-emit="handleWaitEmit" @online-emit="handleOnlineEmit" />

    <div flex-1>
      <a-breadcrumb
        separator=">"
        style="margin-left: 15px; margin-bottom: 8px"
      >
        <a-breadcrumb-item>Ozon</a-breadcrumb-item>
        <a-breadcrumb-item> 采集箱 </a-breadcrumb-item>
      </a-breadcrumb>

      <div
        id="draft"
        ml-10px
      >
        <a-card>
          <a-form
            ref="ruleForm2"
            :model="formData"
          >
            <a-form-item label="店铺账号：">
              <selectComm
                :options="shopAccount"
                :fieldObj="shopObj"
                @backSelectAll="selectAll"
                @backSelectItem="selectItem"
              ></selectComm>
            </a-form-item>
            <a-form-item label="搜索类型:">
              <div class="fBox flex align-start gap-10px">
                <a-button
                  @click="selectTypes(item.prop)"
                  :type="item.prop === actives ? 'primary' : ''"
                  v-for="(item, index) in searchType"
                  :key="index"
                  >{{ item.label }}</a-button
                >
              </div>
            </a-form-item>
            <a-form-item label="搜索内容：">
              <div class="flex">
                <div class="flex align-start">
                  <a-input
                    v-if="actives === 1"
                    style="width: 400px"
                    v-model:value="formData.name"
                    placeholder="请输入标题查询"
                    clearable
                    @clear="onSubmit"
                  ></a-input>
                  <a-input
                    v-if="actives === 2"
                    style="width: 400px"
                    v-model:value="formData.sku"
                    clearable
                    @clear="onSubmit"
                    placeholder="请输入SKU查询,多个SKU间用逗号隔开，最多支持200个"
                  ></a-input>
                </div>
                <a-button
                  type="primary"
                  class="ml-[10px]"
                  @click="onSubmit()"
                  >查询</a-button
                >
              </div>
            </a-form-item>
            <a-form-item label="排序方式：">
              <div class="flex align-start gap-10px">
                <a-button
                  v-for="item in strList"
                  :key="item.prop"
                  :type="item.prop === active.prop ? 'primary' : ''"
                  @click="storChange(item)"
                >
                  <span>{{ item.label }}</span>
                  <AsyncIcon
                    icon="CaretUpOutlined"
                    v-if="item.prop === active.prop && active.type === 'bottom'"
                  />
                  <AsyncIcon
                    icon="CaretDownOutlined"
                    v-if="item.prop === active.prop && active.type === 'top'"
                  />
                </a-button>
              </div>
            </a-form-item>
          </a-form>
        </a-card>
        <a-card class="my-2.5">
          <div class="w-full flex justify-between items-center mb-10px">
            <div class="flex">
              <a-dropdown :disabled="!selectedRowList.length">
                <a-button
                  type="primary"
                  style="height: 32px"
                >
                  批量操作
                  <DownOutlined />
                </a-button>
                <template #overlay>
                  <a-menu @click="handleMenuClick">
                    <a-menu-item :key="0">批量编辑</a-menu-item>
                    <a-menu-item :key="1">批量移入待发布</a-menu-item>
                    <a-menu-item :key="2">批量发布</a-menu-item>
                    <a-menu-item :key="3">批量加水印</a-menu-item>
                    <!-- <a-menu-item :key="4">批量归档</a-menu-item> -->
                    <a-menu-item :key="5">批量备注</a-menu-item>
                    <a-menu-item :key="6">批量删除</a-menu-item>
                    <a-menu-divider />
                    <a-menu-item
                      :key="7"
                      disabled
                    >
                      快捷操作
                    </a-menu-item>
                    <!-- <a-menu-item :key="8"> 批量修改售价 </a-menu-item>
                    <a-menu-item :key="9"> 批量修改原价 </a-menu-item>
                    <a-menu-item :key="10"> 批量修改库存 </a-menu-item>
                    <a-menu-item :key="11"> 全属性修改 </a-menu-item> -->
                    <a-menu-item key="stock"> 批量修改库存 </a-menu-item>
                    <a-menu-item key="price"> 批量修改售价 </a-menu-item>
                    <a-menu-item key="oldPrice"> 批量修改原价 </a-menu-item>
                    <a-menu-item key="all"> 全属性修改 </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>

              <a-dropdown v-model:open="moveCategoryOpen" :disabled="!selectedRowList.length" trigger="click">
                <a-button
                  type="primary"
                  style="height: 32px; margin-left: 10px"
                >
                  移动分类
                  <DownOutlined />
                </a-button>
                <template #overlay>
                  <a-menu>
                    <typeTree
                      platform="ozon"
                      @nodeClick="typeNodeClick"
                    ></typeTree>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
            <div>
              <a-space>
                <a-button
                  type="link"
                  style="height: 32px"
                  @click="shopSet"
                >
                  <SettingOutlined />
                  店铺设置
                </a-button>
                <a-button
                  type="primary"
                  style="height: 32px"
                  @click="navDataCrawli"
                >
                  采集数据
                </a-button>
                <a-button
                  type="primary"
                  style="height: 32px"
                  @click="createProduct"
                >
                  创建产品
                </a-button>
                <!-- <a-tooltip>
                  <template #title>
                    <p mb-0>【 同步产品 】按钮：</p>
                    <p
                      mb-0
                      text-gray-400
                    >
                      仅从平台后台同步产品，产品的信息将会被更新至最新
                    </p>
                  </template>
                  <a-button
                    type="primary"
                    style="height: 32px"
                  >
                    同步产品
                    <QuestionCircleOutlined />
                  </a-button>
                </a-tooltip> -->
              </a-space>
            </div>
          </div>
          <a-table
            :row-selection="rowSelection"
            rowKey="gatherProductId"
            :data-source="tableData"
            bordered
            :columns="columns"
            :pagination="false"
            :loading="loading"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'image'">
                <div class="">
                  <a-image
                    :src="primaryImage(record.primaryImage)"
                    :width="100"
                    :height="100"
                    class="object-contain"
                  />
                  <br />
                  <a-button
                    type="link"
                    class="platform-name"
                    @click="visitUrl(record.sourceUrlList)"
                  >
                    {{ platformName(record.gatherPlatformName) }}</a-button
                  >
                </div>
              </template>
              <template v-if="column.dataIndex === 'name'">
                <div class="flex text-left">
                  <div class="ml-2.5 block">
                    <a-tooltip
                      class="item"
                      effect="dark"
                      :title="record.name"
                      placement="top"
                      style="overflow-wrap: break-word"
                    >
                      <div>{{ record.name }}</div>
                    </a-tooltip>
                    <div class="account">「{{ accountName(record.account) }}」</div>
                    <br />
                    <div
                      :style="{
                        color: remarkColor(record.remarkColor)
                      }"
                    >
                      {{ record.remark }}
                    </div>
                    <div
                      v-if="record.errorMsg"
                      class="w-fit p-1 border border-solid border-gray-300 rounded-md text-red"
                    >
                      <div><WarningOutlined /> 失败原因</div>
                      <div>{{ record.errorMsg }}</div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="column.dataIndex === 'sku'">
                <div class="record-sku-container pb-30px">
                  <div
                    class="record-sku"
                    v-for="(item, index) in displayedSkus(record)"
                    :key="index"
                  >
                    <div text-left>
                      <a-tooltip placement="top">
                        <template #title>
                          <span>复制</span>
                        </template>
                        <span @click="copyText(item.offerId)">
                          {{ item.offerId }}
                        </span>
                      </a-tooltip>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="column.dataIndex === 'price'">
                <div class="pb-30px">
                  <div
                    class="record-sku"
                    v-for="(item, index) in displayedSkus(record)"
                    :key="index"
                  >
                    <div class="sku-price">
                      <span pr-5px>{{ record.currencyCode }} </span>
                      <span>
                        {{ item.price ?? '-' }}
                      </span>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="column.dataIndex === 'oldPrice'">
                <div class="pb-30px">
                  <div
                    class="record-sku"
                    v-for="(item, index) in displayedSkus(record)"
                    :key="index"
                  >
                    <div class="sku-price">
                      <span pr-5px>{{ record.currencyCode }} </span>
                      <span>{{ item.oldPrice ?? '-' }} </span>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="column.dataIndex === 'stock'">
                <div class="pb-30px">
                  <div
                    class="record-sku"
                    v-for="(item, index) in displayedSkus(record)"
                    :key="index"
                  >
                    <div class="sku-price">
                      <a-tooltip
                        style="margin-right: 10px"
                        effect="dark"
                        placement="top"
                      >
                        <template #title>
                          <div
                            v-for="(el, ind) in item.warehouseList"
                            :key="ind"
                          >
                            <span>{{ el.warehouseName }}</span
                            >:
                            <span>{{ el.present || 0 }}</span>
                          </div>
                        </template>
                        <span>{{ item.warehouseList[0].present || 0 }}</span>
                      </a-tooltip>
                    </div>
                  </div>
                </div>

                <div
                  v-if="record.skuList.length > 5"
                  class="w-full flex flex-end flex-end more pr-15px pb-10px"
                >
                  <a-button
                    type="link"
                    @click="record.show = !record.show"
                  >
                    {{ !record.show ? '+ 展开' : '- 收起' }}
                  </a-button>
                </div>
              </template>
              <template v-if="column.dataIndex === 'createTime'">
                <div class="flex items-start flex-col">
                  <div>
                    <span style="color: #9e9f9e"> 创建：</span>
                    <span>
                      {{ record.createTime }}
                    </span>
                  </div>
                  <div>
                    <span style="color: #9e9f9e"> 更新：</span>
                    <span>
                      {{ record.updateTime }}
                    </span>
                  </div>
                </div>
              </template>
              <template v-if="column.dataIndex === 'option'">
                <a-space direction="vertical">
                  <a-button
                    type="link"
                    @click="moveToPending(record)"
                  >
                    移入待发布
                  </a-button>
                  <a-button
                    type="link"
                    @click="editProduct(record)"
                  >
                    编辑
                  </a-button>
                  <a-button
                    type="link"
                    @click="publishProduct(record)"
                  >
                    发布
                  </a-button>
                  <a-dropdown>
                    <a-button type="link">
                      更多
                      <DownOutlined />
                    </a-button>
                    <template #overlay>
                      <a-menu>
                        <a-menu-item @click="addRemark(record)"> 添加备注 </a-menu-item>
                        <a-menu-item @click="delProduct(record)"> 删除产品 </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                </a-space>
              </template>
            </template>
          </a-table>
          <a-pagination
            style="margin: 20px 0 10px 0; text-align: right"
            :show-total="total => `共 ${total} 条`"
            v-model:current="paginations.pageNum"
            v-model:pageSize="paginations.pageSize"
            :total="paginations.total"
            class="pages"
            :show-quick-jumper="true"
            @change="getList"
            :showSizeChanger="true"
            :pageSizeOptions="[50, 100, 200]"
          />
        </a-card>
      </div>
    </div>

    <!-- 店铺设置 -->
    <ShopSetModal
      :shopSetVisible="shopSetVisible"
      :shopCurryList="shopCurryList"
      @handleShopSetClose="handleShopSetClose"
      @refreshShopSet="getShopSet"
    ></ShopSetModal>

    <!--编辑提示 弹窗-->
    <EditPrompt
      ref="editPromptRef"
      :shopAccount="shopAccount"
    ></EditPrompt>

    <!-- 批量编辑-提示弹窗 -->
    <BatchEditPrompt
      ref="batchEditPromptRef"
      :shopAccount="shopAccount"
    >
    </BatchEditPrompt>

    <!-- 批量备注 -->
    <RemarkModal
      ref="remarkModalRef"
      @success="getList"
    ></RemarkModal>

    <!-- 批量加水印 -->
    <BatchAddWatermarkModal v-model:open="watermarkModalOpen" @ok="watermarkOk" />

    <!-- 批量修改属性 -->
    <EditAttribute
      ref="editAttributeRef"
      :selectedRows="selectedRowList"
      :editPriceVisible="editPriceVisible"
      :brandList="brandList"
      @handleEditPriceClose="handleEditPriceClose"
      :editStockList="editStockList"
      :defType="defType"
    >
    </EditAttribute>
  </div>
</template>

<script setup name="draft">
  import { Divider, message, Modal } from 'ant-design-vue'
  import { DownOutlined, SettingOutlined, SyncOutlined, QuestionCircleOutlined, WarningOutlined } from '@ant-design/icons-vue'
  import { accountCache, shopCurrency, productWarehouse } from '../config/api/product'
  import { brandCategory } from '../config/api/waitProduct'
  import { batchAddWatermarkToDraftProductApi } from '../config/api/batch-edit'
  import { ozonDraftList, groupProductCountApi, ozonDeleteProduct, batchPublishToPlatform, batchAddToWaitPublish, addToWaitPublish } from '../config/api/draft'
  import { updateCategoryProduct } from '~/pages/sample/dataAcquisition/js/api.js'
  import tableHeard from '../config/tabColumns/draft'
  import AsyncIcon from '~/layouts/components/menu/async-icon.vue'
  import SideBar from '@/pages/ozon/config/component/SideBar/index.vue'
  import ShopSetModal from '@/pages/ozon/product/comm/shopSetModal.vue'
  import typeTree from '@/components/classificationTree/typeTree.vue'
  import EditPrompt from './comm/editPrompt.vue'
  import BatchEdit from './batchComponent/batchEdit.vue'
  import RemarkModal from './batchComponent/remarkModal.vue'
  import BatchAddWatermarkModal from '@/pages/ozon/config/component/BatchAddWatermarkModal/index.vue'
  import OzonProduct from '@/pages/ozon/product/index.vue'
  import BatchEditPrompt from './batchComponent/batchEditPrompt.vue'
  import EditAttribute from './batchComponent/editAttribute.vue'
  import WaitPublish from '@/pages/ozon/waitPublish/index.vue'
  import { colors } from '@/pages/lazada/product/common'
  let columns = tableHeard
  const baseApi = import.meta.env.VITE_APP_BASE_API

  const { copy } = useClipboard()
  const editPromptEl = useTemplateRef('editPromptRef')
  const batchEditPromptEl = useTemplateRef('batchEditPromptRef') // 批量编辑-弹窗
  const remarkModalEl = useTemplateRef('remarkModalRef') // 批量备注-弹窗
  const batchAttributeEl = useTemplateRef('batchAttributeRef') // 批量属性-弹窗
  const editAttributeEl = useTemplateRef('editAttributeRef') // 批量属性-弹窗
  const typeTreeEl = useTemplateRef('typeTreeRef')
  const typeManageOpen = ref(false)
  const shopSetVisible = ref(false)
  const shopCurryList = ref([])
  const editPriceVisible = ref(false) //全属性
  const editStockList = ref([]) //修改库存
  const defType = ref([])
  const stockShops = ref([])
  const breadcrumb = ref('')

  const { state: formData, reset: resetForm } = useResetReactive({
    offerId: '',
    account: '',
    sku: '',
    name: '',
    prop: 'create_time',
    order: 'desc',
    state: ''
  })
  const paginations = reactive({
    pageNum: 1,
    pageSize: 50,
    total: 0
  })
  const shopAccount = ref([])
  const actives = ref(1)
  const selectedRowKeys = ref([])
  const selectedRowList = ref([])
  const tableData = ref([])
  const deactivateLoading = ref(false)
  const delLoading = ref(false)
  const loading = ref(false)
  const remarkVisible = ref(false)
  const brandList = ref([])
  const remarkId = ref([])
  const state = {
    wait_publish: '待发布',
    published: '已发布',
    publish_failed: '发布失败'
  }
  const shopObj = {
    fieldKey: 'account',
    fieldLabel: 'simpleName'
  }
  const sortObj = reactive({
    sortField: 'create_time',
    sortType: 'desc'
  })
  const searchType = [
    {
      label: '标题',
      prop: 1
    },
    {
      label: 'SKU',
      prop: 2
    }
  ]
  const active = ref({
    label: '按创建时间',
    value: 'create_time',
    type: 'top',
    prop: 1,
    isDefault: true
  })
  // 默认按创建时间查询
  const strList = ref([
    {
      label: '按创建时间',
      value: 'create_time',
      type: 'top',
      prop: 1,
      isDefault: true
    },
    {
      label: '按更新时间',
      type: 'bottom',
      value: 'update_time',
      prop: 2,
      isDefault: false
    },
    {
      label: '按售价',
      value: 'max_current_price',
      // value: "old_price",
      type: 'top',
      prop: 3,
      isDefault: false
    },
    {
      label: '按总库存量',
      value: 'total_stock',
      // value: "stock",
      type: 'top',
      prop: 4,
      isDefault: false
    }
  ])

  const rowSelection = computed(() => {
    return {
      selectedRowKeys: selectedRowKeys.value,
      onChange: (rowKeys, rows) => {
        selectedRowKeys.value = rowKeys //只接收ID
        selectedRowList.value = rows //接收每一行
      }
    }
  })

  const accountName = account => {
    return shopAccount.value.find(item => item.account === account)?.simpleName
  }
  const remarkColor = color => {
    return colors.find(item => item.id == color)?.color
  }
  const primaryImage = primaryImage => {
    if (primaryImage.includes('https')) {
      return primaryImage
    }
    return baseApi + primaryImage
  }
  const platformName = platform => {
    const platNames = {
      Ozon: 'Ozon',
      Tmall: '天猫',
      AliExpress: '速卖通'
    }
    return platNames[platform] ?? platform
  }

  const visitUrl = sourceUrlList => {
    if (sourceUrlList && sourceUrlList.length > 0) {
      window.open(sourceUrlList[0])
    }
  }

  // 复制
  const copyText = text => {
    copy(text)
    message.success(`复制成功：${text}`)
  }
  // 店铺设置
  const shopSet = () => {
    shopSetVisible.value = true
    getShopSet()
  }
  const getShopSet = () => {
    shopCurrency().then(res => {
      shopCurryList.value = res?.data ?? []
    })
  }

  // 店铺单选多选
  const selectAll = () => {
    formData.account = ''
    getList()
    getGroupProductCount()
  }
  const selectItem = val => {
    clearSelectList()
    formData.account = val
    getList()
    getGroupProductCount()
  }

  // 搜索内容
  const selectTypes = index => {
    actives.value = index
    switch (index) {
      case 1:
        formData.sku = ''
        formData.offerId = ''
        break
      case 2:
        formData.name = ''
        formData.offerId = ''
        break
      case 3:
        formData.sku = ''
        formData.name = ''
        break
      default:
        break
    }
  }

  // 排序方式
  const storChange = item => {
    item.type = item.type === 'top' ? 'bottom' : 'top'
    active.value = item
    sortObj.sortField = item.value
    sortObj.sortType = item.type === 'top' ? 'desc' : 'asc'
    formData.order = item.type === 'top' ? 'desc' : 'asc'
    formData.prop = item.value
    getList()
  }

  // 表单搜索
  const onSubmit = () => {
    getList()
  }

  // 店铺数据
  const getAccount = () => {
    accountCache().then(res => {
      if (res.data) {
        shopAccount.value = res?.data ?? []
        getList()
        getGroupProductCount()
      }
    })
  }

  const displayedSkus = row => {
    return row.show ? row?.skuList : row?.skuList?.slice(0, 5)
  }

  /** 左侧边栏 */
  let categoryId = '0'
  const router = useRouter()
  // 采集箱区域事件回调
  function handleDraftEmit(val) {
    // 不做任何回应
    console.log('采集箱', val)
  }
  // 待发布区域事件回调
  function handleWaitEmit(val) {
    router.push(`/platform/ozon/waitPublish?categoryId=${val}`)
  }
  // 店铺(在线)商品区域事件回调
  function handleOnlineEmit(val) {
    router.push(`/platform/ozon/product?categoryId=${val}`)
  }

  // 获取左侧状态栏统计数量
  const totalCount = ref(0)
  const publishFailedCount = ref(0)
  function getGroupProductCount() {
    const params = {
      account: formData.account
    }
    groupProductCountApi(params).then(res => {
      totalCount.value = res.data.totalCount
      publishFailedCount.value = res.data.publishFailedCount
    })
  }

  const getList = () => {
    selectedRowList.value = []
    selectedRowKeys.value = []
    loading.value = true
    ozonDraftList({
      ...formData,
      ...sortObj,
      pageNum: paginations.pageNum,
      pageSize: paginations.pageSize,
    })
      .then(res => {
        tableData.value =
          res?.rows.map(item => {
            item.show = false
            return item
          }) || []
        paginations.total = res?.total || 0
      })
      .finally(() => {
        loading.value = false
      })
  }

  // 批量移动分类
  const moveCategoryOpen = ref(false)
  async function typeNodeClick(node) {
    moveCategoryOpen.value = false
    if (selectedRowList.value.length < 1) return message.warning('请选择商品！')
    try {
      let ids = selectedRowList.value.map(i => i.gatherProductId)
      let params = {
        ids: ids.join(), // 商品信息的唯一标识(多个用英文逗号分割)
        productCategoryId: node.id //分类ID
      }
      await updateCategoryProduct(params)
      getList()
    } catch (error) {
      console.error(error)
    }
  }

  //  采集数据
  const navDataCrawli = () => {
    router.push('/platform/dev/sample/dataAcquisition')
  }

  //  移入待发布
  const moveToPending = (row = {}) => {
    Modal.confirm({
      title: '提示',
      content: '确定要移入待发布吗？',
      onOk: async () => {
        addToWaitPublish({
          account: row.account, //店铺账号
          gatherProductId: row.gatherProductId //采集箱产品id
        })
          .then(res => {
            message.success('操作成功')
            getList()
          })
          .finally(() => {
            loading.value = false
          })
      }
    })
  }

  //  编辑
  const editProduct = row => {
    editPromptEl.value.open(row)
  }

  // 发布
  const publishProduct = (row = {}) => {
    Modal.confirm({
      title: '提示',
      content: '确定要发布吗？',
      onOk: async () => {
        batchPublishToPlatform({
          publishRequestList: [{ account: row.account, gatherProductId: row.gatherProductId }]
        }).then(res => {
          message.success('操作成功')
          getList()
        })
      }
    })
  }

  // 备注
  const addRemark = (row = {}) => {
    remarkModalEl.value.open(row, false)
  }

  // 单个删除产品
  const delProduct = (row = {}) => {
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      onOk: async () => {
        ozonDeleteProduct({
          shopIdList: [row.account], //店铺id列表
          gatherProductIdList: [
            //采集箱商品id列表
            row.gatherProductId
          ]
        })
          .then(res => {
            message.success('操作成功')
            getList()
          })
          .finally(() => {
            loading.value = false
          })
      }
    })
  }

  const handleShopSetClose = () => {
    shopSetVisible.value = false
    getList()
  }

  // 创建产品
  const createProduct = () => {
    window.open('/platform/ozon/productPublish', '_blank')
  }

  const updateCurrentClass = value => {
    console.log(value)
  }

  function clearStock(data) {
    if (Array.isArray(data)) {
      data.forEach(item => {
        if (item.children) {
          clearStock(item.children)
        }
        if (item.hasOwnProperty('stock')) {
          item.stock = null
        }
      })
    }
    return data
  }

  const clearSelectList = () => {
    selectedRowList.value = []
    selectedRowKeys.value = []
  }

  // 获取品牌相关数据
  const getBrandList = () => {
    let list = selectedRowList.value.map(e => {
      return {
        account: e.account,
        typeId: e.typeId,
        descriptionCategoryId: e.categoryId
      }
    })
    brandCategory(list).then(res => {
      brandList.value = res?.data ?? []
    })
  }
  // 关闭价格
  const handleEditPriceClose = () => {
    defType.value = []
    clearSelectList()
    editPriceVisible.value = false
    getList()
    editStockList.value = clearStock(editStockList.value)
  }

  // 库存
  const getStore = () => {
    let params = {
      account: stockShops.value
    }
    productWarehouse(params).then(res => {
      editStockList.value =
        res?.data?.map(item => {
          return {
            account: item.account,
            simpleName: item.simpleName,
            children: item.children,
            allStock: ''
          }
        }) ?? []
    })
  }

  //  批量操作
  const handleMenuClick = e => {
    if (!selectedRowList.value.length) {
      message.warning('请至少选择一条数据')
      return
    }
    if (['stock', 'price', 'oldPrice', 'all'].includes(e.key)) {
      defType.value = e.keyPath
    }
    stockShops.value = selectedRowList.value.map(e => e.account)
    switch (e.key) {
      case 0:
        // 跳转到采集箱批量编辑页
        localStorage.setItem('ids', JSON.stringify(selectedRowKeys.value))
        batchEditPromptEl.value.open(selectedRowList.value)
        break
      case 1:
        let params = selectedRowList.value.map(item => {
          return {
            account: item.account,
            gatherProductId: item.gatherProductId
          }
        })
        Modal.confirm({
          title: '提示',
          content: '确定要批量移入待发布吗？',
          onOk: async () => {
            batchAddToWaitPublish({
              requestList: params
            }).then(res => {
              message.success('操作成功')
              selectedRowList.value = []
              selectedRowKeys.value = []
              getList()
            })
          }
        })
        break
      case 2:
        Modal.confirm({
          title: '提示',
          content: '确定要批量发布吗？',
          onOk: async () => {
            const publishRequestList = selectedRowList.value.map(item => {
              return {
                account: item.account,
                gatherProductId: item.gatherProductId
              }
            })
            batchPublishToPlatform({
              publishRequestList: publishRequestList
            }).then(res => {
              message.success('操作成功')
              getList()
            })
          }
        })
        break
      case 3:
        watermarkModalOpen.value = true
        break
      case 4:
        Modal.confirm({
          title: '提示',
          content: '确定要批量归档吗？',
          onOk: async () => {
            // baseTableEl.value.setLoading(true);
            // const res = await moveToPending({ itemId: record.itemId });
            // if (res.code === 200) {
            //     message.success('归档成功');
            //     getList();
            // } else {
            //     message.error(res.msg);
            //     baseTableEl.value.setLoading(false);
            // }
          }
        })
        console.log('批量归档')
        break
      case 5:
        remarkModalEl.value.open(selectedRowList.value, true)
        break
      case 6:
        Modal.confirm({
          title: '提示',
          content: '确定要批量删除吗？',
          confirmLoading: true,
          onOk: async () => {
            const shopIdList = selectedRowList.value.map(item => item.account)
            const gatherProductIdList = selectedRowList.value.map(item => item.gatherProductId)
            ozonDeleteProduct({
              shopIdList: shopIdList,
              gatherProductIdList: gatherProductIdList
            }).then(res => {
              message.success('操作成功')
              getList()
            })
          }
        })
        break
      case 'stock':
        editPriceVisible.value = true
        getStore()
        getBrandList()
        break
      case 'price':
        editPriceVisible.value = true
        getStore()
        getBrandList()
        break
      case 'oldPrice':
        editPriceVisible.value = true
        getStore()
        getBrandList()
        break
      case 'all':
        editPriceVisible.value = true
        getStore()
        getBrandList()
        break
      default:
        break
    }
  }

  /** 批量加水印 */
  const watermarkModalOpen = ref(false)
  function watermarkOk(form) {
    const params = {
      productIds: selectedRowKeys.value,
      ...form
    }
    batchAddWatermarkToDraftProductApi(params).then(res => {
      selectedRowList.value = []
      selectedRowKeys.value = []
      message.success('添加水印成功')
    }).catch(err => {
      message.warning('添加水印失败')
    })
  }

  onMounted(() => {
    getAccount()
  })

  const show = ref(false)
</script>

<style lang="less" scoped>
  :deep(.ant-space-item) {
    text-align: left;
  }

  .record-sku-container {
    width: 100%;
  }

  .record-sku {
    border-bottom: 1px dashed #e8e8e8;
    padding-bottom: 6px;
  }

  .date {
    color: #999;
    margin-bottom: 4px;
  }

  .more {
    position: absolute;
    height: 30px;
    bottom: 0px;
    display: flex;
    justify-content: end;
  }

  .platform-name {
    padding-top: 5px;
    color: #428bca;
  }

  .account {
    color: #999;
    margin-top: 5px;
  }
</style>
