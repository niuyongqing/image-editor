// 刊登序列表头
export const COLUMNS = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    width: 50
  },
  {
    title: '主图',
    key: 'mainImage',
    fixed: 'left',
    width: 100
  },
  {
    title: '产品标题',
    key: 'title',
    fixed: 'left',
    width: 240
  },
  {
    title: '店铺',
    key: 'shopName',
    dataIndex: 'shopName',
    width: 200
  },
  {
    title: '刊登模式',
    key: 'publishType',
    width: 100
  },
  {
    title: '状态',
    key: 'publishStatus',
    width: 100
  },
  {
    title: 'SKU',
    key: 'skuCode',
    align: 'center',
    width: 100
  },
  {
    title: '售价(CNY)',
    key: 'price',
    align: 'center',
    width: 100
  },
  {
    title: '原价(CNY)',
    key: 'originalPrice',
    align: 'center',
    width: 100
  },
  {
    title: '库存',
    key: 'stock',
    align: 'center',
    width: 100
  },
  {
    title: '时间',
    key: 'time',
    width: 220
  },
  {
    title: '备注',
    key: 'remark',
    width: 240
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 100
  }
]
