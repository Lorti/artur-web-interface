/* eslint-disable no-param-reassign */

import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import '../vendor/MTLLoader';
import '../vendor/OBJLoader';

function loadAsset(asset) {
  return new Promise((resolve, reject) => {
    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath(`/static/${asset.name}/`);
    mtlLoader.load(asset.mtl, (materials) => {
      materials.preload();
      const objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(asset.obj, object => resolve(object), undefined, xhr => reject(xhr));
    }, undefined, xhr => reject(xhr));
  });
}

function setup(element, assets, textureCanvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75, element.offsetWidth / element.offsetHeight, 1, 1000);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
  ambientLight.color.setHSL(0.1, 1, 0.95);
  scene.add(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
  hemisphereLight.color.setHSL(0.6, 1, 0.95);
  hemisphereLight.groundColor.setHSL(0.095, 1, 0.75);
  hemisphereLight.position.set(0, 0, 500);
  scene.add(hemisphereLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.65);
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(-1, 1, 1);
  directionalLight.position.multiplyScalar(50);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(element.offsetWidth, element.offsetHeight);
  element.appendChild(renderer.domElement);

  const canvasTexture = new THREE.CanvasTexture(textureCanvas);
  canvasTexture.anisotropy = renderer.getMaxAnisotropy();

  const objects = [];
  const offset = Math.PI;
  const start = offset;
  const end = (Math.PI * 2) + offset;
  const step = (Math.PI * 2) / assets.length;
  let index = 0;

  for (let i = start; i < end; i += step) {
    const object = new THREE.Object3D();
    const first = index === 0;

    loadAsset(assets[index]).then((asset) => {
      if (first) {
        asset.traverse((node) => {
          if (node.material) {
            node.material.unalteredTexture = node.material.map;
            node.material.map = canvasTexture;
          }
        });
      }
      asset.scale.multiplyScalar(250);
      object.add(asset);
    });

    object.position.x = 150 * Math.sin(i);
    object.position.z = 150 * Math.cos(i);

    scene.add(object);
    objects.push(object);


    index += 1;
  }

  const animate = () => {
    requestAnimationFrame(animate);
    objects.forEach((object) => { object.rotation.y += 0.01; });
    TWEEN.update();
    renderer.render(scene, camera);
  };

  animate();

  const changeTexture = () => {
    canvasTexture.needsUpdate = true;
  };

  const swapTexture = (currentAssetIndex, previousAssetIndex) => {
    const currentAsset = objects[currentAssetIndex];
    const previousAsset = objects[previousAssetIndex];
    previousAsset.traverse((node) => {
      if (node.material) {
        node.material.map = node.material.unalteredTexture;
      }
    });
    currentAsset.traverse((node) => {
      if (node.material) {
        node.material.unalteredTexture = node.material.map;
        node.material.map = canvasTexture;
      }
    });
    changeTexture();
  };

  // TODO
  const rotation = { y: 0 };
  const tween = new TWEEN.Tween(rotation)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        camera.rotation.y = rotation.y;
      });

  const previousAsset = () => {
    tween.stop()
      .to({ y: camera.rotation.y - step }, 1000)
      .start();
  };

  const nextAsset = () => {
    tween.stop()
      .to({ y: camera.rotation.y + step }, 1000)
      .start();
  };

  return {
    changeTexture,
    previousAsset,
    nextAsset,
    swapTexture,
  };
}

export default setup;
