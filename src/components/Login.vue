<template>
    <div class="login_container">
       
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单区域 -->
            <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginFormRef" >
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username"
                     prefix-icon="iconfont icon-user_login" placeholder="请输入用户名" ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password"
                     prefix-icon="iconfont icon-mimasuo" placeholder="请输入密码"></el-input>
                </el-form-item>
                 <el-form-item class="btns" >
                   <el-button type="primary" @click="login()">登录</el-button>
                   <el-button type="info" @click="reserLoginFrom">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        
    </div>
</template>

<script>
import particles from 'particles.js'
    export default {
        data() {
            return {
                loginForm: {
                    username:'admin',
                    password:'123456'
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    password:[
                         { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ]
            }
            }},
            methods:{
                reserLoginFrom(){
                  this.$refs.loginFormRef.resetFields();
                },
                login(){
                    this.$refs.loginFormRef.validate( async valid=>{
                        if(!valid) return;
                     const {data:res}=await  this.$http.post("login",this.loginForm)
                      console.log(res)
                      if(res.meta.status !==200) return this.$message.error("登录失败")
                     this.$message.success("登录成功")
                     window.sessionStorage.setItem("token",res.data.token)
                     this.$router.push("/home")
                    })
                }
            }
   

    }
</script>

<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
     display: flex;
        justify-content: center;
        align-items: center;
    .login_box{
        width:450px;
        height:300px;
        background-color: #fff;
        border-radius: 3px;
        position: relative;
        .avatar_box{
            height:130px;
            width:130px;
            border:1px solid #eee;
            border-radius: 50%;
            padding:10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left:50%;
            transform: translate(-50%,-50%);
            background-color: #fff;
        
            img{
                width:100%;
                height:100%;
                 border-radius: 50%;
                 background-color: #eee;
            }
        }
    }
}
.login_form{
    position: absolute;
    bottom:0;
    width: 100%;
    padding:0 20px;
    box-sizing: border-box;
}
.btns{
    display: flex;
    justify-content:center;
}
</style>