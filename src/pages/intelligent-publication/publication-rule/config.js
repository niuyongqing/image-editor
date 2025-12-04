// 默认表头
export const DEFAULT_TABLE_COLUMN = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    align: 'center',
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
    align: 'center',
    width: 120
  },
  {
    title: '平均重量区间(g)',
    key: 'averageWeightRange',
    dataIndex: 'averageWeightRange',
    align: 'center',
    width: 120
  },
  {
    title: '状态',
    key: 'status',
    align: 'center',
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
    align: 'left',
    width: 100
  }
]
