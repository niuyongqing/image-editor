// 默认表头
export const DEFAULT_TABLE_COLUMN = [
  { title: '活动名称', key: 'name' },
  { title: '广告类型', key: 'type' },
  { title: '广告产品', key: 'product' },
  { title: '付费类型', key: 'chargeType' },
  { title: '广告策略', key: 'strategy' },
  { title: '每日预算', key: 'dailyBudget' },
  { title: '每周预算', key: 'weeklyBudget' },
  { title: '订单量', key: 'orderQuantity' },
  { title: '订单金额', key: 'orderAmount' },
  { title: '广告费用', key: 'fee' },
  { title: '广告费用占比', key: 'feeProportion' },
  { title: '展示次数', key: 'displayCount' },
  { title: '点击量', key: 'hits' },
  { title: '添加购物车次数', key: 'shopping cart' },
  { title: '点击率', key: 'hitsRate' },
  { title: '平均点击价格', key: 'averageHitsPrice' },
  { title: '平均利率', key: 'averageRate' },
  { title: 'CPM', key: 'cpm' },
  { title: '活动状态', key: 'avtiveState' },
  { title: '启用状态', key: 'enableState' },
  { title: '操作', key: 'options' }
]

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
  { label: '按展示量', value: 'showCount' },
  { label: '按点击量', value: 'hits' },
  { label: '按订单', value: 'orderCount' }
]

// 启用状态
export const ENABLE_STATE_OPTIONS = [
  { label: '开启', value: 'active' },
  { label: '关闭', value: 'deactive' }
]

// 活动状态
export const ACTIVE_STATE_OPTIONS = [
  { label: '进行中', value: '1' },
  { label: '未开始', value: '2' },
  { label: '已暂停', value: '3' },
  { label: '已归档', value: '4' },
  { label: '草稿', value: '5' },
  { label: '审核中', value: '6' },
  { label: '审核失败', value: '7' },
  { label: '已完成', value: '8' }
]

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
