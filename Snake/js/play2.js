Object.defineProperty(HTMLDivElement.prototype, "getPos", {
  value: function getPos() {
    function readPx(n) {
      return Number(n.replace(/px/g, ""));
    }
    return {
      x: readPx(this.style.left),
      y: readPx(this.style.top),
      width: readPx(this.style.width),
      height: readPx(this.style.height),
    };
  },
  writable: true,
  configurable: true,
});
Object.defineProperty(HTMLButtonElement.prototype, "getPos", {
  value: function getPos() {
    function readPx(n) {
      return Number(n.replace(/px/g, ""));
    }
    return {
      x: readPx(this.style.left),
      y: readPx(this.style.top),
      width: readPx(this.style.width),
      height: readPx(this.style.height),
    };
  },
  writable: true,
  configurable: true,
});
function Dist(x1, y1, x2, y2) {
  let x = x1 - x2;
  let y = y1 - y2;
  return Math.sqrt(x * x + y * y);
}
function Map(value, istart, istop, ostart, ostop) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}
function randomSpace() {
  return {
    x: ~~((Math.random() * SNAKE.width) / SNAKE.size) * SNAKE.size,
    y: ~~((Math.random() * SNAKE.height) / SNAKE.size) * SNAKE.size,
  };
}
function toGrid(value) {
  return ~~(value / SNAKE.size) * SNAKE.size;
}

const container = document.getElementById("container");
const grid = document.getElementById("grid");
const scoreContainer = document.getElementById("scoreContainer");
const score = document.getElementById("score");
const Hscore = document.getElementById("Hscore");

const canvasSize =
  window.innerWidth > window.innerHeight
    ? window.innerHeight
    : window.innerWidth;
console.log(canvasSize);
//602 706
let SNAKE = {
  width: Map(23 * 10, 0, 602, 0, window.innerWidth),
  height: Map(34 * 10, 0, 706, 0, window.innerHeight),
  size: Map(20, 0, 478, 0, canvasSize),
  startLen: 5,
  startCol: 5,
  startRow: 3,
  segmentGrow: 3,
  mode: "snake",
  trans: { x: 0, y: 0 },
  columns: 20,
  rows: 20,
};

console.log(window.innerWidth);
console.log(window.innerHeight);
if (window.innerWidth >= window.innerHeight) {
  SNAKE.height = window.innerHeight * 0.8;
  SNAKE.size = SNAKE.height / SNAKE.rows;
  SNAKE.width = SNAKE.columns * SNAKE.size;
} else {
  SNAKE.width = window.innerWidth * 0.8;
  SNAKE.size = SNAKE.width / SNAKE.columns;
  SNAKE.height = SNAKE.rows * SNAKE.size;
}
console.log(SNAKE);

// SNAKE.width = ~~(SNAKE.width / SNAKE.size) * SNAKE.size;
// SNAKE.height = ~~(SNAKE.height / SNAKE.size) * SNAKE.size;
// SNAKE.width = SNAKE.columns * SNAKE.size;
// SNAKE.width = SNAKE.rows * SNAKE.size;

let left = document.getElementById("left");
let right = document.getElementById("right");
let up = document.getElementById("up");
let down = document.getElementById("down");

let food = randomSpace();
let gameOver = false;

class SnakeGame {
  constructor() {}
  setHtml() {
    SNAKE.trans.x = (window.innerWidth - SNAKE.width) / 2;
    SNAKE.trans.y = (window.innerHeight - SNAKE.height) / 2;

    console.log(window.innerWidth);
    console.log(window.innerHeight);

    grid.style.left = SNAKE.trans.x + "px";
    grid.style.top = SNAKE.trans.y + "px";

    container.style.left = SNAKE.trans.x + "px";
    container.style.top = SNAKE.trans.y + "px";

    scoreContainer.style.left = SNAKE.trans.x + "px";
    scoreContainer.style.top = SNAKE.trans.y + "px";

    //buttons
    left.style.left = SNAKE.trans.x + "px";
    left.style.top = SNAKE.height + SNAKE.trans.y - 60 + "px";
    right.style.left = SNAKE.trans.x + 60 + "px";
    right.style.top = SNAKE.height + SNAKE.trans.y - 60 + "px";

    up.style.left = SNAKE.width + SNAKE.trans.x - 60 + "px";
    up.style.top = SNAKE.height + SNAKE.trans.y - 120 + "px";
    down.style.left = SNAKE.width + SNAKE.trans.x - 60 + "px";
    down.style.top = SNAKE.height + SNAKE.trans.y - 60 + "px";

    //score
    Hscore.innerHTML = Number(localStorage.getItem("Hscore")) || "0";
  }
  createGrid() {
    // for (let i = 0; i < SNAKE.width; i += SNAKE.size) {
    //   for (let j = 0; j < SNAKE.height; j += SNAKE.size) {
    //     this.segment(i, j, SNAKE.size, SNAKE.size, "grid");
    //   }
    // }
    grid.style.width = SNAKE.width + "px";
    grid.style.height = SNAKE.height + "px";
    grid.style.backgroundSize = `${SNAKE.size}px ${SNAKE.size}px`;
  }
}

let sg = new SnakeGame();
sg.setHtml();
sg.createGrid();

