const canvasSize =
  window.innerWidth > window.innerHeight
    ? window.innerHeight
    : window.innerWidth;
console.log(canvasSize);
const container = document.getElementById("container");
const coinCount = document.getElementById("coinCount");
function Map(value, istart, istop, ostart, ostop) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}
function Dist(x1,y1,x2,y2){
  let x = x1 - x2;
  let y = y1 - y2;
  return Math.sqrt(x*x + y*y)
}
// ARRAYS
let levels = [
  [
    "bbbbbbbbbbb",
    "b  g   g  b",
    "b bbb bbb b",
    "b b     b b",
    "b b b b b b",
    "b    p    b",
    "b b b b b b",
    "b b     b b",
    "b bbb bbb b",
    "b  g   g  b",
    "bbbbbbbbbbb",
  ],
  [
    "bbbbbbbbbbbbbbb",
    "b             b",
    "b bbbb b bbbb b",
    "b b         b b",
    "b b bbb bbb b b",
    "b b b     b b b",
    "b   b b b b   b",
    "b b    p    b b",
    "b   b b b b   b",
    "b b b     b b b",
    "b b bbb bbb b b",
    "b b         b b",
    "b bbbb b bbbb b",
    "b             b",
    "bbbbbbbbbbbbbbb",
  ],
];
let blocks = [];
let coins = [];
let ghosts = [];
let keys = [];

let bSize = ~~Map(50, 0, 496, 0, canvasSize);
let drawOnce = 0;
let player;
let lvl = 0;

let custom = {
  keyCodes: {
    left: "ArrowLeft",
    right: "ArrowRight",
    up: "ArrowUp",
    down: "ArrowDown",
  },

  images: {
    block: "../../../images/Platformer/rock4.svg",
    coin: "../../../images/Platformer/OneRing.svg",
    player: "../../../images/Platformer/Legolas.svg",
  },
};
localStorage.setItem('file1', JSON.stringify(custom))

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
    if (custom.images.block) {
      this.element.style.backgroundImage = `url(${custom.images.block})`;
    }
    this.element.style.width = `${bSize}px`;
    this.element.style.height = `${bSize}px`;
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    // this.element.innerHTML = "block";
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

class Ghost {
  constructor(x, y) {
    this.size = ~~(bSize / 2);
    this.element = document.createElement("div");
    if (custom.images.ghost) {
      this.element.style.backgroundImage = `url(${custom.images.ghost})`;
    }
    this.element.style.width = `${this.size}px`;
    this.element.style.height = `${this.size}px`;
    this.element.style.left = `${x + this.size / 2}px`;
    this.element.style.top = `${y + this.size / 2}px`;
    // this.element.innerHTML = "block";
    this.element.setAttribute("class", "ghost");
    container.append(this.element);

    // this.prev = this.element.getBoundingClientRect();
    this.prev = this.element.getPos();
    this.velX = 1;
    this.velY = 0;
  }
  update() {
    // this.prev = this.element.getBoundingClientRect();
    this.prev = this.element.getPos();

    this.element.style.left = this.prev.x + "px";

    this.element.style.top = this.prev.y + this.velY + "px";
    this.collideUD(blocks, "block");

    this.element.style.left = this.prev.x + this.velX + "px";
    this.collideLR(blocks, "block");
  }
  collideLR(arr, type) {
    for (let i = 0; i < arr.length; i++) {
      let a = this.element.getPos();
      let b = arr[i].element.getPos();
      if (collide(this.element.getPos(), arr[i].element.getPos())) {
          switch(type){
            case 'block':
              this.element.style.left =
              this.prev.x < b.x ? b.x - a.width + "px" : b.x + b.width + "px";
              break;

            case 'ghost':
               break;
          }
      }
    }
  }
  collideUD(arr, type) {
    for (let i = 0; i < arr.length; i++) {
      let a = this.element.getPos();
      let b = arr[i].element.getPos();
      if (collide(this.element.getPos(), arr[i].element.getPos())) {
        switch(type){
          case 'block':
            this.element.style.top =
            this.prev.y < b.y ? b.y - a.height + "px" : b.y + b.height + "px";
            break;
          case 'ghost':

            break;
        }
      }
    }
  }
}

