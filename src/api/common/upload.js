/**
 * 上传临时文件
 */
export function uploadTemp(data) {
    return usePost('/common/uploadTmp', data)
}

/**
 * 上传文件
 * @param data
 * @returns {Promise | Promise<unknown>}
 */
export function upload(data) {
    return usePost('/common/upload', data)
}


