<template>
  <div id="app">
    <h1><img id="logo" src="./assets/logo.png"> A.R.T.U.R.</h1>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  #logo {
    width: auto;
    height: 1em;
    vertical-align: -0.125em;
  }
</style>
