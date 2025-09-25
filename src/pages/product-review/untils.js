import commodityTypeList from "@/utils/commodityType";

/**
 * 根据商品类型value获取对应的label
 * @param {string} value - 商品类型value，格式如 06,0602,060201
 * @returns {string} - 商品类型label，格式如 分类1/分类2/分类3
 */
export function getCommodityTypeLabel(value) {
  console.log(value);
  // 通过传入的 value（格式如 06,0602,060201），从 commodityTypeList 中查找对应的 label。
  // 查找规则：先找第一个逗号之前的值对应的对象，再在该对象的 children 里找第二个逗号之前的值对应的对象，
  // 接着在这个对象的 children 里找第三个值对应的对象，最后将这三个对象的 label 用 / 连接后返回。
  if (!value) return value;
  
  // 将value按逗号分割成数组
  const valueParts = String(value).split(',');
  const labels = [];
  
  // 优先使用props中的商品类型数据，如果没有则使用导入的默认数据
  const typeList = commodityTypeList && commodityTypeList.length > 0 ? commodityTypeList : commodityType;
  
  // 递归查找匹配的节点
  function findNodeByValue(tree, targetValue) {
    if (!Array.isArray(tree)) return null;
    
    for (const node of tree) {
      if (!node) continue;
      
      if (node.value && node.value.trim() === targetValue.trim()) {
        return node;
      }
    }
    
    return null;
  }
  
  // 按层级查找
  let currentLevel = typeList;
  
  for (const part of valueParts) {
    if (!part) continue;
    
    const node = findNodeByValue(currentLevel, part);
    
    if (node) {
      labels.push(node.label ? node.label.trim() : '');
      // 移动到下一级
      if (node.children && Array.isArray(node.children) && node.children.length > 0) {
        currentLevel = node.children;
      }
    } else {
      // 如果某一级找不到对应的节点，仍然保留之前找到的标签
      break;
    }
  }
  
  // 将找到的标签用/连接返回
  return labels.length > 0 ? labels.join(' / ') : value;
};