import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      children: [
        {
          path: '/',
          component: resolve => require(['../components/page/Home.vue'], resolve)
        },
        {
          path: '/ptable:fid-:sid-:tid-:btid',
          component: resolve => require(['../components/page/ProblemTable.vue'], resolve)
        },
        {
          path: '/ptable:fid-:sid-:btid',
          component: resolve => require(['../components/page/ProblemTable.vue'], resolve)
        },
        {
          path: '/ptable:fid-:btid',
          component: resolve => require(['../components/page/ProblemTable.vue'], resolve)
        },
        {
          path: '/dtable:fid-:sid-:tid-:btid',
          component: resolve => require(['../components/page/DemoProjectTable.vue'], resolve)
        },
        {
          path: '/dtable:fid-:sid-:btid',
          component: resolve => require(['../components/page/DemoProjectTable.vue'], resolve)
        },
        {
          path: '/dtable:fid-:btid',
          component: resolve => require(['../components/page/DemoProjectTable.vue'], resolve)
        },
        {
          path: '/null:fid-:btid',
          component: resolve => require(['../components/page/notfound.vue'], resolve)
        }
        // {
        //   path: '/btable:fid-:sid-:tid-:btid',
        //   component: resolve => require(['../components/page/BridgeTable.vue'], resolve)
        // },
        // {
        //   path: '/btable:fid-:sid-:btid',
        //   component: resolve => require(['../components/page/BridgeTable.vue'], resolve)
        // },
        // {
        //   path: '/btable:fid-:btid',
        //   component: resolve => require(['../components/page/BridgeTable.vue'], resolve)
        // },
        // {
        //   path: '/rtable:fid-:sid-:tid-:btid',
        //   component: resolve => require(['../components/page/ProblemTable.vue'], resolve)
        // },
        // {
        //   path: '/rtable:fid-:sid-:btid',
        //   component: resolve => require(['../components/page/ProblemTable.vue'], resolve)
        // },
        // {
        //   path: '/rtable:fid-:btid',
        //   component: resolve => require(['../components/page/ProblemTable.vue'], resolve)
        // },
        // {
        //   path: '/ctable:fid-:sid-:tid-:btid',
        //   component: resolve => require(['../components/page/ProblemTable.vue'], resolve)
        // },
        // {
        //   path: '/ctable:fid-:sid-:btid',
        //   component: resolve => require(['../components/page/ProblemTable.vue'], resolve)
        // },
        // {
        //   path: '/ctable:fid-:btid',
        //   component: resolve => require(['../components/page/ProblemTable.vue'], resolve)
        // }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    }
  ]
})
