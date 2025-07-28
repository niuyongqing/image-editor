import {uploadFile} from "~/utils/upload.js";


/**
 * 上传临时文件
 * @param data
 */
export function uploadTmp(data) {
    return uploadFile('/common/uploadTmp',data)
}

/**
 * 上传文件
 * @param data
 */
export function upload(data) {
    return uploadFile('/common/upload',data)
}


/**
 * 上传临时文件
 * @param data
 */
export function uploadTmpBase64(data) {
    return usePost('/common/uploadBase64', data)
}

// 批量上传网络图
export function batchUploadFromUrlApi(params) {
  return usePost('/platform-common/platform/common/file/batchUploadFromUrl', params)
}
