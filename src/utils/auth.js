// 存储token
const USER_KEY = 'user'

// 获取token
export const getUser = () => JSON.parse(window.localStorage.getItem(USER_KEY))

// 删除token
export const removeUser = () => window.localStorage.removeItem(USER_KEY)

// 修改token
export const setUser = () => window.localStorage.setItem(USER_KEY, JSON.stringify(USER_KEY))