class Snake {
  constructor(vel) {
    this.segments = [];
    this.segments2 = [];
    this.startX = SNAKE.startCol * SNAKE.size;
    this.startY = SNAKE.startRow * SNAKE.size;
    this.vel = vel; //[SNAKE.size, 0];
    this.count = 0;

    // this.setHtml();

    this.createBody();
  }
  createBody() {
    for (let i = 0; i < SNAKE.startLen; i++) {
      this.segments.push({
        x: this.startX - i * SNAKE.size,
        y: this.startY,
        vel: this.vel,
      });
    }
  }

  segment(x, y, width, height, c) {
    let element = document.createElement("div");
    element.setAttribute("class", c);
    element.style.left = x + "px";
    element.style.top = y + "px";
    element.style.width = width + "px";
    element.style.height = height + "px";
    if (c === "grid") {
      grid.append(element);
    } else {
      container.append(element);
    }
  }
  display() {
    container.innerHTML = "";//delete to see another snake
    for (let i = 0; i < this.segments.length; i++) {
      if (i) {
        this.segment(
          this.segments[i].x,
          this.segments[i].y,
          SNAKE.size,
          SNAKE.size,
          "blocks"
        );
      } else {
        this.segment(
          this.segments[i].x,
          this.segments[i].y,
          SNAKE.size,
          SNAKE.size,
          "head"
        );
      }
    }
    this.segment(food.x, food.y, SNAKE.size, SNAKE.size, "food");
    this.move();
  }
  growTail() {
    for (let i = 0; i < SNAKE.segmentGrow; i++) {
      let tail = this.segments[this.segments.length - 1];
      this.segments.push({
        x:
          tail.x - tail.vel[0] < 0
            ? SNAKE.width - SNAKE.size / 2
            : tail.x - tail.vel[0] >= SNAKE.width
            ? 0
            : tail.x - tail.vel[0],

        y:
          tail.y - tail.vel[1] < 0
            ? SNAKE.height - SNAKE.size
            : tail.y - tail.vel[1] >= SNAKE.height
            ? 0
            : tail.y - tail.vel[1],

        vel: tail.vel,
      });
    }
  }
  move() {
    this.collideSegments();
    if (SNAKE.mode === "snake") {
      let head = this.segments[0];
      if (Dist(head.x, head.y, food.x, food.y) < 1) {
        this.growTail();
        food = randomSpace();
        score.innerHTML = this.segments.length;

        if (this.segments.length > Number(Hscore.innerHTML)) {
          localStorage.setItem("Hscore", score.innerHTML);
          let r = document.querySelector(":root");
          r.style.setProperty("--c", "rgb(0, 165, 22)");
          r.style.setProperty("--weight", "bolder");
        }
      }
      this.segments.pop();
    } else if (SNAKE.mode === "grow") {
      score.innerHTML = "Score: " + this.segments.length;
    }

    let oldHead = this.segments[0];
    let newHead = {
      x:
        oldHead.x + this.vel[0] < -0.1
          ? SNAKE.width - SNAKE.size
          : oldHead.x + this.vel[0] > SNAKE.width - SNAKE.size + 0.1
          ? 0
          : oldHead.x + this.vel[0],

      y:
        oldHead.y + this.vel[1] < -0.1
          ? SNAKE.height - SNAKE.size
          : oldHead.y + this.vel[1] > SNAKE.height - SNAKE.size + 0.1
          ? 0
          : oldHead.y + this.vel[1],
      vel: this.vel,
    };
    this.segments.unshift({
      x: newHead.x,
      y: newHead.y,
      vel: newHead.vel,
    });
  }
  collideSegments() {
    let head = this.segments[0];
    for (let i = 1; i < this.segments.length; i++) {
      let seg = this.segments[i];
      if (seg.x === head.x && seg.y === head.y) {
        gameOver = true;
        console.log("Game Over");
        this.handleGameOver();
      }
    }
  }
  handleGameOver() {
    document.querySelectorAll(".blocks").forEach((e) => {
      e.style.backgroundColor = "white";
    });
    console.log(this.segments.length, Number(Hscore.innerHTML));
  }
}

let s = new Snake([SNAKE.size, 0]);

let s2 = new Snake([0, SNAKE.size]);

let frameCount = 0;
function animate() {
  frameCount += 1;
  if (frameCount % 5 === 0 && !gameOver) {
    s.display();
    // s2.display();
  }
  requestAnimationFrame(animate);
}
animate();

document.addEventListener("keydown", (e) => {
  let ct = window.getComputedStyle(grid);

  console.log(s.segments, s2.segments);
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    s.vel = [-SNAKE.size, 0];
  }
  if (e.key === "ArrowRight") {
    e.preventDefault();
    s.vel = [SNAKE.size, 0];
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    s.vel = [0, -SNAKE.size];
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    s.vel = [0, SNAKE.size];
  }
  console.log(document.querySelectorAll("div").length);
});

left.addEventListener("click", () => {
  s.vel = [-SNAKE.size, 0];
});
right.addEventListener("click", () => {
  s.vel = [SNAKE.size, 0];
});
up.addEventListener("click", () => {
  s.vel = [0, -SNAKE.size];
});
down.addEventListener("click", () => {
  s.vel = [0, SNAKE.size];
});
