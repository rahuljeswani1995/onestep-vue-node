<template>
<!-- <nav class="navbar container" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <strong class="navbar-item is-size-4">Device Explorer</strong>
    <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>
  <div id="navbar" class="navbar-menu">
    <div class="navbar-start">
      <router-link to="/" class="navbar-item">Home</router-link>
      <router-link to="/manage-prefs" class="navbar-item">Manage Preferences</router-link>
    </div>
  </div>

  <div id="navbarBasicExample" class="navbar-menu">
    <div class="navbar-start">
      <div class="navbar-item is-hoverable">
        <router-link to="/" class="navbar-item">Home</router-link>
      </div>
      <div class="navbar-item is-hoverable">
        <router-link to="/manage-prefs" class="navbar-item">Manage Preferences</router-link>
      </div>
    </div>
  </div>
</nav> -->
<b-navbar toggleable="lg" type="dark" variant="primary">
    <b-navbar-brand>Device Explorer</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item >
          <router-link to="/" >Home</router-link>
        </b-nav-item>
        <b-nav-item>
          <router-link to="/manage-prefs" >Manage Preferences</router-link>
        </b-nav-item>
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