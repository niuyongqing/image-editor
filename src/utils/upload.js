export function uploadFile(file, uploadUrl) {
    // 判断是否传入文件
    if (!file) {
        console.error('No file provided');
        return;
    }

    // 创建 FileReader 对象
    const reader = new FileReader();

    // 读取文件成功时的回调
    reader.onload = function (e) {
        const base64 = e.target.result; // Base64 格式的文件

        // 将 Base64 转为二进制数据（ArrayBuffer）
        const binaryData = base64ToBinary(base64);

        // 调用上传函数上传二进制数据
       return  uploadBinary(binaryData, uploadUrl);
    };
    return reader;
}

// Base64 转为二进制数据（ArrayBuffer）
function base64ToBinary(base64) {
    const binaryString = atob(base64.split(',')[1]); // 去除前缀 'data:image/png;base64,' 部分
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }

    return uint8Array;
}

// 上传二进制数据到服务器
function uploadBinary(binaryData, uploadUrl) {
    return  fetch(uploadUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data', // 或 'multipart/form-data'，视上传的文件类型而定
            'authorization': 'Bearer ' + useAuthorization(),
        },
        body: binaryData, // 上传二进制数据
    })

}
