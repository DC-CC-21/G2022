let draw;
let _CANVAS_;
class Canvas {
  constructor(canvas, width, height) {
    // SETUP this.canvas
    this.canvas = canvas;
    this.canvas.style.overflow = "hidden";
    this.canvas.style.position = "relative";
    this.canvas.style.width = (width || 400) + "px";
    this.canvas.style.height = (height || 400) + "px";
    this.canvas.style.margin = "auto";
    this.fillColor = '#fff';
    this.strokeColor = '#000';
    this.strokeWeightSize = 1
    // this.canvas.width = 'auto';
    // this.canvas.height = 'auto';
    _CANVAS_ = this.canvas;

    recursive();
  }

  //SHAPES
  rect(x, y, width, height, radius) {
    let el = document.createElement("div");
    el.style.position = "absolute";
    el.style.left = x-this.strokeWeightSize/2 + "px";
    el.style.top = y-this.strokeWeightSize/2 + "px";
    el.style.width = width + "px";
    el.style.height = height + "px";
    if (radius) {
      el.style.borderRadius = radius + "px";
    }
    el.style.backgroundColor = this.fillColor;
    el.style.border = `${this.strokeWeightSize}px solid ${this.strokeColor}`

    this.canvas.append(el);
  }
  ellipse(x, y, width, height) {
    let el = document.createElement("div");
    el.style.position = "absolute";
    el.style.left = x-this.strokeWeightSize/2 + "px";
    el.style.top = y-this.strokeWeightSize/2 + "px";
    el.style.width = width + "px";
    el.style.height = height + "px";
    el.style.borderRadius = "100%";

    el.style.backgroundColor = this.fillColor;
    el.style.border = `${this.strokeWeightSize}px solid ${this.strokeColor}`

    this.canvas.append(el);
  }

  //COLOR & STYLE
  background(r, g, b, a) {
    this.canvas.innerHTML = ''
    if (r != undefined && g != undefined && b != undefined && a != undefined) {
      this.canvas.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a})`;
    } else if (r != undefined && g != undefined && b != undefined) {
      this.canvas.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    } else if (r != undefined && g != undefined) {
      this.canvas.style.backgroundColor = `rgba(${r}, ${r}, ${r}, ${255})`;
    } else {
      this.canvas.style.backgroundColor = r;
    }
  }

  fill(r, g, b, a) {
    if (r != undefined && g != undefined && b != undefined && a != undefined) {
      this.fillColor = `rgba(${r}, ${g}, ${b}, ${a})`;
    } else if (r != undefined && g != undefined && b != undefined) {
      this.fillColor = `rgb(${r}, ${g}, ${b})`;
    } else if (r != undefined && g != undefined) {
      this.fillColor = `rgba(${r}, ${r}, ${r}, ${255})`;
    } else {
      this.fillColor = r;
    }
  }
  stroke(r, g, b, a) {
    if (r != undefined && g != undefined && b != undefined && a != undefined) {
      this.strokeColor = `rgba(${r}, ${g}, ${b}, ${a})`;
    } else if (r != undefined && g != undefined && b != undefined) {
      this.strokeColor = `rgb(${r}, ${g}, ${b})`;
    } else if (r != undefined && g != undefined) {
      this.strokeColor = `rgba(${r}, ${r}, ${r}, ${255})`;
    } else {
      this.strokeColor = r;
    }
  }

  strokeWeight(n){
    this.strokeWeightSize = n
  }
l\
}
function recursive(frame) {
  if (frame > 100) {
    if (typeof draw == "function") {
      draw();
    } else {
      return;
    }
  }
  requestAnimationFrame(recursive);
}

/// TEST ///
let canvas = document.getElementById("canvas");

let c = new Canvas(canvas);


c.background('#00aaff');
// c.rect(0, 0, 100, 100, 10);

// c.stroke(0,255,0,255)
// c.fill(255,0,0)
// c.ellipse(0, 100, 100, 100);

// c.strokeWeight(10);
// c.fill(75,255)
// c.ellipse(125, 101, 50, 99);

// let x = 0;
// draw = function () {
//   c.background(100, 100, 100, 255);
//   c.rect(x, 0, 100, 100);
// };
