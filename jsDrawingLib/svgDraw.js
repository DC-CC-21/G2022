let draw;
let _CANVAS_;
let Width;
let Height;

class Canvas {
  //private variables
  //#region
  #canvas;
  #fillColor = "#fff";
  #strokeColor = "#000";
  #strokeWeightSize = 1;
  #rotation = 90;
  #textSize = 18;
  //#endregion

  constructor(canvas, width, height, showCanvasDimensions) {
    // SETUP this.#canvas
    this.#canvas = canvas;
    this.#canvas.style.overflow = "hidden";
    this.#canvas.style.position = "relative";
    this.#canvas.style.width = (width || 400) + "px";
    this.#canvas.style.height = (height || 400) + "px";
    this.#canvas.style.margin = "auto";
    Width = width;
    Height = height;
    //1536x754
    console.log(`Your canvas is ${Width}x${Height}`)
    recursive();
    if(showCanvasDimensions){
      this.showCanvasDimensions()
    }
  }
  showCanvasDimensions(){
    let el = document.createElement("h1")
    el.innerHTML = `${Width}x${Height}`;
    el.style.position = 'absolute'
    el.style.left = '10px'
    el.style.top = '10px'
    document.querySelector('body').append(el)
  }

  //SHAPES
  rect(x, y, width, height, radius) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    el.setAttribute("x", x);
    el.setAttribute("y", y);
    el.setAttribute("width", width);
    el.setAttribute("height", height);
    el.setAttribute("fill", this.#fillColor);

    el.setAttribute("stroke", this.#strokeColor);
    el.setAttribute("stroke-width", this.#strokeWeightSize);
    // el.setAttribute("transform","rotate(-90 50 100)")
    if (radius) {
      el.setAttribute("rx", radius);
      el.setAttribute("ry", radius);
    }
    this.#canvas.append(el);
  }

  ellipse(x, y, width, height) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    el.setAttribute("cx", x);
    el.setAttribute("cy", y);
    el.setAttribute("rx", width / 2);
    el.setAttribute("ry", height / 2);
    el.setAttribute("fill", this.#fillColor);
    el.setAttribute("stroke", this.#strokeColor);
    el.setAttribute("stroke-width", this.#strokeWeightSize);
    this.#canvas.append(el);
  }

  point(x, y) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    el.setAttribute("cx", x);
    el.setAttribute("cy", y);
    el.setAttribute("rx", this.#strokeWeightSize);
    el.setAttribute("ry", this.#strokeWeightSize);
    el.setAttribute("fill", this.#fillColor);
    el.setAttribute("stroke", this.#strokeColor);
    el.setAttribute("stroke-width", this.#strokeWeightSize);
    this.#canvas.append(el);
  }

  polygon(x, y, x2, y2, x3, y3, x4, y4) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    el.setAttribute("points", `${x},${y} ${x2},${y2} ${x3},${y3} ${x4},${y4}`);
    el.setAttribute("fill", this.#fillColor);
    el.setAttribute("stroke", this.#strokeColor);
    el.setAttribute("stroke-width", this.#strokeWeightSize);

    this.#canvas.append(el);
  }

  text(txt, x, y) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "text");
    el.setAttribute("x", x);
    el.setAttribute("y", y);
    el.innerHTML = txt;
    // el.setAttribute("rx", this.#strokeWeightSize);
    // el.setAttribute("ry", this.#strokeWeightSize);
    el.setAttribute("fill", this.#fillColor);
    el.setAttribute("stroke", this.#strokeColor);
    // el.setAttribute("stroke-width", this.#strokeWeightSize);
    el.setAttribute("font-size", this.#textSize);
    this.#canvas.append(el);
  }

  textSize(size) {
    this.#textSize = size;
  }

  line(x, y, x2, y2) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "line");
    // el.setAttribute('points', `${x},${y} ${x2},${y2} ${x2},${y2+this.#strokeWeightSize} ${x},${y+this.#strokeWeightSize} `)
    el.setAttribute("x1", x);
    el.setAttribute("y1", y);
    el.setAttribute("x2", x2);
    el.setAttribute("y2", y2);
    el.setAttribute("stroke", this.#strokeColor);
    el.setAttribute("stroke-width", this.#strokeWeightSize);
    this.#canvas.append(el);
  }

  image(img, x, y, width, height) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "image");
    el.setAttribute("preserveAspectRatio","none")
    el.setAttribute("x", x);
    el.setAttribute("y", y);
    el.setAttribute("width", width)
    el.setAttribute("height", height);
    // el.style.width = 1000 + 'px'
    // el.style.height = height + 'px'
    el.setAttribute("href", img);
    this.#canvas.append(el);
  }
  //COLOR & STYLE
  background(r, g, b, a) {
    this.#canvas.innerHTML = "";
    if (r != undefined && g != undefined && b != undefined && a != undefined) {
      this.#canvas.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a})`;
    } else if (r != undefined && g != undefined && b != undefined) {
      this.#canvas.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    } else if (r != undefined && g != undefined) {
      this.#canvas.style.backgroundColor = `rgba(${r}, ${r}, ${r}, ${255})`;
    } else {
      this.#canvas.style.backgroundColor = r;
    }
  }

  fill(r, g, b, a) {
    if (r != undefined && g != undefined && b != undefined && a != undefined) {
      this.#fillColor = `rgba(${r}, ${g}, ${b}, ${a})`;
    } else if (r != undefined && g != undefined && b != undefined) {
      this.#fillColor = `rgb(${r}, ${g}, ${b})`;
    } else if (r != undefined && g != undefined) {
      this.#fillColor = `rgba(${r}, ${r}, ${r}, ${255})`;
    } else {
      this.#fillColor = r;
    }
  }

  stroke(r, g, b, a) {
    if (r != undefined && g != undefined && b != undefined && a != undefined) {
      this.#strokeColor = `rgba(${r}, ${g}, ${b}, ${a})`;
    } else if (r != undefined && g != undefined && b != undefined) {
      this.#strokeColor = `rgb(${r}, ${g}, ${b})`;
    } else if (r != undefined && g != undefined) {
      this.#strokeColor = `rgba(${r}, ${r}, ${r}, ${255})`;
    } else {
      this.#strokeColor = r;
    }
  }

  strokeWeight(n) {
    this.#strokeWeightSize = n;
  }

  //transformations
  rotate(deg) {
    this.#rotation = deg;
  }

  //math type functions
  dist(x, y, x2, y2) {
    let X = x - x2;
    let Y = y - y2;
    return Math.sqrt(X * X + Y * Y);
  }

  map(value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
  }

  //line collide
  insideLineBounds(point1, point2, p) {
    let x = point1.x > point2.x ? point2.x : point1.x;
    let y = point1.y > point2.y ? point2.y : point1.y;
    let w = Math.abs(point2.x - point1.x);
    let h = Math.abs(point2.y - point1.y);
    return p.x - x < w && x - p.x < p.w && p.y - y < h && y - p.y < p.h;
  }
  lineSlope(point1, point2, p) {
    let x = point2.x - point1.x;
    let y = point2.y - point1.y;
    let m = y / x;
    let b = point1.y - m * point1.x;
    return { m: m, b: b };
  }
  collideLine(line, p, xOffset, yOffset) {
    return line.m * (p.x + xOffset) + line.b + yOffset;
  }

  //rect collide
  rectCollide(a, b) {
    return (
      a.x - b.x < b.w && b.x - a.x < a.w && a.y - b.y < b.h && b.y - a.y < a.h
    );
  }
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
// let canvas = document.getElementById("svgCanvas", 100, 100);

// let c = new Canvas(canvas);

// c.background("#00aaff");
// c.rect(0, 0, 100, 100, 10);

// c.stroke(0, 255, 0, 255);
// c.fill(255, 0, 0);
// c.strokeWeight(10);
// c.rect(100, 100, 50, 50, 10);
// c.line(0,0,110,100)
// c.line(100,100,200,50)

// c.stroke(255, 0, 255);
// c.fill(0, 0, 255, 10);
// c.strokeWeight(2);
// c.ellipse(0, 100, 100, 100);

// c.strokeWeight(10);
// c.fill(75,255)
// c.ellipse(125, 101, 50, 99);

// let x = 0;
// draw = function () {
//   c.background(100, 100, 100, 255);
//   c.rect(x, 0, 100, 100);
// };
