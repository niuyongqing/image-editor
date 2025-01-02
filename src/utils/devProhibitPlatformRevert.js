// 禁止刊登平台还原

import platform from "@/utils/platform";

export default function (row) {
  if (row == undefined) {
    return null;
  }
  let devProhibitPlatformTag = "";
  platform.forEach((v) => {
    row.forEach((x) => {
      if (x == v.value) {
        devProhibitPlatformTag +=
          '<span class="el-tag el-tag--danger el-tag--mini el-tag--dark el-tag--light" style="margin-top: 5px">' +
          v.label +
          "</span> ";
      }
    });
  });
  return devProhibitPlatformTag;
}
