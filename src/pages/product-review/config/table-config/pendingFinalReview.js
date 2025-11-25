// 初始选品审核发布列表
export default [
 {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 50,
    fixed: 'left',
  },
  {
    title: '主图',
    dataIndex: 'artMainImage',
    key: 'artMainImage',
    align: 'center',
    fixed: 'left',
    width: 60,
  },
  {
    title: '市场方向',
    dataIndex: 'devAttributableMarket',
    key: 'devAttributableMarket',
    align: 'left',
    width: 120,
    show: true,
    filter: true
  },
  {
    title: "产品名称",
    dataIndex: "commodityName",
    key: "commodityName",
    align: "left",
    width: 200,
    minWidth: 200,
    show: true,
    filter: true,
  },
  {
    title: '产品SKU',
    dataIndex: 'skuList',
    key: 'skuList',
    align: 'left',
    width: 120,
    show: true,
    filter: true
  },
  {
    title: '仓储类别',
    dataIndex: 'meansKeepGrain',
    key: 'meansKeepGrain',
    align: 'center',
    width: 200,
    show: true,
    filter: true
  },
  {
    title: '分类',
    dataIndex: 'classify',
    key: 'classify',
    align: 'center',
    width: 330,
    show: true,
    filter: true
  },
  {
    title: '提交人',
    dataIndex: 'selectUserName',
    key: 'selectUserName',
    align: 'center',
    width: 100,
    show: true,
    filter: true
  },
  {
    title: '提交时间',
    dataIndex: 'selectTime',
    key: 'selectTime',
    align: 'center',
    width: 150,
    show: true,
    filter: true,
    sortable: true
  },
  {
    title: '选品理由',
    dataIndex: 'selectReason',
    key: 'selectReason',
    align: 'left',
    width: 200,
    show: true,
  }
]
