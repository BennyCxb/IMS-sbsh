<template>
  <div class="header">
    <div class="logo">
      <img src="../../assets/logo-sbsh.png" alt="">
    </div>
    <div class="user-info">
      <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo" src="../../assets/headimg.png">
                    {{name}}
                </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="cacheClean">清除缓存</el-dropdown-item>
          <el-dropdown-item command="loginout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      name: '未知用户'
    }
  },
  methods: {
    handleCommand (command) {
      if (command === 'loginout') {
        this.logOut()
      } else if (command === 'cacheClean') {
        this.cacheClean()
      }
    },
    getUsername () {
      let self = this
      this.$axios.get('Login/IsLogin')
        .then(function (response) {
          let data = response.data
          // console.log(data)
          if (data.code === 1) {
            self.name = data.object.UserName
            localStorage.setItem('FLevel', data.object.FLevel)
            localStorage.setItem('FAgencyValue', data.object.FAgencyValue)
          } else {
            self.$message.error(data.message)
          }
        })
        .catch(function (error) {
          // console.log(error)
          self.$message.error(error.message)
        })
    },
    logOut () {
      this.$cookies.remove('TZManage')
      localStorage.removeItem('ms_username')
      this.$router.push('/login')
    },
    cacheClean () {
      let self = this
      this.$axios.get('Login/LoginOut')
        .then(function (response) {
          let data = response.data
          if (data.code !== 1) {
            self.$message.error('清除缓存成功，请重新登录！')
          }
          self.logOut()
        })
        .catch(function (error) {
          // console.log(error)
          self.$message.error(error.message)
          self.logOut()
        })
    }
  },
  created () {
    this.getUsername()
  }
}
</script>
<style scoped>
  .header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    line-height: 70px;
    color: #fff;
  }

  .header .logo {
    float: left;
    width: 250px;
    text-align: center;
  }

  .header .logo > img {
    height: 70px;
  }

  .user-info {
    float: right;
    padding-right: 50px;
    font-size: 16px;
    color: #fff;
  }

  .user-info .el-dropdown-link {
    position: relative;
    display: inline-block;
    padding-left: 50px;
    color: #fff;
    cursor: pointer;
    vertical-align: middle;
  }

  .user-info .user-logo {
    position: absolute;
    left: 0;
    top: 15px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #fff;
  }

  .el-dropdown-menu__item {
    text-align: center;
  }
</style>
