// 默认表头
export const DEFAULT_TABLE_COLUMN = [
  {
    title: '商品',
    dataIndex: 'productId',
    key: 'productId',
    show: true,
    ellipsis: true,
    width: 400
  },
  {
    title: '分组',
    dataIndex: 'groupIds',
    key: 'groupIds',
    show: true,
    width: 200
  },
  {
    title: 'SKU信息',
    dataIndex: 'skus',
    key: 'skus',
    show: true,
    width: 400
  },
  {
    title: '状态',
    dataIndex: 'productStatusType',
    key: 'productStatusType',
    show: true,
    width: 100
  },
  {
    title: '运费模版',
    dataIndex: 'freightTemplateId',
    key: 'freightTemplateId',
    show: true,
    width: 150
  },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
    show: true,
    width: 220
  },
  {
    title: '操作',
    key: 'option',
    show: true,
    width: 120
  }
]

// 产品状态
export const PRODUCT_STATUS_OPTIONS = [
  { label: '上架', value: 'onSelling' },
  { label: '下架', value: 'offline' },
  { label: '审核中', value: 'auditing' },
  { label: '审核不通过', value: 'editingRequired' },
  { label: '客服删除', value: 'service_delete' },
  { label: '疑似删除', value: 'service_deleted' },
  { label: '所有删除商品', value: 'deleted' }
]

// 认领状态 Tab
export const TAB_OPTIONS = [
  { label: '全部', value: 'all' },
  { label: '未认领', value: 'unclaimed' },
  { label: '已认领', value: 'claimed' }
]

// 下架原因
export const SHELVE_KIND_OPTIONS = [
  { label: '手动下架', value: 'user_offline' },
  { label: '到期下架', value: 'expire_offline' },
  { label: '网规处罚下架', value: 'punish_offline' },
  { label: '交易违规下架', value: 'violate_offline' },
  { label: '降级下架', value: 'degrade_offline' },
  { label: '未续约下架', value: 'industry_offline' }
]

// 排序类型
export const SORT_TYPE_OPTIONS = [
  { label: '按更新时间', value: 'gmt_modified_time' },
  { label: '按创建时间', value: 'gmt_create_time' },
  { label: '按下架时间', value: 'aeop_national_quote_configuration.ws_offline_date_time' },
  { label: '按库存', value: 'ipm_sku_stock_count' },
  { label: '按价格', value: 'aeop_ae_product_s_k_us.sku_price_number' }
]
