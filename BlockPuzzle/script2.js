Array.prototype.countDuplicates = function () {
  let count = {};
  this.forEach((value) => {
    if (value in count) {
      count[value] += 1;
    } else {
      count[value] = 1;
    }
  });
  return count;
};

//import
import * as THREE from "../3D world/three/src/Three.js";
import { OrbitControls } from "../3D world/three/examples/jsm/controls/OrbitControls.js";
import { DragControls } from "../3D world/three/examples/jsm/controls/DragControls.js";
import { GLTFLoader } from "../3D world/three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "../3D world/three/examples/jsm/loaders/DRACOLoader.js";
import * as ct from "../3D world/js/constant.js";
import { cube, plane } from "../3D world/js/constant.js";
///// NEW /////
// import {RenderPass} from 'renderpass'
// import {EffectComposer} from 'EffectComposer'

//add ambient light to selected square

console.clear();

//#region SETUP
const canvas = document.getElementById("canvas");
console.log(canvas.clientWidth);

let Width = canvas.clientWidth;
let Height = canvas.clientHeight;
let xOffset = -(window.innerWidth - Width);
let yOffset = 0; //-(window.innerHeight - Height);

const scene = new THREE.Scene();
const camera = ct.createCamera(Width, Height);
const controls = new OrbitControls(camera, canvas);
// controls.enablePan = false;
// controls.enableZoom = false;

const renderer = ct.createRenderer(canvas, Width, Height);
const dLight = ct.directionLight(scene, [30, 30, 30], 1, true);
const aLight = ct.AmbientLight(scene, 1);
//#endregion

plane(
  scene,
  new THREE.Vector3(0, -35, 0),
  [300, 300, 300],
  0x404040,
  false,
  true
);
let cube1 = cube(scene, { x: 0, y: 0, z: 0 }, [2, 2, 2], 0x00aaff, true, true);
camera.position.z = 55;
const draggableObjs = {};
let puzzleBox = [];
let placePiece = false;
let selectedObj = false;
let mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let target = new THREE.Vector3(0, 0, 0);
const dragControls = new DragControls(
  draggableObjs,
  camera,
  renderer.domElement
);
///////////////////////////////
let jsonUrl = "./levels.json";
let level = 1;
fetch(jsonUrl)
  .then((request) => request.json())
  .then((jsobject) => {
    let pieceCounts = jsobject["level" + level].pieces.countDuplicates();
    let pieces = Array.from(new Set(jsobject["level" + level].pieces));
    pieces.forEach((piece) => {
      let div = document.createElement("div");
      let img = document.createElement("img");
      let span = document.createElement("span");
      span.innerHTML = `<p>${pieceCounts[piece]}</p>`;
      span.setAttribute("class", "pieceCount");
      img.setAttribute("src", `./assets/woodPiece${piece}.png`);
      img.setAttribute("data-piece", piece);
      div.append(img, span);
      document.getElementById("pieceContainer").append(div);
    });
  });

//#region loadModels
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/js/libs/draco/");
loader.setDRACOLoader(dracoLoader);

const loadingDiv = document.getElementById("Loading");
function loadModel(
  loader,
  path,
  modelName = "Untitled",
  draggableObjs = false,
  scene,
  data = {}
) {
  let p = document.createElement("p");
  p.setAttribute("id", modelName);
  loadingDiv.append(p);
  loader.load(
    // resource URL
    path,
    // called when the resource is loaded
    function (gltf) {
      const model = gltf.scene.children[0];
      model.castShadow = true;
      model.receiveShadow = true;
      // box.userData.draggable = true;
      model.userData.name = modelName;
      scene.add(model);

      if (modelName.includes("Target")) {
        model.material.transparent = true;
        model.material.opacity = 0;
      }
      // const box = new THREE.Box3();
      // box.copy(model.geometry.boundingBox).applyMatrix4(model.matrixWorld);
      // const helper = new THREE.Box3Helper(box, 0xffff00);
      // model.add(helper);

      if (Object.keys(data).length) {
        Object.keys(data).forEach((key) => {
          model.userData[key] = data[key];
        });
      }
      if (draggableObjs && !modelName.includes("piece")) {
        draggableObjs.push(model);
      } else {
        if (!(modelName in draggableObjs)) {
          draggableObjs[modelName] = [];
        }
        draggableObjs[modelName].push(model);
      }

      // gltf.animations; // Array<THREE.AnimationClip>
      // gltf.scene; // THREE.Group
      // gltf.scenes; // Array<THREE.Group>
      // gltf.cameras; // Array<THREE.Camera>
      // gltf.asset; // Object
      loadingDiv.removeChild(document.getElementById(modelName));
      return model;
    },
    // called while loading is progressing
    function (xhr) {
      //   console.log((xhr.loaded / xhr.total) * 100 + "% loaded");

      p.innerHTML = `Loading ${modelName} ${(
        (xhr.loaded / xhr.total) *
        100
      ).toFixed(2)}% loaded`;
    },
    // called when loading has errors
    function (error) {
      console.log("An error happened");
    }
  );
}

