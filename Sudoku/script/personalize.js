import SudokuStorage from "./Storage.js";

const storage = new SudokuStorage();
console.log(storage);

const imageSets = document.getElementById("imageSets");
const addSetBtn = document.getElementById("addSet");
const fileInput = document.getElementById("hidden");
const [b64Canvas, ctx] = initCanvas(
  document.getElementById("b64Canvas"),
  80,
  80,
  "transparent",
  true
);
let currentSet = 0;

function initCanvas(
  canvas,
  width,
  height,
  bgColor = "transparent",
  hidden = false
) {
  canvas.width = width;
  canvas.height = height;
  canvas.style.backgroundColor = bgColor;
  const ctx = canvas.getContext("2d");
  if (hidden) {
    canvas.style.display = "none";
  }

  return [canvas, ctx];
}

function file2b64(file, callback) {
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  image.onload = function () {
    console.log(b64Canvas);
    ctx.drawImage(
      image,
      0,
      0,
      b64Canvas.width,
      b64Canvas.height
    );

    const b64 = b64Canvas.toDataURL("image/png", 1);
    callback(b64);
  };
}

function initializeNewSet(images = []) {
  const div = document.createElement("div");

  images.forEach((image) => {
    let img = document.createElement("img");
    img.src = image;
    div.append(img);
  });

  const imagePlaceholder = document.createElement("div");
  imagePlaceholder.classList.add("imagePlaceholder");

  const addButton = document.createElement("button");
  addButton.classList.add("addButton");
  addButton.innerHTML = "+";
  addButton.onclick = () => {
    currentSet = imageSets.children.length;
    fileInput.click();
  };

  div.append(imagePlaceholder, addButton);
  imageSets.insertBefore(div, imageSets.lastElementChild);
}

Object.values(storage.data.images).forEach(initializeNewSet);

addSetBtn.addEventListener("click", initializeNewSet);
hidden.addEventListener("change", (e) => {
  const files = e.target.files;
  if (files.length) {
    console.log(
      file2b64(files[0], (b64) =>
        storage.addImage(currentSet, b64)
      )
    );
  }
});
