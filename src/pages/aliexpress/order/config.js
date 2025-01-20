// 默认表头
export const DEFAULT_TABLE_COLUMN = [
  {
    title: '订单信息',
    key: 'id',
    width: 180
  },
  {
    title: '买家信息',
    key: 'buyerInfo',
    width: 100
  },
  {
    title: '商品信息',
    key: 'productInfo',
    width: 320
  },
  {
    title: '金额',
    key: 'amount',
    width: 120
  },
  {
    title: '订单状态',
    key: 'status',
    width: 120
  },
  {
    title: '时间',
    key: 'time',
    width: 180
  }
]

// 订单状态
export const STATUS_OPTIONS = [
  { label: '等待买家付款', value: 'PLACE_ORDER_SUCCESS' },
  { label: '买家申请取消', value: 'IN_CANCEL' },
  { label: '等待您发货', value: 'WAIT_SELLER_SEND_GOODS' },
  { label: '部分发货', value: 'SELLER_PART_SEND_GOODS' },
  { label: '等待买家收货', value: 'WAIT_BUYER_ACCEPT_GOODS' },
  { label: '买卖家达成一致，资金处理中', value: 'FUND_PROCESSING' },
  { label: '冻结中的订单', value: 'IN_ISSUE' },
  { label: '等待买家付款', value: 'IN_FROZEN' },
  { label: '等待您确认金额', value: 'WAIT_SELLER_EXAMINE_MONEY' },
  { label: '订单处于风控24小时中', value: 'RISK_CONTROL' },
  { label: '已结束', value: 'FINISH' }
]
