Object.defineProperty(HTMLDivElement.prototype, "getPos", {
  value: function getPos() {
    function readPx(n) {
      return Number(n.replace(/px/g, ""));
    }
    return {
      x: readPx(this.style.left),
      y: readPx(this.style.top),
      width: readPx(this.style.width),
      height: readPx(this.style.height),
    };
  },
  writable: true,
  configurable: true,
});

let cnv;
function createCanvas(parent) {
  cnv = document.getElementById(parent);
}

let __COLOR__ = "white";
let __STROKE__ = "black";
let __STROKEWEIGHT__ = 1;

//shapes
function rect(x, y, w, h, r=0) {
  let element = document.createElement("div");
  element.style.position = "absolute";
  element.style.left = x + "px";
  element.style.top = y + "px";
  element.style.width = w + "px";
  element.style.height = h + "px";


  element.style.border = `${__STROKEWEIGHT__}px solid ${__STROKE__}`;
  element.style.backgroundColor = __COLOR__;
  element.style.borderRadius = r + 'px'
  // element.style.borderStyle = 'inset'
  cnv.append(element);
}

function ellipse(x, y, w, h) {
  let element = document.createElement("div");
  element.style.position = "absolute";
  element.style.border = `${__STROKEWEIGHT__}px solid ${__STROKE__}`;
  element.style.backgroundColor = __COLOR__;
  element.style.borderRadius = '50%'
  element.style.left = x + "px";
  element.style.top = y + "px";
  element.style.width = w + "px";
  element.style.height = h + "px";
  cnv.append(element);
}

//functions
function Map(value, istart, istop, ostart, ostop) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

//style
function fill(r, g, b, a) {
  if (a) {
    __COLOR__ = `rgba(${r},${g},${b},${Map(a, 0, 255, 0, 1)})`;
  } else {
    __COLOR__ = `rgb(${r},${g},${b})`;
  }
}
function strokeWeight(weight) {
  __STROKEWEIGHT__ = weight;
}
function stroke(r, g, b, a) {
  if (a) {
    __STROKE__ = `rgba(${r},${g},${b},${Map(a, 0, 255, 0, 1)})`;
  } else {
    __STROKE__ = `rgb(${r},${g},${b})`;
  }
}

// createCanvas("container");
// fill(255, 0, 0, 150);
// strokeWeight(5);
// stroke(255,255,0)
// rect(100, 100, 100, 100);
// ellipse(210, 100, 100, 100);