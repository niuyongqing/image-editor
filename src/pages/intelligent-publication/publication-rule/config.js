// 默认表头
export const DEFAULT_TABLE_COLUMN = [
  {
    title: '规则名称',
    key: 'name',
    fixed: 'left',
    width: 200
  },
  {
    title: '分类',
    key: 'category',
    width: 100
  },
  {
    title: '平均成本价区间',
    key: 'averageCostPriceRange',
    dataIndex: 'averageCostPriceRange',
    width: 160
  },
  {
    title: '平均重量区间',
    key: 'averageWeightRange',
    dataIndex: 'averageWeightRange',
    width: 160
  },
  {
    title: '状态',
    key: 'status',
    width: 100
  },
  {
    title: '备注',
    key: 'remark',
    width: 200
  },
  {
    title: '操作',
    key: 'options',
    fixed: 'right',
    width: 150
  }
]
