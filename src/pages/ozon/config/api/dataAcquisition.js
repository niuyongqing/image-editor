import request from '@/utils/request'

// 数据搬家列表
export function relocationList(data) {
  return request({
    url: `/platform-ozon/platform/ozon/data/relocation/data/relocation/list`,
    method: 'post',
    data: data
  })
}