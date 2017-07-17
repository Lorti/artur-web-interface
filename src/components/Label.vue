<template>
    <div>
        <img id="source" src="../assets/test.png" style="display: none;">
        <canvas width="256" height="256" v-update-texture="label"></canvas>
        <label for="labelInput">Aufschrift</label>
        <input id="labelInput" v-model="label">
    </div>
</template>

<script>
  export default {
    name: 'label',
    data() {
      return {
        label: 'A.R.T.U.R.',
      };
    },
    directives: {
      updateTexture(element, binding) {
        const ctx = element.getContext('2d');
        ctx.clearRect(0, 0, element.width, element.height);
        const source = document.getElementById('source');
        if (source && source.complete) {
          ctx.drawImage(source, 0, 0, element.width, element.height);
        }
        ctx.fillStyle = 'black';
        ctx.font = '24px Helvetica';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(binding.value, element.width / 2, element.height / 2);
      },
    },
  };
</script>

<style scoped>
    canvas {
        border: 1px solid gray;
    }
</style>
