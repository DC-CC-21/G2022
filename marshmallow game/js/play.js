const canvas = document.getElementById("canvas");

//import
import * as THREE from "../../3D world/three/src/Three.js";
import { OrbitControls } from "../../3D world/three/examples/jsm/controls/OrbitControls.js";
// import { DragControls } from "../../3D world/three/examples/jsm/controls/DragControls.js";
import { GLTFLoader } from "../../3D world/three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "../../3D world/three/examples/jsm/loaders/DRACOLoader.js";
import * as ct from "../../3D world/js/constant.js";
import { cube, plane } from "../../3D world/js/constant.js";
import { Block } from "./gameModules/blocks.js";
import { Player } from "./gameModules/player.js";
let Width = window.innerWidth;
let Height = window.innerHeight;

const scene = new THREE.Scene();
const camera = ct.createCamera(Width, Height);
const renderer = ct.createRenderer(canvas, Width, Height);

renderer.physicallyCorrectLights = true;
renderer.gammmaOutput = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

const controls = new OrbitControls(camera, canvas);

const dlight = ct.directionLight(scene, [-2, 10, 2], 1, true);
const alight = ct.AmbientLight(scene, 1);

var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
hemiLight.position.set(0, 300, 0);
scene.add(hemiLight);

camera.position.z = 5;
let cube1 = cube(scene, { x: 0, y: 0, z: 0 }, [1, 1, 1], 0x00aaff, true, true);
// let plane1 = plane(scene, {x:0,y:-2,z:0}, [15,15,15], 0xffffff, true, true)

let blocks = [];
let p = 0;
let key = [];

let playerSize = [0.5, 1];
let blockSize = [playerSize[0] * 1.4, playerSize[1] / 2];
console.log(blockSize);

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/js/libs/draco/");
loader.setDRACOLoader(dracoLoader);
function loadModel(path, models) {
  path += ".glb";
  loader.load(
    // resource URL
    path,
    // called when the resource is loaded
    function (gltf) {
      const model = gltf.scene.children[0];
      model.castShadow = true;
      model.receiveShadow = true;
      model.material.metalness = 0;
      model.material.metalness = 0;
      scene.add(model);
      models.push(model);
      return model;
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
}
class Game {
  constructor() {
    this.theme = "grass";
    this.isFinished = false;
    fetch("levels/3dmodel.json")
      .then((response) => response.json())
      .then((jsObject) => {
        this.paths = jsObject;
      });
    fetch("levels/world1.json")
      .then((response) => response.json())
      .then((jsObject) => {
        let blockTypes = [];
        console.log("jsobject: ", jsObject[0]);
        jsObject[0].forEach((row) => {
          console.log("row: ", row);
          Array.from(row).forEach((item) => {
            if (item == " " || item == "p") {
            } else {
              blockTypes.push(item);
            }
          });
        });
        blockTypes = Array.from(new Set(blockTypes));
        blockTypes = blockTypes.map((item) => this.paths[item]);
        console.log(blockTypes);
        this.createLevel(jsObject[0], blockTypes);
      });
  }
  createLevel(data, bTypes) {
    let models = []
    for (let i = 0; i < bTypes.length; i++) {
      if (typeof bTypes[i] == "string") {
        console.log(bTypes[i]);
        loadModel(bTypes[i], models);
      } else {
        console.log(bTypes[i][this.theme]);
        loadModel(bTypes[i][this.theme], models);
      }
    }
    console.log(models)
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        let type = data[i][j];
        switch (type) {
          case "g":
            blocks.push(
              new Block(j, -i, scene, blockSize, models[type])
            );
            break;
          case "b":
            blocks.push(
              new Block(
                j,
                -i,
                scene,
                [playerSize[0], playerSize[0], playerSize[0]],
                this.paths[type]
              )
            );
            break;
          case "p":
            p = new Player(j, -i, scene);
        }
      }
    }
    this.isFinished = true;
  }
  run() {
    if (!this.isFinished) {
      return;
    }
    p.move();
    this.moveCamera();
  }
  moveCamera() {
    let pos = p.p.position;
    let dist = 3;
    camera.position.set(pos.x - dist / 5, pos.y + dist / 2, pos.z + dist);
    camera.lookAt(pos.x, pos.y, pos.z);
  }
}
let g = new Game();

function render() {
  requestAnimationFrame(render);
  cube1.rotation.x += 0.1;
  cube1.rotation.y += 0.1;
  g.run();
  renderer.render(scene, camera);
}
render();

document.addEventListener("keydown", (e) => {
  console.log(e.key);
  key[e.key] = e.key;
});
document.addEventListener("keyup", (e) => {
  key[e.key] = false;
});

export { blocks, key, blockSize, playerSize };
