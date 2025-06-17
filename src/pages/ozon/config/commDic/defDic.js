

// 订单-状态
const orderStatus = [
  {
    label: "等待注册",
    value: "awaiting_registration",
  },
  {
    label: "正在验收",
    value: "acceptance_in_progress",
  },
  {
    label: "等待确认",
    value: "awaiting_approve",
  },
  {
    label: "等待包装",
    value: "awaiting_packaging",
  },
  {
    label: "等待装运",
    value: "awaiting_deliver",
  },
  {
    label: "仲裁",
    value: "arbitration",
  },
  {
    label: "快递客户仲裁",
    value: "client_arbitration",
  },
  {
    label: "运输中",
    value: "delivering",
  },
  {
    label: "司机处",
    value: "driver_pickup",
  },
  {
    label: "已送达",
    value: "delivered",
  },
  {
    label: "已取消",
    value: "cancelled",
  },
  {
    label: "分拣中心未接受",
    value: "not_accepted",
  },
  {
    label: "由卖家发送",
    value: "sent_by_seller",
  },
]

// 仓库-状态
const storeStatus = [
  {
    value: 'new',
    label: '正在激活'
  },
  {
    value: 'created',
    label: '已激活'
  },
  {
    value: 'disabled',
    label: '存档'
  },
  {
    value: 'blocked',
    label: '已封禁'
  },
  {
    value: 'disabled_due_to_limit',
    label: '暂停中'
  },
  {
    value: 'error',
    label: '错误'
  }

]

// 交易清单-状态
const tradStatus = [
  {
    value: "",
    label: "所有",
  },
  {
    value: "orders",
    label: "订单",
  },
  {
    value: "returns",
    label: "退货和取消订单",
  },
  {
    value: "services",
    label: "服务费",
  },
  {
    value: "compensation",
    label: "补贴",
  },
  {
    value: "transferDelivery",
    label: "快递价格",
  },
  {
    value: "other",
    label: "其他",
  },
]

//店铺商品 
const tabDicList = [
  {
    label: "全部",
    name: " ",
    code: "all",
    value: "0",
    prop: 1,
  },
  {
    label: "在售",
    name: "在售",
    code: "insale",
    value: "0",
    prop: 2,
  },
  {
    label: "平台审核",
    name: "平台审核",
    code: "inreview",
    value: "0",
    prop: 3,
  },
  {
    label: "准备出售",
    name: "准备出售",
    code: "toSupply",
    value: "0",
    prop: 4,
  },
  {
    label: "审核不通过",
    name: "审核不通过",
    code: "notPass",
    value: "0",
    prop: 5,
  },
  {
    label: "已归档",
    name: "已归档",
    code: "archived",
    value: "0",
    prop: 6,
  },
]

// 商品-描述
const attrList = [
  {
    title: "搜索属性为产品属性的重要属性，有助于买家通过筛选找到产品",
    list: [
      {
        sock: "30分",
        disc: "填写超过70%的属性"
      },
      {
        sock: "22.5分",
        disc: "填写超过50%的属性"
      },
      {
        sock: "15分",
        disc: "填写2个或更多属性"
      },
      {
        sock: "0分",
        disc: "填写2个以下属性"
      }
    ]
  },
  {
    title: "其他属性为产品属性的附加属性，有助于买家了解更多有关产品的信息",
    list: [
      {
        sock: "20分",
        disc: "填写超过50%的属性"
      },
      {
        sock: "12.5分",
        disc: "填写2个或更多属性"
      },
      {
        sock: "0分",
        disc: "填写2个以下属性"
      }
    ]
  },
  {
    title: "超过500个字符信息的描述有助于买家了解更多有关产品的信息并提高信任度",
    list: [
      {
        sock: "20分",
        disc: "填写富内容"
      },
      {
        sock: "10分",
        disc: "填写超过500个字符的描述"
      },
      {
        sock: "5分",
        disc: "填写超过100个字符的描述"
      },
      {
        sock: "0分",
        disc: "填写低于100个字符的描述"
      }
    ]
  },
  {
    title: "图片和视频有助于买家从查看产品并对其外观产生完整的印象",
    list: [
      {
        sock: "25分",
        disc: "添加视频封面+视频+3张图片"
      },
      {
        sock: "+12.5分",
        disc: "添加视频封面"
      },
      {
        sock: "+7.5分",
        disc: "添加视频"
      },
      {
        sock: "+5分",
        disc: "添加3个图片或更多"
      },
      {
        sock: "0分",
        disc: "添加少于3个图片"
      }
    ]
  }
]

