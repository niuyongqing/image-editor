export default [
  {
    title: '标题/产品ID',
    dataIndex: 'name',
    align: "left",
    width: 400,
  },
  {
    title: '状态',
    dataIndex: 'waitState', // state
    align: "center",
    width: 100,
  },
  {
    title: 'SKU',
    dataIndex: 'sku',
    align: "center",
    width: 500,
  },
  {
    title: '售价',
    dataIndex: 'sku.price',
    align: "right",
    sorter: true,
    width: 100,
  },
  {
    title: '原价',
    dataIndex: 'oldPrice',
    align: "right",
    width: 100,
  },
  {
    title: '总库存',
    dataIndex: 'sku.stock',
    align: "right",
    sorter: true,
    width: 100,
  },
  {
      title: '创建时间',
      dataIndex: 'create_time',
      align: "center",
      sorter: true,
      width: 160,
      filter: false,
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      align: "center",
      sorter: true,
      width: 160,
      filter: false,
    },
  {
    title: '操作',
    dataIndex: 'option',
    fixed: 'right',
    align: "left",
    width: 150,
  },
]
