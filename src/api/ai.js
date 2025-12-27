// src/api/ai.js

// 默认地址 (作为兜底，防止调用时传空)
const DEFAULT_BASE_URL = 'http://localhost:3000/ai';
const API_BASE_URL = 'http://10.93.83.151:8080'; // 张

export const aiApi = {
  /**
   * 移除背景
   * @param {File} file - 图片文件
   * @param {string} [baseUrl] - 后端 API 基础地址
   * @returns {Promise<string>} - Blob URL
   */
  async removeBackground(file, baseUrl = DEFAULT_BASE_URL) {
    const formData = new FormData();
    formData.append('image', file);

    // 拼接完整的 URL，移除末尾可能多余的斜杠
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');

    try {
      const response = await fetch(`${cleanBaseUrl}/rembg`, {
        method: 'POST',
        body: formData,
        // fetch 自动处理 multipart/form-data 的 Content-Type，无需手动设置
      });

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('AI API Error:', error);
      throw error;
    }
  },

  /**
   * 图像修复 (Inpaint)
   * @param {Blob} imageBlob 
   * @param {Blob} maskBlob 
   * @param {string} [baseUrl] 
   */
  async inpaint(imageBlob, maskBlob, baseUrl = DEFAULT_BASE_URL) {
    const formData = new FormData();
    formData.append('image', imageBlob);
    formData.append('mask', maskBlob);

    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');

    try {
      const response = await fetch(`${cleanBaseUrl}/inpaint`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('AI API Error:', error);
      throw error;
    }
  },

  /**
    * AI 智能消除接口
    * @param {string} imageUrl - 原图 URL
    * @param {string} maskBase64 - 遮罩图片 Base64 (黑底白图)
    * @returns {Promise<string>} 处理后的图片 URL
    */
  async inpaint(imageUrl, maskBase64) {
    // 模拟网络延迟
    return new Promise((resolve) => {
      console.log('Calling AI Inpaint API...');
      console.log('Image:', imageUrl.substring(0, 50) + '...');
      console.log('Mask Length:', maskBase64.length);

      setTimeout(() => {
        // ⚠️ 这里目前直接返回原图，仅做流程跑通演示
        // 真实开发请替换为：
        // const formData = new FormData();
        // formData.append('image', ...);
        // formData.append('mask', ...);
        // const res = await fetch('/api/inpaint', { ... });

        resolve(imageUrl);
      }, 2000);
    });
  },
  
  /**
   * 图片翻译
   * @param {File} file - 图片文件
   * @param {object<sourceLanguage: string, targetLanguage: string>} languageParams - 语言参数
   * @returns {Promise<string>} 处理后的图片 URL
   */
  async imageTranslate(file, languageParams = {}) {
    const apiUrl = `${API_BASE_URL}/xinzhan-ai/alimt/image/translate`;
    const formData = new FormData();
    formData.append('image', file);
    for (const key in languageParams) {
      formData.append(key, languageParams[key]);
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        // fetch 自动处理 multipart/form-data 的 Content-Type，无需手动设置
      });

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('AI API Error:', error);
      throw error;
    }
  },
};
