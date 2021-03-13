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
      path: '/manage-prefs',
      name: 'manage-prefs',
      component: () => import('../views/ManagePreferences.vue')
    },
    {
      path: '/event/:id',
      name: 'eventSingle',
      component: () => import('../views/DeviceDetails.vue')
    }
  ]
})