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
    return {
      x: (value.x / SNAKE.size).toFixed(0) * SNAKE.size,
      y: (value.y / SNAKE.size).toFixed(0) * SNAKE.size,
      vel: value.vel,
    };
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
  
  let SNAKE = {
    width: Map(23 * 10, 0, 602, 0, window.innerWidth),
    height: Map(34 * 10, 0, 706, 0, window.innerHeight),
    size: Map(20, 0, 478, 0, canvasSize),
    startLen: 5,
    segmentGrow: 3,
    mode: "snake",
    trans: { x: 0, y: 0 },
    columns: 20,
    rows: 20,
    foodC: "rgb(0,255,0)",
  };
  
  if (window.innerWidth >= window.innerHeight) {
    SNAKE.height = window.innerHeight * 0.8;
    SNAKE.size = SNAKE.height / SNAKE.rows;
    SNAKE.width = SNAKE.columns * SNAKE.size;
  } else {
    SNAKE.width = window.innerWidth * 0.8;
    SNAKE.size = SNAKE.width / SNAKE.columns;
    SNAKE.height = SNAKE.rows * SNAKE.size;
  }
  
  let left = document.getElementById("left");
  let right = document.getElementById("right");
  let up = document.getElementById("up");
  let down = document.getElementById("down");
  let food = randomSpace();
  let gameOver = false;
  
  class SnakeGame {
    constructor() {
      this.setHtml();
      this.createGrid();
    }
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
      console.log(canvasSize);
      document.querySelectorAll("button").forEach((btn) => {
        btn.style.width = Map(80, 0, 490, 0, canvasSize) + "px";
        btn.style.height = Map(80, 0, 490, 0, canvasSize) + "px";
        btn.style.backgroundSize = `${btn.style.width} ${btn.style.height}`;
      });
      let btnW = left.getPos().width;
      let btnH = left.getPos().height;
      left.style.left = SNAKE.trans.x + "px";
      left.style.top = SNAKE.height - btnH + SNAKE.trans.y + "px";
  
      right.style.left = SNAKE.trans.x + btnW * 1.1 + "px";
      right.style.top = SNAKE.height - btnH + SNAKE.trans.y + "px";
  
      up.style.left = SNAKE.width - btnW + SNAKE.trans.x + "px";
      up.style.top = SNAKE.height - btnH * 2.1 + SNAKE.trans.y + "px";
  
      down.style.left = SNAKE.width - btnW + SNAKE.trans.x + "px";
      down.style.top = SNAKE.height - btnH + SNAKE.trans.y + "px";
  
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
    segment(x, y, width, height, color) {
      let element = document.createElement("div");
      element.setAttribute("class", "obj");
      element.style.left = x + "px";
      element.style.top = y + "px";
      element.style.width = width + "px";
      element.style.height = height + "px";
      element.style.backgroundColor = color;
      container.append(element);
    }
    handleGameOver() {
      document.querySelectorAll(".obj").forEach((e) => {
        e.style.backgroundColor = "white";
      });
      console.log(document.querySelectorAll(".obj").length);
    }
  }
  
  let g = new SnakeGame();
  
  class Snake {
    constructor(value) {
      this.segments = [];
      this.startX = value.x;
      this.startY = value.y;
      this.vel = value.vel; //[SNAKE.size, 0];
      this.count = 0;
      this.segmentC = value.segmentC;
      this.headC = value.headC;
      // this.setHtml();
  
      this.createBody();
    }
    createBody() {
      for (let i = 0; i < SNAKE.startLen; i++) {
        this.segments.push(
          toGrid({
            x: this.startX - i * SNAKE.size,
            y: this.startY,
            vel: this.vel,
          })
        );
      }
    }
  
    display() {
      for (let i = 0; i < this.segments.length; i++) {
        g.segment(
          this.segments[i].x,
          this.segments[i].y,
          SNAKE.size,
          SNAKE.size,
          i ? this.segmentC : this.headC
        );
      }
  
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
      this.segments.unshift(
        toGrid({
          x: newHead.x,
          y: newHead.y,
          vel: newHead.vel,
        })
      );
    }
    collideSegments() {
      let head = this.segments[0];
      for (let i = 1; i < this.segments.length; i++) {
        let seg = this.segments[i];
        if (seg.x === head.x && seg.y === head.y) {
          gameOver = true;
          console.log("Game Over");
          SNAKE.gameOver = true;
        }
      }
    }
  }
  
  let snakes = [
    new Snake({
      x: SNAKE.size * 6,
      y: SNAKE.size * 2,
      vel: [SNAKE.size, 0],
      segmentC: "rgb(0,0,255)",
      headC: "rgb(100,100,255)",
    }),
    // new Snake({
    //   x: SNAKE.size * 6,
    //   y: SNAKE.size * 16,
    //   vel: [SNAKE.size, 0],
    //   segmentC: "rgb(255,0,0)",
    //   headC: "rgb(255,100,100)",
    // }),
  ];
  
  let frameCount = 0;
  function animate() {
    frameCount += 1;
    if (frameCount % 5 === 0 && !gameOver) {
      container.innerHTML = "";
      for (let i = 0; i < snakes.length; i++) {
        snakes[i].display();
      }
      g.segment(food.x, food.y, SNAKE.size, SNAKE.size, SNAKE.foodC);
      if (SNAKE.gameOver) {
        g.handleGameOver();
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
  
  document.addEventListener("keydown", (e) => {
    let ct = window.getComputedStyle(grid);
  
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      snakes[0].vel = [-SNAKE.size, 0];
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      snakes[0].vel = [SNAKE.size, 0];
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      snakes[0].vel = [0, -SNAKE.size];
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      snakes[0].vel = [0, SNAKE.size];
    }
    if (snakes.length === 2) {
      if (e.key === "a") {
        e.preventDefault();
        snakes[1].vel = [-SNAKE.size, 0];
      }
      if (e.key === "d") {
        e.preventDefault();
        snakes[1].vel = [SNAKE.size, 0];
      }
      if (e.key === "w") {
        e.preventDefault();
        snakes[1].vel = [0, -SNAKE.size];
      }
      if (e.key === "s") {
        e.preventDefault();
        snakes[1].vel = [0, SNAKE.size];
      }
    }
  });
  
  left.addEventListener("click", () => {
    snakes[0].vel = [-SNAKE.size, 0];
  });
  right.addEventListener("click", () => {
    snakes[0].vel = [SNAKE.size, 0];
  });
  up.addEventListener("click", () => {
    snakes[0].vel = [0, -SNAKE.size];
  });
  down.addEventListener("click", () => {
    snakes[0].vel = [0, SNAKE.size];
  });
  document.addEventListener("touchstart", (e) => {
    e.preventDefault();
  });
  
  document.addEventListener("touchmove", (e) => {
    e.preventDefault();
  });
  