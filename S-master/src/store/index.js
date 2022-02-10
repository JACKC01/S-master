import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem, removeItem } from 'utils/storage.js'
import { login } from 'api/user.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户简单信息,包含了token
    userInfo: getItem('userInfo') || null,
    // 用户详细信息,不包含token
    userDetailInfo: getItem('userDetailInfo') || null,
    isLoading: false
  },
  mutations: {
    setUser (state, payload) {
      state.userInfo = payload
      setItem('userInfo', payload)
    },
    addUserInfoAttr (state, payload) {
      Object.assign(state.userInfo, payload)
    },
    removeUserInfo (state) {
      state.userInfo = null
      removeItem('userInfo')
    },
    // 开始筛选按钮的禁用
    startLoading (state) {
      state.isLoading = true
    },
    // 停止筛选按钮的禁用
    stopLoading (state) {
      state.isLoading = false
    },
    // 设置用户详细信息
    setUserDetailInfo (state, payload) {
      state.userDetailInfo = payload
      setItem('userDetailInfo', payload)
    },
    // 更新用户详细信息
    updateUserDetailInfo (state, payload) {
      Object.assign(state.userDetailInfo, payload)
    }
  },
  actions: {
    onLogin (context, data) {
      return new Promise((resolve, reject) => {
        login(data)
          .then(res => {
            context.commit('setUser', res.data.data)
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    }
    // async onGetUserId ({ commit }, userName) {
    //   const id = await getUserId(userName)
    //   commit('setUserId', {
    //     id
    //   })
    // },
    // async onGetUserInfo ({ commit, dispatch, state }, userName) {
    //   await dispatch('onGetUserId', userName)
    //   const userInfo = await getUserInfo(state.userId)
    //   commit('setUserInfo', userInfo)
    // }
  },
  modules: {}
})
