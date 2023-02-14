import * as THREE from "../node_modules/three/src/Three.js";
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { PointerLockControls } from "../node_modules/three/examples/jsm/controls/PointerLockControls.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "../node_modules/three/examples/jsm/loaders/RGBELoader.js";
import * as CANNON from '../node_modules/cannon-es/dist/cannon-es.js'
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
})

const deviceRotation = document.getElementById("device-rotation");
deviceRotation.innerHTML = "deviceRotation";
let motion = false;
// init
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  200
);
camera.position.z = 5;
camera.position.y = 10;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xaaaaaa, 0, 200)
// scene.background = new THREE.Color(0x0f0f0f);

new RGBELoader()
  .setPath("./assets/")
  .load("royal_esplanade_1k.hdr", function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = texture;
    scene.environment = texture;
  });

const light = new THREE.AmbientLight(0x040404); // soft white light
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);

let playing = undefined;

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 1;
controls.minDistance = .8;
//controls.update() must be called after any manual changes to the camera's transform
camera.position.set(0, 20, 100);
controls.update();

// const controls = new PointerLockControls( camera, document.body );

// controls.addEventListener( 'lock', function () {
//     playing = true

// } );

// controls.addEventListener( 'unlock', function () {
//     playing = false
// } );

// // add event listener to show/hide a UI (e.g. the game's menu)
// window.addEventListener('click', () => {
//     controls.lock()
// })

// begin scene
const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
mesh.position.y = 30;

const groundGeo = new THREE.BoxGeometry(1, 0.1, 1);
const groundMat = new THREE.MeshBasicMaterial();
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.position.y = -0.2;
scene.add(ground);


const loader = new GLTFLoader();
let player = false;
let playerComponents = {}
// loader.load(
//   "../planeGame/assets/volcano.glb",
//   function (gltf) {
//     const model = gltf.scene
//     // const model = gltf.scene;
//     // model.traverse((n) => {
//     //   if (n.isMesh) {
//     //     // n.castShadow = true;
//     //     // n.receiveShadow = true;
//     //     if (n.material.map) n.material.map.anisotropy = 16;
//     //   }
//     //   if (n.material) {
//     //     n.material.metalness = 0;
//     //   }
//     // });
//     scene.add(model);
//     // gltf.scene.children.forEach((child) => {
//     //   console.log(child.name);
//     //   if (child.name == "Plane") {
//     //     fighter = child;

//     //     console.log(fighter.position);

//     //     console.log(fighter);
//     //     // controls.target = new THREE.Vector3(fighter.position.x,fighter.position.y, fighter.position.z)//new THREE.Vector3(0,10,0)
//     //     controls.target = fighter.position;
//     //     controls.update();
//     //   }
//     // });
//   },
//   undefined,
//   function (error) {
//     console.error(error);
//   }
// );
const sphereBody = new CANNON.Body({
  mass: 5, // kg
  shape: new CANNON.Sphere(2),
})
sphereBody.position.set(0, 10, 0) // m
world.addBody(sphereBody)

const g = new THREE.SphereGeometry(2)
const m = new THREE.MeshNormalMaterial()
const sphereMesh = new THREE.Mesh(g, m)
scene.add(sphereMesh)

async function loadBirds(){
  const loader = new GLTFLoader();
  const [player, ground] = await Promise.all([
    loader.loadAsync('../planeGame/assets/cezzna172.glb'),
    loader.loadAsync('../planeGame/assets/grass_land.glb')

  ])
  
  setupModel(player.scene.children[0], 'player')
  setupModel(ground.scene.children[0], 'ground')

}
function setupModel(model, type){
  if(type == 'player'){
    player = model
    player.position.y =2.5
    console.log('player found')
  }else {
    // const groundBody = new CANNON.Trimesh({
    //   type: CANNON.Body.STATIC,
    //   shape: model.geometry,
    // })
    // world.addBody(groundBody)
  }
  console.log(model)

  scene.add(model)
}

await loadBirds()

function lerp(value1, value2, amt) {
  return ((value2 - value1) * amt) + value1;
}



// animation
let frameCount = 0;
let scale = 5;
const keys = []
const playerData = {
  x:0,
  y:0,
  z:0,
  rotationSpeed: 5,
  h:.0001,
  speed:1
}


