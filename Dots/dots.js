// localStorage.setItem(
//   "dots",
//   JSON.stringify({
//     theme: [
//       "#ff0000",
//       "#0abcda",
//       "#00ff00",
//       "#0000ff",
//       "#ffff00",
//       "#00ffff",
//       "#00aaff",
//       "#ffaa00",
//     ],
//     levelsBeat: {
//       x4: new Array(100).fill(0),
//       x5: new Array(100).fill(0),
//       x6: new Array(100).fill(0),
//       x7: new Array(100).fill(0),
//       x8: new Array(100).fill(0),
//       x9: new Array(100).fill(0),
//       x10: new Array(100).fill(0),
//       x11: new Array(100).fill(0),
//       x12: new Array(100).fill(0),
//       x15: new Array(100).fill(0),
//     },
//   })
// );

////console.log(window.location);

console.clear();
let errors = document.createElement("ul");
document.getElementById("stats").append(errors);

window.onerror = function (error, source, lineno, colno, err) {
  errors.style.display = "block";

  let info = {
    error: error,
    source: source,
    line: lineno,
    column: colno,
    err: err,
  };
  let el = document.createElement("li");
  Object.keys(info).forEach((key) => {
    let li = document.createElement("p");
    li.innerHTML = `${key}: ${info[key]}`;
    el.append(li);
  });
  errors.append(el);
};

//class checkCards
let colorDiv = document.getElementById("colors");

let completeTarget = document.getElementById("completeTarget");
let completeCards = document.getElementById("completeCards");

const checkCardsCanvas = document.getElementById("checkCards");
var ctx = checkCardsCanvas.getContext("2d");
eraseCanvas(ctx);
const checkCardsCanvas2 = document.getElementById("checkCards2");
var ctx2 = checkCardsCanvas2.getContext("2d");
eraseCanvas(ctx2);

function sizeCanvas(canvas, s) {
  canvas.width = s;
  canvas.height = s;
  canvas.style.width = s + "px";
  canvas.style.height = s + "px";
}

let cSize = 200;
sizeCanvas(checkCardsCanvas, cSize);
sizeCanvas(checkCardsCanvas2, cSize);
// checkCardsCanvas.width = 200
// checkCardsCanvas.height = 200
// checkCardsCanvas2.width = 200
// checkCardsCanvas2.height = 200
// checkCardsCanvas.style.width = '200px'
// checkCardsCanvas.style.height = '200px'
// checkCardsCanvas2.style.width = '200px'
// checkCardsCanvas2.style.height = '200px'

function drawImage(i) {
  transferSVG(document.getElementById(`card${i}`), completeTarget, i);
  let svgs = document.querySelectorAll("#completeTarget svg");

  imgFromSVGnode(ctx, svgs[i], function () {});
}

function transferSVG(svg, newSvg, i) {
  let newSVGcontainer = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  let attr = document.querySelectorAll(`#${newSvg.id} use`)[i];
  // ////console.log(newSvg);

  Array.from(attr.attributes).forEach((attribute) => {
    if (attribute.name != "id" && attribute.name != "transform-origin") {
      newSVGcontainer.setAttribute(
        `data-${attribute.name}`,
        attr.getAttribute(attribute.name)
      );
    }
  });
  newSVGcontainer.setAttribute("viewBox", `0 0 ${cardSize} ${cardSize}`);
  Array.from(svg.children).forEach((child) => {
    let el = document.createElementNS(
      "http://www.w3.org/2000/svg",
      child.tagName
    );

    Array.from(child.attributes).forEach((attribute) => {
      // ////console.log(attribute, child.getAttribute(attribute.name));
      el.setAttribute(attribute.name, child.getAttribute(attribute.name));
    });
    newSVGcontainer.append(el);
    // ////console.log(child.tagName)
    // ////console.log(child.attributes)
  });
  newSvg.append(newSVGcontainer);
}
// //
function createURLforSvg(rawSVG) {
  var svgURL = new XMLSerializer().serializeToString(rawSVG);
  var svg64 = btoa(svgURL);
  var b64Start = "data:image/svg+xml;base64,";
  return b64Start + svg64;
}
function eraseCanvas(ctx) {
  // Store the current transformation matrix
  ctx.save();

  // Use the identity matrix while clearing the canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, checkCardsCanvas.width, checkCardsCanvas.height);

  // Restore the transform
  ctx.restore();
}

function imgFromSVGnode(ctx, rawSVG, callback) {
  //transform
  let transform = rawSVG.dataset.transform;
  let rotation = Number(transform.split("(")[1].split(")")[0]);
  let scale = Number(transform.split("(")[2].split(",")[0]);

  //create link
  let image64 = createURLforSvg(rawSVG);
  var img = new Image();

  img.onload = function () {
    let w = checkCardsCanvas.width;
    let h = checkCardsCanvas.width;
    ctx.save();

    // ctx.resetTransform()
    ctx.translate(w / 2, h / 2);
    ctx.scale(scale, 1);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(this, -w / 2, -h / 2, w, h);
    ctx.restore();
    callback();
  };
  img.src = image64;

  let nimg = document.createElement("img");
  nimg.src = image64;
  // document.getElementById("imgs").append(nimg);
}

