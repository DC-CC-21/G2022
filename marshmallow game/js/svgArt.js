// SVGElement.prototype.getPosition = function (x, y) {
//   let pos = this.getAttribute("transform")
//     .split(",")[0]
//     .replace(/[a-z]|\(|\)/g, "")
//     .split(" ");
//   return { x: Number(pos[0]), y: Number(pos[1]) };
// };
// SVGElement.prototype.getSize = function (x, y) {
//   let pos = window.getComputedStyle(this).transform; //(this.getAttribute('transform'))//[1].replace(/[a-z]|\(|\)/g, '').split(' '))
//   return pos; //{x:Number(pos[0]), y:Number(pos[1])}
// };

//gets position of element
SVGElement.prototype.getPosition = function (x = 0, y = 0) {
  let px = Number(this.getAttribute("x"));
  let py = Number(this.getAttribute("y"));
  return { x: px, y: py };
};

//gets position of element with translation
SVGElement.prototype.getTPosition = function (x = 0, y = 0) {
  let px = Number(this.getAttribute("x"));
  let py = Number(this.getAttribute("y"));
  let tx = Number(
    this.getAttribute("transform")
      .replace(/\) /g, ")|")
      .split("|")[0]
      .split(" ")[0]
      .replace(/\)|\(|[a-z]+/g, "")
  );
  let ty = parseFloat(
    this.getAttribute("transform")
      .replace(/\) /g, ")|")
      .split("|")[0]
      .split(" ")[1]
      .replace(/\)|\(|[a-z]+/g, "")
  );
  return { x: px + tx, y: py + ty };
};

//sets full position
SVGElement.prototype.setPosition = function (x, y) {

  this.setAttribute("x", x);
  this.setAttribute("y", y);
  this.setAttribute("cx", x);
  this.setAttribute("cy", y);
};

//sets X position of element
SVGElement.prototype.setPositionX = function (x,type) {
  if(type){
    this.setAttribute(type, x)
    return;
  }
  this.setAttribute("x", x);
  this.setAttribute("cx", x);
};
//sets Y position of element
SVGElement.prototype.setPositionY = function (y, type) {
  if(!type){
    this.setAttribute('y', y)
    this.setAttribute('cy', y)
  }
  this.setAttribute(type, y);
};

// sets translation of element
SVGElement.prototype.setTranslation = function (x = 0, y = 0) {
  // console.log(this.transform.)
  this.transform.baseVal.getItem(0).setTranslate(x, y);
};

SVGElement.prototype.setRotation = function (deg, x = 0, y = 0) {
  this.transform.baseVal.getItem(1).setRotate(deg, x, y);
};

// class rect {
//   constructor(x, y, width, height, radius) {
//     let el = document.createElementNS("http://www.w3.org/2000/svg", "rect");
//     el.setAttribute("width", width);
//     el.setAttribute("height", height);
//     if (radius) {
//       el.setAttribute("rx", radius);
//       el.setAttribute("ry", radius);
//     }

//     let translate = this.canvas.createSVGTransform();
//     translate.setTranslate(x, y);
//     el.transform.baseVal.appendItem(translate);

//     let rotate = this.canvas.createSVGTransform();
//     rotate.setRotate(this.rotation, this.transform.x, this.transform.y);
//     el.transform.baseVal.appendItem(rotate);

//     let scale = this.canvas.createSVGTransform();
//     scale.setScale(this.scale.x, this.scale.y);
//     el.transform.baseVal.appendItem(scale);
//     this.canvas.append(el);
//     return el;
//   }
//   setRotation() {}
// }
var Width, Height;

class Canvas {
  constructor() {
    this.scale = { x: 1, y: 1 };
    this.rotation = 0;
    this.transform = { x: 0, y: 0 };
    this.strokeColor = "rgb(0,0,0)";
    this.fillColor = "rgb(255,255,255)";
    this.strokeWeightSize = 1;
    this.textAlign = "middle";
    this.textSize = 20;
    this.textFont = "IMPACT";
  }

  //setup
  createCanvas(width, height, canvas) {
    Width = width;
    Height = height;
    if (canvas) {
      this.canvas = canvas;
      this.width = width;
      this.height = height;
      this.canvas.style.width = this.width + "px";
      this.canvas.style.height = this.height + "px";
    }
  }

  callibrateCamera(x, y, minX, maxX, minY, maxY) {
    this.cameraOrigin = {
      x: x,
      y: y,
      min: { x: minX, y: maxY },
      max: { x: maxX, y: maxY },
    };
  }
  moveCamera(x, y) {
    // this.canvas.style.left = cMath.constrain(this.cameraOrigin.x - x, this.cameraOrigin.min.x, this.cameraOrigin.max.x) + 'px'
    this.canvas.style.left =
      cMath.constrain(
        this.cameraOrigin.x - x,
        -this.cameraOrigin.max.x,
        this.cameraOrigin.min.x
      ) + "px";
  }

  //SHAPES
  rect(x, y, width, height, radius) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    //position
    el.setAttribute("x", x);
    el.setAttribute("y", y);
    el.setAttribute("width", width);
    el.setAttribute("height", height);

    if (radius) {
      el.setAttribute("rx", radius);
      el.setAttribute("ry", radius);
    }

