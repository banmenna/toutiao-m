/**
 * 封装 axios 请求模块
 */
import axios from "axios"
import store from '@/store/'
const request = axios.create({
    baseURL: "http://ttapi.research.itcast.cn/" // 基础路径
})

//请求拦截器
request.interceptors.request.use(function(config) {
    console.log(config)
    const { user } = store.state
    if (user) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    console.log(user)
    return config
}, function(error) {
    return Promise.reject(error)
})

export default request