// 默认表头
export const DEFAULT_TABLE_COLUMN = [
  {
    title: '商品',
    dataIndex: 'productId',
    key: 'productId',
    sortable: false,
    show: true,
    ellipsis: true,
    width: 400,
    filter: false
  },
  {
    title: '备货类型',
    dataIndex: 'productType',
    key: 'productType',
    sortable: false,
    show: true,
    width: 140,
    filter: false
  },
  {
    title: 'SKU信息',
    dataIndex: 'skus',
    key: 'skus',
    sortable: false,
    show: true,
    width: 450,
    minWidth: 450,
    filter: false
  },
  {
    title: '状态',
    dataIndex: 'productStatus',
    key: 'productStatus',
    sortable: false,
    show: true,
    width: 80,
    filter: false
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    sortable: true,
    show: true,
    width: 130,
    filter: false
  },
  {
    title: '编辑时间',
    dataIndex: 'update_time',
    key: 'update_time',
    sortable: true,
    show: true,
    width: 130,
    filter: false
  },
  {
    title: '操作',
    dataIndex: 'option',
    key: 'option',
    sortable: false,
    show: true,
    width: 100,
    filter: false
  }
]

// 特殊商品类型选项
export const SPECIAL_PRODUCT_TYPE_OPTIONS = [
  { label: '纯电', value: '274273', disabled: false },
  { label: '内电', value: '274526', disabled: false },
  { label: '弱磁', value: '274452', disabled: false },
  // { label: '强磁', value: '', disabled: true },
  { label: '液体', value: '274259', disabled: false },
  { label: '粉末', value: '274511', disabled: false },
  { label: '膏体', value: '274363', disabled: false },
  // { label: '管制刀具', value: '', disabled: true },
  // { label: '颗粒', value: '', disabled: true },
  { label: '枪型玩具', value: '1043805', disabled: false }
]