    //style
    el.setAttribute("fill", this.fillColor);
    el.setAttribute("stroke", this.strokeColor);
    el.setAttribute("stroke-width", this.strokeWeightSize);

    //transform
    this.createTransformList(el);

    this.canvas.append(el);
    return el;
  }
  ellipse(x, y, width, height) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");

    //position
    el.setAttribute("cx", x);
    el.setAttribute("cy", y);
    el.setAttribute("rx", width / 2);
    el.setAttribute("ry", height / 2);

    //style
    el.setAttribute("fill", this.fillColor);
    el.setAttribute("stroke", this.strokeColor);
    el.setAttribute("stroke-width", this.strokeWeightSize);

    //transform
    let translate = this.canvas.createSVGTransform();
    translate.setTranslate(0, 0);
    el.transform.baseVal.appendItem(translate);

    let rotate = this.canvas.createSVGTransform();
    rotate.setRotate(this.rotation, this.transform.x, this.transform.y);
    el.transform.baseVal.appendItem(rotate);

    let scale = this.canvas.createSVGTransform();
    scale.setScale(this.scale.x, this.scale.y);
    el.transform.baseVal.appendItem(scale);
    this.canvas.append(el);
    return el;
  }
  line(x, y, x2, y2) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "line");

    //position
    el.setAttribute("x1", x);
    el.setAttribute("y1", y);
    el.setAttribute("x2", x2);
    el.setAttribute("y2", y2);

    //style
    el.setAttribute("stroke", this.strokeColor);
    el.setAttribute("stroke-width", this.strokeWeightSize);

    //transform
    this.createTransformList(el);

    this.canvas.append(el);
    return el;
  }
  text(txt, x, y, fixed) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "text");

    //position
    el.setAttribute("x", x);
    el.setAttribute("y", y);
    el.innerHTML = txt;

    //style
    el.setAttribute("fill", this.fillColor);
    el.setAttribute("stroke", this.strokeColor);
    el.setAttribute("font-size", this.textSize);
    el.setAttribute("text-anchor", this.textAlign);
    el.setAttribute("font-family", this.textFont);
    this.createTransformList(el);
    this.canvas.append(el);
    return el;
  }
  image(path, x, y, width, height, aspectRatio) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", "image");

    //position
    el.setAttribute("x", x);
    el.setAttribute("y", y);
    el.setAttribute("height", height);
    el.setAttribute("width", width);

    //style
    if (!aspectRatio) {
      el.setAttribute("preserveAspectRatio", "none");
    }
    el.setAttribute("href", path);
    this.createTransformList(el);
    this.canvas.append(el);
    return el;
  }

  animation(image, name) {
    let clippath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "clipPath"
    );
    clippath.id = name;

    clippath.append(image);
    this.canvas.append(clippath);
    return clippath;
  }

  // -- STYLE --
  background(r, g, b) {
    this.canvas.style.backgroundColor = `rgb(${r},${g},${b})`;
  }
  fill(r, g, b) {
    this.fillColor = `rgb(${r},${g},${b})`;
  }
  stroke(r, g, b) {
    this.strokeColor = `rgb(${r},${g},${b})`;
  }

  //  TRANSFORMS
  createTransformList(el) {
    let translate = this.canvas.createSVGTransform();
    translate.setTranslate(0, 0);
    el.transform.baseVal.appendItem(translate);

    let rotate = this.canvas.createSVGTransform();
    rotate.setRotate(this.rotation, this.transform.x, this.transform.y);
    el.transform.baseVal.appendItem(rotate);

    let scale = this.canvas.createSVGTransform();
    scale.setScale(this.scale.x, this.scale.y);
    el.transform.baseVal.appendItem(scale);
  }

  rotate(deg) {
    this.rotation = deg;
  }
}

const cMath = {
  add: function (n, n2) {
    return 43 + 3;
  },

  sin: function (deg) {
    return Math.sin(deg / (180 / Math.PI));
  },
  constrain(aNumber, aMin, aMax) {
    return aNumber > aMax ? aMax : aNumber < aMin ? aMin : aNumber;
  },
  AABBL(a, b) {
    
    return (
      a.x >= b.vec1.x && a.x <= b.vec2.x
      // a.y >= b.vec1.y &&
      // a.y <= b.vec2.y
    );
  },
  lerp(value1, value2, amt) {
    return (value2 - value1) * amt + value1;
  },
  getSlope(vec1, vec2) {
    let w = vec2.x - vec1.x;
    let h = vec2.y - vec1.y;
    return h / w;
  },
  random(min, max) {
    return Math.random() * (max - min) + min;
  },
  dist(x, y, x2, y2) {
    x = x2 - x;
    y = y2 - y;
    return Math.sqrt(x * x + y * y);
  },
  findNormal(vec1, vec2, rad) {
    var a = Math.atan2(vec2.y - vec1.y, vec2.x - vec1.x);
    var w = vec2.x - vec1.x;
    var h = vec2.y - vec1.y;
    return [
      {
        x: vec1.x + w / 2,
        y: vec1.y + h / 2,
      },
      {
        x: vec1.x + w / 2 + rad * Math.cos(a + Math.PI/2),
        y: vec1.y + h / 2 + rad * Math.sin(a + Math.PI/2),
      },
    ];
  },
};
