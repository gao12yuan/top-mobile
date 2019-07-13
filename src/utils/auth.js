// 存储token
const USER_KEY = 'user'

// 获取token
export const getUser = () => JSON.parse(window.localStorage.getItem(USER_KEY))

// 删除token
export const removeUser = () => window.localStorage.removeItem(USER_KEY)

// 设置token
export const saveUser = (data) => window.localStorage.setItem(USER_KEY, JSON.stringify(data))
