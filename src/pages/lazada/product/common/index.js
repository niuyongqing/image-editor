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

//  去除重复
export function unique(key, list) {
  console.log("list", list);
  if (!list || list.length === 0) return [];
  let uni1 = list.map((item) => [item[key], item]);
  let uni2 = new Map(uni1);
  let uni3 = Array.from(uni2.values());
  return uni3;
}

// 根据categoryId 获取分类 树形结构所有节点的keys
export function findCategoryPath(data, targetId) {
  let path = [];
  function search(categories, currentPath) {
    for (let category of categories) {
      let newPath = [...currentPath, category.categoryId];
      if (category.categoryId === targetId) {
        path = newPath;
        return true;
      }
      if (category.children && search(category.children, newPath)) {
        return true;
      }
    }
    return false;
  }

  search(data, []);
  return path;
}
//  取出图片名称
export function extractedFileName(filePath) {
  if (!filePath) {
    return "";
  }
  if (filePath.includes("http")) return "";
  const regex = /\/([^\/]+)$/;
  const match = filePath.match(regex);
  return match ? match[1] : "";
}

export const globalArea = [
  {
    label: "印度尼西亚",
    value: "id",
  },
  {
    label: "菲律宾",
    value: "ph",
  },
  {
    label: "新加坡",
    value: "sg",
  },
  {
    label: "泰国",
    value: "th",
  },
  {
    label: "越南",
    value: "vn",
  },

  {
    label: "马来西亚",
    value: "my",
  },
];
