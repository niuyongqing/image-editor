// 返回开发状态
const devStatusTag = function (row) {
  switch (row) {
    case 1:
      return '<a-tag color="blue">未提交</a-tag>';
    case 2:
      return "<a-tag>待初审</a-tag>";
    case 3:
      return '<a-tag color="orange">待复审</a-tag>';
    case 4:
      return '<a-tag color="green">已审核</a-tag>';
    case 5:
      return '<a-tag color="red">已驳回</a-tag>';
    default:
      return "";
  }
};

// 1 资料待编辑 2 资料待审核 3 资料已驳回 4 待采购 5 新品待拍 6 老品重拍 7 图片待审核 8 图片已驳回 9 资料已完成 10 已下架
// 资料制作 1待编辑，2待审核，3审核通过（待采购），4，未执行，5.紧急刊登(到新品待拍，并且到资料库的待拍照)，6到货拍照（流向新品待拍），7到货刊登（流向新品待拍、产品资料库待拍照），8.已下架（采购不到），
// 美工管理 状态,1待拍照,2待初审，3待复审。4待终审。5已驳回，6已完成。
const meansStatusTag = function (meansStatus, artStatus) {
  let tag = "";
  switch (meansStatus) {
    case 2001:
      tag = '<a-tag color="green">样品数量待确认</a-tag>';
      break;
    case 301:
      tag = '<a-tag color="green">样品采购中/出库中</a-tag>';
      break;
    case 31:
      tag = '<a-tag color="green">样品采购/调拨</a-tag>';
      break;
    case 32:
      tag = '<a-tag color="green">样品确认</a-tag>';
      break;
    case 33:
      tag = '<a-tag color="blue">样品取消</a-tag>';
      break;
    case 34:
      tag = '<a-tag color="green">库存采购</a-tag>';
      break;
    case 35:
    case 6:
      tag = '<a-tag color="green">采购完成</a-tag>';
      break;
    case 36:
      tag = '<a-tag color="green">资料复核</a-tag>';
      break;
    case 1:
      tag = '<a-tag color="blue">资料待编辑</a-tag>';
      break;
    case 41:
      tag = '<a-tag color="blue">文案待编辑</a-tag>';
      break;
    case 2:
      tag = "<a-tag>资料待审核</a-tag>";
      break;
    case 3:
      tag = "<a-tag>待采购</a-tag>";
      break;
    case 4:
      tag = '<a-tag color="blue">未执行</a-tag>';
      break;
    case 8:
      tag = '<a-tag color="red">已下架</a-tag>';
      break;
    default:
      break;
  }

  if (meansStatus != 8) {
    switch (artStatus) {
      case 1:
        tag = '<a-tag color="green">待拍照</a-tag>';
        break;
      case 2:
        tag = '<a-tag color="blue">美工待初审</a-tag>';
        break;
      case 3:
        tag = '<a-tag color="blue">美工运营复审</a-tag>';
        break;
      case 4:
        tag = '<a-tag color="blue">美工待终审</a-tag>';
        break;
      case 5:
        tag = '<a-tag color="blue">美工已驳回</a-tag>';
        break;
      case 6:
        tag = '<a-tag color="green">已完成</a-tag>';
        break;
      case 10:
        tag = '<a-tag color="blue">美工开发复审</a-tag>';
        break;
      default:
        break;
    }
  }

  return tag;
};

// 产品资料库
const storeStatusTag = function (row) {
  switch (row) {
    case 1:
      return '<a-tag color="green">已完成</a-tag>';
    case 2:
      return '<a-tag color="blue">已下架</a-tag>';
    case 3:
      return '<a-tag color="orange">重拍中</a-tag>';
    case 4:
      return "<a-tag>待拍照</a-tag>";
    default:
      return "";
  }
};

// 仓储类型
const meansKeepGrainTag = function (row) {
  let tag = "";
  row.split(",").forEach((v) => {
    switch (v) {
      case "0":
      case "总仓":
        tag += "<a-tag>总仓</a-tag><br/>";
        break;
      case "1":
      case "馨拓靓仓":
        tag += "<a-tag>馨拓靓仓</a-tag><br/>";
        break;
      case "2":
      case "PH海外仓":
        tag += "<a-tag>PH海外仓</a-tag><br/>";
        break;
      case "3":
      case "馨拓美仓":
        tag += "<a-tag>馨拓美仓</a-tag><br/>";
        break;
      case "4":
      case "TH海外仓":
        tag += "<a-tag>TH海外仓</a-tag><br/>";
        break;
      case "5":
      case "亚马逊仓":
        tag += "<a-tag>亚马逊仓</a-tag><br/>";
        break;
      default:
        break;
    }
  });
  return tag;
};

