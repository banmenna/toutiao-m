import Vue from 'vue'
import Vuex from 'vuex'
import { getItem } from '@/utils/storage'
import { setItem } from '../utils/storage'
Vue.use(Vuex)
const USER_KEY = 'toutiao-user'
export default new Vuex.Store({
    state: { //为了实现响应式
        user: getItem(USER_KEY) //data.data{refresh_token,token}
            //和第一个data同级的有config,header,request,status..
    },
    //修改state要用mutations
    mutations: {
        setUser(state, data) {
            state.user = data
                //容器存储不是持久化的，所以要是使用本地存储，注意对象不能本地存储，要转成JSON字符串
                //window.localStorage.setItem('user', JSON.stringify(state.user))
            setItem(USER_KEY, state.user)
        },

    },
    actions: {},
    modules: {}
})