function canvasToDataURL(canvas) {
  let dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
function lockScroll() {
  document.body.style.position = "fixed";
  document.body.style.top = `-${window.scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
}
lockScroll();

//#region setup
const canvas = document.getElementById("canvas");
const c = new Canvas(canvas, window.innerWidth, window.innerHeight, true);

////console.log(window.innerWidth, window.innerHeight);
let mode = window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";

let originalCanvas = {
  width: 520,
  height: 706,
};

let cardSize;
if (mode == "Landscape") {
  cardSize = c.map(200, 0, 706, 0, window.innerHeight);
} else if (mode == "Portrait") {
  cardSize = c.map(120, 0, originalCanvas.width, 0, window.innerWidth);
}

document.getElementById(
  "stats"
).innerHTML = `Width: ${window.innerWidth}, Height: ${window.innerHeight}, cardSize: ${cardSize}`;

let controls = document.querySelector(".btns");
let selectionMenu = document.getElementById("selectionMenu");

let mx = 0;
let my = 0;

//#endregion

class customImg {
  constructor(container, name, s) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.style.width = s + "px";
    this.svg.style.height = s + "px";
    this.svg.setAttribute("viewBox", `0 0 ${s} ${s}`);
    this.svg.setAttribute("class", "dotsCard");
    // this.defs = document.createElementNS('http://www.w3.org/2000/svg','defs')

    this.symbol = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.symbol.setAttribute("id", name);
    this.symbol.setAttribute("width", s);
    this.symbol.setAttribute("height", s);
    this.symbol.setAttribute("viewBox", `0 0 ${s} ${s}`);

    // this.svg.append(this.defs)
    this.svg.append(this.symbol);
    container.append(this.svg);

    return this.symbol;
  }
}
class createCard {
  constructor(name, width, height, grid, dots, cs, level) {
    this.name = `card${name}`;
    this.card1 = new customImg(
      document.querySelector("body"),
      this.name,
      width
    );
    this.c2 = new Canvas(this.card1, width, height, false);
    this.width = width;
    this.height = height;
    this.index = name;
    this.colors = [
      [
        this.c2.color(255, 0, 0),
        this.c2.color(255, 152, 0),
        this.c2.color(255, 255, 0),
        this.c2.color(0, 255, 0),
        this.c2.color(0, 0, 255),
        this.c2.color(100, 0, 255),
      ],
      [],
      [],
    ];
    this.c2.textAlign("middle");
    this.c2.textSize(this.width / grid / 3);

    this.cBlind = JSON.parse(localStorage.getItem("dots")).colorblind;
    // console.log(this.cBlind);
    //createDots(canvas, grid x*x, number of colors, number of dots)
    this.abc = "ABCDEFGH";
    if (level == "daily") {
      // console.log(grid);
      this.createDaily(this.c2, grid, dots, cs);
    } else if (level == "custom") {
      this.createDots2(this.c2, grid, dots, cs);
    } else {
      this.createLevel(this.c2, cs, grid);
    }
    // this.createDots(this.c2, dots);
    // drawImage();
  }
  createLevel(c2, data, grid) {
    //console.log(data, "hi");
    let theme = JSON.parse(localStorage.getItem("dots")).theme;
    if (theme !== "random") {
      var colors = JSON.parse(localStorage.getItem("dots")).theme;
      var origColors = [...colors];
      colors = c.shuffleArray(colors);
    } else {
      var colors = this.selectColors(num);
    }

    // console.log(colors)
    // let colors
    // this.createDots2(c2, 4, 4, 4);
    c2.reset();
    this.drawOutline(c2);
    c2.reset();
    let offsetWidth = this.width / 2;
    let s = this.width / grid;
    let padding = 0.5;
    let spacing = this.width / grid;
    c2.stroke(0, 0, 0, 0);
    data.colors.forEach((color) => {
      if (color) {
        //console.log(color);
        c2.fill(colors[color.color]);
        c2.ellipse(
          color.x * spacing + s / 2,
          color.y * spacing + s / 2,
          s * padding,
          s * padding
        );

        if (this.cBlind) {
          colorDiv.style.color = colors[color.color];
          let textColor = window.getComputedStyle(colorDiv).color;
          textColor = c2.invertColor(textColor);
          c2.fill(textColor);
          let letter = origColors.indexOf(colors[color.color]);
          c2.text(
            this.abc[letter],
            color.x * spacing + s / 2,
            color.y * spacing + s / 2 + this.width / grid / 3 / 3
          );
        }
      }
    });
    this.appendHTML(false);
  }

  drawOutline(c2) {
    c2.stroke(0, 0, 255, 0.6);
    c2.strokeWeight(5);
    c2.fill(0, 0, 0, 0);

    if (mode == "Landscape") {
      c2.strokeWeight(c.map(2.5, 0, 754, 0, window.innerHeight));
      c2.rect(
        0,
        0,
        this.width,
        this.height,
        c.map(20, 0, 754, 0, window.innerHeight)
      );
    } else {
      // c2.strokeWeight(10);
      c2.strokeWeight(c.map(8, 0, 1286, 0, window.innerWidth));
      c2.rect(
        0,
        0,
        this.width,
        this.height,
        c.map(5, 0, 407.2, 0, window.innerWidth)
      );
    }
  }
  createDots2(c2, grid, dpc, num) {
    c2.reset();
    this.drawOutline(c2);
    c2.reset();

    let theme = JSON.parse(localStorage.getItem("dots")).theme;
    if (theme !== "random" && theme.length == 8) {
      var colors = c
        .shuffleArray(JSON.parse(localStorage.getItem("dots")).theme)
        .slice(0, num);
    } else {
      var colors = this.selectColors(num);
    }
    let offsetWidth = this.width / 2;
    let s = this.width / grid;
    let padding = 0.5;
    let spacing = this.width / grid;

    this.dots = new Array(grid * grid).fill(0);
    for (let i = 0; i < dpc; i++) {
      this.dots[i] = 1;
    }
    this.dots = c.shuffleArray(this.dots);

    this.arrayOfColors = [];
    c2.transformOrigin(this.width / 2, this.width / 2);
    c2.scale(0.9, 0.9);
    for (let i = 0; i < this.dots.length / grid; i++) {
      for (let j = 0; j < grid; j++) {
        if (this.dots[i + j * grid] == 1) {
          c2.stroke(0, 0, 0, 0);
          let index = ~~c2.random(0, colors.length);
          c2.fill(colors[index]);

          this.arrayOfColors.push({
            x: i,
            y: j,
            color: index,
          });

          c2.ellipse(
            i * spacing + s / 2,
            j * spacing + s / 2,
            s * padding,
            s * padding
          );
        }
      }
    }
    // //console.log(JSON.stringify(this.arrayOfColors))
    this.appendHTML(this.arrayOfColors);
  }
  createDaily(c2, grid, dpc, num) {
    c2.reset();
    this.drawOutline(c2);
    c2.reset();

    let theme = JSON.parse(localStorage.getItem("dots")).theme;
    if (theme !== "random" && theme.length == 8) {
      var colors = c
        .shuffleArray(JSON.parse(localStorage.getItem("dots")).theme)
        .slice(0, num);
    } else {
      var colors = this.selectColors(num);
    }

    let s = this.width / grid;
    let padding = 0.5;
    let spacing = this.width / grid;

    this.dots = new Array(grid * grid).fill(0);
    this.positions = new Array(grid * grid)
      .fill(0)
      .map((value, index) => index);

    for (let i = 0; i < dpc; i++) {
      let index = ~~Math.abs(
        noise.simplex2(i ** 5, selectionMenu.children.length ** day) *
          this.positions.length
      );
      let position = this.positions[index];
      // console.log(~~noise.simplex2(i, date.getDay())*this.dots.length, this.dots.length)
      this.dots[position] = 1;
      this.positions.splice(index, 1);
    }

    this.arrayOfColors = [];
    c2.transformOrigin(this.width / 2, this.width / 2);
    c2.scale(0.9, 0.9);
    for (let i = 0; i < this.dots.length / grid; i++) {
      for (let j = 0; j < grid; j++) {
        if (this.dots[i + j * grid] == 1) {
          c2.stroke(0, 0, 0, 0);
          let index = ~~c2.random(0, colors.length);
          c2.fill(colors[index]);

          this.arrayOfColors.push({
            x: i,
            y: j,
            color: index,
          });

          c2.ellipse(
            i * spacing + s / 2,
            j * spacing + s / 2,
            s * padding,
            s * padding
          );
        }
      }
    }

    this.appendHTML(false);
  }
  createDots(c2, dots) {
    c2.reset();
    let colors = this.selectColors(dots);
    c2.fill(c2.color(255, 0, 0, 0));
    c2.stroke(0, 0, 255, 0.6);
    // ////console.log(mode)
    if (mode == "Landscape") {
      c2.strokeWeight(c.map(5, 0, 754, 0, window.innerHeight));
      c2.rect(
        0,
        0,
        this.width,
        this.height,
        c.map(20, 0, 754, 0, window.innerHeight)
      );
    } else {
      // c2.strokeWeight(10);
      c2.strokeWeight(c.map(8, 0, 1286, 0, window.innerWidth));
      c2.rect(
        0,
        0,
        this.width,
        this.height,
        c.map(10, 0, 407.2, 0, window.innerWidth)
      );
    }
    // 1286,754
    let s = this.width / 12;
    let offset = 0;
    c2.translate(s, s);
    //console.log(colors);
    for (let i = offset; i < this.width - offset; i += this.width / 6) {
      for (let j = offset; j < this.height - offset; j += this.height / 6) {
        if (Math.random() > 0.05) {
          c2.fill(255, 0, 0, 0);
          continue;
        } else {
          c2.fill(colors[~~c2.random(0, colors.length)]);
        }
        c2.stroke(0, 0, 0, 0);
        c2.ellipse(i, j, s, s);
      }
    }

    let div = document.createElement("div");

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let use = document.createElementNS("http://www.w3.org/2000/svg", "use");

    div.setAttribute("class", "select");
    div.setAttribute("id", this.index);

    use.setAttribute("href", "#" + this.name);
    svg.setAttribute("viewBox", `0 0 ${cardSize} ${cardSize}`);
    //  / use.setAttribute('width', "100px")
    //  / use.setAttribute('height', '100px')
    use.style.position = "relative";

    svg.append(use);
    div.append(svg);
    selectionMenu.append(div);
  }
  appendHTML(aOC) {
    let div = document.createElement("div");
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let use = document.createElementNS("http://www.w3.org/2000/svg", "use");

    svg.setAttribute("class", "select");
    svg.setAttribute("id", this.index);

    if (aOC) {
      svg.setAttribute("data-solve", JSON.stringify(aOC));
    }

    use.setAttribute("href", "#" + this.name);
    svg.setAttribute("viewBox", `0 0 ${cardSize} ${cardSize}`);
    //  / use.setAttribute('width', "100px")
    //  / use.setAttribute('height', '100px')
    use.style.position = "relative";

    svg.append(use);
    div.append(svg);
    selectionMenu.append(div);
  }
  selectColors(len) {
    let colors = [];
    let colorsCopy = this.colors[0];
    // ////console.log(this.colors, "a");
    while (colors.length < len) {
      let color = ~~this.c2.random(0, colorsCopy.length);
      colors.push(colorsCopy[color]);
      colorsCopy.pop(color);
      // break;
    }
    // ////console.log(colors);
    return colors;
  }
}
class targetCard {
  constructor(x, y, i, data) {
    this.x = x;
    this.y = y;
    this.scales = [-1, 1];
    this.rotations = [0, 90, 180, 270];

    if (data == "daily") {
      let rotation = ~~Math.abs(
        noise.simplex2((day**month)/year, i ** day) * this.rotations.length
      );
      this.rotation = this.rotations[rotation];
      let scale = ~~Math.abs(
        noise.simplex2(day ** day, i ** year) * this.scales.length
      );
      this.scale = this.scales[scale];

    } else if (data) {
      //console.log(data);
      this.rotation = data.rotation;
      this.scale = data.scale;
    } else {
      this.rotation = this.rotations[~~c.random(0, this.rotations.length)];
      this.scale = this.scales[~~c.random(0, this.scales.length)];
    }

    this.set = document.getElementById(i).dataset;
    this.arrayOfCards = {
      colors: "solve" in this.set ? JSON.parse(this.set.solve) : false,
      rotation: this.rotation,
      scale: this.scale,
    };

    this.card = i;
    this.s = cardSize;
    this.setTarget();

    drawImage(this.card);
  }
  display() {
    // c.reset()
    // c.transformOrigin(this.x + this.s / 2, this.y + this.s / 2);
    c.transformOrigin(this.s / 2, this.s / 2);
    c.rotate(this.rotation, this.s / 2, this.s / 2);
    c.scale(this.scale * 0.5, 1 * 0.5);
    if (this.card == 0) {
      //ardCount-1){
      c.fill(0, 0, 0);
      c.rect(this.x, this.y, this.s, this.s, 20);
    }
    c.fill(0, 0, 0, 0);

    // c.image(this.src, this.x, this.y, this.s, this.s);

    c.useLocal(`#card${this.card}`, this.x, this.y, this.s, this.s);
  }
  setTarget() {
    // c.reset()
    c.transformOrigin(this.s / 2, this.s / 2);

    // c.transformOrigin(this.x + this.s / 2, this.y + this.s / 2);
    c.rotate(this.rotation, this.s / 2, this.s / 2);
    c.scale(this.scale * 0.5, 1 * 0.5);
    if (this.card == 0) {
      //ardCount-1){
      c.fill(0, 0, 0);
      c.rect(this.x, this.y, this.s, this.s, 30);
    }
    c.fill(0, 0, 0, 0);

    // c.image(this.src, this.x, this.y, this.s, this.s);

    c.useLocal(`#card${this.card}`, this.x, this.y, this.s, this.s);

    let el = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    el.setAttribute("x", 0);
    el.setAttribute("y", 0);
    el.setAttribute("fill", c.color(0, 0, 255, 1));
    let use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute(
      "transform-origin",
      `${this.x + this.s / 2}px ${this.y + this.s / 2}px`
    );
    use.setAttribute(
      "transform",
      `rotate(${this.rotation}), scale(${this.scale},1)`
    );
    use.setAttribute("href", `#card${this.card}`);
    completeTarget.append(use);
  }
}
class Card {
  constructor(x, y, cardNum) {
    this.x = x;
    this.y = y;
    this.src = `assets/card${cardNum}.png`;
    // ////console.log(this.src);
    this.index = cardNum;
    this.card = cardNum;
    this.s = cardSize;
    this.overlap = { x: 0, y: 0 };
    this.clicked = true;
    this.rotation = 0;
    this.newRotation = 0;
    this.scale = 1;
    this.newScale = 1;

    this.checkedRot = false;
    this.checkedScale = false;
    this.snapped = false;
    this.needsUpdate = true;
  }
  display() {
    // switch (this.index) {
    //   case 1:
    //     c.fill(255, 0, 0);
    //     break;
    //   case 2:
    //     c.fill(0, 255, 0);
    //     break;
    //   case 3:
    //     c.fill(0, 0, 255);
    //     break;
    //   case 4:
    //     c.fill(255, 255, 0);
    //     break;
    // }
    // if(this.isin(mx, my)){c.fill(0,255,0)}
    // else {c.fill(255,0,0)}
    // c.rect(this.x, this.y, this.s, this.s);
    // ////console.log(dst)
    // c.textSize(30);
    // c.textFont("sans-serif");
    // c.text(this.rotation.toFixed(2) + "," + this.newRotation, this.x, this.y-25);
    // c.text(this.scale.toFixed(2) + "," + this.newScale, this.x, this.y);
    // this.needsUpdate = false;
    this.rotation = c.lerp(this.rotation, this.newRotation, 0.05);
    this.scale = c.lerp(this.scale, this.newScale, 0.05);
    if (this.rotation == 360) {
      this.rotation = 0;
      this.newRotation = 0;
    }
    if (Math.abs(this.rotation - this.newRotation) < 2 && !this.checkedRot) {
      this.rotation = this.newRotation;
      check = 5;
      this.checkedRot = true;
    }

    if (Math.abs(this.scale - this.newScale) < 0.1 && !this.checkedScale) {
      this.scale = this.newScale;
      check = 5;
      this.checkedScale = true;
    }
    // else {check = 0}
    // if (this.rotation !== this.newRotation) {
    //   this.checkedRot = false;
    // }
    // if (this.checkedRot == false && ~~this.rotation % 90 == 0) {
    //   ////console.log("check");
    //   check = true;
    //   this.checkedRot = true;
    // }
    // c.transformOrigin(this.x + this.s / 2, this.y + this.s / 2);
    c.transformOrigin(this.s / 2, this.s / 2);
    c.rotate(this.rotation, this.s / 2, this.s / 2);
    c.scale(this.scale, 1);
    // c.image(this.src, this.x, this.y, this.s, this.s);
    c.useLocal(`#card${this.card}`, this.x, this.y, this.s, this.s);
  }

