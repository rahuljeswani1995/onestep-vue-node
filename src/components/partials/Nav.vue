<template>
  <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand>Device Explorer</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/" >Home</b-nav-item>
          <b-nav-item to="/settings" >Settings</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
  </b-navbar>
</template>
<script>
export default {
    name: 'Nav'
}
</script>
<style lang="scss" scoped>
  nav {
    margin-top: 25px;
    margin-bottom: 30px;
    a {
      font-weight: bold;
      color: #2c3e50;
      &.router-link-exact-active {
        color: #d88d00;
      }
    }  
  } 
</style>