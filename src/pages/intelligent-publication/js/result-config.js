export const DEFAULT_COLUMNS = [
  {
    title: '标题/产品ID',
    dataIndex: 'name',
    align: 'center',
    width: 540,
    filter: false
  },
  {
    title: 'SKU信息',
    dataIndex: 'sku',
    width: 180
  },
  {
    title: '售价',
    dataIndex: 'price',
    align: 'center',
    width: 180
  },
  {
    title: '原价',
    dataIndex: 'oldPrice',
    align: 'center',
    width: 180
  },
  {
    title: '最低价',
    dataIndex: 'minPrice',
    align: 'center',
    width: 180
  },
  {
    title: '总库存',
    dataIndex: 'stock',
    align: 'center',
    width: 180
  },
  {
    title: '错误信息',
    dataIndex: 'errorInfo',
    align: 'center',
    width: 180
  },
  {
    title: '状态',
    dataIndex: 'state', // state
    align: 'center',
    width: 180,
    filter: false
  },
  {
    title: '刊登模式',
    dataIndex: 'publishType',
    align: 'center',
    width: 180,
    filter: false
  },
  {
    title: '时间',
    dataIndex: 'createdAt',
    align: 'center',
    width: 250,
    filter: false
  },
  {
    title: '操作',
    dataIndex: 'option',
    width: 160,
    filter: false
  }
]

//店铺商品
export const TABS = [
  {
    label: '全部',
    value: '',
    count: 0
  },
  {
    label: '审核中',
    value: '平台审核,准备出售',
    count: 0
  },
  {
    label: '刊登成功',
    value: '在售',
    count: 0
  },
  {
    label: '刊登失败',
    value: '审核不通过',
    count: 0
  }
]
