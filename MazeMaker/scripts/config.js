function setCanvasSize(canvas, width, height) {
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = canvas.width + "px";
  canvas.style.height = canvas.height + "px";
}

class Config {
  mazeArray = [];
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvasSize = Math.min(window.innerWidth, window.innerHeight) * 0.8;
  running = false;
  picColor = document.getElementById("picColor");

  setStatus(status) {
    switch (status) {
      case "generating maze":
        this.running = true;
        break;
      default:
        this.running = false;
    }
  }
  getRGB() {
    const hexColor = this.picColor.value;

    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    return { r, g, b };
  }
}
export const config = new Config();
setCanvasSize(config.canvas, config.canvasSize, config.canvasSize);
