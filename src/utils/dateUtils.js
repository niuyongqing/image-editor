
/**
 * 将13位时间戳转换为时间字符串
 */
export function timestampToTime(timestamp, formatStr = 'YYYY-MM-DD HH:mm:ss') {
    if (!timestamp) return ''

    try {
        // 处理13位时间戳
        const date = new Date(timestamp.length === 13 ? parseInt(timestamp) : parseInt(timestamp) * 1000)

        // 如果日期无效
        if (isNaN(date.getTime())) return ''

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')

        // 替换格式字符串
        return formatStr
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds)
    } catch (error) {
        console.error('时间戳转换错误:', error)
        return ''
    }
}

/**
 * 常用格式的快捷方法
 */
export const timeFormats = {
    // 完整时间：2024-01-15 14:30:25
    full: (timestamp) => timestampToTime(timestamp, 'YYYY-MM-DD HH:mm:ss'),
    // 日期：2024-01-15
    date: (timestamp) => timestampToTime(timestamp, 'YYYY-MM-DD'),
    // 时间：14:30:25
    time: (timestamp) => timestampToTime(timestamp, 'HH:mm:ss'),
    // 中文格式：2024年01月15日 14时30分25秒
    chinese: (timestamp) => timestampToTime(timestamp, 'YYYY年MM月DD日 HH时mm分ss秒'),
    // 简洁格式：2024-01-15 14:30
    short: (timestamp) => timestampToTime(timestamp, 'YYYY-MM-DD HH:mm')
}