// 默认表头
export const DEFAULT_TABLE_COLUMN = [
  {
    title: '商品',
    key: 'product',
    show: true,
    ellipsis: true,
    width: 400
  },
  {
    title: '分组',
    key: 'groupIds',
    show: true,
    width: 200
  },
  {
    title: 'SKU信息',
    key: 'skus',
    show: true,
    width: 400
  },
  {
    title: '运费模版',
    key: 'freightTemplateId',
    show: true,
    width: 150
  },
  {
    title: '时间',
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

// 排序类型
export const SORT_TYPE_OPTIONS = [
  { label: '按更新时间', value: 'update_time' },
  { label: '按创建时间', value: 'create_time' },
  { label: '按库存', value: 'result.aeop_ae_product_s_k_us.sku_stock' },
  { label: '按价格', value: 'result.aeop_ae_product_s_k_us.sku_price' }
]
