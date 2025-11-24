// 默认表头
export const DEFAULT_TABLE_COLUMN = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    width: 50
  },
  {
    title: '规则名称',
    key: 'name',
    fixed: 'left',
    width: 160
  },
  {
    title: '分类',
    key: 'category',
    width: 160
  },
  {
    title: '平均成本价区间(CNY)',
    key: 'averageCostPriceRange',
    dataIndex: 'averageCostPriceRange',
    width: 120
  },
  {
    title: '平均重量区间(g)',
    key: 'averageWeightRange',
    dataIndex: 'averageWeightRange',
    width: 120
  },
  {
    title: '状态',
    key: 'status',
    width: 80
  },
  {
    title: '备注',
    key: 'remark',
    width: 160
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 100
  }
]
