import { config } from "./config.js";

// FUNCTIONS
function drawImage(imageSrc) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  imageInfo.image.src = imageSrc;
  imageInfo.image.onload = () => {
    redraw();
  };
}

function blackOrWhite(a) {
  return a > thresholdRange.value ? 255 : 0; //> 255 ? 255 : 0;
}

// Function to create boxes
function boxify() {
  const { width, height } = canvas;
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const resolution = resolutionRange.value;

  const squaresPerRow = Math.floor(width / resolution);
  const squaresPerColumn = Math.floor(height / resolution);
  const arr = Array.from({ length: squaresPerRow }, () =>
    Array.from({ length: squaresPerColumn }, () => 0)
  );

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);
  for (let row = 0; row < squaresPerColumn; row++) {
    for (let col = 0; col < squaresPerRow; col++) {
      const x = col * resolution;
      const y = row * resolution;
      const pixelIndex = (y * width + x) * 4;

      let r = blackOrWhite(imgData[pixelIndex] * rRange.value);
      let g = blackOrWhite(imgData[pixelIndex + 1] * gRange.value);
      let b = blackOrWhite(imgData[pixelIndex + 2] * bRange.value);
      let a = 255 - Math.max(r, g, b);

      arr[col][row] = Math.min(r, g, b) / 255 === 0 ? 5 : 0;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      ctx.fillRect(x, y, resolution, resolution);
    }
  }
  return arr;
}

// Function to create outline
function genOutline() {
  const { width, height } = canvas;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

    data[i] = blackOrWhite(255 - avg);
    data[i + 1] = blackOrWhite(255 - avg);
    data[i + 2] = blackOrWhite(255 - avg);
  }
  ctx.putImageData(imgData, 0, 0);
}

// Finished combination of the box and outline functions
function genBoxedOutline() {
  const { width, height } = canvas;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const resolution = resolutionRange.value;

  const squaresPerRow = Math.floor(width / resolution);
  const squaresPerColumn = Math.floor(height / resolution);
  const arr = Array.from({ length: squaresPerRow }, () =>
    Array.from({ length: squaresPerColumn }, () => 0)
  );
  const mazeRGB = config.getRGB();

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);

  // ctx.drawImage(imageInfo.image, 0, 0, width, height);
  for (let row = 0; row < squaresPerColumn; row++) {
    for (let col = 0; col < squaresPerRow; col++) {
      const x = col * resolution;
      const y = row * resolution;
      const pixelIndex = (y * width + x) * 4;

      const r = data[pixelIndex] * rRange.value;
      const g = data[pixelIndex + 1] * gRange.value;
      const b = data[pixelIndex + 2] * bRange.value;
      const avg = (r + g + b) / 3;

      const avgR = blackOrWhite(255 - avg);
      const avgG = blackOrWhite(255 - avg);
      const avgB = blackOrWhite(255 - avg);
      const color = blackOrWhite((avgR + avgG + avgB) / 3);
      const a = color === 255 ? 255 : 0;

      arr[col][row] = color === 255 ? 5 : 0;
      ctx.fillStyle = `rgba(${mazeRGB.r}, ${mazeRGB.g}, ${mazeRGB.b}, ${a})`;
      ctx.fillRect(x, y, resolution, resolution);
    }
  }
  return arr;
}

function redraw() {
  config.setStatus("stopped");

  imageInfo.x = xRange.value * canvas.width;
  imageInfo.y = yRange.value * canvas.height;
  imageInfo.scale = scaleRange.value;

  const { x, y, scale } = imageInfo;

  const aspectRatio = imageInfo.image.width / imageInfo.image.height;
  let imageWidth, imageHeight;

  if (imageInfo.image.width > imageInfo.image.height) {
    imageWidth = canvas.width;
    imageHeight = canvas.height / aspectRatio;
  } else {
    imageHeight = canvas.height;
    imageWidth = canvas.width * aspectRatio;
  }
  imageWidth *= scale;
  imageHeight *= scale;

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    imageInfo.image,
    x - (imageWidth / 2 - canvas.width / 2),
    y - (imageHeight / 2 - canvas.height / 2),
    imageWidth,
    imageHeight
  );
  // config.mazeArray = boxify();
  // genOutline();
  config.mazeArray = genBoxedOutline();
  console.log(config.mazeArray.length)
}

// ELEMENTS
const imageButton = document.getElementById("imageButton");
const xRange = document.getElementById("x");
const yRange = document.getElementById("y");
const scaleRange = document.getElementById("scale");
const resolutionRange = document.getElementById("resolution");
const rRange = document.getElementById("r");
const gRange = document.getElementById("g");
const bRange = document.getElementById("b");
const thresholdRange = document.getElementById("threshold");

// VARIABLES
const ctx = config.ctx;
const imageInfo = {
  x: 0,
  y: 0,
  scale: 1,
  image: new Image(),
};

// FN CALLS
drawImage("./PoohIcon.jpg");

// EVENT LISTENERS
imageButton.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const imageURL = URL.createObjectURL(file);
    drawImage(imageURL);
  }
});
xRange.addEventListener("input", redraw);
yRange.addEventListener("input", redraw);
scaleRange.addEventListener("input", redraw);
resolutionRange.addEventListener("input", redraw);
rRange.addEventListener("input", redraw);
gRange.addEventListener("input", redraw);
bRange.addEventListener("input", redraw);
thresholdRange.addEventListener("input", redraw);
config.picColor.addEventListener("input", redraw);
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("toolButton")) {
    e.target.parentElement.classList.toggle("open");
  }
});
