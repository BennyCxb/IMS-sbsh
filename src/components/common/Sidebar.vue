<template>
  <div class="sidebar">
    <el-menu class="el-menu-vertical-demo"
             :default-active="onRoutes"
             unique-opened
             background-color="#303133"
             text-color="#fff"
             active-text-color="#409EFF">
      <!--一级菜单-->
      <template v-for="(item, i) in items">
        <template v-if="item.subs">
          <el-submenu :key="i"
                      :index="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>
            <!--二级菜单-->
            <template v-for="(subItem,i) in item.subs">
              <template v-if="subItem.subs">
                <el-submenu :key="i"
                            :index="subItem.index">
                  <template slot="title">
                    <i :class="item.icon"></i>
                    <span>{{ subItem.title }}</span>
                  </template>
                  <!--三级菜单-->
                  <el-menu-item v-for="(subSubItem,i) in subItem.subs"
                                :key="i"
                                :index="subSubItem.index"
                                :disabled="subSubItem.disabled"
                                @click="routerTo(subSubItem.index, item, subItem, subSubItem)">
                    {{ subSubItem.title }}
                  </el-menu-item>
                  <!--三级菜单-->
                </el-submenu>
              </template>
              <template v-else>
                <el-menu-item :key="i"
                              :index="subItem.index"
                              @click="routerTo(subItem.index, item, subItem)">
                  <i :class="subItem.icon"></i>{{ subItem.title }}
                </el-menu-item>
              </template>
            </template>

            <!--二级菜单-->
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :key="i"
                        :index="item.index"
                        @click="routerTo(item.index, item)">
            <i :class="item.icon"></i>{{ item.title }}
          </el-menu-item>
        </template>
      </template>
      <!--一级菜单-->
    </el-menu>
    <div class="sidebar-bottom"><p>浙ICP备18015187号-1</p><p>© 2018</p></div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      items: []
    }
  },
  computed: {
    onRoutes () {
      return this.$route.path.replace('/', '')
    }
  },
  methods: {
    routerTo (index, f, s, t) {
      // console.log(f,s,t)
      let path = index
      let breadcrumb = []
      // let billTypeID
      if (f.url === undefined) {
        breadcrumb.push(f.title)
        if (s.url === undefined) {
          breadcrumb.push(s.title)
          if (t.url === undefined) {
            breadcrumb.push(t.title)
          } else {
            breadcrumb.push(t.title)
            // billTypeID = t.billTypeID
          }
        } else {
          breadcrumb.push(s.title)
          // billTypeID = s.billTypeID
        }
      } else {
        breadcrumb.push(f.title)
        // billTypeID = f.billTypeID
      }
      sessionStorage.setItem('breadcrumb', JSON.stringify(breadcrumb))
      if (path !== '') {
        this.$router.push({
          path: path
        })
      }
    }
  },
  beforeCreate () {
    let self = this
    this.$axios.get('Login/IsLogin')
      .then(function (response) {
        // let data = response.data.object
        let data = response.data
        if (data.code === 1) {
          // console.log(data)
          let items1 = []
          // 一级菜单
          _.each(data.object.MenuJson, (obj1) => {
            if (obj1.FChild.length > 0) {
              // 二级菜单
              let items2 = []
              _.each(obj1.FChild, (obj2) => {
                if (obj2.FChild.length > 0) {
                  // 三级菜单
                  let items3 = []
                  _.each(obj2.FChild, (obj3) => {
                    items3.push({
                      id: obj3.FID,
                      billTypeID: obj3.FBillTypeID,
                      index: obj3.FUrlPath + obj1.FID.toString() + '-' + obj2.FID.toString() + '-' + obj3.FID.toString() + '-' + obj3.FBillTypeID,
                      parentId: obj3.FParentID,
                      title: obj3.FName,
                      url: obj3.FUrlPath,
                      disabled: obj3.FUrlPath ? false : 'disabled'
                    })
                  })
                  items2.push({
                    id: obj2.FID,
                    index: obj2.FUrlPath + obj1.FID.toString() + '-' + obj2.FID.toString() + '-' + obj2.FBillTypeID,
                    parentId: obj2.FParentID,
                    title: obj2.FName,
                    subs: items3,
                    disabled: false
                  })
                } else {
                  items2.push({
                    id: obj2.FID,
                    billTypeID: obj2.FBillTypeID,
                    index: obj2.FUrlPath + obj1.FID.toString() + '-' + obj2.FID.toString() + '-' + obj2.FBillTypeID,
                    parentId: obj2.FParentID,
                    title: obj2.FName,
                    url: obj2.FUrlPath,
                    disabled: obj2.FUrlPath ? false : 'disabled'
                  })
                }
              })
              items1.push({
                id: obj1.FID,
                icon: 'el-icon-menu',
                index: obj1.FUrlPath + obj1.FID.toString() + '-' + obj1.FBillTypeID,
                parentId: obj1.FParentID.toString(),
                title: obj1.FName,
                subs: items2,
                disabled: false
              })
            } else {
              items1.push({
                id: obj1.FID,
                billTypeID: obj1.FBillTypeID,
                icon: 'el-icon-menu',
                index: obj1.FUrlPath + obj1.FID.toString() + '-' + obj1.FBillTypeID,
                parentId: obj1.FParentID.toString(),
                title: obj1.FName,
                url: obj1.FUrlPath,
                disabled: obj1.FUrlPath ? false : 'disabled'
              })
            }
          })

          // console.log(items1)
          self.items = [{
            icon: 'el-icon-setting',
            index: 'home',
            title: '首页',
            url: 'home'
          }].concat(items1)
        } else {
          self.$message.error(data.message)
        }
      })
      .catch(function (error) {
        // console.log(error)
        self.$message.error(error.message)
      })
  }
}
</script>

<style scoped>
  .sidebar {
    display: block;
    position: absolute;
    width: 250px;
    left: 0;
    top: 70px;
    bottom: 0;
    background: #2E363F;
  }

  .sidebar > ul {
    height: calc(100% - 55px);
  }

  .sidebar-bottom {
    position: relative;
    margin: 0;
    padding: 10px;
    border-right: solid 1px #e6e6e6;
    text-align: center;
    font-size: 14px;
    color: #ffffff;
    background: rgb(48, 49, 51);
  }
</style>
