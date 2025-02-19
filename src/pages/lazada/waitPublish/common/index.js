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
  if (parentId) {
    return [parentId, deptId];
  } else {
    return [deptId];
  }
}

//  时间戳转时间
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

// 品牌按照brandId去重
export function uniqueByBrandId(array) {
  const map = new Map();
  array.forEach((item) => {
    if (!map.has(item.brandId)) {
      map.set(item.brandId, item);
    }
  });
  return Array.from(map.values());
}

//  图片转base64
export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
// 获取树形结构所有节点的key
function getChildrenKeys(nodeKe, list) {
  const keys = [];
  const treeData = list || unref(treeDataRef);
  const { key: keyField, children: childrenField } = unref(getFieldNames);
  if (!childrenField || !keyField) return keys;
  for (let index = 0; index < treeData.length; index++) {
    const node = treeData[index];
    const children = node[childrenField];
    if (nodeKey === node[keyField]) {
      keys.push(node[keyField]);
      if (children && children.length) {
        keys.push(...getAllKeys(children));
      }
    } else {
      if (children && children.length) {
        keys.push(...getChildrenKeys(nodeKey, children));
      }
    }
  }
  return keys;
}

//  去除重复
export function unique(key, list) {
  let uni1 = list.map((item) => [item[key], item]);
  let uni2 = new Map(uni1);
  let uni3 = Array.from(uni2.values());
  return uni3;
}
export const colors = [
  {
    id: 1,
    color: "#009926",
  },
  {
    id: 2,
    color: "#F00",
    name: "红色",
  },
  {
    id: 3,
    color: "#0005FD",
  },
  {
    id: 4,
    color: "#FF5800",
  },
  {
    id: 5,
    color: "#8E0075",
  },
  {
    id: 6,
    color: "#FF6666",
  },
  {
    id: 7,
    color: "#FFCAC5",
  },
  {
    id: 8,
    color: "#00D0FF",
  },
];
