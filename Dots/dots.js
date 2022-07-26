const canvas = document.getElementById("canvas");
const c = new Canvas(canvas, window.innerWidth, window.innerHeight);

console.log(window.innerWidth, window.innerHeight);
let domSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth

const cardSize = c.map(200,0,706,0,window.innerHeight);
let controls = document.querySelector('.btns')
class Card {
  constructor(x, y, cardNum) {
    this.x = x;
    this.y = y;
    this.src = cardNum; //`assets/card${cardNum}.png`;
    this.s = cardSize;
    this.overlap = { x: 0, y: 0 };
    this.clicked = false;
  }
  display() {
    switch (this.src) {
      case 1:
        c.fill(255, 0, 0);
        break;
      case 2:
        c.fill(0, 255, 0);
        break;
      case 3:
        c.fill(0, 0, 255);
        break;
      case 4:
        c.fill(255, 255, 0);
        break;
    }
    c.rect(this.x, this.y, this.s, this.s);
  }
  isin(mx, my) {
    return (
      mx > this.x && mx < this.x + this.s && my > this.y && my < this.y + this.s
    );
  }
  press(mx, my) {
    this.clicked = true;
    this.overlap.x = this.x - mx;
    this.overlap.y = this.y - my;
    this.moveControls()
  }
  drag(mx, my) {
    if (this.clicked) {
      this.x = mx + this.overlap.x;
      this.y = my + this.overlap.y;
      this.moveControls()
    }
    return;
  }
  release() {
    this.clicked = false;
  }
  snap(){
    if(c.dist(this.x+this.s/2, this.y+this.s/2, window.innerWidth/2, window.innerHeight/2) < cardSize/2){
        this.x = window.innerWidth/2-cardSize/2;
        this.y = window.innerHeight/2-cardSize/2;
        this.moveControls()
    }
  }
  moveControls(){
    controls.style.left = this.x+this.s+'px'
    controls.style.top = this.y+this.s*0.1+'px'
  }
}

let x = 0;

let cards = [
  new Card(100, 100, 1),
  new Card(120, 100, 2),
  new Card(300, 100, 3),
  new Card(400, 100, 4),
];


draw = function () {
  c.background(75, 75, 75);
  x += 1;


  c.rect(window.innerWidth/2-cardSize/2, window.innerHeight/2-cardSize/2, cardSize, cardSize);

  cards.forEach((card) => {

    card.display();
  });
};



let currentCard;
document.addEventListener("mousedown", (e) => {
  for (let i = cards.length - 1; i >= 0; i--) {
    let card = cards[i];
    if (card.isin(e.clientX, e.clientY)) {
      card.press(e.clientX, e.clientY);
      currentCard = card;
      controls.style.display = 'flex'
      return false;
    }
  }
  controls.style.display = 'none';
});
document.addEventListener("mousemove", (e) => {
  if (currentCard) {
    currentCard.drag(e.clientX, e.clientY);
    currentCard.snap()
  }
});
document.addEventListener("mouseup", (e) => {
  if (currentCard) {
    currentCard.release();
    currentCard = false;
  }
});
// cards.push(cards.splice(i, 1)[0]);
