import * as THREE from 'three';
import '../vendor/MTLLoader';
import '../vendor/OBJLoader';

function loadAsset(name) {
  return new Promise((resolve, reject) => {
    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('static/');
    mtlLoader.load(`${name}.mtl`, (materials) => {
      materials.preload();
      const objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('static/');
      objLoader.load(`${name}.obj`, object => resolve(object), undefined, xhr => reject(xhr));
    }, undefined, xhr => reject(xhr));
  });
}

function setup(element) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75, element.offsetWidth / element.offsetHeight, 1, 1000);
  camera.position.z = 100;

  const axisHelper = new THREE.AxisHelper(10);
  scene.add(axisHelper);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  ambientLight.color.setHSL(0.1, 1, 0.95);
  scene.add(ambientLight);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(element.offsetWidth, element.offsetHeight);
  element.appendChild(renderer.domElement);

  let canvasTexture;
  const object = new THREE.Object3D();
  loadAsset('test').then((test) => {
    test.traverse((node) => {
      if (node.material) {
        // TODO
        canvasTexture = new THREE.CanvasTexture(document.querySelector('.compound'));
        node.material.map = canvasTexture; // eslint-disable-line no-param-reassign
      }
    });
    test.scale.multiplyScalar(1);
    object.add(test);
  });
  scene.add(object);

  // TODO
  const animate = () => {
    requestAnimationFrame(animate);
    object.rotation.x += 0.005;
    object.rotation.y += 0.01;
    renderer.render(scene, camera);
  };

  animate();

  const changeTexture = () => {
    canvasTexture.needsUpdate = true;
  };

  return changeTexture;
}

export default setup;
