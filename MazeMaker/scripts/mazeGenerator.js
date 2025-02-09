import { config } from "./config.js";

class Maze {
  constructor(width, height, size) {
    this.width = width;
    this.height = height;

    this.size = Math.floor(width / size);

    this.columnCount = size;
    this.rowCount = size;

    console.log(this.width, this.height, size);
    console.log(this.columnCount, this.rowCount);
    this.grid = new Array(this.columnCount);
    for (let i = 0; i < this.columnCount; i++) {
      this.grid[i] = new Array(this.rowCount);
      for (let j = 0; j < this.rowCount; j++) {
        this.grid[i][j] = 0;
        this.drawCell(i, j, 0);
      }
    }
    this.blockWalls();
  }
  blockWalls() {
    this.grid.forEach((row, i) => {
      row.forEach((_, j) => {
        if (i === 0 || j === 0) {
          this.grid[i][j] = 1;
          this.drawCell(i, j, 1);
        } else if (i === this.columnCount - 1 || j === this.rowCount - 1) {
          this.drawCell(i, j, 0);
          this.grid[i][j] = 1;
        }
      });
    });
  }
  setArr(arr) {
    arr.forEach((row, i) => {
      row.forEach((v, j) => {
        if (i < this.columnCount && j < this.rowCount && v > 0) {
          this.drawCell(i, j, 5);
        }
      });
    });
  }

  drawCell(x, y, status) {
    this.grid[x][y] = status;
    if (status === 0) {
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillRect(x * this.size, y * this.size, this.size, this.size);
    } else if (status === 5) {
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillRect(x * this.size, y * this.size, this.size, this.size);
    } else if (status === 1 || !debug) {
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillRect(x * this.size, y * this.size, this.size, this.size);
    } else if (status === 2) {
      ctx.fillStyle = "rgb(0, 255, 0)";
      ctx.fillRect(x * this.size, y * this.size, this.size, this.size);
    } else if (status === 3) {
      ctx.fillStyle = "rgb(202, 202, 202)";
      ctx.fillRect(x * this.size, y * this.size, this.size, this.size);
    } else if (status === 4) {
      ctx.fillStyle = "rgb(0, 255, 255)";
      ctx.fillRect(x * this.size, y * this.size, this.size, this.size);
    }
  }
  async step(x, y, previous = [], isBacktrack = false) {
    if (!config.running) {
      return;
    }
    await new Promise((resolve) =>
      setTimeout(resolve, (speedRange.max - speedRange.value) * 2)
    );
    functionGraph.push(previous.length);

    if (!x) {
      x = Math.floor(Math.random() * this.columnCount);
      x += x % 2;
    }
    if (!y) {
      y = Math.floor(Math.random() * this.rowCount);
      y += y % 2;
    }

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

    if (directions.length === 0) {
      this.drawCell(x, y, 3);

      if (isBacktrack) {
        previous.pop();
      }

      if (previous.length === 0) return;
      const [prevX, prevY] = previous[previous.length - 1];
      await this.step(prevX, prevY, previous, true);
      return;
    }
    previous.push([x, y]);

    const random = Math.floor(Math.random() * directions.length);
    const direction = directions.splice(random, 1)[0];

    let nx = 0,
      ny = 0;

    switch (direction) {
      case "left":
        this.drawCell(x - 1, y, 1);
        nx = -2;
        break;
      case "right":
        this.drawCell(x + 1, y, 1);
        nx = 2;
        break;
      case "up":
        this.drawCell(x, y - 1, 1);
        ny = -2;
        break;
      case "down":
        this.drawCell(x, y + 1, 1);
        ny = 2;
        break;
    }
    this.drawCell(x, y, 2);
    await this.step(x + nx, y + ny, previous);
  }

  canMoveLeft(x, y) {
    if (x - 2 < 0) return false;
    if (this.grid[x - 2][y] === 0) return true;
    return false;
  }
  canMoveRight(x, y) {
    if (x + 2 >= this.columnCount) return false;
    if (this.grid[x + 2][y] === 0) return true;
    return false;
  }
  canMoveUp(x, y) {
    if (y - 2 < 0) return false;
    if (this.grid[x][y - 2] === 0) return true;
    return false;
  }
  canMoveDown(x, y) {
    if (y + 2 >= this.rowCount) return false;
    if (this.grid[x][y + 2] === 0) return true;
    return false;
  }
  createOpening() {
    const x = Math.floor(Math.random() * (this.columnCount - 1)) + 1;
    const y = 1;
    this.drawCell(x, y, 4);

    const x2 = Math.floor(Math.random() * (this.columnCount - 2)) + 1;
    const y2 = this.rowCount - 1;
    this.drawCell(x2, y2, 4);
  }
}
function plot(xArray) {
  const yArray = Array.from({ length: xArray.length }, (_, i) => i);

  const data = [
    {
      x: yArray,
      y: xArray,
      mode: "lines",
    },
  ];
  const layout = { width: 500, height: 400, title: "Maze" };
  Plotly.newPlot("myPlot", data, layout);
}

// ELEMENTS
const runButton = document.getElementById("run");
const speedRange = document.getElementById("speed");

// VARIABLES
const debug = true;
const canvas = config.canvas;
const ctx = config.ctx;
const functionGraph = [];

const generate = async () => {
  config.setStatus("stopped");
  await new Promise((resolve) => {
    setTimeout((_) => {
      config.setStatus("generating maze");
      resolve();
    }, 100)
  });

  const arr = config.mazeArray;
  const maze = new Maze(canvas.width, canvas.height / 2, arr.length);
  console.log(arr);
  maze.setArr(arr);
  await maze.step();
  maze.createOpening();
};

runButton.addEventListener("click", generate);
