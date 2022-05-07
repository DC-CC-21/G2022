//program for creating mario worlds

//Constants
const canvas = document.getElementById("svgCanvas");
canvas.style.margin = "auto";

const c = new Canvas(canvas, window.innerWidth, window.innerHeight);
const pointSize = document.getElementById("pointSize");
const dispPSize = document.getElementById("currentPSize");
const CWidth = document.getElementById("CWidth");
const CHeight = document.getElementById("CHeight");

let mouseX = 0;
let mouseY = 0;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = pointSize.value;
    this.isHovered = false;
  }

  display() {
    if (this.isHovered) {
      c.fill(0, 255, 0);
    } else {
      c.fill(255);
    }
    c.ellipse(this.x, this.y, this.radius, this.radius);
  }

  isin(e) {
    return c.dist(this.x, this.y, e.offsetX, e.offsetY) < this.radius;
  }

  hover(e) {
    if (this.clicked) {
      this.isHovered = true;
      this.x = e.offsetX;
      this.y = e.offsetY;
    }
    if (this.isin(e)) {
      this.isHovered = true;
      return;
    }
    this.isHovered = false;
    // return;
  }

  press(e) {
    if (this.clicked) {
      return;
    }
    if (this.isin(e)) {
      this.clicked = true;
      return true;
    }
  }
  release() {
    this.clicked = false;
  }
}

let points = [];
let x = 0;
draw = function () {
  c.background("#00aaff");
  x += 1;
  c.rect(x, 100, 100, 100);
  for (let i = 0; i < points.length; i++) {
    points[i].display();
    if (i < points.length - 1) {
      c.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);

      if (mouseX > points[i].x && mouseX < points[i + 1].x) {
        let y = c.slope(points[i], points[i + 1], mouseX);
        c.ellipse(mouseX, y, 20, 20);
      }
    }
  }
};

//Onchange events
function updatePsize() {
  points.forEach((point) => (point.radius = pointSize.value));
  dispPSize.innerHTML = pointSize.value;
}
function updateCSize() {
  canvas.style.width = CWidth.value + "px";
  canvas.style.height = CHeight.value + "px";
}

//Listeners
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
  for (let i = 0; i < points.length; i++) {
    if (points[i].press(e)) {
      return;
    }
  }
});
document.addEventListener("mouseup", () => {
  points.forEach((point) => {
    point.release();
  });
});

document.addEventListener("keydown", () => {
  for (let i = 0; i < points.length-1; i++) {
    if (mouseX > points[i].x && mouseX < points[i + 1].x) {
      points.splice(i+1, 0, new Point(mouseX, mouseY));
    }
  }
});
