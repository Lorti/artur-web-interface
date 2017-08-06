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

  /* eslint-disable no-param-reassign */
  let canvasTexture;
  const object = new THREE.Object3D();
  loadAsset('test').then((test) => {
    test.traverse((node) => {
      if (node.material) {
        // TODO
        canvasTexture = new THREE.CanvasTexture(document.querySelector('.compound'));
        canvasTexture.anisotropy = renderer.getMaxAnisotropy();
        node.material.map = canvasTexture;
      }
    });
    test.scale.multiplyScalar(1);
    object.add(test);
  });
  scene.add(object);
  /* eslint-enable no-param-reassign */

  // TODO
  const animate = () => {
    requestAnimationFrame(animate);
//    object.rotation.x += 0.005;
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
