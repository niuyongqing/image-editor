// 时间戳转化时间
export function Timedata(timestamp) {
  // 创建一个 Date 对象并传入时间戳
  const date = new Date(timestamp);
  // 获取年、月、日、小时、分钟和秒
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月份从0开始，所以要加1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // 将日期和时间格式化为字符串
  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")} ${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