  isin(mx, my) {
    return (
      mx >= this.x &&
      mx <= this.x + this.s &&
      my >= this.y &&
      my <= this.y + this.s
    );
  }
  press(mx, my) {
    this.clicked = true;
    this.overlap.x = this.x - mx;
    this.overlap.y = this.y - my;
    this.moveControls();
  }
  drag(mx, my) {
    if (this.clicked) {
      this.x = c.constrain(mx + this.overlap.x, 0, window.innerWidth - this.s);
      this.y = c.constrain(my + this.overlap.y, 0, window.innerHeight - this.s);
      this.moveControls();
      // this.moveElement();
    }
    return;
  }
  release() {
    check += 1;
    this.clicked = false;
  }
  snap() {
    if (
      c.dist(
        this.x + this.s / 2,
        this.y + this.s / 2,
        window.innerWidth / 2,
        window.innerHeight / 2
      ) <
      cardSize / 4
    ) {
      if (!this.snapped) {
        totalMoves++;
      }
      this.snapped = true;
      check += 2;
      this.x = window.innerWidth / 2 - cardSize / 2;
      this.y = window.innerHeight / 2 - cardSize / 2;

      cards.push(cards.splice(this.index, 1)[0]);
      this.index = cards.length - 1;
      prevCard = { card: this, index: this.index };
      this.moveControls();
      // this.moveElement();
      return;
    }
    this.snapped = false;
  }
  moveControls() {
    controls.style.left = this.x + this.s + "px";
    controls.style.top = this.y + this.s * 0.1 + "px";
  }
  appendToHTML(i) {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute(
      "transform",
      `rotate(${this.rotation}), scale(${this.scale}, 1)`
    );
    completeCards.append(use);
    let oldSVG = document.getElementById(`card${this.card}`);
    transferSVG(oldSVG, completeCards, i);

    let svgs = document.querySelectorAll("#completeCards svg");

    imgFromSVGnode(ctx2, svgs[i], function () {
      if (i == cardCount - 1) {
        game.checkImageData();
      }
    });
  }
  moveElement() {
    let currentElement = document.querySelectorAll("#canvas use");
    currentElement[this.index].setAttribute(
      "transform",
      `translate(${this.x} ${this.y})`
    );
  }
  rotateElement() {
    let currentElement = document.querySelectorAll("#canvas use");
    setInterval(() => {
      this.rotation = c.lerp(this.rotation, this.newRotation, 0.05);
      if (this.rotation == 360) {
        this.rotation = 0;
        this.newRotation = 0;
      }
      if (Math.abs(this.rotation - this.newRotation) < 2 && !this.checkedRot) {
        this.rotation = this.newRotation;
        check = 5;
        this.checkedRot = true;
      }
      currentElement[this.index].setAttribute(
        "transform",
        `translate(${this.x} ${this.y}) rotate(${this.rotation})`
      );
    }, 10);
    // console.log(currentElement[this.index].getAttribute("transform"));
  }
}
class Game {
  constructor() {
    let location = window.location.search;
    let search = location.split("&"); //location.replace(/[\?|a-zA-Z]|\&/g, "").split("=");
    let urlParams = this.getURLParams(search);
    ////console.log(urlParams);
    document.getElementById("stats").innerHTML = JSON.stringify(urlParams)
      .replace(/"/g, "")
      .replace(/,/g, ", ");

    cardCount = Number(urlParams.cards);
    this.grid = Number(urlParams.grid);
    this.dots = Number(urlParams.dots);
    this.cardCount = cardCount;
    this.cs = Number(urlParams.colors);
    this.level = urlParams.level || "custom";
    this.debug = urlParams.debug;
    // cardCount = 3;
    // this.grid = 4;
    // this.dots = 8
    // this.cs = 1;
    // this.cardCount = cardCount;

    // fetch("./levels.json")
    // .then((response) => response.json())
    // .then((jsObject) => {
    //   //console.log(jsObject[this.grid].length)
    //   // let js = c.shuffleArray(jsObject[this.grid])
    //   // let str = ''
    //   // for(let i = 0; i < 20; i ++){
    //   //   str += JSON.stringify(js[i])+', \n'
    //   // }
    //   // //console.log(str)
    // });
    if(this.level == 'daily' || this.level == 'custom'){
      document.getElementById("backBtn").href = "index.html";
    } else {
      document.getElementById("backBtn").href = "levels.html?grid=" + this.grid;
    }

    if (this.level == "daily") {
      noise.seed(month);
      cardCount = c.constrain(~~noise.simplex2(day, year), 2, 6);
      noise.seed(month + day);
      this.grid = c.constrain(
        ~~Math.abs(noise.simplex2(day, year) * 10),
        2,
        15
      );
      noise.seed((month / (day + 1)) * 30);
      this.dots = c.constrain(
        ~~Math.abs(noise.simplex2(day, year) * 10),
        2,
        (this.grid * this.grid) / 2
      );
      noise.seed(month + day);
      this.cardCount = cardCount;
      noise.seed(month - day);
      this.cs = c.constrain(~~Math.abs(noise.simplex2(day, year) * 10), 2, 8);
      document.getElementById("tl").innerHTML +=
        "<h1>" +
        this.grid +
        "," +
        cardCount +
        "," +
        this.cs +
        "," +
        this.dots +
        "</h1>";
      this.run();
    } else if (this.level !== "custom") {
      // console.log(window.location)
      let host = window.location.pathname;
      document.getElementById("win").children[1].href = `?grid=${
        this.grid
      }&level=${Number(this.level) + 1}`;
      // console.log(document.getElementById('win').children[1])

      fetch(`./json/x${this.grid}.json`)
        .then((response) => response.json())
        .then((jsObject) => {
          // console.log(jsObject)
          this.maxLevel = jsObject.length;
          cardCount = jsObject[this.level].length;
          this.cardCount = cardCount;
          this.createLevel(jsObject[this.level]);
        });
    } else {
      this.run();
    }
  }
  createLevel(data) {
    //console.log(data.length);
    this.resetArrays();
    // this.win()

    data.forEach((card, index) => {
      new createCard(
        index,
        cardSize,
        cardSize,
        this.grid,
        this.dots,
        data[index],
        this.level
      );
      this[`create${mode}Display`]();

      this.imageData = ctx.getImageData(0, 0, 200, 200);
      this.dataURL = checkCardsCanvas.toDataURL("image/png");
      this.dataURL = this.dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
      this.shuffleCards(cards);
    });

    this[`create${mode}Display`](data.length, data);
    this.imageData = ctx.getImageData(0, 0, 200, 200);
    this.dataURL = checkCardsCanvas.toDataURL("image/png");
    this.dataURL = this.dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    this.shuffleCards(cards);
  }
  getURLParams(search) {
    let params = {};
    for (let i = 0; i < search.length; i++) {
      let split = search[i].split("=");
      split[0] = split[0].replace(/\?/g, "");
      params[split[0]] = split[1];
    }
    return params;
  }
  resetArrays() {
    document.getElementById("win").style.display = "none";
    document.querySelectorAll(".dotsCard").forEach((card) => card.remove());
    selectionMenu.innerHTML = "";
    eraseCanvas(ctx);
    eraseCanvas(ctx2);

    completeTarget.innerHTML = "";
    customCards = [];
    cards = [];
    targets = [];
    targetComplete = [];
    complete = [];
  }
  run() {
    this.resetArrays();
    for (let i = 0; i < this.cardCount; i++) {
      new createCard(
        i,
        cardSize,
        cardSize,
        this.grid,
        this.dots,
        this.cs,
        this.level
      );
    }

    if (this.level == "daily") {
      this[`create${mode}Display`](
        cardCount,
        new Array(cardCount).fill("daily")
      );
    } else {
      this[`create${mode}Display`](cardCount);
    }

    this.imageData = ctx.getImageData(0, 0, 200, 200);
    this.dataURL = checkCardsCanvas.toDataURL("image/png");
    this.dataURL = this.dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    this.shuffleCards(cards);
  }
  createPortraitDisplay(cardCount, data = false) {
    for (let i = 0; i < cardCount; i++) {
      let offset = i / 2 - cardCount / 4;
      cards.push(
        new Card(
          window.innerWidth / 2 + cardSize * offset - cardSize / 4,
          window.innerHeight - cardSize * 1.5 + (cardSize * i) / 10,
          i
        )
      );
      targets.push(
        new targetCard(
          window.innerWidth / 2 - cardSize / 2,
          c.map(10, 0, originalCanvas.width, 0, window.innerWidth),
          i,
          data[i]
        )
      );
    }
    // this.win()
  }
  createLandscapeDisplay(cardCount, data = false) {
    for (let i = 0; i < cardCount; i++) {
      cards.push(
        new Card(
          (i * cardSize) / 10 +
            c.map(10, 0, originalCanvas.height, 0, window.innerHeight),
          c.map(100, 0, originalCanvas.height, 0, window.innerHeight) +
            (cardSize / cardCount) * 2 * i,
          i
        )
      );
      targets.push(
        new targetCard(
          window.innerWidth / 2 - cardSize / 2,
          c.map(0, 0, originalCanvas.width, 0, window.innerWidth),
          i,
          data[i]
        )
      );
    }
  }
  shuffleCards(array) {
    var counter = array.length;

    while (counter > 0) {
      var ind = Math.floor(Math.random() * counter);
      counter--;

      var temp = array[counter];
      array[counter] = array[ind];
      array[ind] = temp;
    }
    return array;
  }
  checkImageData() {
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].snapped && cards[i].checkedRot && cards[i].checkedScale) {
        continue;
      } else {
        return false;
      }
    }

    var imageData = ctx.getImageData(0, 0, 200, 200);
    var imageData2 = ctx2.getImageData(0, 0, 200, 200);

    var pixels = imageData.data;
    var pixels2 = imageData2.data;
    console.clear();
    let totalDist = 0;
    for (var i = 0; i < pixels.length; i += 4) {
      if (
        this.getColorDist(
          {
            r: pixels[i],
            g: pixels[i + 1],
            b: pixels[i + 2],
          },
          {
            r: pixels2[i],
            g: pixels2[i + 1],
            b: pixels2[i + 2],
          }
        ) < c.map(this.grid, 4, 15, 100, 10)
      ) {
        continue;
      } else {
        totalDist += 1;
      }
    }
    // document.getElementById("stats").innerHTML = totalDist;
    if (totalDist < 100) {
      this.win();
    } else {
      return;
    }
    if (pixels.join("") === pixels2.join("")) {
      ////console.log("complete with pixels search");
      this.win();
      return true;
    }

    var img = new Image();
    img.src = checkCardsCanvas.toDataURL();

    var img2 = new Image();
    img2.src = checkCardsCanvas2.toDataURL();

    var xPromise = new Promise((resolve) => {
      img.onload = resolve;
    });
    var yPromise = new Promise((resolve) => {
      img2.onload = resolve;
    });
    Promise.all([xPromise, yPromise]).then(() => {
      let dataURL = canvasToDataURL(checkCardsCanvas);
      let dataURL2 = canvasToDataURL(checkCardsCanvas2);

      if (dataURL == dataURL2) {
        //match
        ////console.log("complete with data url search");
        this.win();
        return true;
      } else {
        let l = levenshtein(dataURL, dataURL2);
        if (l < 100) {
          ////console.log("complete with levenshtein search");
          this.win();
          return true;
        }
        this.debugCheckSequence(pixels, pixels2, dataURL, dataURL2);
        return false;
      }
    });
  }
  getColorDist(c1, c2) {
    let r = c1.r - c2.r;
    let g = c1.g - c2.g;
    let b = c1.b - c2.b;
    return Math.sqrt(r * r + g * g + b * b);
  }
  getColorIndicesForCoord = (x, y, width) => {
    const red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  };
  // const colorIndices = getColorIndicesForCoord(xCoord, yCoord, canvasWidth);
  debugCheckSequence(pixels, pixels2, dataURL, dataURL2) {
    ////console.log("pixels: ", pixels.length);
    ////console.log("pixels2: ", pixels2.length);
    ////console.log(dataURL);
    ////console.log(dataURL2);
    let leven = levenshtein(dataURL, dataURL2);
    ////console.log(leven);
  }
  check() {
    // document.getElementById("stats").innerHTML = check;
    if (check > 0) {
      check--;
      // console.log(check);
      completeCards.innerHTML = "";
      eraseCanvas(ctx2);
      // sizeCanvas(checkCardsCanvas, cSize);
      // sizeCanvas(checkCardsCanvas2, cSize);
      for (let i = 0; i < cards.length; i++) {
        cards[i].appendToHTML(i);
      }

      // check = false;
    }
    return false;
  }

  win() {
    let completeLevels = JSON.parse(localStorage.getItem("dots"));

    check = 0;
    if(this.level == 'daily'){
      let winText = document.getElementById("win");
      let winBtn = winText.children[1];
      let winH1 = winText.children[0];
      winH1.innerHTML = `Congratulations<br> You have finished the daily level!`;
      winBtn.children[0].innerHTML = "Click to return to main screen";
      winBtn.href = "gridSelect.html";
      completeLevels.daily = date
    }
    else if (this.level == this.maxLevel - 1) {
      let winText = document.getElementById("win");
      let winBtn = winText.children[1];
      let winH1 = winText.children[0];
      winH1.innerHTML = `Congratulations<br> You have finished the ${this.grid}x${this.grid} pack!`;
      winBtn.children[0].innerHTML = "Click to return to main screen";
      winBtn.href = "gridSelect.html";
    }

    document.getElementById("win").style.display = "block";
    document
      .querySelectorAll(".active")
      .forEach((el) => el.classList.toggle("active"));
    controls.style.display = "none";

    if(this.level !== 'daily'){completeLevels.levelsBeat["x" + this.grid][this.level] = 1;}
    localStorage.setItem("dots", JSON.stringify(completeLevels));
    // console.log(completeLevels);
  }
}

