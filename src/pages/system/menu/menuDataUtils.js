/**
 * 菜单数据处理工具，用于支持菜单数据的懒加载
 */

/**
 * 将完整的菜单数据拆分为顶级菜单和子菜单映射
 * @param {Array} fullMenuData - 完整的菜单数据
 * @returns {Object} 包含顶级菜单和子菜单映射的对象
 */
export function splitMenuDataForLazyLoad(fullMenuData) {
  // 顶级菜单数组（parentId为null的菜单）
  const topLevelMenus = [];
  // 子菜单映射，key为父菜单id，value为子菜单数组
  const childrenMap = new Map();
  
  // 递归处理菜单树，将所有层级的子菜单都提取到childrenMap中
  function processMenu(menu) {
    const menuCopy = { ...menu };
    
    // 如果有子菜单，先移除并存储到映射中
    if (menuCopy.children && menuCopy.children.length > 0) {
      // 保存子菜单到映射中
      childrenMap.set(menuCopy.id, menuCopy.children.map(processMenu));
      // 保留hasChild标记，但移除children数组
      menuCopy.hasChild = true;
      delete menuCopy.children;
    } else {
      menuCopy.hasChild = false;
    }
    
    return menuCopy;
  }
  
  // 遍历所有菜单
  fullMenuData.forEach(menu => {
    const processedMenu = processMenu(menu);
    // 添加到顶级菜单
    if (processedMenu.parentId === null) {
      topLevelMenus.push(processedMenu);
    }
  });
  
  return {
    topLevelMenus,
    childrenMap
  };
}

/**
 * 获取指定父菜单的子菜单
 * @param {Map} childrenMap - 子菜单映射
 * @param {number} parentId - 父菜单ID
 * @returns {Promise<Array>} 子菜单数组的Promise
 */
export function fetchMenuChildren(childrenMap, parentId) {
  return new Promise((resolve) => {
    // 模拟异步加载
    setTimeout(() => {
      const children = childrenMap.get(parentId) || [];
      
      // 处理子菜单，递归检查是否有自己的子菜单
      const processedChildren = children.map(child => {
        const childCopy = { ...child };
        
        // 检查是否有子菜单（通过childrenMap检查，而不是直接访问children属性）
        // 因为在splitMenuDataForLazyLoad中已经将所有子菜单都提取到childrenMap中了
        const hasChildren = childrenMap.has(childCopy.id) && childrenMap.get(childCopy.id).length > 0;
        childCopy.hasChild = hasChildren;
        
        // 确保删除children属性，保持懒加载模式
        if (childCopy.children) {
          delete childCopy.children;
        }
        
        return childCopy;
      });
      
      resolve(processedChildren);
    }, 0);
  });
}

/**
 * 构建完整的菜单树（用于保存或导出）
 * @param {Array} topLevelMenus - 顶级菜单
 * @param {Map} childrenMap - 子菜单映射
 * @returns {Array} 完整的菜单树
 */
export function buildCompleteMenuTree(topLevelMenus, childrenMap) {
  // 递归重建菜单树
  function rebuildMenuTree(menus) {
    return menus.map(menu => {
      const menuCopy = { ...menu };
      const children = childrenMap.get(menu.id);
      
      if (children && children.length > 0) {
        menuCopy.children = rebuildMenuTree(children);
        delete menuCopy.hasChild; // 重建时移除hasChild标记
      } else {
        delete menuCopy.hasChild;
      }
      
      return menuCopy;
    });
  }
  
  return rebuildMenuTree(topLevelMenus);
}