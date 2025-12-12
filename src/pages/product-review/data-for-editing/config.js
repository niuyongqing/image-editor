// 默认表头
export const DEFAULT_TABLE_COLUMN = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    width: 50
  },
  {
    title: '主图',
    key: 'image',
    fixed: 'left',
    width: 100
  },
  {
    title: '产品名称',
    key: 'commodityName',
    dataIndex: 'commodityName',
    fixed: 'left',
    width: 180
  },
  {
    title: '市场方向',
    key: 'market',
    width: 80
  },
  {
    title: '产品SKU',
    key: 'sku',
    width: 200
  },
  {
    title: '仓储类别',
    key: 'storage',
    align: 'center',
    width: 80
  },
  {
    title: '分类',
    key: 'category',
    width: 200
  },
  {
    title: '提交人',
    key: 'submiter',
    dataIndex: 'selectUserName',
    align: 'center',
    width: 100
  },
  {
    title: '审核人',
    key: 'reviewer',
    align: 'center',
    width: 100
  },
  {
    title: '提交时间',
    key: 'selectTime',
    dataIndex: 'selectTime',
    align: 'center',
    width: 160
  },
  {
    title: '审核时间',
    key: 'firstAuditTime',
    dataIndex: 'firstAuditTime',
    align: 'center',
    width: 160
  },
  {
    title: '选品理由',
    key: 'selectReason',
    width: 160
  },
  {
    title: '备注',
    key: 'remark',
    width: 160
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 100
  }
]

// 市场方向
export const MARKET_OPTIONS = [
  {
    value: '2',
    label: '欧美'
  },
  {
    value: '1',
    label: '东南亚'
  },
  {
    value: '3',
    label: '菲律宾本土'
  },
  {
    value: '4',
    label: '泰国本土'
  },
  {
    value: '5',
    label: '泰国本土和菲律宾本土'
  },
  {
    value: '6',
    label: '亚马逊haul'
  },
  {
    value: '7',
    label: '韩国'
  }
]

// 仓储类别
export const STORAGE_OPTIONS = [
  {
    value: '0',
    label: '总仓'
  },
  {
    value: '1',
    label: '馨拓靓仓'
  },
  {
    value: '2',
    label: 'PH海外仓'
  },
  {
    value: '3',
    label: '馨拓美仓'
  },
  {
    value: '4',
    label: 'TH海外仓'
  },
  {
    value: '5',
    label: '亚马逊仓'
  },
  {
    value: '7',
    label: '南宁仓'
  },
  {
    value: '8',
    label: '菲律宾一仓'
  },
  {
    value: '9',
    label: '菲律宾二仓'
  },
  {
    value: '10',
    label: 'Coupang仓'
  }
  // {
  //   value: '6',
  //   label: '新仓'
  // }
]
