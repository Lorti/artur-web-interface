<template>
  <v-touch ref="swiper" @swipeleft="swipedLeft" @swiperight="swipedRight">
    <img class="originalTexture" ref="originalTexture" :src="assets[0].map" @load="textureLoaded">
    <canvas class="compoundTexture" ref="compoundTexture"
            width="512" height="512" v-update-texture="{ texture, label }"></canvas>
    <div class="scene" ref="scene"></div>
    <label for="label">Aufschrift</label>
    <input id="label" v-model="label">
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

  export default {
    name: 'label',
    data() {
      return {
        renderer: null,
        texture: null,
        assets: getShuffledAssets(),
        label: getRandomLabel(),
      };
    },
    mounted() {
      this.renderer = setup(this.$refs.scene, this.assets, this.$refs.compoundTexture);
    },
    methods: {
      swipedLeft() {
        this.renderer.previousAsset();
      },
      swipedRight() {
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
        ctx.fillStyle = 'black';
        ctx.font = '36px Helvetica';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(binding.value.label, element.width / 2, element.height / 4);
      },
    },
    watch: {
      label() {
        this.renderer.changeTexture();
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