// 商品-批量修改库存、价格等
const productBatchPrice = [
  {
    title: "价格与库存",
    checkAll:false,
    indeterminate:true,
    checkedList:[],
    list: [
      {
        label: '售价',
        value: 'price'
      },
      {
        label: '原价',
        value: 'oldPrice'
      },
      {
        label: '库存',
        value: 'stock'
      },
      {
        label: '最低价',
        value: 'minPrice'
      }
    ]
  },
  {
    title: "重量和尺寸",
    checkAll:false,
    indeterminate:true,
    checkedList:[],
    list: [
      {
        label: '重量',
        value: 'weight'
      },
      {
        label: '尺寸',
        value: 'size'
      }
    ]
  }
]

// 数据搬家
const dataMove = [
  {
    label: "全部",
    name: " ",
    code: "all",
    value: "0",
  },
  {
    label: "未认领",
    name: "未认领",
    code: "insale",
    value: "0",
  },
  {
    label: "已认领",
    name: "已认领",
    code: "inreview",
    value: "0",
  },
]

// 数据采集
const dataGathe = [
  {
    account: "1688",
    simpleName: "1688"
  },
  {
    account: "smt",
    simpleName: "速卖通"
  },
  {
    account: "shopee",
    simpleName: "Shopee"
  },
  {
    account: "lazada",
    simpleName: "Lazada"
  },
  {
    account: "amazon",
    simpleName: "Amazon"
  },
  {
    account: "temu",
    simpleName: "Temu"
  },
  {
    account: "ozon",
    simpleName: "Ozon"
  },
  {
    account: "shein",
    simpleName: "SHEIN"
  },
  {
    account: "tb",
    simpleName: "淘宝"
  },
  {
    account: "tm",
    simpleName: "天猫"
  },
  {
    account: "pdd",
    simpleName: "拼多多"
  },
  {
    account: "jd",
    simpleName: "京东"
  },
  {
    account: "ywg",
    simpleName: "义乌购"
  },
  {
    account: "wish",
    simpleName: "Wish"
  },
  {
    account: "eBay",
    simpleName: "eBay"
  },
  {
    account: "joom",
    simpleName: "joom"
  },
  {
    account: "mercado",
    simpleName: "Mercado"
  },
  {
    account: "coupang",
    simpleName: "Coupang"
  },
  {
    account: "etsy",
    simpleName: "Etsy"
  },
  {
    account: "al",
    simpleName: "阿里巴巴国际站"
  },
  {
    account: "dh",
    simpleName: "敦煌网"
  },
  {
    account: "daraz",
    simpleName: "Daraz"
  },
  {
    account: "walmart",
    simpleName: "Walmart"
  },
  {
    account: "tiktok",
    simpleName: "Tiktok"
  },
  {
    account: "fruugo",
    simpleName: "Fruugo"
  },
  {
    account: "wildnerries",
    simpleName: "Wildnerries"
  },
  {
    account: "miravia",
    simpleName: "Miravia"
  }
]

const colors = [
  {
    id: 1,
    color: "#009926",
  },
  {
    id: 2,
    color: "#F00",
    name: "红色",
  },
  {
    id: 3,
    color: "#0005FD",
  },
  {
    id: 4,
    color: "#FF5800",
  },
  {
    id: 5,
    color: "#8E0075",
  },
  {
    id: 6,
    color: "#FF6666",
  },
  {
    id: 7,
    color: "#FFCAC5",
  },
  {
    id: 8,
    color: "#00D0FF",
  },
];


const tabAllDicList = [
  {
    label: "全部",
    name: " ",
    code: "ALL",
    value: "0",
    prop: 1,
  },
  {
    label: "待发布",
    name: "wait_publish",
    code: "wait_publish",
    value: "0",
    prop: 2,
  },
  {
    label: "已发布",
    name: "published",
    code: "published",
    value: "0",
    prop: 3,
  },
  {
    label: "发布失败",
    name: "publish_failed",
    code: "publish_failed",
    value: "0",
    prop: 4,
  }
]
export { orderStatus, storeStatus, tradStatus, tabDicList, 
  attrList,productBatchPrice,dataMove,dataGathe, colors, tabAllDicList }