const colorContainer = document.getElementById("colors");
const savedColors = document.getElementById("saved");
let svgDraw = new Canvas();
let selectedEl = false;

// let C = []
// for(let i = 0; i < 10; i ++){
//   let c = []
//   for(let i = 0; i < 5; i ++){
//     let r = ~~svgDraw.random(0, 255);
//     let g = ~~svgDraw.random(0, 255);
//     let b = ~~svgDraw.random(0, 255);
//     c.push(svgDraw.rgbToHex(r, g, b).toUpperCase())
//   }
//   C.push(c)
// }
// console.log(C)
// localStorage.setItem('colors', JSON.stringify(C))

function createDiv() {
  let el = document.createElement("div");
  let p = document.createElement("p");
  let random = document.createElement("button");
  //color
  let r = ~~svgDraw.random(0, 255);
  let g = ~~svgDraw.random(0, 255);
  let b = ~~svgDraw.random(0, 255);

  el.classList.toggle("colors");
  p.innerHTML = svgDraw.rgbToHex(r, g, b).toUpperCase();
  random.innerHTML = "random";
  let gradients = gradient(r,g,b);

  p.setAttribute("contenteditable", true);
  el.style.backgroundColor = `rgb(${r},${g},${b})`;
  el.append(p);

  el.append(random);
  el.append(gradients);
  colorContainer.append(el);
  colorContainer.style.gridTemplateColumns = `repeat(${colorContainer.children.length}, auto)`;
}
function recolor() {
  Array.from(colorContainer.children).forEach((child) => {
    child.style.backgroundColor = child.children[0].innerHTML;
  });
  console.log("hi");
}

function gradient(r,g,b) {
  let gd = document.createElement("div");
  gd.setAttribute("id", "gradient");
  let percentFade = 1;
  for (let i = 0; i < 10; i++) {
    let div = document.createElement("div");

    let diffRed = 0 - r;
    let diffGreen = 0 - g;
    let diffBlue = 0 - b

    diffRed = diffRed * percentFade + r;
    diffGreen = diffGreen * percentFade + g;
    diffBlue = diffBlue * percentFade + b;

    // div.style.backgroundColor = 'white'
    div.style.margin = "1px";
    gd.append(div);
  }
  return g;
}

function readSavedColors() {
  savedColors.innerHTML = "";
  const saved = JSON.parse(localStorage.getItem("colors"));
  console.log(saved);
  Object.keys(saved).forEach((element, index) => {
    let el = document.createElement("div");
    let p = document.createElement("p");
    p.innerHTML = Object.keys(saved)[index];
    el.append(p);
    saved[element].forEach((child) => {
      let childEl = document.createElement("div");
      // childEl.innerHTML = child
      el.style.gridTemplateColumns = `repeat(${saved[element].length}, 1fr)`;
      // el.style.width =
      childEl.style.backgroundColor = child;
      el.append(childEl);
    });

    // el.innerHTML = element
    savedColors.append(el);
  });
  console.log(saved);
}
function deleteDiv() {
  colorContainer.removeChild(selectedEl);
  colorContainer.style.gridTemplateColumns = `repeat(${colorContainer.children.length}, 1fr)`;
}

function save() {
  let saved = JSON.parse(localStorage.getItem("colors"));
  if (!saved) {
    saved = {};
  }
  let name = document.querySelectorAll("input")[0].value;
  let customColors = [];
  Array.from(colorContainer.children).forEach((child) => {
    customColors.push(child.style.backgroundColor);
  });

  // console.log(saved)
  saved[name] = customColors;
  console.log(customColors);
  localStorage.setItem("colors", JSON.stringify(saved));
  readSavedColors();
}

function randomColor() {
  let r = ~~svgDraw.random(0, 255);
  let g = ~~svgDraw.random(0, 255);
  let b = ~~svgDraw.random(0, 255);
  let hex = svgDraw.rgbToHex(r, g, b);
  selectedEl.style.backgroundColor = hex;
  selectedEl.children[0].innerHTML = hex;
}

if (localStorage.getItem("colors")) {
  readSavedColors();
} else {
  saved.innerHTML = "You have no saved colors";
}

for (let i = 0; i < 3; i++) {
  createDiv();
}

document.getElementById("add").addEventListener("click", (_) => {
  createDiv();
});
document.getElementById("delete").addEventListener("click", (_) => {
  if (selectedEl) {
    deleteDiv();
  }
});
colorContainer.addEventListener("keyup", () => {
  recolor();
});
document.getElementById("save").addEventListener("click", save);

document.addEventListener("click", (e) => {
  console.log(e.target.parentNode.classList);
  if (selectedEl) {
    selectedEl.classList.toggle("selected");
  }
  if (e.target.classList.value.includes("colors")) {
    selectedEl = e.target;
    selectedEl.classList.toggle("selected");
  }
  if (
    e.target.tagName == "BUTTON" &&
    e.target.parentNode.classList.value.includes("colors")
  ) {
    selectedEl = e.target.parentNode;
    randomColor();
  }
});
