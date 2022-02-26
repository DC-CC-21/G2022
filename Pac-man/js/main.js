const container = document.getElementById("container");
const stats = document.getElementById("stats");
const path = window.location.pathname.split("/");
stats.innerHTML = path[path.length - 1];

/* Game variables */
const levels = [
  [
    "bbbbbbbbbb",
    "b        b",
    "b  p     b",
    "b        b",
    "b        b",
    "bbbbbbbbbb",
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

/* game */
class Block {
  constructor(x, y) {
    this.element = document.createElement("div");
    this.element.innerHTML = "block";
    this.element.setAttribute("class", "blocks");
    this.element.style.width = bSize + "px";
    this.element.style.height = bSize + "px";
    this.element.style.left = x * bSize + "px";
    this.element.style.top = y * bSize + "px";
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
    this.element.style.width = bSize + "px";
    this.element.style.height = bSize + "px";
    this.element.style.left = x * bSize + "px";
    this.element.style.top = y * bSize + "px";
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

    this.moveX();
    this.collideLR()
    this.element.style.left = this.prev.x + window.scrollX + this.velX + "px";

    this.moveY();
    this.element.style.top = this.prev.y + window.scrollY + this.velY + "px";

    transX += this.velX;
    transY += this.velY;
  }
  collide(that) {
    this.current = this.element.getBoundingClientRect();
    that.current = that.element.getBoundingClientRect();
    return (
      this.current.x - that.current.x < that.current.width &&
      that.current.x - this.current.x < this.current.width &&
      this.current.y - that.current.y < that.current.height &&
      that.current.y - this.current.y < this.current.height
    );
  }
  collideLR(){
    for(let i = blocks.length-1; i >= 0; i --){
        let b = blocks[i].element.getBoundingClientRect()
        if(this.collide(blocks[i])){        this.x =
            this.element.style.left < b.x
              ? b.x - this.prev.width + 'px'
              : b.x + b.width + 'px';
            this.velX = 0;
            // this.element.style.left =  b.x + b.width + 'px'

        }
    }
  }
  collideUD(){
    for(let i = blocks.length-1; i >= 0; i --){
        let b = blocks[i].element.getBoundingClientRect()
        if(this.collide(blocks[i])){        this.x =
            this.element.style.left < b.x
              ? b.y - this.prev.width + 'px'
              : b.y + b.width + 'px';
            this.velY = 0;
            // this.element.style.left =  b.x + b.width + 'px'

        }
    }
  }
}

class Game {
  constructor() {}

  createGame() {
    bSize = canvasSize / levels[lvl].length;
    for (let i = 0; i < levels[lvl].length; i++) {
      for (let j = 0; j < levels[lvl][i].length; j++) {
        let id = levels[lvl][i][j];
        switch (id) {
          case "b":
            blocks.push(new Block(j, i));
            break;
          case "p":
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
  console.log(window.scrollX);
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

/* Last Modified */
document.getElementById("lm").innerHTML = document.lastModified;