function levenshtein(s, t) {
  if (s === t) {
    return 0;
  }
  var n = s.length,
    m = t.length;
  if (n === 0 || m === 0) {
    return n + m;
  }
  var x = 0,
    y,
    a,
    b,
    c,
    d,
    g,
    h;
  var p = new Uint16Array(n);
  var u = new Uint32Array(n);
  for (y = 0; y < n; ) {
    u[y] = s.charCodeAt(y);
    p[y] = ++y;
  }

  for (; x + 3 < m; x += 4) {
    var e1 = t.charCodeAt(x);
    var e2 = t.charCodeAt(x + 1);
    var e3 = t.charCodeAt(x + 2);
    var e4 = t.charCodeAt(x + 3);
    c = x;
    b = x + 1;
    d = x + 2;
    g = x + 3;
    h = x + 4;
    for (y = 0; y < n; y++) {
      a = p[y];
      if (a < c || b < c) {
        c = a > b ? b + 1 : a + 1;
      } else {
        if (e1 !== u[y]) {
          c++;
        }
      }

      if (c < b || d < b) {
        b = c > d ? d + 1 : c + 1;
      } else {
        if (e2 !== u[y]) {
          b++;
        }
      }

      if (b < d || g < d) {
        d = b > g ? g + 1 : b + 1;
      } else {
        if (e3 !== u[y]) {
          d++;
        }
      }

      if (d < g || h < g) {
        g = d > h ? h + 1 : d + 1;
      } else {
        if (e4 !== u[y]) {
          g++;
        }
      }
      p[y] = h = g;
      g = d;
      d = b;
      b = c;
      c = a;
    }
  }

  for (; x < m; ) {
    var e = t.charCodeAt(x);
    c = x;
    d = ++x;
    for (y = 0; y < n; y++) {
      a = p[y];
      if (a < c || d < c) {
        d = a > d ? d + 1 : a + 1;
      } else {
        if (e !== u[y]) {
          d = c + 1;
        } else {
          d = c;
        }
      }
      p[y] = d;
      c = a;
    }
    h = d;
  }

  return h;
}

