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
function Dist(x1, y1, x2, y2) {
  let x = x1 - x2;
  let y = y1 - y2;
  return Math.sqrt(x * x + y * y);
}
// ARRAYS
let levels = [
  [
    "bbbbbbbbbbb",
    "bg       gb",
    "b bbb bbb b",
    "b b     b b",
    "b b b b b b",
    "b    p    b",
    "b b b b b b",
    "b b     b b",
    "b bbb bbb b",
    "bg       gb",
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
  [
    "bbbbbbbbbbbbbbbbb",
    "b       g       b",
    "b  b b  b  b b  b",
    "b b   b   b   b b",
    "b   b  b b  b   b",
    "b b  b  b  b  b b",
    "b  b  b   b  b  b",
    "b g b   p   b g b",
    "b  b  b   b  b  b",
    "b b  b  b  b  b b",
    "b   b  b b  b   b",
    "b b   b   b   b b",
    "b  b b  b  b b  b",
    "b       g       b",
    "bbbbbbbbbbbbbbbbb",
  ],
];
let blocks = [];
let coins = [];
let ghosts = [];
let keys = [];

let bSize = ~~Map(40, 0, 496, 0, canvasSize);
let drawOnce = 0;
let player;
let lvl = 0;
let numberOfCoins;

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
    ghost: "../../../images/Platformer/Orc.svg",
  },
};
localStorage.setItem("file1", JSON.stringify(custom));

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

document.addEventListener("click", () => {
  console.log(ghosts[0].checkSides());
  console.log(ghosts[0].velX, ghosts[0].velY);
  console.log(ghosts[0].element.getPos());
  console.log(ghosts[0].prev);
});

