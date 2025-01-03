/**
 * 虾皮禁售标签
 */
export default function (e) {
  switch (e) {
    case "01":
      return '<a-tag color="red">印尼</a-tag>';
    case "02":
      return '<a-tag color="red">菲律宾</a-tag>';
    case "03":
      return '<a-tag color="red">新加坡</a-tag>';
    case "04":
      return '<a-tag color="red">泰国</a-tag>';
    case "05":
      return '<a-tag color="red">马来西亚</a-tag>';
    case "06":
      return '<a-tag color="red">越南</a-tag>';
    case "07":
      return '<a-tag color="red">台湾</a-tag>';
    case "08":
      return '<a-tag color="red">巴西</a-tag>';
    case "09":
      return '<a-tag color="red">墨西哥</a-tag>';
    case "10":
      return '<a-tag color="red">智利</a-tag>';
    case "11":
      return '<a-tag color="red">哥伦比亚</a-tag>';
    case "12":
      return '<a-tag color="red">波兰</a-tag>';
    case "13":
      return '<a-tag color="red">法国</a-tag>';
    case "14":
      return '<a-tag color="red">西班牙</a-tag>';
    case "99":
      return '<a-tag color="red">全站点</a-tag>';
    case "00":
      return '<a-tag color="green">无</a-tag>';
    default:
      return "";
  }
}