const date = new Date();
const month = date.getMonth();
const day = date.getDate()
const year = date.getFullYear();
let cardCount = 8;
let customCards = [];
let cards = [];
let targets = [];
let targetComplete = [];
let complete = [];
let check = 0;
let offsetX = 0;
let textY = 0;
let totalMoves = 0;

var game = new Game();
//temp
let x = 0;
//

let placedCards = 0;
let centerSquare = {
  x: window.innerWidth / 2 - cardSize / 2,
  y: window.innerHeight / 2 - cardSize / 2,
};
let result = [];
let drawOnce = false;

draw = function () {
  game.check();
  x += 10;
  window.scrollTo(0, 0);
  c.reset();
  c.textAlign("middle");
  c.background(75, 75, 75);
  // x += 1;
  // c.rect(x, 50, 100, 100);
  c.fill(0, 0, 0);
  c.strokeWeight(0);
  c.rect(centerSquare.x, centerSquare.y, cardSize, cardSize, 20);
  // c.image('assets/Metal035.jpg', 0, 0, window.innerWidth, window.innerHeight)

  c.scale(0.5, 0.5);

  c.reset();
  complete = [];
  targetComplete = [];
  cards.forEach((card, i) => {
    card.index = i;
    card.display();
    complete.push(card.card);
    complete.push(card.index);
  });

  c.reset();
  targets.forEach((card, i) => {
    card.display();
    targetComplete.push(card.card);
    targetComplete.push(card.card);
  });

  if (game.debug && !drawOnce) {
    drawOnce = true;
    for (let i = 0; i < 5; i++) {
      createCustomLevels();
    }
  }

  document.getElementById("stats").innerHTML = "Moves: " + totalMoves;
};

