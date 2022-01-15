function Random(min, max) {
  return Math.random() * (max - min) + min;
}
function Rotate(deg) {
  rotate(deg / (180 / Math.PI));
}
function Map(value, istart, istop, ostart, ostop) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

var img;
const width = window.innerWidth;
const height = window.innerHeight;

var mainImage;
function preload(){
  // loadImage('https://cdn.glitch.me/3dd806ba-9708-47f9-a7a4-0ffc8d4ae4bf/redPoo.jpg?v=1639777911432',(img)=>{
  //   mainImage = img
  //   console.log(`image.width: ${img.width}`)
  //   console.log(`image.height: ${img.height}`)

  // })
}

function setup() {
  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.parent("canvas");
  loadImage(
    // "https://raw.githubusercontent.com/DC-CC-21/G2022/15c80a5c05f043c7e75c49be04f52648471a8c98/assets/puzzle1.svg",
    "https://raw.githubusercontent.com/DC-CC-21/G2022/46418a521635c4bc9664cec8272d9d47d9e54178/assets/Puzzle2.svg",
    // "https://raw.githubusercontent.com/DC-CC-21/G2022/15c80a5c05f043c7e75c49be04f52648471a8c98/assets/Puzzle3.svg", 
    // "https://cdn.glitch.me/3dd806ba-9708-47f9-a7a4-0ffc8d4ae4bf/link.jpeg?v=1640428492948",
    (IMAGE) => {
      // IMAGE.resize(width / 2, height / 2);
      console.log(`image.width: ${IMAGE.width}`)
      console.log(`image.height: ${IMAGE.height}`)
      img = IMAGE;
    }
  );
}

var difficulty = ~~Math.sqrt(4);
var puzzleW = Map(800,0,1536,0,width);
var puzzleH = puzzleW * 0.75;
var transX = (width-puzzleW)/2;
var transY = (height-puzzleH)/2;

console.log(puzzleW + ' PuzzleW')
console.log(puzzleH + ' PuzzleH')
console.log(width)
console.log(height)
var pieceW;
var pieceH;
var pieces = [];
var snapDist = 100;
var x = 0;
var y = 0;
var col = 0;
var frm = 0;
var scene = 'main'


// Create Pieces
class Piece {
  constructor(self) {
    for (let i = 0; i < Object.keys(self).length; i++) {
      this[Object.keys(self)[i]] = self[Object.keys(self)[i]];
    }

    this.c = createGraphics(width, height);
    this.c.image(this.img, 0, 0);
    
    this.c = this.c.get(this.x, this.y, this.w, this.h);

    // this.x *= 1.1;
    // this.y *= 1.1;
    this.origX = this.x + this.transX;
    this.origY = this.y + this.transY;

    this.x = Random(0, width - this.w);
    this.y = Random(0, height - this.h);

    this.clicked = false;
    this.rotation = 90;
    this.size = (this.w + this.h) / 2;
    this.fixed = false;
  }
  display() {
    // if (
    //   dist(this.x, this.y, this.origX, this.origY) < this.size / 4 &&
    //   this.rotation === 0
    // ) {
    //   fill(0, 255, 0, 50);
    // } else {
    //   fill(255, 0, 0, 50);
    // }
  fill(0,0)
    push();
    translate(this.x + this.w / 2, this.y + this.h / 2);
    Rotate(this.rotation);
    image(this.c, -this.w / 2, -this.h / 2);
    rect(-this.w / 2, -this.h / 2, this.w, this.h);
    pop();
  }
  press() {
    if (this.fixed) {
      return;
    }
    if (
      this.Circ_to_Rot_rect(
        { x: mouseX, y: mouseY, s: 2 },
        {
          x: this.x + this.w / 2,
          y: this.y + this.h / 2,
          w: this.w,
          h: this.h,
          rotation: this.rotation,
        }
      )
    ) {
      this.overlap = {
        x: this.x - mouseX,
        y: this.y - mouseY,
      };
      this.clicked = true;
    }
    return this.clicked;
  }
  drag() {
    if (this.clicked) {
      this.x = mouseX + this.overlap.x;
      this.y = mouseY + this.overlap.y;
    }
  }
  snap() {
    if (
      dist(this.x, this.y, this.origX, this.origY) < this.size / 4 &&
      this.rotation === 0
    ) {
      this.x = this.origX;
      this.y = this.origY;
      this.fixed = true;
    }
  }
  Circ_to_Rot_rect(x, x2) {
    var dis = dist(x.x, x.y, x2.x, x2.y);
    var angle = atan2(x.y - x2.y, x.x - x2.x);

    x.x = x2.x + cos(angle - x2.rotation / (180 / Math.PI)) * dis;
    x.y = x2.y + sin(angle - x2.rotation / (180 / Math.PI)) * dis;
    var rectX = constrain(x.x, x2.x - x2.w / 2, x2.x + x2.w / 2);
    var rectY = constrain(x.y, x2.y - x2.h / 2, x2.y + x2.h / 2);

    return dist(rectX, rectY, x.x, x.y) < x.s / 2;
  }
}

