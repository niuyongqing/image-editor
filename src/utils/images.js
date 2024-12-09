/**
 * 将 Base64 编码字符串转换为二进制数据 (Blob)
 */
export function base64ToBlob(base64Data) {
    const base64String = base64Data.split(',')[1];
    const byteCharacters = atob(base64String);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
    }
    return byteArray;
}
