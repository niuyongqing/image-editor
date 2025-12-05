export default [
   {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 60,
    fixed: 'left',
  },
    {
      title: '图片',
      dataIndex: 'image',
      align: "center",
      width: 120,
    },
    {
      title: '标题/产品ID',
      dataIndex: 'name',
      align: "center",
      width: 350,
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      align: "left",
      width: 300,
    },
    {
      title: '售价',
      dataIndex: 'price',
      align: "price",
      width: 150,
      sorter: true,
    },
    {
      title: '原价',
      dataIndex: 'oldPrice',
      align: "price",
      width: 150,
    },
    {
      title: '总库存',
      dataIndex: 'stock',
      align: "center",
      width: 150,
      sorter: true,
    },
  
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: "center",
      width: 180,
      sorter: true,
    },
     {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: "center",
      width: 180,
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: "center",
      width: 100,
    },
  ]
  