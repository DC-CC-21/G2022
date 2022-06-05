console.log("Loading Controls...");

let addType = 'block'


//Listeners
function updatePoint(e) {
  for (let i = 0; i < points.length; i++) {
    if (points[i].press(e)) {
    }
  }
}
function releasePoint() {
  points.forEach((point) => {
    point.release();
  });
}

const touchC = document.getElementById("touchContainer");
//#region mouse events
document.addEventListener("dblclick", (e) => {
  points.push(new Point(e.offsetX, e.offsetY));
});
document.addEventListener("mousemove", (e) => {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
  for (let i = 0; i < points.length; i++) {
    points[i].hover(e);
  }
});
document.addEventListener("mousedown", (e) => {
  updatePoint(e);
});
document.addEventListener("mouseup", () => {
  releasePoint();
});
//#endregion

//#region touch events
document.addEventListener("touchstart", (e) => {
  mouseT = e.touches;
  mouseIsPressed = true;
});
document.addEventListener("touchmove", (e) => {
  mouseT = e.touches;
});
document.addEventListener("touchend", (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  mouseT = e.touches;
});
document.addEventListener("touchcancel", (e) => {});
//#endregion

//#region key events
document.addEventListener("keydown", (e) => {
  if (e.key == "a") {
    e.preventDefault();
    let a = [];
    points.forEach((point) => a.push({ x: point.x, y: point.y }));
    console.log(JSON.stringify(a));
  }
  if (e.key == " ") {
    e.preventDefault();
    for (let i = 0; i < points.length - 1; i++) {
      if (mouseX > points[i].x && mouseX < points[i + 1].x) {
        points.splice(i + 1, 0, new Point(mouseX, mouseY));
      }
    }
  }
  if (e.key == "Delete") {
    e.preventDefault();
    for (let i = 0; i < points.length - 1; i++) {
      if (mouseX > points[i].x && mouseX < points[i + 1].x) {
        points.splice(i + 1, 1);
      }
    }
  }
  if (e.key == "b") {
    console.log(mouseX, mouseY);
    blocks.push(
      new Block(
        mouseX,
        mouseY,
        {
          w: Number(document.getElementById('BWidth').value),
          h: Number(document.getElementById('BHeight').value)
          },
        ["regular"],
        {
          x: 0,
          y: 1,
        }
      )
    );
    console.log(blocks.length);
  }
  console.log(e.key);
  keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});
//#endregion

//create