//models

//box
loadModel(loader, "assets/WoodenBlock.glb", "Box", [], scene);

//targets
loadModel(loader, "assets/Target1.glb", "Target1", puzzleBox, scene, {
  rotation: { x: 0, y: Math.PI, z: 0 },
});
loadModel(loader, "assets/Target2.glb", "Target2", puzzleBox, scene, {
  rotation: { x: 0, y: -Math.PI / 2, z: 0 },
});
loadModel(loader, "assets/Target3.glb", "Target3", puzzleBox, scene, {
  rotation: { x: 0, y: -Math.PI / 2, z: 0 },
});
loadModel(loader, "assets/Target4.glb", "Target4", puzzleBox, scene, {
  rotation: { x: Math.PI / 2, y: 0, z: 0 },
});
loadModel(loader, "assets/Target5.glb", "Target5", puzzleBox, scene, {
  rotation: { x: Math.PI / 2, y: 0, z: 0 },
});
loadModel(loader, "assets/Target6.glb", "Target6", puzzleBox, scene, {
  rotation: { x: Math.PI / 2, y: 0, z: 0 },
});
loadModel(loader, "assets/Target7.glb", "Target7", puzzleBox, scene, {
  rotation: { x: Math.PI / 2, y: 0, z: 0 },
});
loadModel(loader, "assets/Target8.glb", "Target7", puzzleBox, scene, {
  rotation: { x: 0, y: 0, z: 0 },
});

//pieces
loadModel(loader, "assets/piece1.glb", "piece1", draggableObjs, scene, {
  offset: {
    x: 0,
    y: 0,
    z: 0,
  },
  prev: new THREE.Vector3(0, 0, 0),
});
loadModel(loader, "assets/piece2.glb", "piece5", draggableObjs, scene, {
  offset: {
    x: 0,
    y: 0,
    z: 0,
  },
  prev: new THREE.Vector3(0, 0, 0),
});

//#endregion

let selectedLight = ct.PointLight(scene, 0xffff00, 100, 50);
const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper(selectedLight, sphereSize);
scene.add(pointLightHelper);

