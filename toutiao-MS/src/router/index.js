import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('views/login/Login')
  },
  {
    path: '/layout',
    component: () => import('views/layout/Layout'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('views/home/Home')
      },
      {
        path: 'content',
        name: 'content',
        component: () => import('views/content/Content')
      },
      {
        path: 'material',
        name: 'material',
        component: () => import('views/material/Material')
      },
      {
        path: 'essay',
        name: 'essay',
        component: () => import('views/essay/Essay')
      },
      {
        path: 'comment',
        name: 'comment',
        component: () => import('views/comment/Comment')
      },
      {
        path: 'fans',
        name: 'fans',
        component: () => import('views/fans/Fans')
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import('views/setting/Setting')
      }
    ]
  }
]
const router = new VueRouter({
  routes
})

export default router
