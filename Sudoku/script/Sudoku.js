import { Tile } from "./Tile.js";

export class Sudoku {
  constructor(
    parent,
    gridSize,
    tileSize,
    difficulty = "easy",
    values = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  ) {
    this.board = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(0)
    );
    this.gridSize = gridSize;
    this.tileSize = tileSize;
    this.parent = parent;
    this.boxSize = 3;
    this.active = null;
    this.activeValue = null;
    this.difficulty = {
      easy: 0.03,
      medium: 0.5,
      hard: 0.8,
    }[difficulty];
    this.contentValues = values;
  }

  // Init functions
  init() {
    this.initBoard();
    this.initOptionTiles();
  }

  initBoard() {
    this.boardParent = document.createElement("div");
    this.boardParent.classList.add("board");

    this.parent.append(this.boardParent);

    this.board.flat().forEach(this.fillBoard.bind(this));

    const boxCount = this.gridSize / this.boxSize;
    for (let i = 0; i < boxCount; i++) {
      for (let j = 0; j < boxCount; j++) {
        const box = document.createElement("div");
        box.classList.add("box");
        this.boardParent.append(box);

        const boxValues = this.getBox(
          i * this.boxSize,
          j * this.boxSize
        );

        boxValues.forEach((value, index) => {
          const x = j * this.boxSize + (index % this.boxSize);
          const y =
            i * this.boxSize + Math.floor(index / this.boxSize);
          const tile = new Tile(
            box,
            x,
            y,
            value,
            this.tileSize,
            this.tileClicked.bind(this),
            this.contentValues
          );
          this.board[y][x] = tile;
        });
      }
    }

    this.hideTiles();
  }

  initOptionTiles() {
    this.optionParent = document.createElement("div");
    this.optionParent.classList.add("options");
    this.parent.append(this.optionParent);

    for (let i = 0; i <= 9; i++) {
      const option = document.createElement("div");
      option.classList.add("option");
      option.setAttribute("data", i || " ");
      option.innerText = this.contentValues[i - 1] || "";
      option.addEventListener(
        "click",
        this.optionClicked.bind(this)
      );
      this.optionParent.append(option);
    }
  }

  // Board init helpers
  fillBoard() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const values = [];
    for (let i = 0; i < 9; i++) {
      const random = Math.floor(Math.random() * numbers.length);
      values.push(numbers.splice(random, 1)[0]);
    }

    // const isValid = (row, column, value) => {
    //   const rowValue = this.getRow(row);
    //   const columnValue = this.getColumn(column);
    //   const boxValue = this.getBox(row, column);

    //   return (
    //     !rowValue.includes(value) &&
    //     !columnValue.includes(value) &&
    //     !boxValue.includes(value)
    //   );
    // };

    const solve = () => {
      for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
          if (this.board[row][column] === 0) {
            for (let value of values) {
              if (this.isValid(row, column, value)) {
                this.board[row][column] = value;
                if (solve()) {
                  return true;
                }
                this.board[row][column] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    solve();
  }

  hideTiles() {
    const board = this.board.flat();
    const hiddenCount = Math.floor(
      this.difficulty * board.length
    );

    for (let i = 0; i < hiddenCount; i++) {
      const randomIndex = Math.floor(
        Math.random() * board.length
      );
      board[randomIndex].setHidden();
    }
  }

  isValid(row, column, value) {
    const rowValue = this.getRow(row);
    const columnValue = this.getColumn(column);
    const boxValue = this.getBox(row, column);

    return (
      !rowValue.includes(value) &&
      !columnValue.includes(value) &&
      !boxValue.includes(value)
    );
  }

  // Click handlers
  optionClicked(e) {
    const [value] = e.target.getAttribute("data");
    this.clearHighlight();
    if (this.active) {
      this.active.setValue(value);
      this.active = null;
      this.checkBoardFinished();
    } else {
      this.clearActiveOptions();
      if (this.activeValue == value) {
        this.activeValue = null;
        e.target.classList.remove("active");
      } else {
        this.activeValue = value;
        e.target.classList.add("active");
        const match = this.getMatches(value);
        this.applyHighlight(match, "match");
      }
      console.log(this.activeValue);
    }
  }

  tileClicked(y, x, value) {
    const tile = this.board[y][x];

    if (!this.activeValue) {
      const row = this.getRow(y);
      const column = this.getColumn(x);
      const box = this.getBox(y, x);
      const match = this.getMatches(value);

      this.active = tile;
      this.clearHighlight();
      this.applyHighlight(row, "row");
      this.applyHighlight(column, "column");
      this.applyHighlight(box, "box");
      this.applyHighlight(match, "match");
    } else {
      tile.setValue(this.activeValue);
      setTimeout(() => {
        tile.setInactive();
      }, 1);
    }
  }

  // Highlighters
  clearActiveOptions() {
    Array.from(this.optionParent.children).forEach((child) => {
      child.classList.remove("active");
    });
  }

  checkBoardFinished() {
    const isFinished = this.board
      .flat()
      .every((tile) => parseInt(tile.value));
    if (isFinished) {
      let incorrect = 0;
      this.clearHighlight();
      this.board.forEach((row, y) => {
        row.forEach((value, x) => {
          if (
            !this.isValid(y, x, value) &&
            value.origValue != value.value
          ) {
            console.log(x, y, value);
            incorrect += 1;
            value.setIncorrect();
          }
        });
      });
      console.log(incorrect)
      if (!incorrect) {
        setTimeout(() => {
          alert("You have finished the game!");
        }, 500);
      }
    }
  }

  applyHighlight(tiles, highlightType) {
    tiles.forEach((tile) => {
      tile.applyHighlight(highlightType);
    });
  }

  clearHighlight() {
    this.board.flat().forEach((tile) => {
      tile.clearHighlight();
    });
  }

  // Getters
  getRow(rowIndex) {
    return this.board[rowIndex];
  }

  getColumn(columnIndex) {
    return this.board.map((x) => x[columnIndex]);
  }

  getBox(rowIndex, columnIndex) {
    const box = [];

    const boxStart = {
      x: Math.floor(columnIndex / this.boxSize) * this.boxSize,
      y: Math.floor(rowIndex / this.boxSize) * this.boxSize,
    };

    for (let i = 0; i < this.boxSize; i++) {
      for (let j = 0; j < this.boxSize; j++) {
        box.push(this.board[boxStart.y + i][boxStart.x + j]);
      }
    }

    return box;
  }

  getMatches(value) {
    return this.board
      .flat()
      .filter((tile) => tile.value == value && tile.value > 0);
  }
}
