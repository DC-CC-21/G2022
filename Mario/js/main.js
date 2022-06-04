console.log("Main is Loading...");

//program for creating mario worlds

//#region Canvas
const canvas = document.getElementById("svgCanvas");
canvas.style.margin = "auto";
const c = new Canvas(canvas, window.innerWidth, window.innerHeight, true);
const pointSize = document.getElementById("pointSize");
//#endregion

const errorContainer = document.getElementById("errorContainer");
window.onerror = function (error, source, lineno, colno, err) {
  errorContainer.style.display = 'block'
  let info = {
    error: error,
    source: source,
    line: lineno,
    column: colno,
    err: err,
  };
  let el = document.createElement("li");
  Object.keys(info).forEach((key) => {
    let li = document.createElement("p");
    li.innerHTML = `${key}: ${info[key]}`;
    el.append(li);
  });
  errorContainer.append(el);
};
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
let points = [];
let level = 2;
let WorldWidth = 0;
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

    c.image(
      `assets/${this.type} Arrow.svg`,
      this.x,
      this.y,
      this.w,
      this.h,
      true
    );
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

let worldPoints = [
  [
    { x: 3, y: 307 + 174 },
    { x: 106, y: 305 + 174 },
    { x: 212, y: 311 + 174 },
    { x: 263, y: 331 + 174 },
    { x: 307, y: 383 + 174 },
    { x: 353, y: 412 + 174 },
    { x: 412, y: 408 + 174 },
    { x: 445, y: 411 + 174 },
    { x: 470, y: 409 + 174 },
    { x: 754, y: 416 + 174 },
    { x: 790, y: 415 + 174 },
    { x: 819, y: 410 + 174 },
    { x: 850, y: 414 + 174 },
    { x: 873, y: 418 + 174 },
    { x: 905, y: 408 + 174 },
    { x: 928, y: 414 + 174 },
    { x: 947, y: 425 + 174 },
    { x: 995, y: 428 + 174 },
    { x: 1035, y: 423 + 174 },
    { x: 1074, y: 410 + 174 },
    { x: 1158, y: 408 + 174 },
    { x: 1197, y: 418 + 174 },
    { x: 1230, y: 445 + 174 },
    { x: 1405, y: 444 + 174 },
  ],
  [
    { x: 0, y: 605 },
    { x: 56, y: 649 },
    { x: 112, y: 647 },
    { x: 168, y: 622 },
    { x: 224, y: 605 },
    { x: 280, y: 597 },
    { x: 336, y: 607 },
    { x: 392, y: 572 },
    { x: 448, y: 538 },
    { x: 504, y: 531 },
    { x: 560, y: 504 },
    { x: 616, y: 472 },
    { x: 672, y: 443 },
    { x: 728, y: 454 },
    { x: 784, y: 471 },
    { x: 840, y: 504 },
    { x: 896, y: 504 },
    { x: 952, y: 487 },
    { x: 1008, y: 487 },
    { x: 1064, y: 504 },
    { x: 1120, y: 466 },
    { x: 1176, y: 412 },
    { x: 1232, y: 387 },
    { x: 1288, y: 377 },
    { x: 1344, y: 344 },
    { x: 1400, y: 343 },
    { x: 1456, y: 405 },
    { x: 1512, y: 438 },
    { x: 1568, y: 448 },
    { x: 1624, y: 479 },
  ],
  [
    {x: 0, y: 562},
    {x: 88, y: 589},
    {x: 176, y: 599},
    {x: 264, y: 599},
    {x: 352, y: 581},
    {x: 440, y: 562},
    {x: 528, y: 562},
    {x: 704, y: 562},
    {x: 792, y: 543},
    {x: 880, y: 524},
    {x: 968, y: 487},
    {x: 1056, y: 487},
    {x: 1144, y: 478},
    {x: 1232, y: 460},
    {x: 1320, y: 431},
    {x: 1408, y: 412},
    {x: 1496, y: 412},
    {x: 1584, y: 412},
    {x: 1672, y: 431},
    {x: 1760, y: 449},
    {x: 1848, y: 468},
    {x: 1936, y: 468},
    {x: 2024, y: 450},
    {x: 2112, y: 449},
    {x: 2200, y: 449},
    {x: 2288, y: 468},
    {x: 2376, y: 449},
    {x: 2464, y: 412},
    {x: 2552, y: 376},
    {x: 2640, y: 356},
    {x: 2728, y: 356},
    {x: 2816, y: 337},
    {x: 2904, y: 319},
    {x: 2992, y: 318},
    {x: 3080, y: 318},
    {x: 3168, y: 374},
    {x: 3256, y: 393},
    {x: 3344, y: 412},
    {x: 3432, y: 414},
    {x: 3520, y: 431},
    {x: 3520, y: 31},
  ],
];

function createWorld(worldPoints) {
  worldPoints.forEach((point) => points.push(new Point(point)));
}

//setup objects
let blocks = [
  new Block(444+52.5, 405, { w: blockSize, h: blockSize }, ["regular"], {
    x: 0,
    y: 0,
  }),
  new Block(444+102.5, 405, { w: blockSize, h: blockSize }, ["regular"], {
    x: 0,
    y: 0,
  }),
  new Block(444+152.5, 405, { w: blockSize, h: blockSize }, ["regular"], {
    x: 0,
    y: 0,
  }),
  new Block(180, 290, { w: blockSize * 3, h: blockSize / 2 }, ["moving", "v"], {
    x: 0,
    y: 1,
  }),
  
  new Block(
    300,
    300,
    { w: blockSize * 3, h: blockSize / 2 },
    [
      "path",
      {
        pathway: [
          [300, 300],
          [140, 140],
          [570, 200],
          [800, 300],
          [1600, 350],
        ],
        startIndex: 0,
        amount: 0.01,
        error: 10,
        speed: 2,
      },
    ],
    {
      x: 0,
      y: 1,
    }
  ),
];
let coins = [new Coin(200, 200, blockSize)];
let p = new Player(blockSize);

let x = 0;

createWorld(worldPoints[level]);//create point list
WorldWidth = points[points.length-1].x
console.log(points[points.length-1].x)

draw = function () {

  c.background();
  c.image("assets/Bground1.jpg", 0, 0, 1680, Height, false, true);
  c.image("assets/land1.png",0,0,points.at(-1).x, Height, false,false)
  x += 1;
  // c.rect(x, 100, 100, 100);

  // connectTheDots(points);
  // points.forEach((point) => point.display());
  coins.forEach((coin) => coin.display());
  blocks.forEach((block) => block.display());
  p.move(points, blocks, coins);
  p.display();

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

  c.rect(mouseX-c.cameraPos.x, mouseY, blockSize, blockSize)
  c.text(mouseX-c.cameraPos.x+", "+mouseY, mouseX-c.cameraPos.x, mouseY)
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
