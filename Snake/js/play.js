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
function Dist(x1, y1, x2, y2) {
  let x = x1 - x2;
  let y = y1 - y2;
  return Math.sqrt(x * x + y * y);
}

const container = document.getElementById("container");

const canvasSize =
  window.innerWidth > window.innerHeight
    ? window.innerHeight
    : window.innerWidth;
let SNAKE = {
  size: 30,
  len: 3,
  count: 1,
  vel: 2,
  max: {
    x: 600,
    y: 600,
  },
  min: {
    x: 0,
    y: 0,
  },
  grow: 3,
};

let keys = [];

class Food {
  constructor() {
    let x = Math.random() * SNAKE.max.x;
    let y = Math.random() * SNAKE.max.y;
    this.element = document.createElement("div");
    this.element.setAttribute("class", "food");
    this.element.style.left = x + "px";
    this.element.style.top = y + "px";
    this.element.style.width = SNAKE.size + "px";
    this.element.style.height = SNAKE.size + "px";

    container.append(this.element);
  }
  collect() {
    let head = s.segments[0].element.getPos();
    let food = this.element.getPos();
    if (Dist(head.x, head.y, food.x, food.y) < SNAKE.size / 2) {
      this.element.style.left = Math.random() * SNAKE.max.x + "px";
      this.element.style.top = Math.random() * SNAKE.max.y + "px";
      for (let i = 0; i < SNAKE.grow; i++) {
        let segment = s.segments[s.segments.length - 1];
        let lastSegment = segment.element.getPos();
        if (segment.vel[0] !== 0) {
          if (segment.vel[0] > 0) {
            s.segments.push(
              new Obj(
                lastSegment.x - SNAKE.size,
                lastSegment.y,
                s.segments.length
              )
            );
          } else {
            s.segments.push(
              new Obj(
                lastSegment.x + SNAKE.size,
                lastSegment.y,
                s.segments.length
              )
            );
          }
        } else {
          if (segment.vel[1] > 0) {
            s.segments.push(
              new Obj(
                lastSegment.x,
                lastSegment.y - SNAKE.size,
                s.segments.length
              )
            );
          } else {
            s.segments.push(
              new Obj(
                lastSegment.x,
                lastSegment.y + SNAKE.size,
                s.segments.length
              )
            );
          }
        }

        s.segments[s.segments.length - 1].vel = segment.vel;
        console.log(s.segments);
      }
    }
  }
}

class Obj {
  constructor(x, y, idx) {
    this.idx = idx;
    this.element = document.createElement("div");
    this.element.setAttribute("class", "blocks");
    this.element.style.left = x + "px";
    this.element.style.top = y + "px";
    this.element.style.width = SNAKE.size + "px";
    this.element.style.height = SNAKE.size + "px";

    container.append(this.element);
    this.vel = [SNAKE.vel, 0];
    this.turnPos = [];
    // this.setTurnPos();
    // this.turnPos.shift()
  }
  setTurnPos() {
    if (this.idx < s.segments.length - 1) {
      this.pos = this.element.getPos();
      this.turnPos.push({ x: this.pos.x, y: this.pos.y, vel: this.vel });
    }
    return;
  }
  turnSelf() {
    let previous = s.segments[this.idx - 1].turnPos;
    if (previous.length) {
      let previousPos = previous[0];

      let current = this.element.getPos();
      if (Dist(previousPos.x, previousPos.y, current.x, current.y) <= 1) {
        this.vel = previousPos.vel;
        this.setTurnPos();
        previous.shift();
        console.log(previous);
      }
    }
  }
  move() {
    this.prev = this.element.getPos();

    this.element.style.left =
      ((this.prev.x + this.vel[0]) % SNAKE.max.x) + "px";
    this.element.style.top = ((this.prev.y + this.vel[1]) % SNAKE.max.y) + "px";

    this.el = this.element.getPos();
    if (this.el.x < SNAKE.min.x) {
      this.element.style.left = SNAKE.max.x + "px";
    }
    if (this.el.y < SNAKE.min.y) {
      this.element.style.top = SNAKE.max.y + "px";
    }

    if (this.idx !== 0) {
      this.turnSelf();
    } else {
      f.collect();
    }
  }
}

class Snake {
  constructor(x, y) {
    this.segments = [];
    this.x = x;
    this.y = y;
    this.createSnake();
  }
  moveSnake() {
    for (let i = 0; i < this.segments.length; i++) {
      this.segments[i].move();
    }
  }
  turnSnake() {
    if (keys["ArrowUp"]) {
      this.segments[0].vel = [0, -SNAKE.vel];
    }
    if (keys["ArrowDown"]) {
      this.segments[0].vel = [0, SNAKE.vel];
    }
    if (keys["ArrowRight"]) {
      this.segments[0].vel = [SNAKE.vel, 0];
    }
    if (keys["ArrowLeft"]) {
      this.segments[0].vel = [-SNAKE.vel, 0];
    }
    this.segments[0].setTurnPos();
  }
  createSnake() {
    for (let i = 0; i < SNAKE.len; i++) {
      this.segments.push(new Obj(this.x - SNAKE.size * i, this.y, i));
    }
  }
}

s = new Snake(500, 100);
f = new Food();

function draw() {
  s.moveSnake();

  requestAnimationFrame(draw);
}
draw();

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  s.turnSnake();
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});
