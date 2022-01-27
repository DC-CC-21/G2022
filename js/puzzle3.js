const canvas =
  window.innerWidth > window.innerHeight
    ? window.innerHeight
    : window.innerWidth;
const puzzle = document.getElementById("puzzle");
puzzle.style.width = canvas + "px";
puzzle.style.height = canvas * 0.8 + "px";
let puzzleW = puzzle.clientWidth;
let puzzleH = puzzle.clientHeight;

let difficulty = 25;
console.log(window.location);
difficulty = sq(~~Math.sqrt(difficulty));
let pieceW = puzzleW / Math.sqrt(difficulty);
let pieceH = puzzleH / Math.sqrt(difficulty);
let speed = 5;
let xPos = 0;
let yPos = 0;
let puzzleImg = "./assets/Waterfalls/Waterfall7.svg";

function sq(num) {
  return num * num;
}
function createPieces() {
  if (xPos + yPos * ~~Math.sqrt(difficulty) < difficulty) {
    if (xPos >= Math.sqrt(difficulty)) {
      xPos = 0;
      yPos += 1;
    }
    //action
    let d = document.createElement("div");
    //background and attributes
    d.style.backgroundImage = `url(${puzzleImg})`;
    d.style.backgroundSize = `${puzzleW}px ${puzzleH}px`;
    d.style.backgroundPosition = `${-xPos * pieceW}px ${-yPos * pieceH}px`;
    d.setAttribute("class", "piece");

    //width height and position
    d.dataset.origX = xPos * pieceW;
    d.dataset.origY = yPos * pieceH;
    d.style.width = pieceW + "px";
    d.style.height = pieceH + "px";
    // d.style.left = xPos * pieceW + "px";
    // d.style.top = yPos * pieceH + "px";
    d.style.left = Math.random() * puzzleW + "px";
    d.style.top = Math.random() * puzzleH + "px";
    puzzle.append(d);
    xPos += 1;
    d.innerHTML = xPos + yPos * ~~Math.sqrt(difficulty);
    setTimeout(createPieces, speed);
  }
}
function dist(x, y, x2, y2) {
  let X = x - x2;
  let Y = y - y2;
  return Math.sqrt(sq(X) + sq(Y));
}
createPieces();

let element;
let touching = false;
window.addEventListener("mousedown", chooseElement);
window.addEventListener("mousemove", moveElement);
window.addEventListener("mouseup", releaseElement);

window.addEventListener("touchstart", () => {
  touching = true;
  chooseElement();
});
window.addEventListener("touchmove", moveElement);
window.addEventListener("touchend", releaseElement);

function chooseElement(e) {
  e.preventDefault();
  console.log("click");
  element = e.target;
  element.style.zIndex = "1";
  console.log(element.innerHTML);
}
function moveElement(e) {
  e.preventDefault();
  if (element) {
    if (touching) {
      element.style.left = e.touches[0].clientX + "px";
      element.style.top = e.touches[0].clientY + "px";
    } else {
      element.style.left = e.clientX + "px";
      element.style.top = e.clientY + "px";
    }
  }
}
function releaseElement(e) {
  e.preventDefault();
  element.style.zIndex = "0";
  snapPiece();

  element = false;
}
function readPx(value) {
  return Number(value.replace("px", ""));
}

function snapPiece() {
  let origX = element.dataset.origX;
  let origY = element.dataset.origY;
  if (
    dist(readPx(element.style.left), readPx(element.style.top), origX, origY) <
    (element.clientWidth / 2 + element.clientHeight / 2) / 2
  ) {
    element.style.left = origX + "px";
    element.style.top = origY + "px";
  }
  console.log(readPx(element.style.left));
}