// draw2();
// draw
// let frame = 0;
// draw=function(){
//   frame++;
//   if(frame < 10){
//     draw2()
//   }
//   if(frame > 1000){
//     frame = 0;
//   }
//   if(frame%200== 0){
//     draw2()
//   }
// }

//#region listeners
let currentCard;
let prevCard;

function selectCard(mx, my, card, i, done) {
  card.press(mx, my);
  currentCard = { card: card, index: i };
  document
    .querySelectorAll(".active")
    .forEach((el) => el.classList.toggle("active"));
  document.getElementById(currentCard.card.card).classList.toggle("active");
  controls.style.display = "flex";
}

function ontouchDown(e, mx, my) {
  // ////console.log(e.target.tagName);
  // ////console.log(e.target.parentElement.tagName);

  if (e.target.tagName == "use" && e.target.parentElement.tagName == "svg") {
    cards.forEach((card, i) => {
      // ////console.log(card.index, e.target.parentElement);
      if (card.card == e.target.parentElement.id) {
        selectCard(mx, my, card, i, 0);
        return;
      }
    });
    // ////console.log(currentCard);
  }
  if (e.target.tagName == "BUTTON" || e.target.tagName == "use") {
    return;
  }
  for (let i = cards.length - 1; i >= 0; i--) {
    let card = cards[i];
    if (card.isin(mx, my)) {
      selectCard(mx, my, card, i);
      return false;
    }
  }
}

