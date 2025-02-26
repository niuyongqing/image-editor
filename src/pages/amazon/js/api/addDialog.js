import request from '@/utils/request'
// get方法参数序列化
function getParamsFn(data) {
  let params = ''
  if (data) {
    let arr = []
    Object.keys(data).forEach(key => {
      let str = `${key}=${data[key]}`
      arr.push(str)
    })
    params = `?${arr.join('&')}`
  }
  return params
}
// 上传图片
export function uploadImage(data) {
  return request({
    url: '/platform-amazon/platform/amazon/file/upload/image',
    method: 'post',
    data: data
  })
}

//水印
export function watermark(data) {
  return request({
    url: `/platform-setting/platform/setting/image/handle/watermark`,
    method: 'post',
    data: data
  })
}

//裁剪
export function cropImg(data) {
  return request({
    url: `/platform-setting/platform/setting/image/handle/scale`,
    method: 'post',
    data: data
  })
}

// 获取水印
export function watermarkList() {
  return request({
    url: `/platform-setting/platform/setting/template/watermark/list`,
    method: 'get'
  })
}