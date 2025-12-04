// 默认表头
export const DEFAULT_TABLE_COLUMN = [
  { title: '图片', key: 'image', width: 120 },
  { title: '标题/产品 ID', key: 'title', width: 300 },
  { title: 'SKU', key: 'sku', dataIndex: 'sku', width: 120 },
  { title: '是否可搜索', key: 'isSearchable', align: 'center', width: 100 },
  { title: '竞价', key: 'bidding', align: 'right', width: 100 },
  { title: '产品价格', key: 'productPrice', align: 'right', width: 100 },
  { title: '可见性指数', key: 'visibilityIndex', align: 'right', width: 120 },
  { title: '订单量', key: 'orderVolume', align: 'right', width: 100 },
  { title: '订单金额', key: 'orderAmount', align: 'right', width: 100 },
  { title: '广告费用', key: 'advertisingExpenses', align: 'right', width: 100 },
  { title: '广告收入率', key: 'proportionAdvertisingExpenses', align: 'right', width: 100 },
  { title: '展示次数', key: 'displayCount', align: 'right', width: 100 },
  { title: '点击量', key: 'hits', align: 'right', width: 100 },
  { title: '点击率', key: 'clickRate', align: 'right', width: 100 },
  { title: '上周期竞价', key: 'previousBidding', align: 'right', width: 100 },
  { title: '竞价更新时间', key: 'biddingUpdateTime', align: 'center', width: 140 },
  { title: '最近更新时间', key: 'recentUpdateTime', align: 'center', width: 140 },
  { title: '启用状态', key: 'state', align: 'center', fixed: 'center', width: 100 },
  { title: '操作', key: 'operation', fixed: 'right', width: 100 }
]

// 启用状态
export const ENABLE_STATE_OPTIONS = [
  { label: '全部', value: undefined },
  { label: '开启', value: 'CAMPAIGN_STATE_RUNNING' },
  { label: '关闭', value: 'CAMPAIGN_STATE_INACTIVE' }
]
