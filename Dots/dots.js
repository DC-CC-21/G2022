let errors = document.createElement("ul");
document.getElementById('stats').append(errors)

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



//#region setup
const canvas = document.getElementById("canvas");
const c = new Canvas(canvas, window.innerWidth, window.innerHeight, true);

console.log(window.innerWidth, window.innerHeight);
let domSize = window.innerWidth > window.innerHeight ? "height" : "width";

let originalCanvas = {
  width: 520,
  height: 706,
};

let cardSize;
if(domSize == 'height'){

  cardSize = c.map(250, 0, 706, 0, window.innerHeight);
}
else if(domSize == 'width'){

  cardSize = c.map(150, 0, originalCanvas.width, 0, window.innerWidth);
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

    // this.defs = document.createElementNS('http://www.w3.org/2000/svg','defs')

    this.symbol = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "symbol"
    );
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
  constructor(name, width, height, dots) {
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
    this.createDots(this.c2, dots);
  }
  createDots(c2, dots) {
    c2.reset();
    let colors = this.selectColors(dots);
    c2.fill(c2.color(255, 0, 0, 0));
    c2.stroke(0, 0, 255, 0.6);
    c2.strokeWeight(5);
    c2.rect(0, 0, this.width, this.height, this.width * 0.1);

    for (let i = 0; i < this.width; i += this.width / 6) {
      for (let j = 0; j < this.height; j += this.height / 6) {
        c2.transformOrigin(0, 0);
        c2.scale(1, 1);
        if (Math.random() > 0.1) {
          c2.fill(255, 0, 0, 0);
        } else {
          c2.fill(colors[~~c2.random(0, colors.length)]);
        }
        c2.stroke(0, 0, 0, 0);
        c2.ellipse(
          i + this.width / 12,
          j + this.height / 12,
          this.width / 10,
          this.height / 10
        );
      }
    }

    let div = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let use = document.createElementNS("http://www.w3.org/2000/svg", "use");

    div.setAttribute("class", "select");
    div.setAttribute("id", this.index);

    use.setAttribute("href", "#" + this.name);
    div.setAttribute("viewBox", `0 0 ${cardSize} ${cardSize}`);
    //  / use.setAttribute('width', "100px")
    //  / use.setAttribute('height', '100px')
    use.style.position = "relative";

    div.append(use);
    selectionMenu.append(div);
  }
  selectColors(len) {
    let colors = [];
    let colorsCopy = this.colors[0];
    console.log(this.colors, "a");
    while (colors.length < len) {
      let color = ~~this.c2.random(0, colorsCopy.length);
      colors.push(colorsCopy[color]);
      colorsCopy.pop(color);
      // break;
    }
    console.log(colors);
    return colors;
  }
}
class targetCard {
  constructor(x, y, i) {
    this.x = x;
    this.y = y;
    this.scales = [-1, 1];
    this.rotations = [0, 90, 180, 270];

    this.rotation = this.rotations[~~c.random(0, this.rotations.length)];
    this.scale = this.scales[~~c.random(0, this.scales.length)];
    this.card = i;
    this.s = cardSize;
  }
  display() {
    // c.reset()
    c.transformOrigin(this.x + this.s / 2, this.y + this.s / 2);
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
  }
}

let customCards = [];
let cardCount = 4;
for (let i = 0; i < cardCount; i++) {
  new createCard(i, cardSize, cardSize, 5);
}

class Card {
  constructor(x, y, cardNum) {
    this.x = x;
    this.y = y;
    this.src = `assets/card${cardNum}.png`;
    console.log(this.src);
    this.index = cardNum;
    this.card = cardNum;
    this.s = cardSize;
    this.overlap = { x: 0, y: 0 };
    this.clicked = false;
    this.rotation = 0;
    this.newRotation = 0;
    this.scale = 1;
    this.newScale = 1;
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
    // console.log(dst)

    this.rotation = Math.ceil(c.lerp(this.rotation, this.newRotation, 0.01));
    this.scale = c.lerp(this.scale, this.newScale, 0.05);
    if (this.rotation == 360) {
      this.rotation = 0;
      this.newRotation = 0;
    }
    c.transformOrigin(this.x + this.s / 2, this.y + this.s / 2);
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
      this.x = mx + this.overlap.x;
      this.y = my + this.overlap.y;
      this.moveControls();
    }
    return;
  }
  release() {
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
      this.x = window.innerWidth / 2 - cardSize / 2;
      this.y = window.innerHeight / 2 - cardSize / 2;
      this.moveControls();
    }
  }
  moveControls() {
    controls.style.left = this.x + this.s + "px";
    controls.style.top = this.y + this.s * 0.1 + "px";
  }
}
let cards = [];
let targets = [];
//   new Card(100, 250, 1),
//   new Card(120, 100, 2),
//   new Card(140, 100, 3),
//   new Card(160, 100, 4),
// ];

