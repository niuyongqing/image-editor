// 变种信息表头
const columns = [
  {
    dataIndex: 'sellerSKU',
    title: 'SKU',
    align: 'center',
    show: true,
    width: 180
  },
  {
    dataIndex: 'costPrice',
    title: '成本价',
    align: 'center',
    show: true,
    width: 180
  },
  {
    dataIndex: 'stock',
    title: '库存',
    align: 'center',
    show: true,
    width: 120
  },
  {
    dataIndex: 'packageLength',
    title: '尺寸',
    align: 'center',
    show: true,
    width: 600
  },
  {
    dataIndex: 'options',
    title: '操作',
    align: 'center',
    show: true,
    width: 100
  }
]

const otherList = ['colorImg', 'skuTitle', 'secondName', 'sellerSKU', 'costPrice', 'stock', 'packageLength', 'options']

export { columns, otherList }
