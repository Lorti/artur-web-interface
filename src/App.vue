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
  html {
    background:
        repeating-linear-gradient(45deg, transparent, transparent 35px,
            rgba(255, 255, 255, .5) 35px, rgba(255, 255, 255, .75) 70px),
        linear-gradient(hsla(0, 0%, 100%, 1) 10%, transparent 50%, hsla(0, 0%, 100%, 1) 90%),
        radial-gradient(hsl(0, 0%, 100%), hsl(0, 0%, 90%))
        no-repeat;
  }
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