class Coin {
  constructor(x, y) {
    this.size = bSize * 0.8;
    this.element = document.createElement("div");
    if (custom.images.coin) {
      this.element.style.backgroundImage = `url(${custom.images.coin})`;
    }
    this.element.style.width = `${this.size}px`;
    this.element.style.height = `${this.size}px`;
    this.element.style.left = `${x + (bSize - this.size) / 2}px`;
    this.element.style.top = `${y + (bSize - this.size) / 2}px`;
    // this.element.innerHTML = "coin";
    this.element.setAttribute("class", "coin");
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
    if (custom.images.player) {
      this.element.style.backgroundImage = `url(${custom.images.player})`;
    }
    this.element.style.width = `${this.size}px`;
    this.element.style.height = `${this.size}px`;
    this.element.style.left = `${x + this.size / 2}px`;
    this.element.style.top = `${y + this.size / 2}px`;
    // this.element.innerHTML = "player";
    this.element.setAttribute("class", "player");
    container.append(this.element);

    this.prev = this.element.getPos();
    this.velX = 0;
    this.velY = 0;
    this.speed = 5;
  }
  move() {
    this.prev = this.element.getPos();

    this.keysUD();
    this.element.style.top = this.prev.y + this.velY + "px";
    this.collideUD(blocks, "block");

    this.keysLR();
    this.element.style.left = this.prev.x + this.velX + "px";
    this.collideLR(blocks, "block");
    this.collideLR(coins, "coin");
  }
  collideLR(arr, type) {
    for (let i = 0; i < arr.length; i++) {
      let a = this.element.getPos();
      let b = arr[i].element.getPos();
      if (collide(this.element.getPos(), arr[i].element.getPos())) {
        switch (type) {
          case "block":
            this.element.style.left =
              this.prev.x < b.x ? b.x - a.width + "px" : b.x + b.width + "px";
            break;
          case "coin":
            coinCount.innerHTML = Number(coinCount.innerHTML) + 1;
            arr[i].element.remove();
            arr.splice(i, 1);
            break;
        }
      }
    }
  }
  collideUD(arr, type) {
    for (let i = 0; i < arr.length; i++) {
      let a = this.element.getPos();
      let b = arr[i].element.getPos();
      if (collide(this.element.getPos(), arr[i].element.getPos())) {
        switch (type) {
          case "block":
            this.element.style.top =
              this.prev.y < b.y ? b.y - a.height + "px" : b.y + b.height + "px";
            break;
        }
      }
    }
  }

  keysLR() {
    if (keys[custom.keyCodes.left]) {
      this.velX = -this.speed;
      this.velY = 0;
    }
    if (keys[custom.keyCodes.right]) {
      this.velX = this.speed;
      this.velY = 0;
    }
  }
  keysUD() {
    if (keys[custom.keyCodes.up]) {
      this.velX = 0;
      this.velY = -this.speed;
    }
    if (keys[custom.keyCodes.down]) {
      this.velX = 0;
      this.velY = this.speed;
    }
  }
}

class Game {
  constructor() {
    this.width = 0;
    this.height = 0;
  }

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
            break;
          case "g":
            ghosts.push(new Ghost(j * bSize, i * bSize));
          default:
            coins.push(new Coin(j * bSize, i * bSize));
        }
        if (j * bSize > this.width) {
          this.width = j * bSize;
        }
        if (i * bSize > this.height) {
          this.height = i * bSize;
        }
      }
    }
    container.style.width = this.width + bSize + "px";
    container.style.height = this.height + bSize + "px";
    console.log(container.getPos());
  }
  update() {
    for (let i = 0; i < blocks.length; i++) {
      blocks[i].update();
    }
    for (let i = 0; i < ghosts.length; i ++){
      ghosts[i].update()
    }
    player.move();

    let trans = player.element.getPos();
    // let canvas = container.getPos();

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
