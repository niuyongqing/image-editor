// 开发状态选择器
const devStatus = [
  {
    value: "1",
    label: "未提交",
  },
  {
    value: "2",
    label: "待初审",
  },
  {
    value: "3",
    label: "待复审",
  },
  {
    value: "4",
    label: "已审核",
  },
  {
    value: "5",
    label: "已驳回",
  },
];

// 资料制作选择器
const meansStatusS = [
  {
    value: "1",
    label: "资料待编辑",
  },
  {
    value: "2",
    label: "资料待审核",
  },
  {
    value: "3",
    label: "资料已驳回",
  },
  {
    value: "4",
    label: "待采购",
  },
  {
    value: "5",
    label: "新品待拍",
  },
  {
    value: "6",
    label: "老品重拍",
  },
  {
    value: "7",
    label: "图片待审核", // 含初审、复审、终审
  },
  {
    value: "8",
    label: "图片已驳回",
  },
  {
    value: "9",
    label: "资料已完成",
  },
  {
    value: "10",
    label: "已下架",
  },
];
// 商品属性
const productAttr = [
  {
    value: "0",
    label: "普通商品",
  },
  {
    value: "1",
    label: "液体商品",
  },
  {
    value: "2",
    label: "膏状商品",
  },
  {
    value: "3",
    label: "粉末商品",
  },
  {
    value: "4",
    label: "带磁商品",
  },
  {
    value: "5",
    label: "带电商品",
  },
  {
    value: "6",
    label: "刀具商品",
  },
];

// 仓库类型
const meansKeepGrains = [
  {
    value: "0",
    label: "总仓",
  },
  {
    value: "1",
    label: "馨拓靓仓",
  },
  {
    value: "2",
    label: "PH海外仓",
  },
  {
    value: "3",
    label: "馨拓美仓",
  },
  {
    value: "4",
    label: "TH海外仓",
  },
  {
    value: "5",
    label: "亚马逊仓",
  },
  // {
  //   "value": "6",
  //   "label": "新仓",
  // },
];

const meansKeepGrains2 = [
  {
    value: "总仓",
    label: "总仓",
  },
  // {
  //   "value": "新仓",
  //   "label": "新仓",
  // },
  {
    value: "馨拓靓仓",
    label: "馨拓靓仓",
  },
  {
    value: "PH海外仓",
    label: "PH海外仓",
  },
  {
    value: "馨拓美仓",
    label: "馨拓美仓",
  },
];

const PHmeansKeepGrains = [
  {
    value: "0",
    label: "总仓",
  },
  {
    value: "1",
    label: "馨拓靓仓",
  },
  {
    value: "3",
    label: "馨拓美仓",
  },
];

// 美工类型
const artType = [
  {
    value: "5",
    label: "紧急刊登",
  },
  {
    value: "6",
    label: "到货拍照",
  },
  {
    value: "7",
    label: "到货刊登",
  },
  {
    value: "9",
    label: "图片处理",
  },
  {
    value: "10",
    label: "店铺装修",
  },
  {
    value: "11",
    label: "老品重拍",
  },
];
// 美工进度
const artCourse = [
  {
    value: "1",
    label: "待拍照",
  },
  {
    value: "2",
    label: "待初审",
  },
  {
    value: "3",
    label: "待复审",
  },
  {
    value: "4",
    label: "待终审",
  },
  {
    value: "5",
    label: "已驳回",
  },
  {
    value: "6",
    label: "已完成",
  },
];

// 产品资料库
const storeStatus = [
  {
    value: "1",
    label: "已完成",
  },
  {
    value: "2",
    label: "已下架",
  },
  {
    value: "3",
    label: "重拍中",
  },
  {
    value: "4",
    label: "待拍照",
  },
];
// 出库类型
const outTypeSelect = [
  {
    value: "1",
    label: "产品重拍借用",
  },
  {
    value: "2",
    label: "样品对比借用",
  },
  {
    value: "3",
    label: "行政需要领用",
  },
  {
    value: "4",
    label: "厂家寄样领用",
  },
  {
    value: "5",
    label: "驳回产品重拍借用",
  },
];
export {
  devStatus,
  meansStatusS,
  productAttr,
  meansKeepGrains,
  artType,
  artCourse,
  storeStatus,
  outTypeSelect,
  PHmeansKeepGrains,
  meansKeepGrains2,
};
