const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function rgbColor(r, g, b) {
  return `rgb(${r},${g},${b})`;
}
function map(value, istart, istop, ostart, ostop) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}
function collide(a, b) {
  return (
    ~~a.x - ~~b.x < ~~b.width &&
    ~~b.x - ~~a.x < ~~a.width &&
    ~~a.y - ~~b.y < ~~b.height &&
    ~~b.y - ~~a.y < ~~a.height
  );
}

class Player {
  constructor(x, y, color) {
    this.width = size;
    this.height = size;
    this.x = x * this.width;
    this.y = y * this.height;
    this.color = color;
    this.acceleration = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.speed = 0.5;
    if (BUILD) {
      this.speed = 1;
    }
    this.canMove = true;
    this.orig = {
      x: x * size,
      y: y * size,
    };
    this.deaths = 0;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  move() {
    if (this.canMove) {
      if (keys["ArrowRight"]) {
        this.acceleration.x = this.speed;
        this.canMove = false;
        keys = []
      }
      if (keys["ArrowLeft"]) {
        this.acceleration.x = -this.speed;
        this.canMove = false;
        keys = []
      }
      if (keys["ArrowUp"]) {
        this.acceleration.y = -this.speed;
        this.canMove = false;
        keys = []
      }
      if (keys["ArrowDown"]) {
        this.acceleration.y = this.speed;
        this.canMove = false;
        keys = []
      }
    }
    this.velocity.x += this.acceleration.x;
    this.x += this.velocity.x;
    blocks.forEach((block) => {
      if (collide(this, block)) {
        this.canMove = true;
        this.acceleration = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.x =
          this.x < block.x ? block.x - this.width : block.x + block.width;

        this.collideWithPortal(block.type);
      }
    });

    this.velocity.y += this.acceleration.y;
    this.y += this.velocity.y;
    blocks.forEach((block) => {
      if (collide(this, block)) {
        this.canMove = true;
        this.acceleration = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.y =
          this.y < block.y ? block.y - this.height : block.y + block.height;
        this.collideWithPortal(block.type);
      }
    });
    if (!this.checkInsideWorld()) {
      this.x = this.orig.x;
      this.y = this.orig.y;
      this.acceleration = { x: 0, y: 0 };
      this.velocity = { x: 0, y: 0 };
      this.canMove = true;
      this.deaths += 1;
    }
    if (this.canMove) {
      keys = [];
    }
    this.draw();
  }
  collideWithPortal(type) {
    if (BUILD) {
      return;
    }
    if (type != "portal") return;
    g.createWorld = false;
    this.acceleration = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    g.isFinished = false;
  }
  checkInsideWorld() {
    return (
      this.x >= 0 &&
      this.y >= 0 &&
      this.x <= canvas.width &&
      this.y <= canvas.height
    );
  }
}
class Block extends Player {
  constructor(x, y, color, type) {
    super(x, y, color);
    this.type = type;
    this.halfC = 255 / 2;
    this.color = this.x + this.y;
  }
  draw() {
    if (this.type == "block") {
      this.color =
        this.halfC +
        this.halfC * Math.sin((frameCount + this.x) / (180 / Math.PI));
      this.color2 =
        this.halfC +
        this.halfC * Math.sin((frameCount + this.y) / (180 / Math.PI));
      ctx.fillStyle = rgbColor(
        this.color - this.color2 + 100,
        this.color2 + 150,
        this.color + 50
      );
    } else {
      ctx.fillStyle = "#000";
    }
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
class Game {
  constructor() {
    this.level = -1;
    this.isFinished = false;
    this.createWorld = false;
    this.world = [];
    this.gridSize = 15;
  }

  create() {
    blocks.splice(0, blocks.length);
    this.createWorld = true;
    this.level += 1;
    fetch("./assets/levels.json")
      .then((response) => response.json())
      .then((jsObj) => {
        let jsObject = jsObj[`${this.gridSize}x${this.gridSize}`];
        if (BUILD) {
          this.level = jsObject.length - 1;
        }
        let levelMap = jsObject[this.level];
        if (!BUILD) {
          gridSize = levelMap.length;
        }

        size = cSize / gridSize;
        offset = {
          x: (canvas.width - size * levelMap.length) / 2,
          y: (canvas.height - size * levelMap[0].length) / 2,
        };
        if (BUILD) {
          offset = { x: 0, y: 0 };
          this.world = Array.from(new Array(gridSize), (a) => {
            return Array(gridSize).fill(0);
          });
        }

        console.log(this.world);
        levelMap.forEach((row, j) => {
          row.forEach((_, i) => {
            let id = levelMap[j][i];
            let x = i + offset.x / size;
            let y = j + offset.y / size;
            switch (id) {
              case 0:
                break;
              case 1:
                blocks.push(new Block(x, y, "#0af", "block"));
                break;
              case 2:
                p = new Player(x, y, "#f00");
                break;
              case 3:
                blocks.push(new Block(x, y, "#0af", "portal"));
                break;
            }
          });
        });
        this.isFinished = true;
        keyDelay = 10;
        keys = [];
      });
  }
  draw() {
    if (!this.createWorld) {
      this.create();
    }
    if (!this.isFinished) return;
    if(!BUILD){
    ctx.fillStyle = "rgb(100,100,100)";
    ctx.fillRect(offset.x, offset.y, cSize, cSize);
    }
    p.move();
    blocks.forEach((block) => block.draw());
  }
}

let size = 10; //~~map(30, 0, 706, 0, canvas.height);
let keys = [];
let p;
let blocks = [];
let frameCount = 0;
let offset = {
  x: 0,
  y: 0,
};
let gridSize = 20;
let keyDelay = 10;

let cSize = canvas.height * 0.9;
if (canvas.width > canvas.height) {
  cSize = canvas.height * 0.9;
} else if (canvas.width < canvas.height) {
  cSize = canvas.width * 0.9;
}

console.log(canvas.width, canvas.height);

let g = new Game();

const BUILD = false;

let mouseX = 0,
  mouseY = 0;
let bitX = 0,
  bitY = 0;
let bType = 1;
let types = ["block", "player", "portal", "erase"];
let swipe = {
  start: { x: 0, y: 0 },
  end: { x: 0, y: 0 },
};

function draw() {
  if (keyDelay > 0) {
    keyDelay--;
  }
  frameCount += 1;
  if (!BUILD) {
    background(75, 75, 75);
  }
  g.draw();

  if (BUILD) {
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 5, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.strokeRect(size * bitX, size * bitY, size, size);

    ctx.fillStyle = rgbColor(255, 0, 0);
    ctx.font = "15px impact";
    ctx.fillText(
      types[bType - 1] + "," + bType,
      bitX * size + size * 1.1,
      bitY * size + size / 2 + 6
    );
  }

  // ctx.font = "30px Ariel";
  // ctx.fillText(JSON.stringify(swipe), 100, 100);

  requestAnimationFrame(draw);
}
draw();

function background(r, g, b) {
  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

document.addEventListener("keydown", (e) => {
  if (keyDelay > 0) {
    return;
  }
  e.preventDefault();
  console.log(e.key);
  keys[e.key] = true;
  if (e.key == "Delete") {
    blocks.pop();
  } else if (e.key == " ") {
    console.log(g.world);
  }
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
  if (e.key == "s") {
    bType += 1;
  }

  if (bType - 1 >= types.length) {
    bType = 1;
  }
});
document.addEventListener("mousemove", (e) => {
  if (BUILD) {
    background(75, 75, 75);
    ctx.fillStyle = "rgb(150,150,150)";
    ctx.fillRect(0, 0, cSize, cSize);
  }
  mouseX = e.clientX;
  mouseY = e.clientY;

  bitX = ~~(mouseX / size);
  bitY = ~~(mouseY / size);
});

if (BUILD) {
  document.addEventListener("click", (e) => {
    background(75, 75, 75);
    ctx.fillStyle = "rgb(150,150,150)";
    ctx.fillRect(0, 0, cSize, cSize);
    mouseX = e.clientX;
    mouseY = e.clientY;
    bitX = ~~(mouseX / size);
    bitY = ~~(mouseY / size);

    console.log(bType, types[bType - 1]);

    if (types[bType - 1] == "erase") {
      // g.world[bitY][bitX] = bType;
      blocks.forEach((block, index) => {
        console.log(block.x / size, block.y / size, bitX, bitY);
        if (
          Math.floor(block.x / size) == bitX &&
          Math.floor(block.y / size) == bitY
        ) {
          blocks.splice(index, 1);
        }
      });
      return;
    } else if (types[bType - 1] != "player") {
      blocks.push(new Block(bitX, bitY, "#f00", types[bType - 1]));
    } else {
      p.x = bitX * size;
      p.y = bitY * size;
      p.orig = { x: p.x, y: p.y };
      g.world.forEach((row, j) => {
        row.forEach((column, i) => {
          let id = g.world[j][i];
          if (id == 2) {
            g.world[j][i] = 0;
          }
        });
      });
    }
    g.world[bitY][bitX] = bType;
  });
}

document.addEventListener("touchstart", (e) => {
  swipe.start.x = e.touches[0].clientX - offset.x;
  swipe.start.y = e.touches[0].clientY - offset.y;
});
document.addEventListener("touchmove", (e) => {
  swipe.end.x = e.touches[0].clientX - offset.x;
  swipe.end.y = e.touches[0].clientY - offset.y;

  let run = swipe.end.x - swipe.start.x;
  let rise = swipe.end.y - swipe.start.y;
  if (Math.abs(run) > Math.abs(rise)) {
    if (run > 0) {
      keys["ArrowRight"] = true;
    } else {
      keys["ArrowLeft"] = true;
    }
  } else {
    if (rise > 0) {
      keys["ArrowDown"] = true;
    } else {
      keys["ArrowUp"] = true;
    }
  }
});
