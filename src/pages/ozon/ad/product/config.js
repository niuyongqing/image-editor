// 默认表头
export const DEFAULT_TABLE_COLUMN = [
  { title: '图片', key: 'image', align: 'left', width: 120 },
  { title: '标题/产品 ID', key: 'title', align: 'left', width: 250 },
  { title: 'SKU', key: 'sku', dataIndex: 'sku', align: 'left', width: 120 },
  { title: '活动名称', key: 'name', align: 'center', width: 120 },
  { title: '广告类型', key: 'type', align: 'center', width: 120 },
  { title: '广告策略', key: 'strategy', align: 'center', width: 120 },
  { title: '竞价', key: 'bidding', align: 'right', width: 120 },
  { title: '操作', key: 'operation', align: 'left', width: 100 }
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