function animation(time) {
  world.fixedStep()
  sphereMesh.position.copy(sphereBody.position)
  sphereMesh.quaternion.copy(sphereBody.quaternion)
  frameCount += 1;
  if (frameCount > 1000) {
    frameCount = 0;
  }
  if (frameCount % 50 == 0) {
    console.log(typeof fighter);
    // console.log(camera.getWorldDirection(new THREE.Vector3))
  }
  if(typeof player !== undefined){
    let vec = player.getWorldDirection(new THREE.Vector3)
    vec = vec.divide(new THREE.Vector3(playerData.speed * 100,playerData.speed * 100,playerData.speed * 100))
    player.position.add(vec)
    camera.position.add(vec.divide(new THREE.Vector3(10,1,1)))
    controls.target = player.position
    controls.update()

    // if(keys['ArrowUp']){
    //   playerData.x -= playerData.rotationSpeed;
    // }
    // else if(keys['ArrowDown']){
    //   playerData.x += playerData.rotationSpeed;
    // } else {
    //   playerData.x = lerp(playerData.x, 0, playerData.h*500)
    // }

    // if(keys['ArrowRight']){
    //   playerData.z -= playerData.rotationSpeed;
    // }
    // else if(keys['ArrowLeft']){
    //   playerData.z += playerData.rotationSpeed;
    // } else {
    //   playerData.z = lerp(playerData.z, 0, playerData.h*500)

    // }

    // if(keys['a']){
    //   playerData.y += playerData.rotationSpeed;
    // }
    // else if(keys['d']){
    //   playerData.y -= playerData.rotationSpeed;
    // } else {
    //   playerData.y = lerp(playerData.y, 0, playerData.h*500)

    // }

    player.rotation.x = lerp(player.rotation.x, playerData.x,playerData.h)
    player.rotation.y = lerp(player.rotation.y, playerData.y,playerData.h)
    player.rotation.z = lerp(player.rotation.z, playerData.z,playerData.h)
    // player.rotation.x += playerData.x*playerData.h
    // player.rotation.y += playerData.y*playerData.h
    // player.rotation.z += playerData.z*playerData.h

  }

  // if(playing ){
  //     let vec = camera.getWorldDirection(new THREE.Vector3)
  //     vec = vec.divide(new THREE.Vector3(5,1,5))
  //     camera.position.add(  vec);
  //     if(typeof fighter == 'object'){
  //         fighter.position.copy(camera.position)
  //         fighter.rotation.copy(camera.rotation)
  //         fighter.position.add(new THREE.Vector3(2,-2,2).multiply(fighter.rotation))
  //     }
  // }

  mesh.rotation.x = time / 2000;
  mesh.rotation.y = time / 1000;
  renderer.render(scene, camera);
  requestAnimationFrame(animation);
}
animation();

function permission() {
  deviceRotation.innerHTML = 'checking'
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    // (optional) Do something before API request prompt.
    DeviceMotionEvent.requestPermission()
      .then((response) => {
        deviceRotation.innerHTML = response
        // (optional) Do something after API prompt dismissed.
        if (response == "granted") {
          window.addEventListener("devicemotion", handleMotionEvent, true);
          deviceRotation.innerHTML = response

          // window.addEventListener("devicemotion", (e) => {
          // });
        }
      })
      .catch(console.error);
  } else {
    deviceRotation.innerHTML = ("DeviceMotionEvent is not defined");
  }
}
document.addEventListener("click", permission);
function handleMotionEvent(event) {

  playerData.x = event.accelerationIncludingGravity.x;
  playerData.y = event.accelerationIncludingGravity.y;
  playerData.z = event.accelerationIncludingGravity.z;
  deviceRotation.innerHTML = `${playerData.x}, ${playerData.y}, ${playerData.z}`
  // Do something awesome.
}


// if (typeof DeviceMotionEvent.requestPermission === "function") {
//   document.body.addEventListener("click", function () {
//     DeviceMotionEvent.requestPermission()
//       .then(function () {
//         console.log("DeviceMotionEvent enabled");
//         deviceRotation.innerHTML = "DeviceMototionEvent enabled";
//         motion = true;
//         window.addEventListener("devicemotion", handleMotionEvent, true);
//       })
//       .catch(function (error) {
//         deviceRotation.innerHTML = "DeviceMototionEvent not enabled\n" + error;
//         console.warn("DeviceMotionEvent not enabled", error);
//       });
//   });
// } else {
//   // motion = true;
// }


document.addEventListener('keydown', (e) => {
  keys[e.key] = true
  playerData.h = Number(document.getElementById('i').value)
})
document.addEventListener('keyup', (e) => {
    keys[e.key] = false
})