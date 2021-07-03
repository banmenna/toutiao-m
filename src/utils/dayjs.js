import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // import locale
import Vue from 'vue'
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
dayjs.locale('zh-cn') // use locale
    // console.log(dayjs().format('YYYY-MM-DD'))
    // 把处理时间的部分包装成全局过滤器，可以在任何组件模板中使用{{xxx|relativeTime}}
    // 过滤器是一个可以在模板中调用的函数，|前面的作为参数传递给过滤器函数
Vue.filter('relativeTime', value => {
    return dayjs(value).from(dayjs())
})