scene = 'display'
//Create Button Class


// create buttons
var Back = new Button({
  //shape
  x: 10,
  y: 10,
  w: 70,
  h: 40,
  strokeWeight:1,
  stroke:'rgba(255,255,0,50)',
  fill:'#00aaff',
  radius: 10,
  shape: "rect",

  //text
  tx:0,
  ty:0,

  text:'PUZZLES',
  tFill:'rgb(255,0,0)',
  tStroke:'rgb(255,0,0',
  tSize:14,


  //command and help
  help: true,
  cmd: () => {
    scene = 'main'
  },
})
var puzzleBtns = [
  new Button({
    //shape
    x: 10,
    y: 10,
    w: 70,
    h: 40,
    shape: "image",
    src:"",
    // src:'https://cdn.glitch.com/a9975ea6-8949-4bab-addb-8a95021dc2da%2Fillustration.svg?v=1618177344016',
    //command and help
    help: true,
    cmd: () => {
      scene = 'main'
    },
  })
]
var mainBtns = [
  new Button({
    x: 300,
    y: 300,
    w: 100,
    h: 100,
    strokeWeight:1,
    stroke:'rgba(255,255,0,50)',
    fill:'rgb(255,0,0)',
    radius: 100,
    shape: "rect",
    help: true,
    cmd: () => {
      scene = 'puzzleSetup'
    },
  })
]

// Create Game
class Game {
  constructor() {}
  create() {
    //set vars
    pieceW = puzzleW / difficulty;
    pieceH = puzzleH / difficulty;
    // img.resize(puzzleW,puzzleH)
    // img.width = puzzleW;
    // img.height = puzzleH;

    //createPieces
    for (let i = 0; i < difficulty; i++) {
      for (let j = 0; j < difficulty; j++) {
        pieces.push(
          new Piece({
            x: i * pieceW,
            y: j * pieceH,
            w: pieceW,
            h: pieceH,
            img: img,
            transX: transX,
            transY: transY,
          })
        );
      }
    }
  }
  display() {
    for (var i = pieces.length - 1; i >= 0; i--) {
      pieces[i].display();
    }
    push();
    translate(x, y);
    Rotate(col);
    if (img) {
      // image(img, -50, -50);
    }
    pop();

    fill(255);

    if (frameCount % 10 === 0) {
      frm = frameRate();
    }

    text(
      `frameRate: ${frm}
Number of Pieces: ${pieces.length}`,
      10,
      20
    );
    textAlign(CENTER,CENTER)
    Back.display()
  }
  main(){
    // image(mainImage,0,0,width,height)
    background(255,0,0);
    
    for(var i = 0; i < mainBtns.length; i ++){
      mainBtns[i].display()
    }
    
  }
  puzzleSetup(){
    background(255,255,0,50)
    for(var i = 0; i < puzzleBtns.length;  i ++){
      puzzleBtns[i].display()
    }
  }
}

var drawOnce = 0;
var game = new Game();

function draw() {
  background(75);
  if (!drawOnce) {
    
    if (img) {
      console.log(`before ${img.width},${img.height}`)
      
      // img.resize(puzzleW,puzzleH)
      game.create();
      drawOnce = 1;
      console.log(`after ${img.width},${img.height}`)
    }
  }
  fill(255);
  rect(transX, transY, puzzleW, puzzleH);
  game[scene]();
  // if(img)image(img,0,0)
}



var dragging = false;
// touch and mouse
function end_and_release() {
  console.log(dragging);
  if(scene === 'main'){
    for(var i = 0; i < mainBtns.length; i ++){
      mainBtns[i].click()
    }
  }
  if(scene === 'display'){
    if (!dragging) {
      for (var i = 0; i < pieces.length; i++) {
        if (pieces[i].clicked) {
          pieces[i].rotation += 90;
          if (pieces[i].rotation >= 360) {
            pieces[i].rotation = 0;
          }

          pieces[i].snap();
        }
      }
      col += 90;
      Back.click()
    }
  }

  //set dragging to false
  for (var i = 0; i < pieces.length; i++) {
    pieces[i].snap();
    pieces[i].clicked = false;
  }
  dragging = false;
  
  for(var i = 0,j = 0; i < pieces.length; i ++){
    if(pieces[i].fixed){
      j += 1
    }
  }
  if(j === pieces.length-1){
    completed = true;
  }
}

function mouse_touch_drag() {
  dragging = true;
  x = mouseX;
  y = mouseY;
  for (var i = 0; i < pieces.length; i++) {
    pieces[i].drag();
  }
  return false;
}

//touching
function touchMoved() {
  return mouse_touch_drag();
}
function touchStarted(){
  return false
}
function touched() {
  return false;
}
function touchEnded() {
  return end_and_release();
}

//mouse
function mouseDragged() {
  mouse_touch_drag();
}

function mouseReleased() {
  end_and_release();
}

function mousePressed() {
  if (!dragging) {
    for (var i = 0; i < pieces.length; i++) {
      if (pieces[i].press()) {
        return;
      }
    }
  }
}
