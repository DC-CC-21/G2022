const canvas = document.getElementById("canvas");
const c = new Canvas(canvas, window.innerWidth, window.innerHeight);

console.log(window.innerWidth, window.innerHeight);
let domSize =
  window.innerWidth > window.innerHeight
    ? window.innerHeight
    : window.innerWidth;

const cardSize = c.map(200, 0, 706, 0, window.innerHeight);
let controls = document.querySelector(".btns");

let mx = 0;
let my = 0;
class Card {
  constructor(x, y, cardNum) {
    this.x = x;
    this.y = y;
    this.src = `assets/card${cardNum}.png`;
    this.index = cardNum;
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
    
    this.rotation = Math.ceil(c.lerp(this.rotation, this.newRotation, 0.1));
    this.scale = c.lerp(this.scale, this.newScale, 0.1)
    if (this.rotation == 360) {
      this.rotation = 0;
      this.newRotation = 0;
    }
    c.transformOrigin(this.x+this.s/2, this.y+this.s/2)
    c.rotate(this.rotation, this.s / 2, this.s / 2);
    c.scale(this.scale, 1)
    c.image(this.src, this.x, this.y, this.s, this.s);
  }
  isin(mx, my) {
    return (
      mx >= this.x && mx <= this.x + this.s && my >= this.y && my <= this.y + this.s
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
    controls.style.top = this.y + this.s*0.1 + "px";
  }
}

let x = 0;

let cards = [
  new Card(100, 250, 1),
  new Card(120, 100, 2),
  new Card(140, 100, 3),
  new Card(160, 100, 4),
];
cards[0].snap()
c.textSize(50)
draw = function () {
  c.background(75, 75, 75);
  x += 1;
  c.rect(c.lerp(0, 100, 0.1), 50, 100, 100);

  c.rect(
    window.innerWidth / 2 - cardSize / 2,
    window.innerHeight / 2 - cardSize / 2,
    cardSize,
    cardSize
  );

  cards.forEach((card, i) => {
    card.display();
  });
};

let currentCard;
let prevCard;
document.addEventListener("mousedown", (e) => {
    console.log(e.target.tagName)
    if(e.target.tagName == 'BUTTON'){
        return;
    }
  for (let i = cards.length - 1; i >= 0; i--) {
    let card = cards[i];
    if (card.isin(e.clientX, e.clientY)) {
      card.press(e.clientX, e.clientY);
      currentCard = {card:card, index:i};
      controls.style.display = "flex";
      return false;
    }
  }
  //   controls.style.display = 'none';
});
document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  if (currentCard) {
    currentCard.card.drag(e.clientX, e.clientY);
    currentCard.card.snap();
  }
});
document.addEventListener("mouseup", (e) => {
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
      prevCard.card.newScale *=-1;
    }
});
document.getElementById("for").addEventListener("click", (_) => {
    console.log(prevCard);
    if (prevCard) {
        if(prevCard.index == cards.length){return}
        // cards = array_move(cards, prevCard, )
        cards.splice(prevCard.index+1,  0, cards.splice(prevCard.index, 1)[0])
        prevCard.index +=1;
        prevCard.card.index = prevCard.index
    }
});
document.getElementById("back").addEventListener("click", (_) => {
    console.log(prevCard);
    if (prevCard) {
        if(prevCard.index == 0){return} 
        cards.splice(prevCard.index-1,  0, cards.splice(prevCard.index, 1)[0])
        prevCard.index -=1;
        prevCard.card.index = prevCard.index
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
};

// cards.push(cards.splice(i, 1)[0]);
