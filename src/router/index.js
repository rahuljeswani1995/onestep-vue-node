import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/ManagePreferences.vue')
    },
    {
      path: '/device/:id',
      name: 'deviceDetails',
      component: () => import('../views/DeviceDetails.vue')
    }
  ]
})