document.addEventListener("mousedown", (e) => {
  ////console.log(complete, targetComplete);
  ontouchDown(e, e.clientX, e.clientY);
  //   controls.style.display = 'none';
});

document.addEventListener("touchstart", (e) => {
  e.clientX = e.touches[0].clientX;
  e.clientY = e.touches[0].clientY;

  ontouchDown(e, e.pageX, e.pageY);
});

document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;

  if (currentCard) {
    currentCard.card.drag(e.clientX, e.clientY);
    currentCard.card.snap();
  }
});
document.addEventListener("touchmove", (e) => {
  mx = e.touches[0].clientX;
  my = e.touches[0].clientY;

  if (currentCard) {
    currentCard.card.drag(e.pageX, e.pageY);
    currentCard.card.snap();
  }
  return false;
});
document.addEventListener("mouseup", (e) => {
  if (currentCard) {
    currentCard.card.release();
    prevCard = currentCard;
    currentCard = false;
  }
  refreshElement(selectionMenu);
});
document.addEventListener("touchend", (e) => {
  if (currentCard) {
    currentCard.card.release();
    prevCard = currentCard;
    currentCard = false;
  }
  refreshElement(selectionMenu);
});
document.getElementById("rot").addEventListener("click", (_) => {
  // ////console.log(prevCard);
  totalMoves++;
  if (prevCard) {
    prevCard.card.newRotation += 90 * (prevCard.card.scale < 0 ? -1 : 1);
    prevCard.card.checkedRot = false;
    // prevCard.card.rotateElement();
    ////console.log(prevCard.card.newRotation);

    // check = true;
  }
});
document.getElementById("flip").addEventListener("click", (_) => {
  // ////console.log(prevCard);
  totalMoves++;
  if (prevCard) {
    prevCard.card.newScale *= -1;
    prevCard.card.checkedScale = false;
    // check = true;
  }
});
document.getElementById("for").addEventListener("click", (_) => {
  totalMoves++;
  // ////console.log(prevCard);
  check += 1;
  if (prevCard) {
    if (prevCard.index == cards.length - 1) {
      return;
    }
    // cards = array_move(cards, prevCard, )
    cards.splice(prevCard.index + 1, 0, cards.splice(prevCard.index, 1)[0]);
    prevCard.index += 1;
    prevCard.card.index = prevCard.index;
  }
});
document.getElementById("back").addEventListener("click", (_) => {
  // ////console.log(prevCard);
  totalMoves++;
  check += 1;
  if (prevCard) {
    if (prevCard.index == 0) {
      return;
    }
    cards.splice(prevCard.index - 1, 0, cards.splice(prevCard.index, 1)[0]);
    prevCard.index -= 1;
    prevCard.card.index = prevCard.index;
  }
});

