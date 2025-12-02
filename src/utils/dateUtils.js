import dayjs from 'dayjs'

/**
 * 将时间戳转换为时间字符串（推荐使用dayjs版本）
 */
export function timestampToTime(timestamp, formatStr = 'YYYY-MM-DD HH:mm:ss') {
    if (!timestamp) return ''

    try {
        // 统一处理时间戳：确保是数字类型
        const ts = parseInt(timestamp)
        if (isNaN(ts)) return ''

        // 判断是否是毫秒级时间戳（13位）
        const isMillisecond = ts > 9999999999

        // 使用dayjs处理（自动处理时区）
        const date = dayjs(isMillisecond ? ts : ts * 1000)

        if (!date.isValid()) return ''

        return date.format(formatStr)
    } catch (error) {
        console.error('时间戳转换错误:', error)
        return ''
    }
}

/**
 * 如果不使用dayjs，使用原生Date的改进版本
 */
export function timestampToTimeNative(timestamp, formatStr = 'YYYY-MM-DD HH:mm:ss') {
    if (!timestamp) return ''

    try {
        // 统一处理时间戳
        const ts = parseInt(timestamp)
        if (isNaN(ts)) return ''

        // 判断时间戳位数（13位是毫秒，10位是秒）
        const isMillisecond = ts > 9999999999
        const date = new Date(isMillisecond ? ts : ts * 1000)

        if (isNaN(date.getTime())) return ''

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')

        // 使用对象映射提高性能
        const formatMap = {
            'YYYY': year,
            'MM': month,
            'DD': day,
            'HH': hours,
            'mm': minutes,
            'ss': seconds
        }

        // 一次性替换所有格式标记
        return formatStr.replace(/YYYY|MM|DD|HH|mm|ss/g, match => formatMap[match] || match)

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
    short: (timestamp) => timestampToTime(timestamp, 'YYYY-MM-DD HH:mm'),
    // 月份格式：2024-01
    month: (timestamp) => timestampToTime(timestamp, 'YYYY-MM'),
    // 年格式：2024
    year: (timestamp) => timestampToTime(timestamp, 'YYYY')
}

/**
 * 获取当前时间戳（毫秒）
 */
export function getCurrentTimestamp() {
    return Date.now()
}

/**
 * 获取当前时间戳（秒）
 */
export function getCurrentTimestampSeconds() {
    return Math.floor(Date.now() / 1000)
}

/**
 * 时间字符串转时间戳
 */
export function timeToTimestamp(timeStr, formatStr = 'YYYY-MM-DD HH:mm:ss') {
    if (!timeStr) return 0

    try {
        const date = dayjs(timeStr, formatStr)
        return date.isValid() ? date.valueOf() : 0
    } catch (error) {
        console.error('时间字符串转换错误:', error)
        return 0
    }
}