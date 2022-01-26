var puzzle = document.getElementById("puzzle");
for (let i = 0; i < 600; i++) {
  var d = document.createElement("div");
  d.innerHTML = i;
  d.setAttribute("class", "piece");
  d.style.cursor = "normal";
  d.style.left = Math.random() * window.innerWidth + "px";
  d.style.top = Math.random() * window.innerHeight + "px";
  puzzle.append(d);
}

var element;

window.addEventListener("mousedown",chooseElement);
window.addEventListener("mousemove",moveElement);
window.addEventListener("mouseup",  releaseElement);

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
    element.style.left = e.clientX + "px";
    element.style.top = e.clientY + "px";
  }
}
function releaseElement(e) {
  e.preventDefault();
  element.style.zIndex = "0";
  element = false;
}
