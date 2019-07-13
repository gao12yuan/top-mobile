// 引入
import request from '@/utils/request'

// 频道列表
export const userChannel = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}
// 全部频道列表
export const allChannel = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}
