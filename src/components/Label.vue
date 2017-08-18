<template>
  <v-touch ref="swiper" @swipeleft="swipedLeft" @swiperight="swipedRight">
    <img class="originalTexture" ref="originalTexture" :src="assets[position].map" @load="textureLoaded">
    <canvas class="compoundTexture" ref="compoundTexture"
            :width="resolution" :height="resolution"
            v-update-texture="{ texture, label, color, resolution }"></canvas>
    <div class="scene" ref="scene"></div>
    <form action="/submit" ref="form">
      <input type="hidden" name="asset" :value="assets[position].name">
      <p>
        <button class="colorButton colorButton--red" type="button" @click="makeRed"></button>
        <button class="colorButton colorButton--yellow" type="button" @click="makeYellow"></button>
        <button class="colorButton colorButton--green" type="button" @click="makeGreen"></button>
        <button class="colorButton colorButton--blue" type="button" @click="makeBlue"></button>
        <input type="hidden" name="color" :value="color">
      </p>
      <p>
        <input type="text" name="label" v-model="label">
      </p>
      <p>
        <button type="submit" @click="submit">Submit</button>
      </p>
    </form>
  </v-touch>
</template>

<script>
  import shuffle from 'array-shuffle';

  import setup from './rendering';

  import assetList from '../../static/assets.json';
  import nameList from '../vendor/names.json';

  function getShuffledAssets() {
    const shuffled = shuffle(assetList);
    return shuffled.map(name => ({
      name,
      obj: `static/${name}/${name}.obj`,
      mtl: `static/${name}/${name}.mtl`,
      map: `static/${name}/${name}.png`,
    }));
  }

  function getRandomLabel() {
    return Object.keys(nameList)[Math.floor(Math.random() * Object.keys(nameList).length)];
  }

  const colors = {
    red: '#E61717',
    yellow: '#E6C217',
    green: '#12B812',
    blue: '#3E209E',
  };

  function getRandomColor() {
    return Object.keys(colors)[Math.floor(Math.random() * Object.keys(colors).length)];
  }

  export default {
    name: 'label',
    data() {
      return {
        renderer: null,
        texture: null,
        resolution: 2048,
        color: getRandomColor(),
        assets: getShuffledAssets(),
        label: getRandomLabel(),
        position: 0,
      };
    },
    mounted() {
      this.renderer = setup(this.$refs.scene, this.assets, this.$refs.compoundTexture);
    },
    methods: {
      submit() {
        const form = this.$refs.form;
        const data = new FormData(form);
        const request = new XMLHttpRequest();
        request.open('POST', '/submit');
        request.send(data);
      },
      makeRed() {
        this.color = colors.red;
      },
      makeYellow() {
        this.color = colors.yellow;
      },
      makeGreen() {
        this.color = colors.green;
      },
      makeBlue() {
        this.color = colors.blue;
      },
      swipedLeft() {
        this.position -= 1;
        if (this.position < 0) {
          this.position = this.assets.length - 1;
        }
        this.renderer.previousAsset();
      },
      swipedRight() {
        this.position += 1;
        if (this.position > this.assets.length - 1) {
          this.position = 0;
        }
        this.renderer.nextAsset();
      },
      textureLoaded() {
        this.texture = this.$refs.originalTexture;
      },
    },
    directives: {
      updateTexture(element, binding) {
        const ctx = element.getContext('2d');
        ctx.clearRect(0, 0, element.width, element.height);
        if (binding.value.texture) {
          ctx.drawImage(binding.value.texture, 0, 0, element.width, element.height);
        }
        ctx.fillStyle = binding.value.color;
        ctx.fillRect(0, 0, element.width, element.height / 2);
        ctx.fillStyle = 'white';
        ctx.font = `${binding.value.resolution / 8}px Arial Black`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(binding.value.label, element.width / 2, element.height / 4);
      },
    },
    watch: {
      label() {
        this.renderer.changeTexture();
      },
      color() {
        this.renderer.changeTexture();
      },
      position(current, previous) {
        this.renderer.swapTexture(current, previous);
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

  .colorButton {
    border: none;
    width: 44px;
    height: 44px;
  }
  .colorButton--red {
    background-color: red;
  }
  .colorButton--yellow {
    background-color: yellow;
  }
  .colorButton--green {
    background-color: green;
  }
  .colorButton--blue {
    background-color: blue;
  }
</style>
