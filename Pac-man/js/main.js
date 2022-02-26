const container = document.getElementById("container");
const stats = document.getElementById("stats");
const path = window.location.pathname.split("/");
stats.innerHTML = path[path.length - 1];

/* Game variables */
const levels = [
  [
    "bbbbbbbbbbbbb",
    "b           b",
    "b bbb   bbb b",
    "b b       b b",
    "b b bb bb b b",
    "b   b   b   b",
    "b     p     b",
    "b   b   b   b",
    "b b bb bb b b",
    "b b       b b",
    "b bbb   bbb b",
    "b           b",
    "bbbbbbbbbbbbb",
  ],
  [],
];
let canvasSize =
  window.innerWidth > window.innerHeight
    ? window.innerHeight
    : window.innerWidth;

let bSize = canvasSize / 2;
let keys = [];
let blocks = [];
let p;
let transX = 0;
let transY = 0;
let drawOnce = 0;
let lvl = 0;

let customKeys = {
  left: "ArrowLeft",
  right: "ArrowRight",
  up: "ArrowUp", //'w',
  down: "ArrowDown",
};
/* functions */
function Map(value, istart, istop, ostart, ostop) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

/* game */
class Block {
  constructor(x, y) {
    this.element = document.createElement("div");
    this.element.innerHTML = "block";
    this.element.setAttribute("class", "blocks");
    this.element.style.width = bSize + "px";
    this.element.style.height = bSize + "px";
    this.element.style.left = ~~(x * bSize) + "px";
    this.element.style.top = ~~(y * bSize) + "px";
    container.append(this.element);
    this.prev = this.element.getBoundingClientRect();
  }
  update() {
    this.prev = this.element.getBoundingClientRect();
  }
}

class Player {
  constructor(x, y) {
    this.element = document.createElement("div");
    this.element.innerHTML = "player";
    this.element.setAttribute("class", "player");
    this.element.style.width = ~~(bSize/2) + "px";
    this.element.style.height = ~~(bSize/2) + "px";
    this.element.style.left = ~~(x * bSize) + "px";
    this.element.style.top = ~~(y * bSize) + "px";
    container.append(this.element);

    this.velX = 0;
    this.velY = 0;
    this.speed = 2;
    this.prev = this.element.getBoundingClientRect();
  }
  moveX() {
    if (keys[customKeys.left]) {
      this.velX = -this.speed;
      this.velY = 0;
    }
    if (keys[customKeys.right]) {
      this.velX = this.speed;
      this.velY = 0;
    }
  }
  moveY() {
    if (keys[customKeys.up]) {
      this.velX = 0;
      this.velY = -this.speed;
    }
    if (keys[customKeys.down]) {
      this.velX = 0;
      this.velY = this.speed;
    }
  }

  move() {
    this.prev = this.element.getBoundingClientRect();

<<<<<<< HEAD
    this.moveX();
    this.collideLR()
    this.element.style.left = this.prev.x + window.scrollX + this.velX + "px";

=======
>>>>>>> 5677b0fd30b56ddcae8b7f776f2005c2b30c482e
    this.moveY();
    this.element.style.top =
      this.element.getBoundingClientRect().y +
      window.scrollY +
      this.velY +
      "px";
    this.collideUD();

    this.moveX();
    this.element.style.left =
      this.element.getBoundingClientRect().x +
      window.scrollX +
      this.velX +
      "px";
    this.collideLR();

    transX += this.velX;
    transY += this.velY;
  }
  collide(that) {
    this.current = this.element.getBoundingClientRect();
    that.current = that.element.getBoundingClientRect();
    return (
      ~~this.current.x - ~~that.current.x < that.current.width &&
      ~~that.current.x - ~~this.current.x < this.current.width &&
      ~~this.current.y - ~~that.current.y < that.current.height &&
      ~~that.current.y - ~~this.current.y < this.current.height
    );
    // return (
    //     this.current.x > that.current.x && this.current.x < that.current.x + that.current.width &&
    //     this.current.y > that.current.y && this.current.y < that.current.y + that.current.height
    // )
  }
  collideLR() {
    for (let i = blocks.length - 1; i >= 0; i--) {
      let b = blocks[i].prev;
      if (this.collide(blocks[i])) {
        this.velX = 0;
        this.element.style.left =
          this.prev.x < b.x
            ? b.x - this.prev.width + "px"
            : b.x + b.width + "px";

        // this.element.style.left =  b.x + b.width + 'px'
      }
    }
  }
  collideUD() {
    for (let i = blocks.length - 1; i >= 0; i--) {
      let b = blocks[i].prev;
      if (this.collide(blocks[i])) {
        this.element.style.top =
          this.prev.y < b.y
            ? b.y - this.prev.height + "px"
            : b.y + b.height + "px";
        this.velY = 0;
        // this.element.style.left =  b.x + b.width + 'px'
      }
    }
  }
}

class Game {
  constructor() {}

  createGame() {
    bSize = ~~Map(60, 0, 382, 0, canvasSize);
    console.log(`
    canvasSize: ${canvasSize}\nbSize: ${bSize}\ncontainer${container.getBoundingClientRect().width}
    `)
    let s = 0;
    // bSize = ~~(canvasSize / levels[lvl].length);
    for (let i = 0; i < levels[lvl].length; i++) {
      for (let j = 0; j < levels[lvl][i].length; j++) {
        let id = levels[lvl][i][j];
        switch (id) {
          case "b":
            if(j * bSize > s){
              s = j*bSize
            }
            blocks.push(new Block(j, i));
            break;
          case "p":
            console.log(s)
            transX = j*bSize//~~(canvasSize/2)//~~(canvasSize / 2);
            transY = i*bSize;

            p = new Player(j, i);
            break;
          default:
            break;
        }
      }
    }
  }

  display() {
    // for(let i = blocks.length-1; i >= 0; i --){
    //     blocks[i].update()
    // }

    p.move();

    window.scroll(transX, transY);
  }
}

const g = new Game();
function draw() {
  if (!drawOnce) {
    g.createGame();
    drawOnce = 1;
  } else {
    g.display();
  }
  // let elementPos = element.getBoundingClientRect()
  // element.style.top = elementPos.y + 1 + 'px';
  requestAnimationFrame(draw);
}
draw();

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

/* Last Modified */
document.getElementById("lm").innerHTML = document.lastModified;
