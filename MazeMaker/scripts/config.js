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

  setStatus(status) {
    switch (status) {
      case "generating maze":
        this.running = true;
        break;
      default:
        this.running = false;
    }
  }
}
export const config = new Config();
setCanvasSize(config.canvas, config.canvasSize, config.canvasSize);
