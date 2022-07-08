//imports
import * as THREE from "../3D world/three/src/Three.js";
import { OrbitControls } from "../3D world/three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "../3D world/three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "../3D world/three/examples/jsm/loaders/DRACOLoader.js";
import * as ct from "../3D world/js/constant.js";
import { cube, plane } from "../3D world/js/constant.js";
import { MovementControls } from "../3D world/js/movementControls.js";
// const THREE = {
//   //Setup
//   Scene: Scene,
//   PerspectiveCamera,
//   WebGLRenderer: WebGLRenderer,

//   //Lights
//   DirectionalLight: DirectionalLight,
//   AmbientLight: AmbientLight,
//   DirectionalLightHelper: DirectionalLightHelper,

//   //Geometry
//   BoxGeometry: BoxGeometry,
//   PlaneGeometry: PlaneGeometry,

//   //Mesh
//   MeshPhongMaterial: MeshPhongMaterial,
//   Mesh: Mesh,
// }

console.clear();

//SETUP
const canvas = document.getElementById("canvas");
const scene = new THREE.Scene();
const camera = ct.createCamera();
const controls = new OrbitControls(camera, canvas);
const renderer = ct.createRenderer(canvas);
const dLight = ct.directionLight(scene, [10, 10, -10]);
const aLight = ct.AmbientLight(scene, 10);

// let cube1 = cube(scene, { x: 0, y: 0, z: 0 }, [1, 1, 1], 0x00aaff, true, true);

camera.position.z = 15;

///////////////////////////////
const loader = new GLTFLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/js/libs/draco/");
loader.setDRACOLoader(dracoLoader);

// Load a glTF resource
loader.load(
  // resource URL
  "./assets/WoodenBlock.glb",
  // called when the resource is loaded
  function (gltf) {
    gltf.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        // node.receiveShadow = true;
      }
    });
    scene.add(gltf.scene);

    // gltf.animations; // Array<THREE.AnimationClip>
    // gltf.scene; // THREE.Group
    // gltf.scenes; // Array<THREE.Group>
    // gltf.cameras; // Array<THREE.Camera>
    // gltf.asset; // Object
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

/////////////////////////////
console.log(dLight)
function animate() {
    controls.update()
  dLight.position.set(camera.position.x, camera.position.y, camera.position.z)
//   cube1.rotation.x += 0.01;
//   cube1.rotation.y += 0.01;
  // cube1.rotation.z += 0.01;

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
