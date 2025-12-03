// 颜色样本在最前面
export const COLOR_IMAGE_COL = [{
  title: '颜色样本',
  key: 'colorImage',
  width: 90
}]

// 变种信息表头
export const COLUMNS = [
  {
    title: 'SKU',
    key: 'skuCode',
    width: 160
  },
  {
    title: '成本价(CNY)',
    key: 'costPrice',
    width: 70
  },
  {
    title: '库存',
    key: 'stock',
    width: 70
  },
  {
    title: '策划数量',
    key: 'planNum',
    width: 70
  },
  {
    title: '多数量策划',
    key: 'mult',
    align: 'center',
    width: 110
  },
  {
    title: '售卖单位',
    key: 'saleUnit',
    width: 100
  },
  {
    title: '尺寸(mm)',
    key: 'size',
    width: 120
  },
  {
    title: '重量(g)',
    key: 'weight',
    width: 60
  },
  {
    title: '操作',
    key: 'operate',
    width: 40
  }
]

// 售卖单位
export const UNIT_OPTIONS = [
  { label: '个/Piece/шт', ch: '个', en: 'Piece', ru: 'шт' },
  { label: '套/Set/комплект', ch: '套', en: 'Set', ru: 'комплект' },
  { label: '双/Pair/Пара', ch: '双', en: 'Pair', ru: 'Пара' },
  { label: '瓶/Bottle/бутылка', ch: '瓶', en: 'Bottle', ru: 'бутылка' },
  { label: '包/Bag/сумка', ch: '包', en: 'Bag', ru: 'сумка' },
  { label: '片/Sheet/лист', ch: '片', en: 'Sheet', ru: 'лист' }
]
