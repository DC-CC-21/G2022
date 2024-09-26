function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function configureSize(sprite) {
  let s = sprite.displayHeight / spriteSize.height;
  sprite.body.setSize(
    sprite.displayWidth,
    spriteSize.height * spriteBox.scaleY * s,
    true
  );
  sprite.displayWidth = spriteSize.width;
  sprite.displayHeight = spriteSize.height;
}
function lerp(value1, value2, amt) {
  return (value2 - value1) * amt + value1;
}
function freezeObject(obj) {
  obj.body.setVelocityY(0);
  obj.body.setAccelerationY(0);
  obj.body.setAllowGravity(false);
  obj.body.setImmovable(true);
}
function compareArr(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  } else
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      } else {
        continue;
      }
    }
  return true;
}
