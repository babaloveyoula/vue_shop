import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/components/Login"
import Home from "@/components/Home"
import Welcome from "@/components/Welcome"
import Users from '@/components/User/Users'
import Rights from "@/components/rights/Rights"
import Roles from "@/components/roles/Roles"
import Cate from "@/components/goods/Cate"
import Params from "@/components/goods/Params"
import List from "@/components/goods/List"
import Add from  "@/components/goods/Add"
import Order from "@/components/order/Order"
Vue.use(VueRouter)

const routes = [
  {path:"/",redirect:"/login"},
  {path:"/login",component:Login},
  {path:"/home",redirect:"/welcome",component:Home,
    children:[
    {path:'/welcome',name:"welcome",component:Welcome},
    {path:"/users",component:Users},
    {path:"/rights",component:Rights},
    {path:"/roles",component:Roles},
    {path:"/categories",component:Cate},
    {path:"/params",component:Params},
    {path:"/goods",component:List},
    {path:"/goods/add",component:Add},
    {path:"/orders",component:Order}
  ]},
  
]


const router = new VueRouter({
  routes
})
router.beforeEach((to,from,next)=>{
  if(to.path == "/login") return next();
  const token=window.sessionStorage.getItem("token")
  if(!token){
    return next("/login")
  }
  next()
})

export default router
