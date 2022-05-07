let draw;
let _CANVAS_;
class Canvas {
  
  //make vars private
  #canvas;
  #fillColor = "#fff";
  #strokeColor = "#000";
  #strokeWeightSize = 1;
  
  constructor(canvas, width, height) {
    // SETUP this.#canvas
    this.#canvas = canvas;
    this.#canvas.style.overflow = "hidden";
    this.#canvas.style.position = "relative";
    this.#canvas.style.width = (width || 400) + "px";
    this.#canvas.style.height = (height || 400) + "px";
    this.#canvas.style.margin = "auto";
    recursive();
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
    if(radius){
      el.setAttribute('rx', radius)
      el.setAttribute('ry', radius)
    }
    this.#canvas.append(el);
  }

  ellipse(x, y, width, height) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    el.setAttribute("cx", x);
    el.setAttribute("cy", y);
    el.setAttribute("rx", width/2);
    el.setAttribute("ry", height/2);
    el.setAttribute("fill", this.#fillColor);
    el.setAttribute("stroke", this.#strokeColor);
    el.setAttribute("stroke-width", this.#strokeWeightSize);
    this.#canvas.append(el);
  }

  point(x, y, width, height) {
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
  
  text(txt, x, y) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "text");
    el.setAttribute("x", x);
    el.setAttribute("y", y);
    el.innerHTML = txt
    el.setAttribute("rx", this.#strokeWeightSize);
    el.setAttribute("ry", this.#strokeWeightSize);
    el.setAttribute("fill", this.#fillColor);
    el.setAttribute("stroke", this.#strokeColor);
    el.setAttribute("stroke-width", this.#strokeWeightSize);
    this.#canvas.append(el);
  }

  line(x, y, x2, y2) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "line");
    // el.setAttribute('points', `${x},${y} ${x2},${y2} ${x2},${y2+this.#strokeWeightSize} ${x},${y+this.#strokeWeightSize} `)
    el.setAttribute("x1", x);
    el.setAttribute("y1", y);
    el.setAttribute("x2", x2);
    el.setAttribute("y2", y2);
    el.setAttribute('stroke', this.#strokeColor)
    el.setAttribute('stroke-width', this.#strokeWeightSize)
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

  //math type functions
  dist(x, y, x2, y2){
    let X = x - x2
    let Y = y - y2;
    return Math.sqrt(X*X + Y*Y)
  }
  
  slope(a,b ,x){
    var X = (b.x - a.x);//        var x = (points[i+1].x - points[i].x);
    var Y = (b.y - a.y);//        var y = (points[i+1].y - points[i].y);
    var m = Y/X;//                var slope = y/x;
    var b = a.y;//a.y-(m*mouseX);// var b = points[i].y-(slope*mouseX);
    var y = m*(x-a.x) + b;
    return [y, m];
  }
  slope2(a, b, y){
    var X = (b.x - a.x);//        var x = (points[i+1].x - points[i].x);
    var Y = (b.y - a.y);//        var y = (points[i+1].y - points[i].y);
    var m = X/Y;//                var slope = y/x;
    var b = a.x;//a.y-(m*mouseX);// var b = points[i].y-(slope*mouseX);
    var x = m*(y-a.y)+b;
    return [x, m];
  }
  getAngle(a, b){
    return Math.atan2((b.y-a.y), (b.x - a.x))
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