class Ghost {
  constructor(x, y) {
    this.size = ~~(bSize * 0.9);
    this.element = document.createElement("div");
    if (custom.images.ghost) {
      this.element.style.backgroundImage = `url(${custom.images.ghost})`;
    }
    this.element.style.width = `${this.size}px`;
    this.element.style.height = `${this.size}px`;
    this.element.style.left = `${x + bSize * 0.05}px`;
    this.element.style.top = `${y + bSize * 0.05}px`;
    // this.element.innerHTML = "block";
    this.element.setAttribute("class", "ghost");

    this.testX = document.createElement("div");
    this.testX.style.width = `${bSize * 1.3}px`;
    this.testX.style.height = `${this.size / 2}px`;
    this.testX.style.left = `${x + this.size / 2}px`;
    this.testX.style.top = `${y + this.size / 2}px`;
    this.testX.setAttribute("class", "ghost");
    this.testX.style.backgroundColor = "white";
    this.testX.setAttribute("id", "testX");
    // thtestent.innerHTML = "block";
    container.append(this.testX);

    this.testY = document.createElement("div");
    this.testY.style.width = `${this.size / 2}px`;
    this.testY.style.height = `${bSize * 1.3}px`;
    this.testY.style.left = `${x + this.size / 2}px`;
    this.testY.style.top = `${y + this.size / 2}px`;
    this.testY.setAttribute("class", "ghost");
    this.testY.setAttribute("id", "testY");
    this.testY.style.backgroundColor = "red";
    // this.testent.innerHTML = "block";
    container.append(this.testY);

    container.append(this.element);

    // this.prev = this.element.getBoundingClientRect();
    this.sides = [];
    this.prev = this.element.getPos();
    this.velX = 1;
    this.velY = 0;
    this.speed = 2;
    this.current = 0;
    this.prevX = 0;
    this.prevY = 0;
  }
  checkSides() {
    this.sides = [];
    this.a = this.element.getPos();
    let id = levels[lvl];

    if (id[~~(this.a.y / bSize)][~~(this.a.x / bSize) - 1] === "b") {
    } else {
      this.sides.push("left");
    }
    if (id[~~(this.a.y / bSize)][~~(this.a.x / bSize) + 1] === "b") {
    } else {
      this.sides.push("right");
    }
    if (id[~~(this.a.y / bSize) - 1][~~(this.a.x / bSize)] === "b") {
    } else {
      this.sides.push("top");
    }
    if (id[~~(this.a.y / bSize) + 1][~~(this.a.x / bSize)] === "b") {
    } else {
      this.sides.push("down");
    }
    let direction = this.sides;

    if (
      JSON.stringify(this.sides) !== JSON.stringify(this.prevSides) ||
      JSON.stringify(this.element.getPos()) === JSON.stringify(this.prev)
    ) {
      // console.log('1: '+this.sides)
      // console.log('2: '+this.prevSides)
      let dir = direction[~~(Math.random() * direction.length)];
      switch (dir) {
        case "left":
          this.velX = -this.speed;
          this.velY = 0;
          break;
        case "right":
          this.velX = this.speed;
          this.velY = 0;
          break;
        case "top":
          this.velX = 0;
          this.velY = -this.speed;
          break;
        case "down":
          this.velX = 0;
          this.velY = this.speed;
          break;
      }
    }
    let s = this.prevSides;
    this.prevSides = this.sides;
    //id[~~(this.a.y/bSize)][~~(this.a.x/bSize)+1])right
    //id[~~(this.a.y/bSize)][~~(this.a.x/bSize)-1])left
    //id[~~(this.a.y/bSize)+1][~~(this.a.x/bSize)])//down
    //id[~~(this.a.y/bSize)-1][~~(this.a.x/bSize)])top
    return [direction, this.sides, s];
  }
  update() {
    // this.prev = this.element.getBoundingClientRect();
    this.prev = this.element.getPos();

    this.element.style.top = this.prev.y + this.velY + "px";
    this.collideUD(blocks, "block");
    for (let i = 0; i < ghosts.length; i++) {
      let a = this.element.getPos();
      let b = ghosts[i].element.getPos();
      if (collide(a, b) && Dist(a.x, a.y, b.x, b.y)) {
        this.element.style.top =
          this.prev.y < b.y ? b.y - a.height + "px" : b.y + b.height + "px";
        this.velY *= -1;
      }
    }

    this.element.style.left = this.prev.x + this.velX + "px";
    this.collideLR(blocks, "block");
    for (let i = 0; i < ghosts.length; i++) {
      let a = this.element.getPos();
      let b = ghosts[i].element.getPos();
      if (collide(a, b) && Dist(a.x, a.y, b.x, b.y)) {
        this.element.style.left =
          this.prev.x < b.x ? b.x - a.width + "px" : b.x + b.width + "px";
        this.velX *= -1;
      }
    }

    if (collide(player.element.getPos(), this.element.getPos())) {
      gameOver = true;
    }
    this.checkSides();
    this.repositionGhosts()
    if (collide(player.element.getPos(), this.element.getPos())) {
      gameOver = true;
    }

  }
  repositionGhosts() {
    this.testX.style.left =
      this.element.getPos().x -
      this.testX.getPos().width / 2 +
      this.element.getPos().width / 2 +
      "px";
    this.testX.style.top =
      this.element.getPos().y -
      this.testX.getPos().height / 2 +
      this.element.getPos().height / 2 +
      "px";

    this.testY.style.left =
      this.element.getPos().x -
      this.testY.getPos().width / 2 +
      this.element.getPos().width / 2 +
      "px";
    this.testY.style.top =
      this.element.getPos().y -
      this.testY.getPos().height / 2 +
      this.element.getPos().height / 2 +
      "px";
  }
  changeVel() {
    let r = Math.random();
    if (r > 0.5) {
      this.velX = Math.random() > 0.5 ? -this.speed : this.speed;
      this.velY = 0;
    } else {
      this.velX = 0;
      this.velY = Math.random() > 0.5 ? -this.speed : this.speed;
    }
    console.log(this.velX, this.velY);
  }
  collideLR(arr, type) {
    for (let i = 0; i < arr.length; i++) {
      if (collide(this.element.getPos(), arr[i].element.getPos())) {
        let a = this.element.getPos();
        let b = arr[i].element.getPos();
        this.element.style.left =
          this.prev.x < b.x ? b.x - a.width + "px" : b.x + b.width + "px";
        // this.changeVel();
        return;
      }
    }
  }

  collideUD(arr, type) {
    // this.testY.style.backgroundColor = "green";
    for (let i = 0; i < arr.length; i++) {
      if (collide(this.element.getPos(), arr[i].element.getPos())) {
        let a = this.element.getPos();
        let b = arr[i].element.getPos();
        this.element.style.top =
          this.prev.y < b.y ? b.y - a.height + "px" : b.y + b.height + "px";
        // this.changeVel();
        return;
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

            if (Number(coinCount.innerHTML) >= numberOfCoins) {
              drawOnce = 0;
            }

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
    container.innerHTML = "";
    coinCount.innerHTML = "";
    ghosts = [];
    blocks = [];
    coins = [];
    player = undefined;

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
    numberOfCoins = coins.length;

    container.style.width = this.width + bSize + "px";
    container.style.height = this.height + bSize + "px";
    console.log(container.getPos());
  }
  update() {
    for (let i = 0; i < blocks.length; i++) {
      // blocks[i].update();
    }
    for (let i = 0; i < ghosts.length; i++) {
      ghosts[i].update();
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
let gameOver = false;

function draw() {
  if (!drawOnce) {
    game.create();
    drawOnce = 1;
  } else {
    game.update();
  }
  if(gameOver){ container.innerHTML = ''; window.location = 'gameover.html'}
  requestAnimationFrame(draw);
}
draw();

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});
