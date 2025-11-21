export function preciseDecimalToPercentage(decimal, decimals = 0) {
  if (isNaN(decimal)) {
    return '-';
  }
  // 核心：先乘以100，再根据指定小数位数进行四舍五入
  const factor = Math.pow(10, decimals);
  const roundedValue = Math.round(decimal * 100 * factor) / factor;
  return roundedValue.toFixed(decimals) + '%';
  // return roundedValue + '%';
}