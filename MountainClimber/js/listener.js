console.log("Loading Controls...");

//Listeners
function updatePoint(e) {
  for (let i = 0; i < points.length; i++) {
    if (points[i].press(mouseX, mouseY)) {
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
touchC.addEventListener("dblclick", (e) => {
  points.push(new Point(e.offsetX, e.offsetY));
});
touchC.addEventListener("mousemove", (e) => {
  mouseX = e.offsetX-c.cameraPos.x;
  mouseY = e.offsetY-c.cameraPos.y;
  for (let i = 0; i < points.length; i++) {
    points[i].hover(mouseX, mouseY);
  }
});
touchC.addEventListener("mousedown", (e) => {
  updatePoint(e);
});
touchC.addEventListener("mouseup", () => {
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



  keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});
//#endregion



//create

