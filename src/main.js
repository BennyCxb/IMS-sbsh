// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import lodash from 'lodash'
import VueLodash from 'vue-lodash'
// 引入cookie
import VueCookies from 'vue-cookies'
// 引入vue-amap
import VueAMap from 'vue-amap'

Vue.use(ElementUI)
Vue.use(VueCookies)
Vue.use(VueAMap)
Vue.use(VueLodash, lodash)

Vue.config.productionTip = false

// 初始化vue-amap
VueAMap.initAMapApiLoader({
  key: '4cf9ecbcb9448825d9b3f92064db8045',
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.Geocoder', 'AMap.Geolocation'],
  v: '1.4.4'
})
/* eslint-disable no-new */
Vue.prototype.$axios = axios
Vue.prototype.$axios.defaults.baseURL = process.env.API_ROOT
// 添加请求拦截器
const self = Vue.prototype
Vue.prototype.$axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    if (self.$cookies.get('TZManage')) {
      config.headers.common['Authorization'] = 'Bearer ' + self.$cookies.get('TZManage')
    } else {
      // alert('登录已过期，请重新登录！')
    }

    return config
  },
  error => {
    // 对请求错误做些什么
    if (error.response) {
      switch (error.response.status) {
        case 401:
          router.push({path: '/login'})
          break
        default:
          break
      }
    }
    return Promise.reject(error)
  })
// http response 拦截器
Vue.prototype.$axios.interceptors.response.use(
  response => {
    let code = response.data.code
    if (code === 2) {
      router.push({path: '/login'})
    }
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          // store.commit(types.LOGOUT)
          router.replace({
            path: '/login',
            query: {redirect: router.currentRoute.fullPath}
          })
      }
    }
    return Promise.reject(error.response.data)// 返回接口返回的错误信息
  })

new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
