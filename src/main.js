import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant, {
  Lazyload
} from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible'
// 语言包
import zhCN from 'vee-validate/dist/locale/zh_CN'
import VeeValidate, {
  Validator
} from 'vee-validate'
// 时间
import dayjs from 'dayjs'
//  时间语言包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

dayjs.locale('zh_cn')
// 注册一个全局处理时间格式
Vue.filter('relativeTime', value => {
  return dayjs().from(value)
})

Vue.use(Lazyload)

Vue.use(VeeValidate, {
  events: 'change'
})
Validator.localize('zh_CN', zhCN)
Vue.use(Vant)

Vue.config.productionTip = false
Vue.prototype.$sleep = (time) => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, time)
  })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
