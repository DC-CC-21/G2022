createCanvas("container");

let TETRIS = {
  rows: 20,
  columns: 10,
  bSize: 60,
};

let board = Array.from({ length: TETRIS.rows }, () =>
  Array(TETRIS.columns).fill(0)
);
let pieceTypes = [
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
];
// console.table(board);
class Piece {
  constructor() {
    this.piece = pieceTypes[0];
    this.x = 0;
    this.y = 0;
  }
  flip() {
    this.piece.forEach((row) => row.reverse());
  }
  draw() {
    // this.rotate();
    this.piece.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 1) {
          strokeWeight(0);
          fill(255, 0, 0);
          rect(x * TETRIS.bSize, y * TETRIS.bSize, TETRIS.bSize, TETRIS.bSize);
        }
      });
    });
  }
}
let p = new Piece();
p.draw();
// p.move()

// let piece = pieceTypes[0];
// piece.forEach((row, y) => {
//   row.forEach((value, x) => {
//     if (value === 1) {
//       strokeWeight(0);
//       fill(255, 0, 0);
//       rect(x * TETRIS.bSize, y * TETRIS.bSize, TETRIS.bSize, TETRIS.bSize);
//     }
//   });
// });

// cnv.style.transform = "scale(10)";
