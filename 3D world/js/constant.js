import * as THREE from "../three/src/Three.js";

//setup scene and render
function createCamera(width, height) {
  return new THREE.PerspectiveCamera(
    75,
    width/height,
    0.1,
    1000
  );
}
function createRenderer(container, width, height) {
  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  return renderer;
}

function directionLight(scene, position, intensity=1, helper=false) {
  let light = new THREE.DirectionalLight(0xffffff, intensity);
  light.position.set(position[0], position[1], position[2]); //default; light shining from top

  let t = new THREE.Object3D();
t.position.set(0,0,0)
  light.target = t
  //Set up shadow properties for the light
  light.castShadow = true; // default false
  light.shadow.mapSize.width = 512; // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 0.5; // default
  light.shadow.camera.far = 500; // default
  scene.add(light);



  if(helper){
    helper = new THREE.DirectionalLightHelper( light, 50 );
    scene.add( helper )
  }

  return light;
}
function AmbientLight(scene, intensity) {
  const ambientLight = new THREE.AmbientLight("#ffffff", intensity);
  scene.add(ambientLight);
  return ambientLight;
}
function PointLight(scene, color, intensity, decay) {
  const light = new THREE.PointLight(color, intensity, 100 , decay);
  light.position.set(10000,10000,10000 );
  scene.add(light)
  return light;
}

function loadEquirectangular(scene, src) {
  const equirectangular = new THREE.TextureLoader().load(src);
  equirectangular.mapping = THREE.EquirectangularReflectionMapping;

  // Things Github Copilot suggested, removing it does not change colors so I thing it's not the problem
  equirectangular.magFilter = THREE.LinearFilter;
  equirectangular.minFilter = THREE.LinearMipMapLinearFilter;
  equirectangular.format = THREE.RGBAFormat;
  equirectangular.encoding = THREE.sRGBEncoding;
  equirectangular.anisotropy = 16;

  scene.background = equirectangular;
}

//random
function dist(vec1, vec2) {
  let x = vec1.x - vec2.x;
  let y = vec1.y - vec2.y;
  let z = vec1.z - vec2.z;
  return Math.sqrt(x * x + y * y + z * z);
}

function getNormalRotation(
  intersects,
  position = new THREE.Vector3(),
  n = new THREE.Vector3(),
  lookAt = new THREE.Vector3()
) {
  let i0 = intersects;
  let obj = i0.object;
  position.copy(i0.point);
  n.copy(i0.face.normal);
  n.transformDirection(obj.matrixWorld);
  lookAt.copy(position).add(n);
  return [position, lookAt];
}

//geometry
function cube(scene, pos, dim, color, cast, receive) {
  let geometry = new THREE.BoxGeometry(dim[0], dim[1], dim[2]);
  let material = new THREE.MeshPhongMaterial({ color: color });
  let c = new THREE.Mesh(geometry, material);
  c.position.set(pos.x, pos.y, pos.z);
  c.castShadow = cast;
  c.receiveShadow = receive;
  scene.add(c);
  return c;
}
function plane(scene, pos, dim, color, cast, receive) {
  let geo = new THREE.PlaneGeometry(dim[0], dim[1]);
  let mat = new THREE.MeshPhongMaterial({ color: color });
  let p = new THREE.Mesh(geo, mat);
  p.position.set(pos.x, pos.y, pos.z);
  p.rotation.x = -90 / (180 / Math.PI);
  p.receiveShadow = receive;
  p.castShadow = cast;
  scene.add(p);

  return p;
}

//trig
function cos(deg) {
  return Math.cos(deg / (180 / Math.PI));
}
function sin(deg) {
  return Math.sin(deg / (180 / Math.PI));
}

export {
  //setup scene and render
  createCamera,
  createRenderer,
  directionLight,
  AmbientLight,
  PointLight,
  loadEquirectangular,
  //random
  dist,
  getNormalRotation,
  //geo
  cube,
  plane,
  //trig
  sin,
  cos,
};
