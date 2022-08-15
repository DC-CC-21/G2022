const colorContainer = document.getElementById("colors");
let svgDraw = new Canvas();

function createDiv() {
  let el = document.createElement("div");
  
  let r = ~~svgDraw.random(0, 255);
  let g = ~~svgDraw.random(0, 255);
  let b = ~~svgDraw.random(0, 255);
  
  el.innerHTML = svgDraw.rgbToHex(r, g, b).toUpperCase();
  el.style.backgroundColor = `rgb(${r},${g},${b})`;
  colorContainer.append(el);
  colorContainer.style.gridTemplateColumns = `repeat(${colorContainer.children.length}, 1fr)`
}
function deleteDiv() {

    colorContainer.removeChild(colorContainer.children(0))
    colorContainer.style.gridTemplateColumns = `repeat(${colorContainer.children.length}, 1fr)`
  }

for (let i = 0; i < 3; i++) {
  createDiv();
}


document.getElementById('add').addEventListener('click', _ => {
    createDiv()
})
document.getElementById('delete').addEventListener('click', _ => {
    deleteDiv()
})