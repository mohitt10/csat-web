import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 1.5, 5);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById('3dcontainer').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const light = new THREE.HemisphereLight(0xffffff, 0x444444, 3.0);
scene.add(light);

const loader = new GLTFLoader(); 

let mixer;    
let model;


loader.load(
  './shoes_outdoor/scene.gltf', 
  (gltf) => {
    model = gltf.scene;
    scene.add(model);

    model.position.set(0, 0, 0);
    model.scale.set(10, 10, 10);

    if (gltf.animations && gltf.animations.length) {
      mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
    }
  },
  undefined,
  (error) => {
    console.error('Error loading GLTF:', error);
  }
);

const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta();

  if (mixer) mixer.update(delta);

  if (model && !mixer) {
    model.rotation.x += 0.01;
    model.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
  controls.update(); 
}

renderer.setAnimationLoop(animate);