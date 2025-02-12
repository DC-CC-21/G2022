function drawMaze(ctx, mazeArray, cellSize) {
  for (let i = 0; i < mazeArray.length; i++) {
    for (let j = 0; j < mazeArray[i].length; j++) {
      const status = mazeArray[i][j];
      const x = i * cellSize;
      const y = j * cellSize;

      ctx.fillStyle = "rgb(0, 0, 0)";
      if (status === 5) {
        ctx.fillStyle = picColor || "rgb(0, 0, 0)";
      } else if (status === 1 || !debug) {
        ctx.fillStyle = "rgb(255, 255, 255)";
      } else if (status === 2) {
        ctx.fillStyle = "rgb(0, 255, 0)";
      } else if (status === 3) {
        ctx.fillStyle = "rgb(224, 224, 224)";
      } else if (status === 4) {
        ctx.fillStyle = "rgb(0, 255, 255)";
      }
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const mazeArray = JSON.parse(localStorage.getItem("mazeLevel"));
const picColor = localStorage.getItem("mazeColor");
const { width, height } = canvas;
const cellSize = ~~(Math.min(width, height) / mazeArray.length);
const debug = true;
drawMaze(ctx, mazeArray, cellSize);

class Player {
  constructor(x, y, size, arr) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.vel = {
      x: 0,
      y: 0,
    };
    this.grid = arr;
    this.options = [1, 2, 3];
    this.endpoint = 4;
  }
  render(x, y, status) {
    x ??= this.x;
    y ??= this.y;

    if (status === 0) {
      ctx.fillStyle = "rgb(153, 153, 153)";
    } else if (status === 2) {
      ctx.fillStyle = "rgb(255, 255, 0)";
    } else {
      ctx.fillStyle = "rgb(255, 0, 0)";
    }
    ctx.fillRect(x, y, this.size, this.size);
  }
  canMoveLeft(x, y) {
    if (x - 1 <= 0) return false;
    if (this.options.includes(this.grid[x - 1][y])) return true;
    return false;
  }
  canMoveRight(x, y) {
    if (x + 1 >= this.columnCount) return false;
    if (this.options.includes(this.grid[x + 1][y])) return true;
    return false;
  }
  canMoveUp(x, y) {
    if (y - 1 <= 0) return false;
    if (this.options.includes(this.grid[x][y - 1])) return true;
    return false;
  }
  canMoveDown(x, y) {
    if (y + 1 >= this.rowCount) return false;
    if (this.options.includes(this.grid[x][y + 1])) return true;
    return false;
  }
  isEndpointAdjacent() {
    const { x, y } = this.getXY();
    const left = this.grid[x - 1][y];
    if (left === this.endpoint) return "left";

    const right = this.grid[x + 1][y];
    if (right === this.endpoint) return "right";

    const up = this.grid[x][y - 1];
    if (up === this.endpoint) return "up";

    const down = this.grid[x][y + 1];
    if (down === this.endpoint) return "down";
  }

  move() {
    let { x, y } = this.getXY();
    this.grid[x][y] = -1;

    if (!this.canMoveLeft(x, y) && this.vel.x < 0) {
      this.vel.x = 0;
    } else if (!this.canMoveRight(x, y) && this.vel.x > 0) {
      this.vel.x = 0;
    }

    this.x += this.vel.x;

    x = this.getXY().x;
    if (!this.canMoveDown(x, y) && this.vel.y > 0) {
      this.vel.y = 0;
    } else if (!this.canMoveUp(x, y) && this.vel.y < 0) {
      this.vel.y = 0;
    }
    this.y += this.vel.y;

    return [x, y];
  }

  async step(x, y, previous = [], isBacktrack = false, isEnd = false) {
    await new Promise((resolve) => setTimeout(resolve, 1));

    if (!x) {
      x = this.getXY().x;
    }
    if (!y) {
    }
    this.vel.x = 0;
    this.vel.y = 0;

    // get all directions
    let directions = this.getDirections();
    const adjacentEndpoint = this.isEndpointAdjacent();
    if (adjacentEndpoint) {
      directions = [adjacentEndpoint];
      isEnd = true;
    }

    this.render(
      (x = this.x),
      (y = this.y),
      (status = directions.length ? 1 : 0)
    );

    let coordinates = this.getXY();
    x = coordinates.x;
    y = coordinates.y;

    //   if there are no directions, backtrack to previous function
    if (!directions.length) {
      this.grid[x][y] = -1;
      if (isBacktrack) {
        previous.pop();
      }
      if (!previous.length) {
        return;
      }
      const [prevX, prevY] = previous[previous.length - 1];
      this.x = prevX * cellSize;
      this.y = prevY * cellSize;

      this.render(prevX * cellSize, prevY * cellSize, 2);

      await this.step(prevX, prevY, previous, true, isEnd);
      return;
    }

    //   choose a random direction
    const randomDirection = Math.floor(Math.random() * directions.length);
    const direction = directions.splice(randomDirection, 1)[0];

    //   apply the velocity for the direction
    switch (direction) {
      case "left":
        this.vel.x = -cellSize;
        break;
      case "right":
        this.vel.x = cellSize;
        break;
      case "up":
        this.vel.y = -cellSize;
        break;
      case "down":
        this.vel.y = cellSize;
        break;
    }
    if (isEnd) {
      this.render(x * cellSize + this.vel.x, y * cellSize + this.vel.y, 1);
      this.render();
      return;
    }

    //   move and push to the previous visited coordinates
    previous.push([x, y]);
    this.move();

    coordinates = this.getXY();
    x = coordinates.x;
    y = coordinates.y;
    await this.step(x, y, previous, false, isEnd);
  }

  getDirections() {
    const { x, y } = this.getXY();
    const directions = [];
    if (this.canMoveLeft(x, y)) {
      directions.push("left");
    }
    if (this.canMoveRight(x, y)) {
      directions.push("right");
    }
    if (this.canMoveUp(x, y)) {
      directions.push("up");
    }
    if (this.canMoveDown(x, y)) {
      directions.push("down");
    }
    return directions;
  }

  getXY() {
    return {
      x: ~~(this.x / cellSize),
      y: ~~(this.y / cellSize),
    };
  }
}

const row = 1;
const id = 4;
let x = 0;
for (let i = 0; i < mazeArray.length; i++) {
  if (mazeArray[i][row] == id) {
    x = i * cellSize;
    break;
  }
}

console.log(x, row * cellSize);
const player = new Player(x, row * cellSize, cellSize, mazeArray);
player.vel.y = 1;

for (let i = 0; i < mazeArray.length; i++) {
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillText(i, i * cellSize, cellSize * 0.8);
  ctx.fillText(i, 0, i * cellSize + cellSize, cellSize);
}

let clicked = false;
let timeStart;
document.addEventListener("click", async () => {
  if (!clicked) {
    console.log("clicked");
    timeStart = Date.now();
    clicked = true;
    await player.step();
    document.querySelector(".mask").classList.remove("hidden");
    document.getElementById("time").innerHTML = `Time to solve: ${(
      (Date.now() - timeStart) /
      1000
    ).toFixed(2)}s`;
  }
});

document.getElementById("solve").addEventListener("click", () => {
  document.querySelector(".mask").classList.add("hidden");
});
