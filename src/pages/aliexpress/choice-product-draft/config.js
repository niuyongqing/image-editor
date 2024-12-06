// 默认表头
export const DEFAULT_TABLE_COLUMN = [
  {
    name: '商品',
    dataIndex: 'draftId',
    key: 'draftId',
    sortable: false,
    show: true,
    minWidth: '400',
    filter: false
  },
  {
    name: '备货类型',
    dataIndex: 'productType',
    key: 'productType',
    sortable: false,
    show: true,
    minWidth: '140',
    filter: false
  },
  {
    name: 'SKU信息',
    dataIndex: 'skus',
    key: 'skus',
    sortable: false,
    show: true,
    minWidth: '450',
    filter: false
  },
  {
    name: '创建时间',
    dataIndex: 'saveTime',
    key: 'saveTime',
    sortable: true,
    show: true,
    minWidth: '130',
    filter: false
  },
  {
    name: '操作',
    dataIndex: 'option',
    key: 'option',
    sortable: false,
    show: true,
    minWidth: '100',
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
