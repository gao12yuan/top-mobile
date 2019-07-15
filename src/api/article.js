// 引入
import request from '@/utils/request'

// 频道新闻推荐
export const getArticles = ({
  channelId,
  timestamp,
  withTop
}) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params: {
      channel_id: channelId,
      timestamp,
      with_top: withTop
    }
  })
}
// 对文章不喜欢
export const acitveDislike = targetId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: targetId
    }
  })
}
// 举报文章
export const artcileReport = ({
  targetId,
  type,
  remark
}) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/reports',
    data: {
      target: targetId,
      type,
      remark
    }
  })
}