document.getElementById("backBtn").addEventListener("click", (_) => {
  // console.clear();
  // let newSet = [];
  // targets.forEach((card) => {
  //   newSet.push(card.arrayOfCards);
  // });
  // result.push(newSet);
  // let str = JSON.stringify(result)
  // //console.log(str.slice(1,str.length-1)+',');
  // //console.log(result.length)
  // game.run();
});
function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
}

function createCustomLevels() {
  console.clear();
  let newSet = [];
  targets.forEach((card) => {
    newSet.push(card.arrayOfCards);
  });
  result.push(newSet);
  let str = JSON.stringify(result);
  // console.log(str.slice(1, str.length - 1) + ",");
  console.log(result.length);
  game.run();
}

//#endregion
// cards.push(cards.splice(i, 1)[0]);

window.onresize = function () {
  canvas.style.width = window.innerWidth;
  canvas.style.height = window.innerHeight;
  document.getElementById(
    "stats"
  ).innerHTML = `Width: ${window.innerWidth}, Height: ${window.innerHeight}, cardSize: ${cardSize}`;
};
document.getElementById("next").addEventListener("click", (_) => {
  // game.run();
});
function refreshElement(el) {
  let children = Array.from(el.children);
  el.innerHTML = "";
  children.forEach((child) => {
    el.append(child);
  });
}
////
