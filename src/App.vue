<template>
  <div id="app">
    <h1 class="heading">
      <img class="heading-logo" src="./assets/logo.svg">
      <span class="heading-text">
        <span class="heading-main">ARTUR</span>
        <small class="heading-sub">Autonomous Robot Playspace</small>
      </span>
    </h1>
    <router-view></router-view>
    <footer>
      © 2017
      <a href="https://manu.ninja/">Manuel Wieser</a>,
      <a href="https://quantumreboot.com/">Quantum Reboot</a> and
      <a href="http://pie.fh-hagenberg.at/">Playful Interactive Environments</a>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style>
  html,
  body {
    min-height: 100%;
  }
  html {
    background:
        repeating-linear-gradient(45deg, transparent, transparent 35px,
            rgba(255, 255, 255, .5) 35px, rgba(255, 255, 255, .75) 70px),
        linear-gradient(hsla(0, 0%, 100%, 1) 10%, transparent 25%, transparent 75%, hsla(0, 0%, 100%, 1) 90%),
        radial-gradient(hsl(0, 0%, 100%), hsl(0, 0%, 90%))
        no-repeat;
  }
  *, *:before, *:after {
    box-sizing: border-box;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 0 auto;
    max-width: 320px;
  }

  .heading {
    display: inline-block;
    width: auto;
    margin: 1rem auto;
  }
  .heading-logo {
    float: left;
    width: auto;
    height: 1em;
  }
  .heading-text {
    display: block;
    text-align: left;
    margin-left: 1.25em;
  }
  .heading-main {}
  .heading-sub {
    font-size: 0.75rem;
    display: block;
  }

  footer {
    margin: 2rem auto;
    font-size: 0.875rem;
  }
  footer a {
    white-space: nowrap;
  }
</style>
