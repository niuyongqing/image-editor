// 返回市场方向
export default function (row) {
  if (row == 1) {
    return `<a-tag color="success" style="font-size: 12px;">东南亚</a-tag>`;
  }
  if (row == 2) {
    return `<a-tag color="warning" style="font-size: 12px;">欧美</a-tag>`;
  }
  if (row == 3) {
    return `<a-tag color="success" style="font-size: 12px;">菲律宾本土</a-tag>`;
  }
  if (row == 4) {
    return `<a-tag color="success" style="font-size: 12px;">泰国本土</a-tag>`;
  }
}
