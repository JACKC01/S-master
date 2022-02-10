import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import jsonBig from 'json-bigint'

const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net',
  timeout: '5000'
  // transformResponse: [function (data) {
  //   try {
  //     console.log(jsonBig.parse(data))
  //     // 如果转换成功则返回转换的数据结果
  //     return jsonBig.parse(data)
  //   } catch (err) {
  //     // 如果转换失败，则包装为统一数据格式并返回
  //     return data
  //   }
  // }]
})
request.defaults.transformResponse = [function (data) {
  try {
    return jsonBig.parse(data)
  } catch (err) {
    return {}
  }
}]
// 请求拦截器
request.interceptors.request.use(config => {
  config.headers.Authorization = store.state.userInfo ? `Bearer ${store.state.userInfo.token}` : ''
  return config
}, error => {
  return Promise.reject(error)
}
)
// 响应拦截器
request.interceptors.response.use(config => {
  return config
}, error => {
  if (error.message === 'timeout of 5000ms exceeded') {
    Message.error('服务器忙,请稍后再试!')
  }
  return Promise.reject(error)
})
export { request }
