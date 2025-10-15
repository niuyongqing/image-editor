import commodityTypeList from "@/utils/commodityType";

/**
 * 根据商品类型value获取对应的label
 * @param {string} value - 商品类型value，格式如 06,0602,060201
 * @returns {string} - 商品类型label，格式如 分类1/分类2/分类3
 */
export function getCommodityTypeLabel(value) {
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


/**
 * 处理SKU列表，返回格式化后的字符串
 * @param {string} e - 逗号分隔的SKU字符串
 * @returns {string} - 格式化后的SKU字符串
 */
export function getSkuList(e) {
    let str = ''
    if (e == '' || e == null) {
        e = ''
    }
    let spanD = e.split(',');
    let oldSku = e.split(','); //原始错乱sku
    let b = [] //去除所有带标签的
    oldSku.map(item => {
        b.push(item.replace(/<[^>]+>/g, ''))
    })
    let newSku = b.sort(); //排序 正确的sku
    if (newSku.length == 0) {
        str = ''
    } else if (newSku.length == 1) {
        str = spanD[0]
    } else if (newSku.length > 1) {
        spanD.forEach(v => {
            if (v.includes(newSku[0])) {
                newSku[0] = v
            }
            if (v.includes(newSku[newSku.length - 1])) {
                newSku[newSku.length - 1] = v
            }
        })
        str = `${newSku[0]} - ${newSku[newSku.length - 1]}`
    }
    return str
};