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
let keys = [];

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
    c.ellipse(this.x, this.y, this.w, this.h);
  }
  move() {
    this.prevX = this.x;
    this.prevY = this.y;
    this.grav += 0.1;
    this.y += this.grav;
    this.canJump = false;

    for (let i = 0; i < points.length - 1; i++) {
      if (this.x >= points[i].x && this.x <= points[i + 1].x) {
        let angle = c.getAngle(points[i], points[i + 1]) * (180 / Math.PI);
        if (angle > -45 && angle < 45) {
          let y = c.slope(points[i], points[i + 1], this.x - ~~(this.w / 2));
          if (this.prevY < y[0]) {
            if (this.y + this.h > y[0] && this.y + this.h < y[0] + this.h) {
              this.y = y[0] - this.h;
              this.grav = 0;
              this.canJump = true;
            }
          }
        }
      } else if (this.x >= points[i + 1].x && this.x <= points[i].x) {
        let angle = c.getAngle(points[i], points[i + 1]) * (180 / Math.PI);
        if (angle > -45 && angle < 45) {
          if (this.prevY > y[0]) {
            if (this.y - this.h < y[0] && this.y - this.h > y[0] - this.h) {
              this.y = y[0] + this.h;
              this.grav = 0;
            }
          }
        }
      }
    }

    if (keys["ArrowLeft"]) {
      this.x -= this.speed;
    }
    if (keys["ArrowRight"]) {
      this.x += this.speed;
    }

    for (let i = 0; i < points.length - 1; i++) {
      if (this.y >= points[i].y && this.y <= points[i + 1].y) {
        let angle =
          c.getAngle(points[i], points[i + 1], this.x) * (180 / Math.PI);

        if (angle >= 45) {
          let x = c.slope2(points[i], points[i + 1], this.y);
          if (
            this.x - this.w > x[0] - this.speed * 1.5 &&
            this.x - this.w < x[0]
          ) {
            this.x = x[0] + this.w;
            // this.y = this.prevY;
            this.grav -= 0.05;
          }
        }
      } else if (this.y > points[i + 1].y && this.y < points[i].y) {
        let angle =
          c.getAngle(points[i], points[i + 1], this.x) * (180 / Math.PI);

        if (angle <= -45) {
          let x = c.slope2(points[i], points[i + 1], this.y);
          if (
            this.x + this.w > x[0] &&
            this.x + this.w < x[0] + this.speed * 1.5
          ) {
            this.x = x[0] - this.w;
            this.grav -= 0.05;
          }
        }
      }
    }

    if (keys["ArrowUp"] && this.canJump) {
      this.grav -= this.h * 0.2;
    }
  }
  collide() {}
}

let points = [new Point(0, 200), new Point(100, 200)];
let p = new Player();
let x = 0;

draw = function () {
  c.background("#00aaff");
  x += 1;
  c.rect(x, 100, 100, 100);
  for (let i = 0; i < points.length; i++) {
    if (i < points.length - 1) {
      c.strokeWeight(5);
      c.stroke(0, 255, 0);
      c.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);

      let angle = c.getAngle(points[i], points[i + 1]);
      c.strokeWeight(1);
      c.stroke(0, 255);
      c.text(
        (angle * (180 / Math.PI)).toFixed(2),
        points[i + 1].x - 70,
        points[i + 1].y - 10
      );
      c.line(0, points[i + 1].y, canvas.clientWidth, points[i + 1].y);

      c.strokeWeight(1);
      if (mouseX > points[i].x && mouseX < points[i + 1].x) {
        let y = c.slope(points[i], points[i + 1], mouseX);
        c.fill(255, 255);
        c.ellipse(mouseX, y[0], 10, 10);
      }
      if (mouseY > points[i].y && mouseY < points[i + 1].y) {
        let x = c.slope2(points[i], points[i + 1], mouseY);
        c.fill(0, 255);
        c.ellipse(x[0], mouseY, 10, 10);
      }
    }
  }
  points.forEach((point) => point.display());
  c.stroke(1);

  p.move();
  p.collide();
  p.display();
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

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  console.log(e.key);
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
