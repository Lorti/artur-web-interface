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

function objectFactory(assets, canvasTexture) {
  const threeObjects = [];
  const rotationVectors = [];

  const offset = Math.PI;
  const step = (Math.PI * 2) / assets.length;

  assets.forEach((asset, index) => {
    const object = new THREE.Object3D();
    const first = index === 0;
    loadAsset(asset).then((assetObject3d) => {
      if (first) {
        assetObject3d.traverse((node) => {
          if (node.material) {
            node.material.unalteredTexture = node.material.map;
            node.material.map = canvasTexture;
          }
        });
      }
      assetObject3d.rotation.x = asset.transform.rotation.x;
      assetObject3d.rotation.y = asset.transform.rotation.y;
      assetObject3d.rotation.z = asset.transform.rotation.z;
      assetObject3d.scale.multiplyScalar(asset.transform.scale);
      object.add(assetObject3d);
    });

    const angle = offset + (step * index);
    object.position.x = 150 * Math.sin(angle);
    object.position.z = 150 * Math.cos(angle);

    const matrix = new THREE.Matrix4();
    matrix.lookAt(object.position, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
    object.quaternion.setFromRotationMatrix(matrix);
    object.rotateY(Math.PI + 1);

    threeObjects.push(object);
    rotationVectors.push(object.rotation.clone());
  });

  return {
    threeObjects,
    rotationVectors,
  };
}

function setup(element, assets, textureCanvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50, element.offsetWidth / element.offsetHeight, 1, 1000);

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

  const wheel = new THREE.Object3D();
  const { threeObjects, rotationVectors } = objectFactory(assets, canvasTexture);

  threeObjects.forEach((object) => {
    wheel.add(object);
  });
  scene.add(wheel);

  const swapTexture = (currentAssetIndex, previousAssetIndex) => {
    const currentAsset = threeObjects[currentAssetIndex];
    const previousAsset = threeObjects[previousAssetIndex];
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
  };

  const rotation = { y: 0 };
  const tween = new TWEEN.Tween(rotation)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        wheel.rotation.y = rotation.y;
      });

  const previousAsset = () => {
    tween.stop()
      .to({ y: wheel.rotation.y + ((Math.PI * 2) / assets.length) }, 750)
      .start();
  };

  const nextAsset = () => {
    tween.stop()
      .to({ y: wheel.rotation.y - ((Math.PI * 2) / assets.length) }, 750)
      .start();
  };

  const resetRotation = (assetIndex) => {
    threeObjects[assetIndex].setRotationFromEuler(rotationVectors[assetIndex]);
  };

  const animate = () => {
    requestAnimationFrame(animate);
    threeObjects.forEach((object) => { object.rotateY(-0.0125); });
    TWEEN.update();
    if (textureCanvas.dataset.dirty === 'true') {
      canvasTexture.needsUpdate = true;
      textureCanvas.dataset.dirty = false;
    }
    renderer.render(scene, camera);
  };

  animate();

  return {
    swapTexture,
    previousAsset,
    nextAsset,
    resetRotation,
  };
}

export default setup;