function animate() {
  controls.update();
  // dLight.position.set(camera.position.x, camera.position.y, camera.position.z);
  // dLight.rotation.copy(camera.rotation)
  cube1.rotation.x += 0.01;
  cube1.rotation.y += 0.01;
  if (placePiece) {
    place();
  }
  // cube1.rotation.z += 0.01;
  //   if(!controls.enabled){dragObj();}
  // if(draggableObjs.length > 1){
  // draggableObjs[1].rotation.z += 0.01;}
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

//#region functions
function place() {
  if (
    selectedObj.userData.prev.distanceTo(puzzleBox[0].position) < 1 &&
    selectedObj.position.z - puzzleBox[7].position.z > 0
  ) {
    selectedObj.position.z -= 0.5;
  } else if (
    selectedObj.userData.prev.distanceTo(puzzleBox[7].position) < 1 &&
    selectedObj.position.z - puzzleBox[0].position.z < 0
  ) {
    selectedObj.position.z += 0.5;
  }
}
function changeObjectColor(event) {
  // console.log(selectedObj.children)
  if (selectedObj && selectedObj.children.length > 0) {
    selectedObj.children[0].material.color.setHex(0x000);
  }
  // console.log(event.object.children[0].material)
  selectedObj = event.object;
  if (event.object.children.length > 0) {
    event.object.children[0].material.color.setHex(0x00ff00);
  }
  if (
    event.object.rotation.y == 0 &&
    dist(event.object.position, new THREE.Vector3(0, 0, 0)) < 5
  ) {
    event.object.position.set(0, 0, 0);
    return;
  }
}
function dist(vec1, vec2) {
  let x = vec1.x - vec2.x;
  let y = vec1.y - vec2.y;
  let z = vec1.z - vec2.z;
  return Math.sqrt(x * x + y * y + z * z);
}
function map(value, istart, istop, ostart, ostop) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

//#endregion

//#region Listeners

let dIntensity = document.getElementById("dlight");
let aIntensity = document.getElementById("alight");
let rotation = document.getElementById("rotation");

rotation.addEventListener("click", () => {
  controls.enabled = rotation.checked;
});

dragControls.addEventListener("drag", (event) => {
  document.getElementById("mx").innerHTML = mouse.x;
  document.getElementById("my").innerHTML = mouse.y;

  changeObjectColor(event);

  event.object.lookAt(target);

  raycaster.setFromCamera(mouse, camera);
  const found = raycaster.intersectObjects(puzzleBox);
  if (found.length > 0) {
    let intersect = found[0];
    if (intersect) {
      document.getElementById("ray").innerHTML = JSON.stringify(
        intersect,
        null,
        " "
      );
      target.copy(intersect.point);
      console.log(intersect);
      console.log(intersect.object.userData.name);
      // event.object.position.copy(intersect.point).add(intersect.face.normal);
      if (intersect.object) {
        event.object.position.copy(intersect.object.position);
        event.object.rotation.x =
          intersect.object.userData.rotation.x + event.object.userData.offset.x;
        event.object.rotation.y =
          intersect.object.userData.rotation.y + event.object.userData.offset.y;
        event.object.rotation.z =
          intersect.object.userData.rotation.z + event.object.userData.offset.z;
      }

      // event.object.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
    }
  }
});

document.addEventListener("click", (event) => {
  mouse.x = ((event.clientX + xOffset) / Width) * 2 - 1;
  mouse.y = -((event.clientY + yOffset) / Height) * 2 + 1;

  console.log(event.target);
  if (event.target.nextSibling.tagName == "SPAN") {
    let p = event.target.nextSibling.children[0];
    p.innerHTML = Number(p.innerHTML) > 0 ? Number(p.innerHTML) - 1 : 0;

    let obj = draggableObjs["piece" + event.target.dataset.piece][0];
    obj.userData.hole = selectedLight.userData.hole[6];

    let light = selectedLight.userData.rotation;

    console.log(light);
    const a = new THREE.Euler(0, 1, 1.57, "XYZ");
    const b = new THREE.Vector3(light.x, light.y, light.z)
    b.applyEuler(a);
    obj.rotation.x = light.x
    obj.rotation.y = light.y
    obj.rotation.z = light.z
    obj.position.copy(selectedLight.position);
    return;
  }

  raycaster.setFromCamera(mouse, camera);
  const found = raycaster.intersectObjects(puzzleBox);
  if (found.length > 0) {
    let intersect = found[0];
    console.log(intersect);
    if (intersect) {
      // document.getElementById('ray').innerHTML = JSON.stringify(intersect, null, ' ')

      if (intersect.object) {
        puzzleBox.forEach((object) => {
          object.material.opacity = 0;
        });
        // intersect.object.material.opacity = 1;
        console.log(intersect.object);
        selectedLight.position.copy(intersect.object.position);
        selectedLight.userData.hole = intersect.object.userData.name;
        selectedLight.userData.rotation = intersect.object.userData.rotation;

        if (intersect.object.children.length > 0) {
          // intersect.object.children[0].material.emissive = new THREE.Color( 0xffff00 );
          // intersect.object.children[0].material.intensity = 10;
        }
        //   event.object.position.copy(intersect.object.position);
        //   event.object.rotation.x = intersect.object.userData.rotation.x+event.object.userData.offset.x;
        //   event.object.rotation.y = intersect.object.userData.rotation.y+event.object.userData.offset.y;
        //   event.object.rotation.z = intersect.object.userData.rotation.z+event.object.userData.offset.z;
      }

      // event.object.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
    }
  }
});

var supportsTouch = "ontouchstart" in window || navigator.msMaxTouchPoints;
console.log("Supports touch", supportsTouch);

document.addEventListener("mousedown", (event) => {
  console.log(supportsTouch);
  if (!supportsTouch) {
    placePiece = false;
    mouse.x = ((event.clientX + xOffset) / Width) * 2 - 1;
    mouse.y = -((event.clientY + yOffset) / Height) * 2 + 1;
    document.getElementById("my").innerHTML =
      mouse.x + "," + mouse.y + "mouse?";
  }
});
document.addEventListener("touchstart", (event) => {
  if (supportsTouch) {
    placePiece = false;
    mouse.x = ((event.touches[0].clientX + xOffset) / Width) * 2 - 1;
    mouse.y = -((event.touches[0].clientY + yOffset) / Height) * 2 + 1;
    document.getElementById("mx").innerHTML = mouse.x + "," + mouse.y + "touch";
  }
});
//
document.addEventListener("mousemove", (event) => {
  placePiece = false;
  mouse.x = ((event.clientX + xOffset) / Width) * 2 - 1;
  mouse.y = -((event.clientY + yOffset) / Height) * 2 + 1;
  // document.getElementById("mx").innerHTML = mouse.x;
  // document.getElementById("my").innerHTML = mouse.y;
});
document.addEventListener("touchmove", (event) => {
  placePiece = false;
  mouse.x = ((event.touches[0].clientX + xOffset) / Width) * 2 - 1;
  mouse.y = -((event.touches[0].clientY + yOffset) / Height) * 2 + 1;
  // document.getElementById("mx").innerHTML = mouse.x+','+mouse.y;
  // document.getElementById('my').innerHTML = JSON.stringify(event)
});
document.addEventListener("mouseup", (event) => {
  mouse.x = ((event.clientX + xOffset) / Width) * 2 - 1;
  mouse.y = -((event.clientY + yOffset) / Height) * 2 + 1;
  if (selectedObj) {
    selectedObj.userData.prev.copy(selectedObj.position);
    placePiece = true;
  }
});

document.getElementById("rotateX").addEventListener("click", () => {
  if (selectedObj) {
    selectedObj.userData.offset.x += Math.PI / 2;
    selectedObj.rotation.x += Math.PI / 2;
    if (selectedObj.rotation.y == Math.PI) {
      // selectedObj.position.z = selectedObj.position.z -20
    }
  }
});
document.getElementById("rotateY").addEventListener("click", () => {
  if (selectedObj) {
    selectedObj.userData.offset.y += Math.PI / 2;
    selectedObj.rotation.y += Math.PI / 2;
    if (selectedObj.rotation.y == Math.PI) {
      // selectedObj.position.z = selectedObj.position.z -20
    }
  }
});
document.getElementById("rotateZ").addEventListener("click", () => {
  if (selectedObj) {
    selectedObj.userData.offset.z += Math.PI / 2;
    selectedObj.rotation.z += Math.PI / 2;
    if (selectedObj.rotation.y == Math.PI) {
      // selectedObj.position.z = selectedObj.position.z -20
    }
  }
});
document.getElementById("place").addEventListener("click", () => {
  if (selectedObj) {
    selectedObj.userData.prev.copy(selectedObj.position);
    placePiece = true;
    console.log(selectedObj.userData.prev.distanceTo(puzzleBox[0].position));
  }
});

// window.addEventListener( 'resize', onWindowResize, false );

// function onWindowResize(){

//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();

//     renderer.setSize( window.innerWidth, window.innerHeight );

// }

//#endregion
