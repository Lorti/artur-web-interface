<template>
  <div>
    <img class="texture" ref="texture" src="static/test.png" @load="textureLoaded">
    <canvas class="compound" width="256" height="256" v-update-texture="{ texture, label }"></canvas>
    <label>
      Aufschrift
      <input v-model="label">
    </label>
    <div class="scene" ref="scene"></div>
  </div>
</template>

<script>
  import setup from './rendering';

  export default {
    name: 'label',
    data() {
      return {
        updateTexture: null,
        texture: null,
        label: 'A.R.T.U.R.',
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
        ctx.font = '24px Helvetica';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(binding.value.label, element.width / 2, element.height / 2);
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
  .texture {
    display: none;
  }
  .scene {
    display: block;
    margin: 1em auto;
    width: 320px;
    height: 320px;
  }
</style>
