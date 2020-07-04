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
import echarts from "echarts"
import "../src/assets/china.js"
import BaiduMap from 'vue-baidu-map';
import Driver from "driver.js"
import "driver.js/dist/driver.min.css"
import Nprogress from "nprogress"
import "nprogress/nprogress.css"
import Service from "./service/http.js"
Vue.prototype.$driver = new Driver({
  doneBtnText: '完成', // Text on the final button
  closeBtnText: '关闭', // Text on the close button for this step
  stageBackground: '#373d41', // Background color for the staged behind highlighted element
  nextBtnText: '下一步', // Next button text for this step
  prevBtnText: '上一步', // Previous button text for this step
})

Vue.use(BaiduMap, {
      /* Visit http://lbsyun.baidu.com/apiconsole/key for details about app key. */
      ak: 'QPvPuaiIK8QjGnV0Q2LrzqVk6KGtnbz5'
})

Vue.use(vueParticleLine)
Vue.use(animated)
Vue.use(echarts)


Vue.prototype.$http=Service
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