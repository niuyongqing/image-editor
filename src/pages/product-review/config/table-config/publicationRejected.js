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
    width: 80,
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
    title: '审核人',
    dataIndex: 'firstAuditName',
    key: 'firstAuditName',
    align: 'center',
    width: 100, 
    show: true,
    filter: true
  },
  {
    title: '审核时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    align: 'center',
    width: 150,
    show: true,
    filter: true,
    sortable: true
  },
  {
    title: '驳回备注',
    dataIndex: 'firstAuditReason',
    key: 'firstAuditReason',
    align: 'left',
    width: 300,
    show: true,
  },
]
