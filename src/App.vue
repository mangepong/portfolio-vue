<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">Portfolio</router-link> |
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="navbar-brand" to="/about">About</router-link>
            </li>
            <li class="nav-item">
              <router-link class="navbar-brand" to="/github">Github/Projects</router-link>
            </li>
            <li class="nav-item">
              <router-link class="navbar-brand" to="/test">Test</router-link>
            </li>
        </ul>
        </div>
      </div>
    </nav>
    <router-view/>
  </div>
</template>




<style>
 @import './assets/css/style.css';

body {
  background-image: url("assets/img/background.jpg");
  /* position: fixed; */
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
