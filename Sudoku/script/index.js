import { Sudoku } from "./Sudoku.js";

console.log("Init Sudoku")

const values = "ABCDEFGHI".split("")
const sudokuContainer = document.getElementById("sudoku");
const gridSize = 9;

const tileSize = (window.innerWidth * 0.9) / gridSize;
const difficulty = "easy"

const sudoku = new Sudoku(sudokuContainer, gridSize, tileSize, difficulty, values);
sudoku.init();
