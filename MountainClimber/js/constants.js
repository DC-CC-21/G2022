//#region Canvas
const canvas = document.getElementById("svgCanvas");
canvas.style.margin = "auto";
const c = new Canvas(canvas, window.innerWidth, window.innerHeight, true);
const pointSize = document.getElementById("pointSize");
//#endregion

const mapWidth = 746;
const mapHeight = 706;
pointSize.value = 10;
let collectedCoins = 0;
let G = c.map(0.35, 0, 706, 0, Height);
//#region document elements
const dispPSize = document.getElementById("currentPSize");
const CWidth = document.getElementById("CWidth");
const CHeight = document.getElementById("CHeight");
const maxAValue = document.getElementById("maxAValue");
//#endregion

//#region constants
const blockSize = c.map(50, 0, 706, 0, Height);

let MAX_ANGLE = 60;
let mouseX = 0;
let mouseY = 0;
let mouseT = [];
let mouseIsPressed = false;
let keys = [];
let points = [];
let level = 3;
let WorldWidth = 0;
//#endregion