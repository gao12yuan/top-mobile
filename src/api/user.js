// 引入
import request from '@/utils/request'

// 用户登录
export const login = ({
  mobile,
  code
}) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}
// 删除用户指定频道
export const userDelect = (id) => {
  return request({
    method: 'DELETE',
    url: ` /app/v1_0/user/channels/${id}`
  })
}
// 修改用户频道列表
export const userChannelsList = channels => {
  return request({
    method: 'PUT',
    url: '/app/v1_0/user/channels',
    data: {
      channels
    }
  })
}
// 拉黑用户
export const userBlackList = targetId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/blacklists',
    data: {
      target: targetId
    }
  })
}
