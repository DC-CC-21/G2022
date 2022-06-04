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
  #textAlign = "left";
  #cameraPos = { x: 0, y: 0 };
  //#endregion

  constructor(canvas, width, height) {
    // SETUP this.#canvas
    this.#canvas = canvas;
    this.#canvas.style.overflow = "show";
    this.#canvas.style.position = "relative";
    this.#canvas.style.width = (width || 400) + "px";
    this.#canvas.style.height = (height || 400) + "px";
    this.#canvas.style.margin = "auto";
    this.cameraPos = {x:0, y:0}
    Width = width;
    Height = height;
    //1536x754
    console.log(`Your canvas is ${Width}x${Height}`);
    recursive();
    this.createTouchContainer();
  }
  moveCamera(p, w) {
    this.cameraPos = { x: this.constrain(Width/2 - p.x, -w+Width*1.4,0 ), y: 0 };
    this.#cameraPos = this.cameraPos
    // this.textSize(20);
    // this.text(JSON.stringify(this.#cameraPos), 100, 100, true);
  }
  displayStats(lst){
    lst.forEach((stat, index)=>{
      this.fill('#000')
      this.textSize(20)
      this.textAlign('left')

      this.text(stat, 10, 50+index*20,true)
    })
  }

  createTouchContainer() {
    let el = document.createElement("div");
    el.style.backgroundColor = "";
    el.style.position = "absolute";
    el.style.left = "0";
    el.style.top = "0";
    el.style.width = Width + "px";
    el.style.height = Height + "px";

    el.setAttribute("id", "touchContainer");
    document.querySelector("body").append(el);
  }
  //SHAPES
  rect(x, y, width, height, radius, fixed) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    el.setAttribute("x", fixed ? x : x + this.#cameraPos.x);
    el.setAttribute("y", fixed ? y : y + this.#cameraPos.y);
    el.setAttribute("width", width);
    el.setAttribute("height", height);
    el.setAttribute("fill", this.#fillColor);

    el.setAttribute("stroke", this.#strokeColor);
    el.setAttribute("stroke-width", this.#strokeWeightSize);

    // else{el.setAttribute('x', el.getAttribute('x')+this.#canvas.style.left) }
    // el.setAttribute("transform","rotate(-90 50 100)")
    if (radius) {
      el.setAttribute("rx", radius);
      el.setAttribute("ry", radius);
    }
    this.#canvas.append(el);
  }

  ellipse(x, y, width, height, fixed) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    el.setAttribute("cx", fixed ? x : x + this.#cameraPos.x);
    el.setAttribute("cy", fixed ? y : y + this.#cameraPos.y);
    el.setAttribute("rx", width / 2);
    el.setAttribute("ry", height / 2);
    el.setAttribute("fill", this.#fillColor);
    el.setAttribute("stroke", this.#strokeColor);
    el.setAttribute("stroke-width", this.#strokeWeightSize);
    this.#canvas.append(el);
  }

  point(x, y, fixed) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    el.setAttribute("cx", fixed ? x : x + this.#cameraPos.x);
    el.setAttribute("cy", fixed ? y : y + this.#cameraPos.y);
    el.setAttribute("rx", this.#strokeWeightSize);
    el.setAttribute("ry", this.#strokeWeightSize);
    el.setAttribute("fill", this.#fillColor);
    el.setAttribute("stroke", this.#strokeColor);
    el.setAttribute("stroke-width", this.#strokeWeightSize);
    this.#canvas.append(el);
  }

  polygon(x, y, x2, y2, x3, y3, x4, y4, fixed) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    el.setAttribute("points", `
    ${fixed ? x : x+this.#cameraPos.x},
    ${fixed ? y : y+this.#cameraPos.y}
    ${fixed ? x2 : x2+this.#cameraPos.x},
    ${fixed ? y2 : y2+this.#cameraPos.y}
    ${fixed ? x3 : x3+this.#cameraPos.x}, 
    ${fixed ? y3 : y3+this.#cameraPos.y}
    ${fixed ? x4 : x4+this.#cameraPos.x},
    ${fixed ? y4 : y4+this.#cameraPos.y}`);
    el.setAttribute("fill", this.#fillColor);
    el.setAttribute("stroke", this.#strokeColor);
    el.setAttribute("stroke-width", this.#strokeWeightSize);

    this.#canvas.append(el);
  }

  text(txt, x, y, fixed) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "text");
    el.setAttribute("x", fixed ? x : x + this.#cameraPos.x);
    el.setAttribute("y", fixed ? y : y + this.#cameraPos.y);
    el.innerHTML = txt;
    // el.setAttribute("rx", this.#strokeWeightSize);
    // el.setAttribute("ry", this.#strokeWeightSize);
    el.setAttribute("fill", this.#fillColor);
    el.setAttribute("stroke", this.#strokeColor);
    // el.setAttribute("stroke-width", this.#strokeWeightSize);
    el.setAttribute("font-size", this.#textSize);
    el.setAttribute("text-anchor", this.#textAlign);
    this.#canvas.append(el);
  }

  textAlign(mode) {
    if (mode == "left") {
      mode = "start";
    } else if (mode == "right") {
      mode = "end";
    } else if (mode == "center") {
      mode = "center";
    }
    this.#textAlign = mode;
  }

  textSize(size) {
    this.#textSize = size;
  }

  line(x, y, x2, y2, fixed) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "line");
    // el.setAttribute('points', `${x},${y} ${x2},${y2} ${x2},${y2+this.#strokeWeightSize} ${x},${y+this.#strokeWeightSize} `)
    el.setAttribute("x1", fixed ? x : x + this.#cameraPos.x);
    el.setAttribute("y1", fixed ? y : y + this.#cameraPos.y);
    el.setAttribute("x2", fixed ? x2 : x2 + this.#cameraPos.x);
    el.setAttribute("y2", fixed ? y2 : y2 + this.#cameraPos.y);
    el.setAttribute("stroke", this.#strokeColor);
    el.setAttribute("stroke-width", this.#strokeWeightSize);
    this.#canvas.append(el);
  }

  image(img, x, y, width, height, fixed, aspect) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "image");
    if(!aspect){el.setAttribute("preserveAspectRatio", "none");}

    el.setAttribute("x", fixed ? x : x + this.#cameraPos.x);
    el.setAttribute("y", fixed ? y : y + this.#cameraPos.y);
    if(!aspect){el.setAttribute("width", width || 100);}
    el.setAttribute("height", height || 100);
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
    } else if(r) {
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

  constrain(aNumber, aMin, aMax) {
    return aNumber > aMax ? aMax : aNumber < aMin ? aMin : aNumber;

  }
  lerp(value1, value2, amt) {
    return ((value2 - value1) * amt) + value1;
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
    return { m: m, b: b, h: y, w:x };
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
