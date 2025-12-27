// src/api/ai.js

// 默认地址 (作为兜底，防止调用时传空)
const DEFAULT_BASE_URL = 'http://127.0.0.1:11111';

export const aiApi = {
  /**
   * 一键抠图 (Matting)
   * 接口定义：POST /api/ai/matting
   * Content-Type: application/json
   * Body: { image_path: string }
   *
   * @param {string} imagePath - 图片地址（网络 URL，或你的服务能访问的本地地址）
   * @param {string} [baseUrl] - 后端服务地址（例如 http://localhost:11111）
   * @returns {Promise<string>} - 返回可用于 img/src 的 URL（优先返回 blobURL；若后端直接返回 dataURL，则原样返回）
   */
  async removeBackground(imagePath, baseUrl = DEFAULT_BASE_URL) {
    
    // 拼接完整的 URL，移除末尾可能多余的斜杠
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');

    const response = await fetch(`${cleanBaseUrl}/api/ai/matting`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      // body: JSON.stringify({ image_path: imagePath })
      body: JSON.stringify({ "image_path": "C:/codeCS/image-editor/src/assets/image/02.jpg" })
      
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    }

    // 兼容返回：
    // - { result: 'data:image/png;base64,...' }
    // - { result: 'BASE64...' }
    // - { result: 'http(s)://...' }
    const data = await response.json();
    const result = data?.no_bg_image;
    if (!result || typeof result !== 'string') {
      throw new Error('请求成功但返回体缺少 result 字段');
    }

    // 1) dataURL 直接返回
    if (result.startsWith('data:image/')) return result;

    // 2) 纯 base64：转成 blobURL（更省内存，且便于统一 revoke）
    const isLikelyBase64 = /^[A-Za-z0-9+/=\s]+$/.test(result) && result.length > 100;
    if (isLikelyBase64) {
      const cleaned = result.replace(/\s+/g, '');
      const binary = atob(cleaned);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'image/png' });
      return URL.createObjectURL(blob);
    }

    // 3) 兜底：当作 url 返回（后端若返回的是可访问链接）
    return result;
  },

  /**
   * 图像修复 (Inpaint)
   * @param {Blob} imageBlob
   * @param {Blob} maskBlob
   * @param {string} [baseUrl]
   * @returns {Promise<string>} - Blob URL
   */
  async inpaint(imageBlob, maskBlob, baseUrl = DEFAULT_BASE_URL) {
    const formData = new FormData();
    formData.append('image', imageBlob);
    formData.append('mask', maskBlob);

    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');

    const response = await fetch(`${cleanBaseUrl}/inpaint`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },

  /**
   * 图像修复 (Inpaint) - Mock
   * 仅用于演示流程跑通：直接返回原图。
   * @param {string} imageUrl - 原图 URL
   * @param {string} maskBase64 - 遮罩 Base64
   * @returns {Promise<string>} - 处理后的图片 URL
   */
  async inpaintMock(imageUrl, maskBase64) {
    // 模拟网络延迟
    return new Promise((resolve) => {
      console.log('Calling AI Inpaint API (Mock)...');
      console.log('Image:', imageUrl.substring(0, 50) + '...');
      console.log('Mask Length:', maskBase64.length);

      setTimeout(() => {
        resolve(imageUrl);
      }, 2000);
    });
  }
};
