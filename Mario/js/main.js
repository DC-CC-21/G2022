//program for creating mario worlds

//Constants
const canvas = document.getElementById("svgCanvas");
canvas.style.margin = "auto";

const c = new Canvas(canvas, window.innerWidth, window.innerHeight);
const pointSize = document.getElementById("pointSize");
pointSize.value = 1;

const dispPSize = document.getElementById("currentPSize");
const CWidth = document.getElementById("CWidth");
const CHeight = document.getElementById("CHeight");
const maxAValue = document.getElementById("maxAValue");

let MAX_ANGLE = 60;

let mouseX = 0;
let mouseY = 0;
let keys = [];

class Point {
  constructor(x, y) {
    console.log(typeof x)
    if(typeof x == "object"){
      this.x = x.x;
      this.y = x.y;
    } else{
      this.x = x;
      this.y = y;
    }
    this.radius = Number(pointSize.value);
    this.isHovered = false;
  }

  display() {
    if (this.isHovered) {
      c.fill(0, 255, 0);
    } else {
      c.fill(255);
    }

    c.strokeWeight(1);
    c.stroke(0);
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
function connectTheDots(points) {
  for (let i = 0; i < points.length - 1; i++) {
    c.fill("#deac69")
    c.stroke("#deac69")
    c.strokeWeight(1);
    c.polygon(points[i].x,points[i].y, points[i+1].x,points[i+1].y, points[i+1].x, Height,points[i].x, Height)

    c.stroke(0, 255, 0);
    c.strokeWeight(10);
    c.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
  }
}

class Player {
  constructor() {
    this.x = 50;
    this.y = 40;
    this.w = 10;
    this.h = this.w * 1.5;
    this.grav = 0;
    this.speed = 2;
  }
  display() {
    c.fill(255, 0, 0);
    c.rect(this.x - this.w / 2, this.y - 2.5, this.w, this.h);
  }
  move() {
    this.prevX = this.x;
    this.prevY = this.y;
    this.grav += 0.1;
    this.y += this.grav;
    this.canJump = false;

    for (let i = 0; i < points.length - 1; i++) {
      if (c.insideLineBounds(points[i], points[i + 1], this)) {
        let line = c.lineSlope(points[i], points[i + 1], this);
        let y = c.collideLine(line, this);
        if (c.dist(this.x, this.y, this.x, y) < this.h * 1.1) {
          this.grav = 0;
          this.y = y - this.h;
          this.canJump = true;
        }
        // break;
      }
    }

    if (keys["ArrowLeft"]) {
      this.x -= this.speed;
    }
    if (keys["ArrowRight"]) {
      this.x += this.speed;
    }
    if (keys["ArrowUp"] && this.canJump) {
      // this.grav -= 10;
      this.grav -= this.h * 0.2;
    }
  }
}

// let points = [new Point(0, 300), new Point(100, 300), new Point(220, 280)];
let points = [
  new Point({ x: 3, y: 307 }),
  new Point({ x: 106, y: 305 }),
  new Point({ x: 212, y: 311 }),
  new Point({ x: 263, y: 331 }),
  new Point({ x: 307, y: 383 }),
  new Point({ x: 353, y: 412 }),
  new Point({ x: 412, y: 408 }),
  new Point({ x: 445, y: 411 }),
  new Point({ x: 470, y: 409 }),
  new Point({ x: 754, y: 416 }),
  new Point({ x: 790, y: 415 }),
  new Point({ x: 819, y: 410 }),
  new Point({ x: 850, y: 414 }),
  new Point({ x: 873, y: 418 }),
  new Point({ x: 905, y: 408 }),
  new Point({ x: 928, y: 414 }),
  new Point({ x: 947, y: 425 }),
  new Point({ x: 995, y: 428 }),
  new Point({ x: 1035, y: 423 }),
  new Point({ x: 1074, y: 410 }),
  new Point({ x: 1158, y: 408 }),
  new Point({ x: 1197, y: 418 }),
  new Point({ x: 1230, y: 445 }),
  new Point({ x: 1405, y: 444 }),
];
let p = new Player();
let x = 0;

draw = function () {
  c.background("#00aaff");
  x += 1;
  c.rect(x, 100, 100, 100);

  connectTheDots(points);
  points.forEach((point) => point.display());

  p.move();
  p.display();

  c.textSize(500);

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

function updateAngle() {
  MAX_ANGLE = Number(maxAValue.value);
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

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  console.log(e.key);
  if (e.key == "a") {
    let a = [];
    points.forEach((point) => a.push({ x: point.x, y: point.y }));
    console.log(JSON.stringify(a));
  }
  if (e.key == " ") {
    for (let i = 0; i < points.length - 1; i++) {
      if (mouseX > points[i].x && mouseX < points[i + 1].x) {
        points.splice(i + 1, 0, new Point(mouseX, mouseY));
      }
    }
  }
  if (e.key == "Delete") {
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
