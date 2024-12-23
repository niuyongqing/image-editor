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
