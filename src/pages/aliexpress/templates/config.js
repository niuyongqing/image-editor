// 默认表头
export const ALL_TABLE_COLUMN = [
  {
    title: '模板名称',
    dataIndex: 'name',
    key: 'name',
    width: 300,
    scope: ['attribute', 'variant', 'nationalQuote']
  },
  {
    title: '模板分类',
    dataIndex: 'category',
    key: 'category',
    width: 200,
    scope: ['attribute']
  },
  {
    title: '变种主题',
    dataIndex: 'variant',
    key: 'variant',
    width: 200,
    scope: ['variant']
  },
  {
    title: '创建时间',
    dataIndex: 'time',
    key: 'time',
    width: 200,
    scope: ['attribute', 'variant', 'nationalQuote']
  },
  {
    title: '启用状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    scope: ['attribute', 'variant', 'nationalQuote']
  },
  {
    title: '操作',
    key: 'option',
    width: 120,
    scope: ['attribute', 'variant', 'nationalQuote']
  }
]
