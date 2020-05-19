<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img id="logo" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"  />
        <span >电商后台管理系统</span>
      </div>
      <el-tooltip  effect="dark" content="注销" placement="top-start" id="logout" >
      <el-button type="text" @click="logout" class="iconfont icon-tuichu" size="mini"></el-button>
    </el-tooltip>
     
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse" id="toggle">|||</div>
        <el-menu
          id="menu"
          background-color="#333744"
          text-color="#fff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
          active-text-color="#409eff"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path + ''"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main :class="[$route.path === '/welcome' ? 'bgc2' : 'bgc']" id="mainInfo" >
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import driverStep from "@/untils/driver"
export default {
  data() {
    return {
      menuList: [],
      iconsObj: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-kongjian",
        "101": "iconfont icon-shangpingouwudai2",
        "102": "iconfont icon-danju-tianchong",
        "145": "iconfont icon-baobiao"
      },
      isCollapse: false,
      activePath: ""
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  mounted() {
    this.start()
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
    start(){
      this.$nextTick(() => {
        this.$driver.defineSteps(driverStep);
        this.$driver.start();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
    img {
      width: 61px;
      height: 50px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.bgc {
  background-color: #eaedf1;
}
.bgc2 {
  background-color: #404a59;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  text-align: center;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
  color: #fff;
}
</style>
