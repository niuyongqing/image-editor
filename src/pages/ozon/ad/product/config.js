// 默认表头
export const DEFAULT_TABLE_COLUMN = [
  { title: '图片', key: 'image' },
  { title: '标题/产品 ID', key: 'title' },
  { title: 'SKU', key: 'sku', dataIndex: 'sku' },
  { title: '活动名称', key: 'name' },
  { title: '广告类型', key: 'type' },
  { title: '广告策略', key: 'strategy' },
  { title: '竞价', key: 'bidding' },
  { title: '操作', key: 'options' }
]

// 搜索类型
export const SEARCH_PROP_OPTIONS = [
  { label: '活动名称', value: 'title' },
  { label: '活动 ID', value: 'activeId' },
  { label: '产品 ID', value: 'productId' },
  { label: '产品名称', value: 'name' },
  { label: 'SKU', value: 'sku' }
]
export const PLACEHOLDER_ENUM = {
  title: '活动名称',
  activeId: '活动 ID, 多个 ID 间用英文逗号隔开',
  productId: '产品 ID, 多个 ID 间用英文逗号隔开',
  name: '产品名称',
  sku: 'SKU, 多个 SKU 间用英文逗号隔开'
}

// 广告列表 tab
export const LIST_TABS = [
  { label: '全部', value: 'all' },
  { label: '登上顶端', value: 'top' },
  { label: '模板', value: 'template' }
]
export const LIST_TABS_COUNT_ENUM = {
  all: 0,
  top: 0,
  template: 0
}