let offsetX = 0;
let textY = 0;

switch (domSize) {
  case "width":
    for (let i = 0; i < cardCount; i++) {
      console.log(i + 1);
      cards.push(
        new Card((i * cardSize) / 5, window.innerHeight - cardSize * 1.1, i)
      );
      targets.push(
        new targetCard(
          window.innerWidth / 2 - cardSize / 2,
          c.map(-10, 0, 150, 0, cardSize),
          i
        )
      );
    }
    break;
  case "height":
    for (let i = 0; i < cardCount; i++) {
      console.log(i + 1);
      cards.push(
        new Card(
          c.map(40,0,249.9,0,cardSize) + i * 20,
          c.map(100,0,706,0,window.innerHeight)+i*cardSize/4,
          i
        )
      );
      targets.push(
        new targetCard(
          window.innerWidth / 2 - cardSize / 2,
          c.map(-30, 0, 150, 0, cardSize),
          i
        )
      );
    }
    break;
}

//temp
let x = 0;
cards[0].snap();
c.textSize(50);
//

draw = function () {
  x += 10;
  window.scrollTo(0, 0);
  c.reset();
  c.textAlign("middle");
  c.background(75, 75, 75);
  // x += 1;
  // c.rect(x, 50, 100, 100);
  c.rect(
    window.innerWidth / 2 - cardSize / 2,
    window.innerHeight / 2 - cardSize / 2,
    cardSize,
    cardSize
  );

  c.scale(0.5, 0.5);

  for (let i = 0; i < cardCount; i++) {
    // c.useLocal(`#card${i}`, i*cardSize/2, i*cardSize, cardSize/2, cardSize/2);
  }
  c.reset();
  cards.forEach((card, i) => {
    card.display();
  });


  
  c.textSize(c.map(20,0,150,0,cardSize))
  c.text(
    "Match the card above to win",
    window.innerWidth / 2,
    c.map(170, 0, 706, 0, window.innerHeight)
  );
  targets.forEach((card, i) => {
    card.display();
  });
};
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
// draw2()

//#region listeners
let currentCard;
let prevCard;

function selectCard(mx, my, card, i) {
  card.press(mx, my);
  currentCard = { card: card, index: i };
  document
    .querySelectorAll(".active")
    .forEach((el) => el.classList.toggle("active"));
  document.getElementById(currentCard.card.index).classList.toggle("active");
  controls.style.display = "flex";
}

function ontouchDown(e, mx, my) {
  console.log(e.target.tagName);
  console.log(e.target.parentElement.tagName);
  if (e.target.tagName == "use" && e.target.parentElement.tagName == "svg") {
    cards.forEach((card, i) => {
      console.log(card.index, e.target.parentElement);
      if (card.index == e.target.parentElement.id) {
        selectCard(mx, my, card, i);
        return;
      }
    });
    console.log(currentCard);
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
});
document.addEventListener("mouseup", (e) => {
  if (currentCard) {
    currentCard.card.release();
    prevCard = currentCard;
    currentCard = false;
  }
  draw2();
});
document.addEventListener("touchend", (e) => {
  if (currentCard) {
    currentCard.card.release();
    prevCard = currentCard;
    currentCard = false;
  }
});
document.getElementById("rot").addEventListener("click", (_) => {
  console.log(prevCard);
  if (prevCard) {
    prevCard.card.newRotation += 90;
  }
});
document.getElementById("flip").addEventListener("click", (_) => {
  console.log(prevCard);
  if (prevCard) {
    prevCard.card.newScale *= -1;
  }
});
document.getElementById("for").addEventListener("click", (_) => {
  console.log(prevCard);
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
  console.log(prevCard);
  if (prevCard) {
    if (prevCard.index == 0) {
      return;
    }
    cards.splice(prevCard.index - 1, 0, cards.splice(prevCard.index, 1)[0]);
    prevCard.index -= 1;
    prevCard.card.index = prevCard.index;
  }
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

//#endregion
// cards.push(cards.splice(i, 1)[0]);

window.onresize = function () {
  canvas.style.width = window.innerWidth;
  canvas.style.height = window.innerHeight;
  document.getElementById(
    "stats"
  ).innerHTML = `Width: ${window.innerWidth}, Height: ${window.innerHeight}, cardSize: ${cardSize}`;
  
};
