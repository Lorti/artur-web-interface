<template>
  <v-touch ref="swiper" @swipeleft="swipedLeft" @swiperight="swipedRight">
    <img class="originalTexture" ref="texture" src="static/toaster/toaster.png" @load="textureLoaded">
    <canvas class="compoundTexture" width="256" height="256" v-update-texture="{ texture, label }"></canvas>
    <div class="scene" ref="scene"></div>
    <label for="label">Aufschrift</label>
    <input id="label" v-model="label">
  </v-touch>
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
      swipedLeft() {
        console.log('swiped left');
      },
      swipedRight() {
        console.log('swiped right');
      },
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
  .originalTexture,
  .compoundTexture {
    display: none;
  }
  .scene {
    display: block;
    margin: 1em auto;
    width: 320px;
    height: 320px;
  }
</style>
