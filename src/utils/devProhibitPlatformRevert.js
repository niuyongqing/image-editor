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
          '<span class="ant-tag ant-tag-has-color" style="border-radius: 5px; color: #fff; padding:2px; background-color: #f56c6c">' +
          v.label +
          "</span> ";
      }
    });
  });
  return devProhibitPlatformTag;
}
