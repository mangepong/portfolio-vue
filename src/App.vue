<template>
  <v-app>
    <div id="app">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <router-link class="navbar-brand" to="/">Portfolio</router-link> |
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link class="navbar-brand" to="/about"
                  >About</router-link
                >
              </li>
              <li class="nav-item">
                <router-link class="navbar-brand" to="/github"
                  >Github/Projects</router-link
                >
              </li>
              <li class="nav-item">
                <router-link class="navbar-brand" to="/test">Test</router-link>
              </li>
              <li class="nav-item">
                <router-link class="navbar-brand" to="/stream"
                  >Stream</router-link
                >
              </li>
              <li class="nav-item">
                <router-link class="navbar-brand" to="/p2p">P2P</router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <router-view />
    </div>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
