<template>
  <v-touch ref="swiper" @swipeleft="swipedLeft" @swiperight="swipedRight">
    <img class="originalTexture" ref="originalTexture" :src="assets[position].map" @load="textureLoaded">
    <canvas class="compoundTexture" ref="compoundTexture"
            :width="resolution" :height="resolution"
            v-update-texture="{ texture, label, color, resolution }"></canvas>
    <div class="scene" ref="scene"></div>
    <form ref="form">
      <input type="hidden" name="asset" :value="assets[position].name">
      <p v-if="advancedEditor" class="colorButtons">
        <button class="colorButtons-button" :style="{ backgroundColor: this.colors.red }"
                type="button" @click="makeRed">Red
        </button>
        <button class="colorButtons-button" :style="{ backgroundColor: this.colors.yellow }"
                type="button" @click="makeYellow">Yellow
        </button>
        <button class="colorButtons-button" :style="{ backgroundColor: this.colors.green }"
                type="button" @click="makeGreen">Green
        </button>
        <button class="colorButtons-button" :style="{ backgroundColor: this.colors.blue }"
                type="button" @click="makeBlue">Blue
        </button>
        <input type="hidden" name="color" :value="color">
      </p>
      <p>
        <label v-if="!advancedEditor">Give your object a name<br>so you can find it in the game.</label>
        <input type="text" name="label" v-model="label" :placeholder="placeholder">
      </p>
      <p>
        <button type="submit" @click="submit">Submit</button>
      </p>
    </form>
  </v-touch>
</template>

<script>
  import Vue from 'vue';
  import VueTouch from 'vue-touch';

  import shuffle from 'array-shuffle';
  import axios from 'axios';

  import assetList from './assets';
  import config from '../config';
  import setup from './rendering';

  Vue.use(VueTouch);

  function getShuffledAssets() {
    return shuffle(assetList);
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
        advancedEditor: config.advancedEditor,
        renderer: null,
        texture: null,
        resolution: 2048,
        color: config.advancedEditor ? getRandomColor() : '#808080',
        colors,
        assets: getShuffledAssets(),
        label: '',
        placeholder: '',
        position: 0,
      };
    },
    beforeCreate() {
      axios.get('https://uinames.com/api/?region=Austria')
        .then((response) => {
          if (this.advancedEditor) {
            this.label = response.data.name;
          } else {
            this.placeholder = response.data.name;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    mounted() {
      this.renderer = setup(this.$refs.scene, this.assets, this.$refs.compoundTexture);
    },
    methods: {
      submit(e) {
        e.preventDefault();
        const form = this.$refs.form;
        const data = new FormData(form);
        data.append('img', this.$refs.compoundTexture.toDataURL('image/jpeg', 0.65));
        axios.post(config.editorEndpoint, data)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
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
        this.renderer.resetRotation(this.position);
      },
      swipedRight() {
        this.position += 1;
        if (this.position > this.assets.length - 1) {
          this.position = 0;
        }
        this.renderer.nextAsset();
        this.renderer.resetRotation(this.position);
      },
      textureLoaded() {
        this.texture = this.$refs.originalTexture;
      },
    },
    directives: {
      updateTexture(element, binding) {
        if (binding.value.texture) {
          const ctx = element.getContext('2d');
          ctx.clearRect(0, 0, element.width, element.height);
          ctx.drawImage(binding.value.texture, 0, 0, element.width, element.height);
          ctx.fillStyle = binding.value.color;
          ctx.fillRect(0, 0, element.width, element.height / 2);
          ctx.fillStyle = 'white';
          ctx.font = `${binding.value.resolution / 8}px Arial Black`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(binding.value.label, element.width / 2, element.height / 4);
          // eslint-disable-next-line
          element.dataset.dirty = true;
        }
      },
    },
    watch: {
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
    width: 100%;
    height: 240px;
  }

  .colorButtons {
    overflow: hidden;
  }

  .colorButtons-button {
    float: left;
    border: none;
    width: 25%;
    height: 44px;
    color: #fff;
    font-size: 0.75em;
  }

  form {
    padding: 0 1em;
  }

  input,
  [type="submit"] {
    height: 44px;
    width: 100%;
  }
</style>
