import Vue from 'vue'
import Vuex from 'vuex'
// 引入
import * as auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 初始化token
    user: auth.getUser()
  },
  mutations: {
    // 登录成功 调用mutation 更新容器中的 user 的状态
    setUser (state, data) {
      // 将数据给
      // console.log('eee', data)
      state.user = data
      // 本地储存
      auth.saveUser(state.user)
    }
  },
  actions: {

  }
})
