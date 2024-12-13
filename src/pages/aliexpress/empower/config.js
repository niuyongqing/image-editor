// 默认表头
export const DEFAULT_TABLE_COLUMN = [
  {
    title: '店铺ID',
    dataIndex: 'sellerId'
  },
  {
    title: '过期时间',
    dataIndex: 'expireTime'
  },
  {
    title: '账号',
    dataIndex: 'account'
  },
  {
    title: '品类',
    dataIndex: 'classify'
  },
  {
    title: '禁售属性',
    dataIndex: 'forbidSale'
  },
  {
    title: '自动刊登',
    dataIndex: 'autoPublish'
  },
  {
    title: '仓库',
    dataIndex: 'meansKeepGrain'
  },
  {
    title: '简称',
    dataIndex: 'simpleName'
  },
  {
    title: '别名',
    dataIndex: 'alias'
  },
  {
    title: '备注',
    dataIndex: 'remark'
  },
  {
    title: '生成时间',
    dataIndex: 'createTime'
  },
  {
    title: '编辑时间',
    dataIndex: 'updateTime'
  }
]

// 品类
export const CLASSIFY_OPTIONS = [
  { value: '01', label: '饰品配件' },
  { value: '02', label: '服饰配饰' },
  { value: '03', label: '家居' },
  { value: '04', label: '3C' },
  { value: '05', label: '文具办公' },
  { value: '06', label: '美妆个护' },
  { value: '07', label: '汽摩配' },
  { value: '08', label: '户外运动' },
  { value: '09', label: '母婴玩具' },
  { value: '10', label: '宠物' },
  { value: '99', label: '其他' }
]

// 仓库列表
export const WAREHOUSE_LIST = [
  {
    value: '0',
    label: '总仓',
    simpleName: 'AliExpress-01'
  },
  {
    value: '1',
    label: '馨拓靓仓(配饰,服饰类)',
    simpleName: 'AliExpress-02'
  },
  {
    value: '2',
    label: '菲律宾本土仓',
    simpleName: 'AliExpress-03'
  },
  {
    value: '3',
    label: '馨拓美仓(美妆类)',
    simpleName: 'AliExpress-04'
  },
  {
    value: '4',
    label: '馨拓美仓(3C类)',
    simpleName: 'AliExpress-05'
  },
  {
    value: '5',
    label: '馨拓美仓(汽摩配类)',
    simpleName: 'AliExpress-06'
  },
  {
    value: '6',
    label: '泰国本土仓',
    simpleName: 'AliExpress-07'
  }
]
