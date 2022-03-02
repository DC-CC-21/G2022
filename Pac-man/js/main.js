const container = document.getElementById("container");

let bSize = 90;
let blocks = [];
let drawOnce = 0;
let player;
let levels = [
  [
    "bbbbbbbbbbb",
    "b         b",
    "b bbb bbb b",
    "b b     b b",
    "b b b b b b",
    "b    p    b",
    "b b b b b b",
    "b b     b b",
    "b bbb bbb b",
    "b         b",
    "bbbbbbbbbbb",
  ],
  [],
];
let lvl = 0;
let keys = [];
let keyCode = {
  left: "ArrowLeft",
  right: "ArrowRight",
  up: "ArrowUp",
  down: "ArrowDown",
};

function collide(a, b) {
  return (
    a.x - b.x < b.width &&
    b.x - a.x < a.width &&
    a.y - b.y < b.height &&
    b.y - a.y < a.height
  );
}

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

class Block {
  constructor(x, y) {
    this.element = document.createElement("div");
    this.element.style.width = `${bSize}px`;
    this.element.style.height = `${bSize}px`;
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    this.element.innerHTML = "block";
    this.element.setAttribute("class", "block");
    container.append(this.element);

    // this.prev = this.element.getBoundingClientRect();
    this.prev = this.element.getPos();
  }
  update() {
    // this.prev = this.element.getBoundingClientRect();
    this.prev = this.element.getPos();

    this.element.style.left = this.prev.x + "px";
  }
}

class Player {
  constructor(x, y) {
    this.size = bSize / 2;

    //Setup elements
    this.element = document.createElement("div");
    this.element.style.width = `${this.size}px`;
    this.element.style.height = `${this.size}px`;
    this.element.style.left = `${x + this.size / 2}px`;
    this.element.style.top = `${y + this.size / 2}px`;
    this.element.innerHTML = "block";
    this.element.setAttribute("class", "player");
    container.append(this.element);

    this.prev = this.element.getPos();
    this.velX = 0;
    this.velY = 0;
    this.speed = 2;
  }
  move() {
    this.prev = this.element.getPos();

    this.keysUD();
    this.element.style.top = this.prev.y + this.velY + "px";
    this.collideUD();

    this.keysLR();
    this.element.style.left = this.prev.x + this.velX + "px";
    this.collideLR();
  }
  collideLR() {
    for (let i = 0; i < blocks.length; i++) {
      let a = this.element.getPos();
      let b = blocks[i].element.getPos();
      if (collide(this.element.getPos(), blocks[i].element.getPos())) {
        this.element.style.left =
          this.prev.x < b.x ? b.x - a.width + "px" : b.x + b.width + "px";
      }
    }
  }
  collideUD() {
    for (let i = 0; i < blocks.length; i++) {
      let a = this.element.getPos();
      let b = blocks[i].element.getPos();
      if (collide(this.element.getPos(), blocks[i].element.getPos())) {
        this.element.style.top =
          this.prev.y < b.y ? b.y - a.height + "px" : b.y + b.height + "px";
      }
    }
  }

  keysLR() {
    if (keys[keyCode.left]) {
      this.velX = -this.speed;
      this.velY = 0;
    }
    if (keys[keyCode.right]) {
      this.velX = this.speed;
      this.velY = 0;
    }
  }
  keysUD() {
    if (keys[keyCode.up]) {
      this.velX = 0;
      this.velY = -this.speed;
    }
    if (keys[keyCode.down]) {
      this.velX = 0;
      this.velY = this.speed;
    }
  }
}

class Game {
  constructor() {}

  create() {
    for (let i = 0; i < levels[lvl].length; i++) {
      for (let j = 0; j < levels[lvl][i].length; j++) {
        let id = levels[lvl][i][j];
        switch (id) {
          case "b":
            blocks.push(new Block(j * bSize, i * bSize));
            break;
          case "p":
            player = new Player(j * bSize, i * bSize);
        }
      }
    }
  }
  update() {
    for (let i = 0; i < blocks.length; i++) {
      blocks[i].update();
    }
    player.move();

    let trans = player.element.getPos();
    let canvas = container.getPos();

    window.scrollTo(
      trans.x - window.innerWidth / 2 + trans.width,
      trans.y - window.innerHeight / 2 + trans.height
    );
  }
}
const game = new Game();

function draw() {
  if (!drawOnce) {
    game.create();
    drawOnce = 1;
  } else {
    game.update();
  }
  requestAnimationFrame(draw);
}
draw();

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});
