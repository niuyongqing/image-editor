/**
 * src/composables/useInteractionHelper.js
 * ✨ 物理交互辅助工具：防抖阈值判定 [宪法 0.7]
 */
export function useInteractionHelper() {
  /**
   * 判定是否突破拖拽阈值
   * @param {Object} start - 起始点 {x, y}
   * @param {Object} current - 当前点 {x, y}
   * @param {number} threshold - 阈值（默认2像素）
   * @returns {boolean}
   */
  const isBreakThreshold = (start, current, threshold = 2) => {
    if (!start || !current) return false;
    
    const dx = current.x - start.x;
    const dy = current.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance >= threshold;
  };

  return { isBreakThreshold };
}