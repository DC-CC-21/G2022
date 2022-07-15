//imports
import * as THREE from "../3D world/three/src/Three.js";
import { OrbitControls } from "../3D world/three/examples/jsm/controls/OrbitControls.js";
import { DragControls } from "../3D world/three/examples/jsm/controls/DragControls.js";
import { GLTFLoader } from "../3D world/three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "../3D world/three/examples/jsm/loaders/DRACOLoader.js";
import * as ct from "../3D world/js/constant.js";
import { cube, plane } from "../3D world/js/constant.js";
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
// controls.enablePan = false;
// controls.enableZoom = false;

const renderer = ct.createRenderer(canvas);
const dLight = ct.directionLight(scene, [10, 10, -10]);
const aLight = ct.AmbientLight(scene, 10);

let cube1 = cube(scene, { x: 0, y: 0, z: 0 }, [2, 2, 2], 0x00aaff, true, true);

camera.position.z = 55;
const draggableObjs = [];
let puzzleBox = [];
///////////////////////////////
const loader = new GLTFLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
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
      
      if(modelName.includes('Target')){
      model.material.transparent = true;
      model.material.opacity = 0;
      }
      const box = new THREE.Box3();
      box.copy(model.geometry.boundingBox).applyMatrix4(model.matrixWorld);
      const helper = new THREE.Box3Helper(box, 0xffff00);
      model.add(helper);

      if (Object.keys(data).length) {
        Object.keys(data).forEach((key) => {
          model.userData[key] = data[key];
        });
      }
      if (draggableObjs) {
        draggableObjs.push(model);
      }
      // gltf.animations; // Array<THREE.AnimationClip>
      // gltf.scene; // THREE.Group
      // gltf.scenes; // Array<THREE.Group>
      // gltf.cameras; // Array<THREE.Camera>
      // gltf.asset; // Object
      loadingDiv.removeChild(document.getElementById(modelName));
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
  rotation: { x: 0, y: -Math.PI/2, z: 0 },
});
loadModel(loader, "assets/Target3.glb", "Target3", puzzleBox, scene, {
  rotation: { x: 0, y: -Math.PI/2, z: 0 },
});
loadModel(loader, "assets/Target4.glb", "Target4", puzzleBox, scene, {
  rotation: { x: Math.PI/2, y: 0, z: 0 },
});
loadModel(loader, "assets/Target5.glb", "Target5", puzzleBox, scene, {
  rotation: { x: Math.PI/2, y:0, z: 0 },
});
loadModel(loader, "assets/Target6.glb", "Target6", puzzleBox, scene, {
  rotation: { x: Math.PI/2, y: 0, z: 0 },
});
loadModel(loader, "assets/Target7.glb", "Target7", puzzleBox, scene, {
  rotation: { x: Math.PI/2, y:0, z: 0 },
});
loadModel(loader, "assets/Target8.glb", "Target7", puzzleBox, scene, {
  rotation: { x: 0, y:0, z: 0 },
});

//pieces
loadModel(loader, "assets/piece1.glb", "piece1", draggableObjs, scene, {
  offset: {
    x: 0,
    y: 0,
    z: 0,
  },
  prev:new THREE.Vector3(0,0,0)
});
loadModel(loader, "assets/piece2.glb", "piece5", draggableObjs, scene, {
  offset: {
    x: 0,
    y: 0,
    z: 0,
  },
  prev:new THREE.Vector3(0,0,0)
});

// Load a glTF resource
// loader.load(
//   // resource URL
//   "./assets/WoodenBlock.glb",
//   // called when the resource is loaded
//   function (gltf) {
//     const box = gltf.scene.children[0];
//     box.castShadow = true;
//     box.receiveShadow = true;
//     // box.userData.draggable = true;
//     box.userData.name = "PuzzleBox";
//     scene.add(box);

