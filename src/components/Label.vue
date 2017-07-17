<template>
  <div>
    <img id="source" src="/static/test.png" ref="texture" @load="textureLoaded">
    <canvas width="256" height="256" v-update-texture="{ texture, label }"></canvas>
    <label for="labelInput">Aufschrift</label>
    <input id="labelInput" v-model="label">
  </div>
</template>

<script>
  export default {
    name: 'label',
    data() {
      return {
        texture: null,
        label: 'A.R.T.U.R.',
      };
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
  };
</script>

<style scoped>
  canvas {
    border: 1px solid gray;
  }
  #source {
    display: none;
  }
</style>
