// // 返回市场方向
// export default function(row) {
//   if(row == 1){
//     return `<span class="el-tag el-tag--success el-tag--mini el-tag--dark el-tag--light">东南亚</span> `
//   }
//   if(row == 2){
//     return `<span class="el-tag el-tag--warning el-tag--mini el-tag--dark el-tag--light">欧美</span> `
//   }
//   if(row == 3){
//     return `<span class="el-tag el-tag--success el-tag--mini el-tag--dark el-tag--light">菲律宾本土</span> `
//   }
//   if(row == 4){
//     return `<span class="el-tag el-tag--success el-tag--mini el-tag--dark el-tag--light">泰国本土</span> `
//   }
// }
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
