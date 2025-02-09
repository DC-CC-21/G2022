function bOrw(a) {
  return a > 200 ? 255 : 0; //> 255 ? 255 : 0;
}
function convert2Squares(imgData, width, height, squareSize) {
  const squaresPerRow = Math.floor(width / squareSize);
  const squaresPerColumn = Math.floor(height / squareSize);
  const arr = Array.from({ length: squaresPerRow }, () =>
    Array.from({ length: squaresPerColumn }, () => 0)
  );

  for (let row = 0; row < squaresPerColumn; row++) {
    for (let col = 0; col < squaresPerRow; col++) {
      const x = col * squareSize;
      const y = row * squareSize;
      const pixelIndex = (y * width + x) * 4;

      let r = bOrw(imgData[pixelIndex]);
      let g = bOrw(imgData[pixelIndex + 1]);
      let b = bOrw(imgData[pixelIndex + 2]);
      let a = 255;

      arr[col][row] = Math.min(r, g, b) / 255 === 0 ? 5 : 0;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      ctx.fillRect(x, y, squareSize, squareSize);
    }
  }
  return arr;
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "./olafSvg.png";
img.onload = function () {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newArr = convert2Squares(data, canvas.width, canvas.height, 4); // Adjust the square size as needed
  console.log(newArr);
};
