// 代理标识 前缀
const PROXY_PREFIX = '/prod-api';

const Authorization = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX2tleSI6ImNiOGIxYWUwLWQ0YjYtNDA5ZC04ZDIwLWFlZmYzNDA2ZDkxMSIsInVzZXJuYW1lIjoiYWRtaW4ifQ.XKcDgXPZbk2kGBVlMHM9U4ZDtuy10g0qmm_wFOGss0FoZxj7hi1pYdRfolp3AoYrh5mX7ANkzQa75_y4ysbfhQ`;

// 模板列表
export const templateListApi = async () => {
  const apiUrl = `${PROXY_PREFIX}/xinzhan-system/meitu/template/list`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': Authorization,
      },
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// 单模板全部列表
export const templateTypeListApi = async (params) => {
  const apiUrl = `${PROXY_PREFIX}/xinzhan-system/meitu/template/all`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': Authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// 使用模板
export const templateUseApi = async (params) => {
  const apiUrl = `${PROXY_PREFIX}/xinzhan-system/meitu/template/use`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': Authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// 最近列表
export const latestListApi = async () => {
  const apiUrl = `${PROXY_PREFIX}/xinzhan-system/meitu/template/get/lately`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': Authorization,
      },
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// 收藏列表
export const collectListApi = async () => {
  const apiUrl = `${PROXY_PREFIX}/xinzhan-system/meitu/template/get/collect`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': Authorization,
      },
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// 收藏
export const addCollectApi = async (params) => {
  const apiUrl = `${PROXY_PREFIX}/xinzhan-system/meitu/template/collect`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': Authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// 取消收藏
export const cancelCollectApi = async (params) => {
  const apiUrl = `${PROXY_PREFIX}/xinzhan-system/meitu/template/cancel/collect`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': Authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// 上传模板素材
export const createMaterialApi = async (file) => {
  const apiUrl = `${PROXY_PREFIX}/xinzhan-system/meitu/template/create/material`;
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': Authorization
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// 删除模板素材
export const delApi = async (params) => {
  const apiUrl = `${PROXY_PREFIX}/xinzhan-system/meitu/template/del`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': Authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// '我的'列表
export const mineListApi = async () => {
  const apiUrl = `${PROXY_PREFIX}/xinzhan-system/meitu/template/get/mine`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': Authorization,
      },
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