//     // gltf.animations; // Array<THREE.AnimationClip>
//     // gltf.scene; // THREE.Group
//     // gltf.scenes; // Array<THREE.Group>
//     // gltf.cameras; // Array<THREE.Camera>
//     // gltf.asset; // Object
//   },
//   // called while loading is progressing
//   function (xhr) {
//     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
//     document.getElementById("3dBox").innerHTML = `Loading Box ${(
//       (xhr.loaded / xhr.total) *
//       100
//     ).toFixed(2)}% loaded`;
//   },
//   // called when loading has errors
//   function (error) {
//     console.log("An error happened");
//   }
// );
// // Load a glTF resource
// loader.load(
//   // resource URL
//   "./assets/piece2.glb",
//   // called when the resource is loaded
//   function (gltf) {
//     console.log(gltf);
//     const piece1 = gltf.scene.children[0];
//     piece1.castShadow = true;
//     piece1.receiveShadow = true;
//     piece1.userData.draggable = true;
//     piece1.userData.name = "Piece1";
//     scene.add(piece1);
//     draggableObjs.push(piece1);
//     console.log(piece1);

//     // gltf.animations; // Array<THREE.AnimationClip>
//     // gltf.scene; // THREE.Group
//     // gltf.scenes; // Array<THREE.Group>
//     // gltf.cameras; // Array<THREE.Camera>
//     // gltf.asset; // Object
//   },
//   // called while loading is progressing
//   function (xhr) {
//     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
//     document.getElementById("3dPiece1").innerHTML = `Loading Piece1 ${(
//       (xhr.loaded / xhr.total) *
//       100
//     ).toFixed(2)}% loaded`;
//   },
//   // called when loading has errors
//   function (error) {
//     console.log("An error happened");
//   }
// );

/////////////////////////////
console.log(dLight);
let placePiece = false


