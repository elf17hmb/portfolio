// import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))


import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
const renderer = new THREE.WebGLRenderer({
  canvas : document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
camera.position.set(0,1,2);
camera.rotation.y = -30;
renderer.render(scene,camera);

// const geometry = new THREE.TorusGeometry(10,3,16,100);
// const material = new THREE.MeshStandardMaterial({color:0xFF6347});
// const torus = new THREE.Mesh(geometry,material);

// scene.add(torus);
// renderer.render(scene,camera);
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);

const ambientLight = new THREE.AmbientLight();

scene.add(pointLight,ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50);
scene.add(lightHelper);


const controls = new OrbitControls(camera,renderer.domElement);


const loader = new OBJLoader();
const textureLoader = new THREE.TextureLoader();

var sannyObj;

loader.load('resources/sanny.obj',function(obj){
    // Load and apply the main texture
    var mainTexture = textureLoader.load('resources/textured_0_JDT9QVDR.jpg');
    var mainMaterial = new THREE.MeshStandardMaterial({ map: mainTexture });

    // Load and apply the normal map
    var normalMap = textureLoader.load('resources/textured_0_norm_JDT9QVDR.jpg');
    mainMaterial.normalMap = normalMap;

    // Load and apply the ambient occlusion map
    var occlusionMap = textureLoader.load('resources/textured_0_occl_JDT9QVDR.jpg');
    mainMaterial.aoMap = occlusionMap;

    // Assign the material to the model
    obj.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material = mainMaterial;
        }
    });

    sannyObj = obj;

    // Add the loaded model to the scene
    scene.add(obj);
},
// called when loading is in progresses
function ( xhr ) {

  console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

},
// called when loading has errors
function ( error ) {

  console.log( 'An error happened' );

});

function animate(){
  requestAnimationFrame(animate);

  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;

  // Rotate the loaded model around the up axis
  if (sannyObj) {
    sannyObj.rotation.y += 0.01;
  }
  
  controls.update();

  renderer.render(scene,camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', function () {
  var newWidth = window.innerWidth;
  var newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
});