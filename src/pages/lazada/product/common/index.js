// 查找上一级部门并返回数组
export function findParentAndMerge(deptId, list) {
  let parentId = null;
  list.forEach((department) => {
    const foundDept = (function findInChildren(children) {
      for (const child of children) {
        if (child.deptId === deptId) {
          parentId = child.parentId; // 找到上级
          return true;
        }
        if (child.children && findInChildren(child.children)) {
          return true;
        }
      }
      return false; // 没有找到目标部门
    })(department.children);
  });

  console.log("parentId", parentId);
  if (parentId) {
    return [parentId, deptId];
  } else {
    return [deptId];
  }
}
export function timestampToDateTime(timestamp) {
  if (timestamp == null || timestamp == "") {
    return "无";
  }
  var date = new Date(timestamp); // 根据时间戳生成的时间对象
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2); // 月份是从0开始的
  var day = ("0" + date.getDate()).slice(-2);
  var hour = ("0" + date.getHours()).slice(-2);
  var minute = ("0" + date.getMinutes()).slice(-2);
  var second = ("0" + date.getSeconds()).slice(-2);
  return (
    year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
  );
}
