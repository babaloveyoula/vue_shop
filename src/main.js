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
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'
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
Vue.filter("dateFormat",function(originVal){
 const dt= new Date(originVal)
 const y=dt.getFullYear()
 const m=(dt.getMonth()+1+'').padStart(2,"0")
 const d=(dt.getDate()+"").padStart(2,"0")
 const hh=(dt.getHours()+'').padStart(2,"0")
 const mm=(dt.getMinutes()+"").padStart(2,"0")
 const ss=(dt.getSeconds()+"").padStart(2,"0")
 return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.config.productionTip = false
Vue.component("tree-table", TreeTable)
Vue.use(VueQuillEditor)
const vm=new Vue({
  router,
  render: h => h(App)
}).$mount('#app')