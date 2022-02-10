import { Message } from 'element-ui'
import router from '../router/index'
import store from '../store'
export default {
  install: Vue => {
    // 登录验证
    router.beforeEach((to, from, next) => {
      const { userInfo } = store.state
      if (to.path === '/login') {
        next()
      } else {
        if (userInfo && userInfo.token) {
          next()
        } else {
          next('/login')
          Message.error({
            message: '您还未登录,请先进行登录',
            showClose: true
          })
        }
      }
    })
  }
}
