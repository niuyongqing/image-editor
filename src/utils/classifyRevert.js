// 商品分类还原
import commodityType from "@/utils/commodityType";
export default function (row) {
  if (row == undefined) {
    return null;
  }
  let classifyTag = [];
  commodityType.forEach((v) => {
    if (row[0] == v.value) {
      classifyTag.push(v.label);
    }
    v.children.forEach((x) => {
      if (row[1] == x.value) {
        classifyTag.push(x.label);
      }
      try {
        x.children.forEach((y) => {
          if (row[2] == y.value) {
            classifyTag.push(y.label);
          }
        });
      } catch (e) {}
    });
  });
  return classifyTag.join(" / ");
}
