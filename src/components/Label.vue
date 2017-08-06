<template>
  <div>
    <img class="texture" ref="texture" src="static/toaster/toaster.png" @load="textureLoaded">
    <canvas class="compound" width="256" height="256" v-update-texture="{ texture, label }"></canvas>
    <div class="scene" ref="scene"></div>
    <label for="label">Aufschrift</label>
    <br>
    <input id="label" v-model="label">
  </div>
</template>

<script>
  import setup from './rendering';
  import names from '../vendor/names.json';

  export default {
    name: 'label',
    data() {
      return {
        updateTexture: null,
        texture: null,
        label: Object.keys(names)[Math.floor(Math.random() * Object.keys(names).length)],
      };
    },
    mounted() {
      this.updateTexture = setup(this.$refs.scene);
    },
    methods: {
      textureLoaded() {
        this.texture = this.$refs.texture;
      },
    },
    directives: {
      updateTexture(element, binding) {
        const ctx = element.getContext('2d');
        ctx.clearRect(0, 0, element.width, element.height);
        if (binding.value.texture) {
          ctx.drawImage(binding.value.texture, 0, 0, element.width, element.height);
        }
        ctx.fillStyle = 'black';
        ctx.font = '36px Helvetica';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(binding.value.label, element.width / 2, element.height / 4);
      },
    },
    watch: {
      label() {
        this.updateTexture();
      },
    },
  };
</script>

<style scoped>
  canvas {
    display: block;
    margin: 1em auto;
    border: 1px solid gray;
  }
  .texture,
  .compound {
    display: none;
  }
  .scene {
    display: block;
    margin: 1em auto;
    width: 320px;
    height: 320px;
  }
</style>
