<template>
    <div class="container">
      <div class="welcome_wrap">
          <h1>Welcome {{username}}</h1>
          <h1>欢迎使用商城后台管理系统</h1>
      </div>
      <!-- <el-carousel :interval="3000" type="card" height="300px" width="560px">
        <el-carousel-item>
          <img src="../assets/1a.jpg" alt="">
        </el-carousel-item>
        <el-carousel-item >
          <img src="../assets/3a.jpg" alt="">
        </el-carousel-item>
         <el-carousel-item >  
          <img src="../assets/2a.jpg" alt="">
        </el-carousel-item>
         <el-carousel-item >
          <img src="../assets/4a.jpg" alt="">
        </el-carousel-item>
         <el-carousel-item >
          <img src="../assets/5a.jpg" alt="">
        </el-carousel-item>
      </el-carousel> -->
        <ul>
          <li><img src="../assets/1a.jpg" alt=""></li>
          <li><img src="../assets/3a.jpg" alt=""></li>
          <li><img src="../assets/4a.jpg" alt=""></li>
          <li><img src="../assets/2a.jpg" alt=""></li>
          <li><img src="../assets/5a.jpg" alt=""></li>
        </ul>

      </div>
</template>

<script>
 
  export default {
    created(){
     this.username= window.sessionStorage.getItem("username")
     this.handleDate()
    },
    data () {
      return {
        username:'',
        loginDate:'',
      }
    },
    methods: {
      handleDate(){
        this.loginDate=window.localStorage.getItem("loginDate")
        console.log(this.loginDate)
        
      }
    },
  }
</script>
<style lang="less" scoped>
.container{
  display:flex;
  perspective: 1000px;
  // background-color: #000;
}

h1{
  display:flex;
  align-items: center;
  justify-content: center;
  width:450px;
  // height:150px;
  box-sizing: border-box;
  // color:#6cf;
  font-size:30px;
  color:greenyellow;
  // background-color: #000;
}
   body {
      // background-color: #000;
      /* 有近大远小的效果 */
      // perspective: 100px;
    }
    ul {
      width: 250px;
      height: 400px;
      margin: 50px auto;
      list-style: none;
      position: relative;
      transition: all 1s;
      /* 绕底边转 */
      transform-origin: center bottom;
      transform-style: preserve-3d;
    }
    li {
      border: 3px solid orange;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      transition: all 1s;
      /* 绕左边轴转 */
      transform-origin: left center;
    }
    li img {
      width: 100%;
      height: 100%;
      display: block;
    }
    /*
      实现美女相册
      1. 推倒, ul 绕 x 轴转
      2. 让 li 旋转
    */
    ul:hover {
      transform: rotateX(30deg);
    }
    ul:hover li:nth-child(5) {
      /* 等 ul 倒下去, 再执行, 延时 1秒 */
      transition-delay: 1s;
      transform: rotateY(-160deg);
    }
    ul:hover li:nth-child(4) {
      transition-delay: 2s;
      transform: rotateY(-160deg);
    }
    ul:hover li:nth-child(3) {
      transition-delay: 3s;
      transform: rotateY(-160deg);
    }
    ul:hover li:nth-child(2) {
      transition-delay: 4s;
      transform: rotateY(-140deg);
    }
</style>