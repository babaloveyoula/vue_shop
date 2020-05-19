<template>
  <div class="login_container">
    <vue-particle-line :hoverEffect="true">
      <div class="login_box">
        <div class="avatar_box">
          <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"  />
        </div>
        <!-- 登录表单区域 -->
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginFormRef">
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              prefix-icon="iconfont icon-user_login"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              prefix-icon="iconfont icon-mimasuo"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login()" :loading="isLoading">登录</el-button>
            <el-button type="info" @click="reserLoginFrom">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </vue-particle-line>
  </div>
</template>

<script>
import particles from "particles.js";
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      isLoading: false,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    reserLoginFrom() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.isLoading = true;
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);

        if (res.meta.status !== 200) return this.$message.error("登录失败");
        this.isLoading = false;
        this.$message.success("登录成功");
        const loginDate = new Date().toLocaleString();
        window.sessionStorage.setItem("token", res.data.token);

        this.$router.push("/home");
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #000;
  // background-image: url("../assets/login-bg.jpg");
  //  background-size: cover;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;

    .avatar_box {
      height: 100px;
      width: 100px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: center;
}
</style>