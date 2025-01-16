// 默认表头
export const DEFAULT_TABLE_COLUMN = [
  {
    title: '商品',
    dataIndex: 'draftId',
    key: 'draftId',
    show: true,
    width: 400
  },
  {
    title: '备货类型',
    dataIndex: 'productType',
    key: 'productType',
    show: true,
    width: 140
  },
  {
    title: 'SKU信息',
    dataIndex: 'skus',
    key: 'skus',
    show: true,
    width: 450
  },
  {
    title: '创建时间',
    dataIndex: 'saveTime',
    key: 'saveTime',
    show: true,
    width: 130
  },
  {
    title: '操作',
    dataIndex: 'option',
    key: 'option',
    show: true,
    width: 100
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
