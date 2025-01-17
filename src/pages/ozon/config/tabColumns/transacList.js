export default [
    {
      title: '累积日期',
      dataIndex: 'operationDate',
      align:"center",
      sortable:true,
      filter:false,
    },
    {
      title: '包裹或服务追踪号码',
      dataIndex: 'postingNumber',
      align:"center",
      sortable:false,
      filter:false,
    },
    {
      title: 'sku',
      dataIndex: 'sku',
      align:"center",
      sortable:false,
      filter:false,
    },
    {
      title: '标题',
      dataIndex: 'name',
      align:"center",
      sortable:false,
      filter:false,
      width: 300
    },
    {
      title: '状态',
      dataIndex: 'type',
      align:"center",
    },
    {
      title: '下单时间',
      dataIndex: 'orderDate',
      align:"center",
      sortable:false,
      filter:false,
    },
    {
      title: '发货仓库',
      dataIndex: 'deliverySchema',
      align:"center",
      sortable:false,
      filter:false,
    },
    {
      title: '商品成本',
      dataIndex: 'accrualsForSale',
      align:"center",
      sortable:false,
      filter:false,
    },
    {
      title: '销售提成',
      dataIndex: 'saleCommission',
      align:"center",
      sortable:false,
      filter:false,
    },
    {
      title: '处理和送货',
      dataIndex: 'returnDeliveryCharge',
      align:"center",
      sortable:false,
    },
    {
      title: '退货和取消',
      dataIndex: 'deliveryCharge',
      align:"center",
      sortable:false,
      filter:false,
    },
    {
      title: '总计',
      dataIndex: 'amount',
      align:"center",
      sortable:false,
      filter:false,
    }
  ]
  