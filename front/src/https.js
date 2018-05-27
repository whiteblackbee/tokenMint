import axios from 'axios'
import qs from 'qs'
import { Loading, Message } from 'element-ui'
let axiosIns = axios.create({})
// 超时时间
axiosIns.defaults.timeout = 5000
axiosIns.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.baseURL = 'http://yuhuan-app.guahao-test.com:8080/app'
axiosIns.defaults.baseURL = 'http://127.0.0.1:9000/app/'
axiosIns.defaults.transformRequest = [function (data) {
  // 数据序列化
  return qs.stringify(data)
}]
// http请求拦截器
var loadinginstace
axiosIns.interceptors.request.use(config => {
  // element ui Loading方法
  loadinginstace = Loading.service({ fullscreen: true })
  return config
}, error => {
  loadinginstace.close()
  Message.error({
    message: '加载超时'
  })
  return Promise.reject(error)
})
// http响应拦截器
axiosIns.interceptors.response.use(data => {
  // 响应成功关闭loading
  loadinginstace.close()
  return data
}, error => {
  loadinginstace.close()
  Message.error({
    message: '加载失败'
  })
  return Promise.reject(error)
})

const ajaxMethod = ['get', 'post']
const api = {}
ajaxMethod.forEach(method => {
  api[method] = function (uri, data, config) {
    return new Promise(function (resolve, reject) {
      axiosIns[method](uri, data, config).then(response => {
        if (response.data.code === 500) {
          Message.error({message: response.data.msg})
        } else {
          resolve(response)
        }
      }).catch(error => {
        if (error.response) {
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else {
          Message.error({message: '网络故障'})
          console.log(error)
          console.log('Error', error.message)
        }
        console.log(error.config)
      })
    })
  }
})
export default api
