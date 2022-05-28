
console.log("Main is Loading...");

//program for creating mario worlds

//#region Canvas
const canvas = document.getElementById("svgCanvas");
canvas.style.margin = "auto";
const c = new Canvas(canvas, window.innerWidth, window.innerHeight, true);
const pointSize = document.getElementById("pointSize");
//#endregion

const mapWidth = 746;
const mapHeight = 706;
pointSize.value = 10;
let collectedCoins = 0;

//#region document elements
const dispPSize = document.getElementById("currentPSize");
const CWidth = document.getElementById("CWidth");
const CHeight = document.getElementById("CHeight");
const maxAValue = document.getElementById("maxAValue");
//#endregion

//#region constants
const blockSize = c.map(50, 0, 706, 0, Height);

//junk
let G = c.map(0.35, 0, 706, 0, Height);
let MAX_ANGLE = 60;
let mouseX = 0;
let mouseY = 0;
let mouseT = [];
let mouseIsPressed = false;
let keys = [];
//#endregion

class Point {
  constructor(x, y) {
    // console.ltypeof x);
    if (typeof x == "object") {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y;
    }
    this.x = ~~c.map(this.x, 0, 706, 0, Height);
    this.y = ~~c.map(this.y, 0, 706, 0, Height);
    this.radius = Number(pointSize.value);
    this.isHovered = false;
  }

  display() {
    if (this.clicked) {
      c.fill(255, 0, 0);
    } else if (this.isHovered) {
      c.fill(0, 0, 255);
    } else {
      c.fill(0, 255, 0);
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
    c.fill("#deac69");
    c.stroke("#deac69");
    c.strokeWeight(1);
    c.polygon(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y,
      points[i + 1].x,
      Height,
      points[i].x,
      Height
    );

    c.stroke(0, 255, 0);
    c.strokeWeight(10);
    c.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
  }
}

class Controls {
  constructor(x, y, type) {
    this.x = x; //c.map(x,0, 746,0,Width);
    this.y = y;
    this.w = c.map(70, 0, 706, 0, Height);
    this.h = c.map(70, 0, 706, 0, Height);

    this.pressed = false;
    this.type = type;
    this.textSize = (this.w + this.h) / 5;
  }
  drawControls() {
    // c.fill(0, 255, 0,0);
    // c.rect(this.x, this.y, this.w, this.h);

    c.image(`assets/${this.type} Arrow.svg`, this.x, this.y, this.w, this.h, true);
  }
  isin(mX, mY) {
    return (
      mX > this.x && mX < this.x + this.w && mY > this.y && mY < this.y + this.h
    );
  }
}
//#region Buttons
const left = new Controls(
  c.map(30, 0, 706, 0, Height),
  c.map(600, 0, 706, 0, Height),
  "Left"
);
const right = new Controls(
  c.map(120, 0, 706, 0, Height),
  c.map(600, 0, 706, 0, Height),
  "Right"
);
const up = new Controls(
  Width - c.map(100, 0, 706, 0, Height),
  c.map(520, 0, 706, 0, Height),
  "Up"
);
const down = new Controls(
  Width - c.map(100, 0, 706, 0, Height),
  c.map(600, 0, 706, 0, Height),
  "Down"
);
const controlBtns = [left, right, up, down];
//#endregion

class PowerUp {}
class Enemey {}

// let points = [new Point(0, 300), new Point(100, 300), new Point(220, 280)];
let points = [
  new Point({ x: 3, y: 307 +174}),
  new Point({ x: 106, y: 305 +174}),
  new Point({ x: 212, y: 311 +174}),
  new Point({ x: 263, y: 331 +174}),
  new Point({ x: 307, y: 383 +174}),
  new Point({ x: 353, y: 412 +174}),
  new Point({ x: 412, y: 408 +174}),
  new Point({ x: 445, y: 411 +174}),
  new Point({ x: 470, y: 409 +174}),
  new Point({ x: 754, y: 416 +174}),
  new Point({ x: 790, y: 415 +174}),
  new Point({ x: 819, y: 410 +174}),
  new Point({ x: 850, y: 414 +174}),
  new Point({ x: 873, y: 418 +174}),
  new Point({ x: 905, y: 408 +174}),
  new Point({ x: 928, y: 414 +174}),
  new Point({ x: 947, y: 425 +174}),
  new Point({ x: 995, y: 428 +174}),
  new Point({ x: 1035, y: 423+174 }),
  new Point({ x: 1074, y: 410+174 }),
  new Point({ x: 1158, y: 408+174 }),
  new Point({ x: 1197, y: 418+174 }),
  new Point({ x: 1230, y: 445+174 }),
  new Point({ x: 1405, y: 444+174 }),
];
let blocks = [
  new Block(60, 350, { w: blockSize, h: blockSize }, ["regular"], {
    x: 0,
    y: 0,
  }),
  new Block(108, 350, { w: blockSize, h: blockSize }, ["regular"], {
    x: 0,
    y: 0,
  }),
  new Block(156, 350, { w: blockSize, h: blockSize }, ["regular"], {
    x: 0,
    y: 0,
  }),
  new Block(180, 290, { w: blockSize * 3, h: blockSize / 2 }, ["moving", "v"], {
    x: 0,
    y: 1,
  }),
  new Block(300, 300, { w: blockSize * 3, h: blockSize / 2 }, ['path',{
    pathway:[[100,300],[600,400],[300,200]],
    startIndex:0,
    amount:0.01,
    error:10,
    speed:2,
  }], {
    x: 0,
    y: 1,
  }),
];
let coins = [
  new Coin(200, 200, blockSize)
];

let p = new Player(blockSize);
let x = 0;

draw = function () {
  c.background("#00aaff");
  x += 1;
  // c.rect(x, 100, 100, 100);

  // c.image("assets/Bground1.jpg", 0, 0, points.at(-1).x,754);
  connectTheDots(points);
  points.forEach((point) => point.display());
  coins.forEach((coin) => coin.display());
  p.move(points, blocks, coins);
  p.display();

  blocks.forEach((block) => block.display());

  controlBtns.forEach((btn) => btn.drawControls());

  if (mouseIsPressed) {
    c.rect(100, 100, 100, 100);
  }

  // c.displayStats([
  //   JSON.stringify({width:Width, height:Height}),
  //   JSON.stringify(c.cameraPos),
  //   JSON.stringify(p),
  //   JSON.stringify({mouseX: mouseX, mouseY:mouseY}),
  //   JSON.stringify(mouseT),
  //   JSON.stringify(points.at(-1))
  // ])
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
