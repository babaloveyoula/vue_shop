import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import "@/assets/style/reset.css"
import "../src/assets/fonts/iconfont.css"
import axios from "axios"
import animated from 'animate.css'
import vueParticleLine from 'vue-particle-line'
import 'vue-particle-line/dist/vue-particle-line.css'
import TreeTable from 'vue-table-with-tree-grid'

Vue.use(vueParticleLine)
Vue.use(animated)
axios.defaults.baseURL="http://timemeetyou.com:8889/api/private/v1/"
// http://timemeetyou.com:8889/api/private/v1/
// https://www.liulongbin.top:8888/api/private/v1/
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem("token")
  return config
},err=>Promise.reject(err))
Vue.prototype.$http=axios
Vue.config.productionTip = false
Vue.component("tree-table", TreeTable)
const vm=new Vue({
  router,
  render: h => h(App)
}).$mount('#app')