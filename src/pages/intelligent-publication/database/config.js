// 默认表头
export const DEFAULT_TABLE_COLUMN = [
  {
    title: '示意图',
    key: 'image',
    fixed: 'left',
    width: 200
  },
  {
    title: '产品名称',
    key: 'commodityName',
    dataIndex: 'commodityName',
    fixed: 'left',
    width: 200
  },
  {
    title: '产品SKU',
    key: 'sku',
    width: 200
  },
  {
    title: '平均成本价',
    key: 'averageCostPrice',
    dataIndex: 'averageCostPrice',
    width: 200
  },
  {
    title: '平均重量',
    key: 'averageWeight',
    dataIndex: 'averageWeight',
    width: 200
  },
  {
    title: '分类',
    key: 'category',
    width: 200
  },
  {
    title: '提交人',
    key: 'submiter',
    width: 200
  },
  {
    title: '提交时间',
    key: 'submitTime',
    dataIndex: 'submitTime',
    width: 200
  },
  {
    title: '审核人',
    key: 'reviewer',
    dataIndex: 'lastAuditUserName',
    width: 200
  },
  {
    title: '完成时间',
    key: 'finalAuditTime',
    dataIndex: 'finalAuditTime',
    width: 200
  },
  {
    title: '备注',
    key: 'remark',
    dataIndex: 'remark',
    width: 200
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 200
  }
]
