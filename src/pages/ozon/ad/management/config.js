// 默认表头
export const DEFAULT_TABLE_COLUMN = [
  { title: '活动名称', key: 'title', width: 400, fixed: 'left' },
  { title: '广告类型', key: 'placement', fixed: 'left' },
  { title: '广告产品', key: 'productCount' },
  { title: '付费类型', key: 'advObjectType' },
  { title: '广告策略', key: 'productAutopilotStrategy' },
  { title: '每日预算', key: 'dailyBudget' },
  { title: '每周预算', key: 'weeklyBudget' },
  { title: '订单量', key: 'orderVolume' },
  { title: '订单金额', key: 'orderAmount' },
  { title: '广告费用', key: 'advertisingExpenses' },
  { title: '广告费用占比', key: 'proportionAdvertisingExpenses' },
  { title: '展示次数', key: 'displayCount' },
  { title: '点击量', key: 'hits' },
  { title: '添加购物车次数', key: 'shoppingCartcQuantity' },
  { title: '点击率', key: 'clickRate' },
  { title: '平均点击价格', key: 'averageClickPrice' },
  { title: '平均利率', key: 'averageInterestRate' },
  { title: 'CPM', key: 'cpm' },
  { title: '活动状态', key: 'activityState', fixed: 'right' },
  { title: '启用状态', key: 'state', fixed: 'right' },
  { title: '操作', key: 'operation', fixed: 'right' }
]

// 广告类型枚举
export const PLACEMENT_ENUM = {
  PLACEMENT_TOP_PROMOTION: '登上顶端',
  PLACEMENT_SEARCH_AND_CATEGORY: '模板'
}

// 付费类型举
export const CHARGE_TYPE_ENUM = {
  SKU: '按点击量',
  BANNER: '横幅广告活动',
  SEARCH_PROMO: '订单付款'
}

// 广告策略枚举
export const STRATEGY_ENUM = {
  TARGET_BIDS: '平均每次点击费用',
  TOP_MAX_CLICKS: '自动策略'
}

// 搜索类型
export const SEARCH_PROP_OPTIONS = [
  { label: '活动名称', value: 'title' },
  { label: '活动 ID', value: 'id' }
]
export const PLACEHOLDER_ENUM = {
  title: '活动名称',
  sku: '活动 ID, 多个 ID 间用英文逗号隔开'
}

// 付款类型
export const PAY_TYPE_OPTIONS = [
  { label: '按展示量', value: 'BANNER' },
  { label: '按点击量', value: 'SKU' },
  { label: '按订单', value: 'SEARCH_PROMO' }
]

// 启用状态
export const ENABLE_STATE_OPTIONS = [
  { label: '开启', value: 'CAMPAIGN_STATE_RUNNING' },
  { label: '关闭', value: 'CAMPAIGN_STATE_INACTIVE' }
]

// 活动状态
export const ACTIVE_STATE_OPTIONS = [
  { label: '进行中', value: 'CAMPAIGN_STATE_RUNNING' },
  { label: '未开始', value: '2' },
  { label: '已暂停', value: 'CAMPAIGN_STATE_INACTIVE' },
  { label: '已归档', value: 'CAMPAIGN_STATE_ARCHIVED' },
  { label: '草稿', value: '5' },
  { label: '审核中', value: '6' },
  { label: '审核失败', value: '7' },
  { label: '已完成', value: 'CAMPAIGN_STATE_FINISHED' }
]

// 广告列表 tab
export const LIST_TABS = [
  { label: '全部', value: 'ALL' },
  { label: '登上顶端', value: 'PLACEMENT_TOP_PROMOTION' },
  { label: '模板', value: 'PLACEMENT_SEARCH_AND_CATEGORY' }
]
export const listTabsCountEnum = {
  ALL: 0,
  PLACEMENT_TOP_PROMOTION: 0,
  PLACEMENT_SEARCH_AND_CATEGORY: 0
}