function animate() {
  controls.update();
  dLight.position.set(camera.position.x, camera.position.y, camera.position.z);
  cube1.rotation.x += 0.01;
  cube1.rotation.y += 0.01;
  if(placePiece){
    place()
  }
  // cube1.rotation.z += 0.01;
  //   if(!controls.enabled){dragObj();}
  // if(draggableObjs.length > 1){
  // draggableObjs[1].rotation.z += 0.01;}
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

console.log(new THREE.Vector3(1,10,5.5).distanceTo(new THREE.Vector3(1,10,5.5)), '💩')
function place(){
  if (selectedObj.userData.prev.distanceTo(puzzleBox[0].position) < 1 && selectedObj.position.z-puzzleBox[7].position.z > 0) {
    selectedObj.position.z -= 0.5
  } else if (selectedObj.userData.prev.distanceTo(puzzleBox[7].position) < 1 && selectedObj.position.z-puzzleBox[0].position.z < 0) {
    selectedObj.position.z += 0.5
  }
}

//Listeners
let dIntensity = document.getElementById("dlight");
let aIntensity = document.getElementById("alight");
let rotation = document.getElementById("rotation");

dIntensity.addEventListener("change", () => {
  updateLights(dLight, dIntensity.value);
});
aIntensity.addEventListener("change", () => {
  updateLights(aLight, aIntensity.value);
});
rotation.addEventListener("click", () => {
  controls.enabled = rotation.checked;
});
function updateLights(light, i) {
  light.intensity = i;
}

// /++

// const clickMouse = new THREE.Vector2();
const moveMouse = new THREE.Vector2();
// let draggableObj;
// const raycaster = new THREE.Raycaster();
animate();
// window.addEventListener("mousedown", (event) => {
//   if (draggableObj) {
//     draggableObj = null;
//     return;
//   }

//   clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//   raycaster.setFromCamera(clickMouse, camera);
//   const found = raycaster.intersectObjects(scene.children);
//   if (found.length > 0 && found[0].object.userData.draggable) {
//     draggableObj = found[0].object;
//     console.log(`Found draggable ${found[0].object.name}`);
//   }
// });

// window.addEventListener('mouseup', ()=>{
//     draggableObj = null;
// })

// window.addEventListener("mousemove", (event) => {
//   moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
// });
// function dragObj() {
//   if (draggableObj != null) {
//     raycaster.setFromCamera(moveMouse, camera);
//     const found = raycaster.intersectObjects(scene.children);
//     if (found.length > 0) {
//       for (let obj of found) {
//         // if (obj.object.userData.name == 'PuzzleBox') continue;
//         draggableObj.position.x = obj.point.x
//         if(obj.object.userData.name == 'PuzzleBox') draggableObj.position.y = obj.point.y
//         draggableObj.position.z = obj.point.z
//       }
//     }
//   }
// }

const dragControls = new DragControls(
  draggableObjs,
  camera,
  renderer.domElement
);

let selectedObj = false;
let mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let target = new THREE.Vector3(0, 0, 0);
;

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

dragControls.addEventListener("drag", (event) => {
  changeObjectColor(event);

  event.object.lookAt(target);

  raycaster.setFromCamera(mouse, camera);
  const found = raycaster.intersectObjects(puzzleBox);
  if (found.length > 0) {
    let intersect = found[0];
    if (intersect) {
      target.copy(intersect.point);
      console.log(intersect);
      console.log(intersect.object.userData.name);
      // event.object.position.copy(intersect.point).add(intersect.face.normal);
      if (intersect.object) {
        event.object.position.copy(intersect.object.position);
        event.object.rotation.x = intersect.object.userData.rotation.x+event.object.userData.offset.x;
        event.object.rotation.y = intersect.object.userData.rotation.y+event.object.userData.offset.y;
        event.object.rotation.z = intersect.object.userData.rotation.z+event.object.userData.offset.z;
      }

      // event.object.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
    }
  }
});

function dist(vec1, vec2) {
  let x = vec1.x - vec2.x;
  let y = vec1.y - vec2.y;
  let z = vec1.z - vec2.z;
  return Math.sqrt(x * x + y * y + z * z);
}
function map(value, istart, istop, ostart, ostop) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

document.addEventListener("mousedown", (event) => {
  placePiece = false;
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

document.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
document.addEventListener("touchmove", (event) => {
  mouse.x = (event.touches[0].clientX / Width) * 2 - 1;
  mouse.y = -(event.touches[0].clientY / Height) * 2 + 1;
});
document.addEventListener("mouseup", (event) => {
  
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  if (selectedObj) {
    selectedObj.userData.prev.copy(selectedObj.position)
    placePiece = true;
  }
});

document.getElementById("rotateX").addEventListener("click", () => {
  if (selectedObj) {
    selectedObj.userData.offset.x+=Math.PI/2;
    selectedObj.rotation.x+=Math.PI/2;
    if (selectedObj.rotation.y == Math.PI) {
      // selectedObj.position.z = selectedObj.position.z -20
    }
  }
});
document.getElementById("rotateY").addEventListener("click", () => {
  if (selectedObj) {
    selectedObj.userData.offset.y+=Math.PI/2;
    selectedObj.rotation.y+=Math.PI/2;
    if (selectedObj.rotation.y == Math.PI) {
      // selectedObj.position.z = selectedObj.position.z -20
    }
  }
});
document.getElementById("rotateZ").addEventListener("click", () => {
  if (selectedObj) {
    selectedObj.userData.offset.z+=Math.PI/2;
    selectedObj.rotation.z+=Math.PI/2;
    if (selectedObj.rotation.y == Math.PI) {
      // selectedObj.position.z = selectedObj.position.z -20
    }
  }
});
document.getElementById("place").addEventListener("click", () => {
  if (selectedObj) {
    selectedObj.userData.prev.copy(selectedObj.position)
    placePiece = true;
    console.log(selectedObj.userData.prev.distanceTo(puzzleBox[0].position))
  }
  
});