// 美工进度
const artCourseTag = function (row) {
  switch (row) {
    case 1:
      return '<a-tag color="blue">待拍照</a-tag>';
    case 2:
      return '<a-tag color="blue">待初审</a-tag>';
    case 3:
      return '<a-tag color="blue">开发复审</a-tag>';
    case 10:
      return '<a-tag color="blue">运营复审</a-tag>';
    case 4:
      return '<a-tag color="blue">待终审</a-tag>';
    case 5:
      return '<a-tag color="red">已驳回</a-tag>';
    case 6:
      return '<a-tag color="green">已完成</a-tag>';
    default:
      return "";
  }
};

// 美工类型
const artTypeTag = function (row) {
  switch (row) {
    case 5:
    case 6:
    case 7:
      return "<a-tag>新品待拍</a-tag>";
    case 9:
      return "<a-tag>图片处理</a-tag>";
    case 10:
      return "<a-tag>店铺装修</a-tag>";
    case 11:
      return "<a-tag>老品重拍</a-tag>";
    default:
      return "";
  }
};

const renwuartTypeTag = function (row) {
  switch (row) {
    case 1:
      return "<a-tag>运营提交</a-tag>";
    case 2:
      return "<a-tag>shein提交</a-tag>";
    case 3:
      return "<a-tag>服务部提交</a-tag>";
    default:
      return "";
  }
};

// 出库类型
const outTypeTag = function (row) {
  switch (row) {
    case 1:
      return '<a-tag color="orange">产品重拍借用</a-tag>';
    case 2:
      return '<a-tag color="orange">样品对比借用</a-tag>';
    case 3:
      return '<a-tag color="orange">行政需要领用</a-tag>';
    case 4:
      return '<a-tag color="orange">厂家寄样领用</a-tag>';
    case 5:
      return '<a-tag color="orange">驳回产品重拍借用</a-tag>';
    default:
      return "";
  }
};

// 出库状态
const outStautsTag = function (row) {
  switch (row) {
    case 1:
      return '<a-tag color="blue">待申请</a-tag>';
    case 2:
      return '<a-tag color="blue">待审批</a-tag>';
    case 3:
      return '<a-tag color="blue">待出库</a-tag>';
    case 4:
      return '<a-tag color="green">已出库</a-tag>';
    case 5:
      return '<a-tag color="blue">待归还</a-tag>';
    case 6:
      return '<a-tag color="blue">已领用</a-tag>';
    case 7:
      return '<a-tag color="blue">已损耗</a-tag>';
    case 8:
      return '<a-tag color="blue">已归还</a-tag>';
    case 9:
      return "<a-tag>已完成</a-tag>";
    case 10:
      return '<a-tag color="red">审批拒绝</a-tag>';
    case 11:
      return '<a-tag color="red">出库驳回</a-tag>';
    default:
      return "";
  }
};

// 产品库区
const devStockAreaTag = function (row) {
  switch (row) {
    case 1:
      return '<a-tag color="orange">综合区</a-tag>';
    case 2:
      return '<a-tag color="orange">家用百货区</a-tag>';
    case 3:
      return '<a-tag color="orange">家庭装饰区</a-tag>';
    case 4:
      return '<a-tag color="orange">服饰配饰区</a-tag>';
    case 5:
      return '<a-tag color="orange">3C汽摩配区</a-tag>';
    case 6:
      return '<a-tag color="orange">美妆工具区</a-tag>';
    case 7:
      return '<a-tag color="orange">文具办公区</a-tag>';
    default:
      return "";
  }
};

export {
  devStatusTag,
  meansStatusTag,
  meansKeepGrainTag,
  artCourseTag,
  artTypeTag,
  storeStatusTag,
  outTypeTag,
  outStautsTag,
  renwuartTypeTag,
  devStockAreaTag,
};
