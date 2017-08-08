/* eslint-disable no-param-reassign */

import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import '../vendor/MTLLoader';
import '../vendor/OBJLoader';

function loadAsset(name) {
  return new Promise((resolve, reject) => {
    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath(`static/${name}/`);
    mtlLoader.load(`${name}.mtl`, (materials) => {
      materials.preload();
      const objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath(`static/${name}/`);
      objLoader.load(`${name}.obj`, object => resolve(object), undefined, xhr => reject(xhr));
    }, undefined, xhr => reject(xhr));
  });
}

function setup(element, textureCanvas) {
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

  for (let i = 0; i < Math.PI * 2; i += Math.PI / 4) {
    const object = new THREE.Object3D();

    loadAsset('toaster').then((test) => {
      test.traverse((node) => {
        if (node.material) {
          node.material.map = canvasTexture;
        }
      });
      test.scale.multiplyScalar(250);
      object.add(test);
    });

    object.position.x = 150 * Math.cos(i);
    object.position.z = 150 * Math.sin(i);

    scene.add(object);
    objects.push(object);
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

  // TODO
  const rotation = { y: 0 };
  const tween = new TWEEN.Tween(rotation)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        camera.rotation.y = rotation.y;
      });

  const previousAsset = () => {
    tween.stop()
      .to({ y: camera.rotation.y - (Math.PI / 4) }, 1000)
      .start();
  };

  const nextAsset = () => {
    tween.stop()
      .to({ y: camera.rotation.y + (Math.PI / 4) }, 1000)
      .start();
  };

  return {
    changeTexture,
    previousAsset,
    nextAsset,
  };
}

export default setup;
