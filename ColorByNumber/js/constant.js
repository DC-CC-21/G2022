import * as THREE from '../three/src/Three.js'
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
  c.castShadow = true;
  c.receiveShadow = false;
  scene.add(c);
  return c;
}
function plane(scene, pos, dim, color, cast, receive) {
  let geo = new THREE.PlaneGeometry(dim[0], dim[1]);
  let mat = new THREE.MeshPhongMaterial({ color: color });
  let p = new THREE.Mesh(geo, mat);
  p.position.set(pos.x, pos.y, pos.z);
  p.rotation.x = -90 / (180 / Math.PI);
  p.receiveShadow = true;
  p.castShadow = true;
  scene.add(p);

  return p;
}

//trig
function cos(deg){
  return Math.cos(deg/(180/Math.PI))
}
function sin(deg){
  return Math.sin(deg/(180/Math.PI))
}

export{
  dist,
  getNormalRotation,

  //geo
  cube,
  plane,

  //trig
  sin,
  cos
  }
