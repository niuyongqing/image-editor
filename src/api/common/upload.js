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