var canvasSize =
  window.innerWidth > window.innerHeight
    ? window.innerHeight
    : window.innerWidth;
canvasSize *= 0.9;
var _height = window.innerWidth * 0.9;
var _width = window.innerHeight * 0.9;

var width;
var height;

function setup() {
  var cnv = createCanvas(window.innerWidth * 0.9, window.innerHeight * 0.9);
  cnv.parent("canvas");
  width = cnv.width;
  height = cnv.height;
}

var pieces = [];

var puzzleWidth;
var puzzleHeight;
var imageWidth;
var imageHeight;
var transX;
var transY;
var chosenElement = false;

class PuzzlePiece {
  constructor(self) {
    for (var i = 0; i < Object.keys(self).length; i++) {
      this[Object.keys(self)[i]] = self[Object.keys(self)[i]];
    }
    this.clicked = false;

    var c = createGraphics(puzzleWidth, puzzleHeight);
    c.image(self.image, 0, 0, puzzleWidth, puzzleHeight);
    this.image = c.get(this.x, this.y, this.w, this.h);

    this.origX = this.x + this.transX;
    this.origY = this.y + this.transY;

    this.x = Math.random() * puzzleWidth;
    this.y = Math.random() * puzzleHeight;
    this.rotation = 0;
    this.size = this.w + this.h;
  }
  display() {
    if (this.isClicked) {
      this.x = mouseX;
      this.y = mouseY;
    }
    fill(255, 50);
    // rect(this.origX, this.origY, this.w, this.h);
    if (this.image) {
      image(this.image, this.x, this.y);
    }
  }
  isin() {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    );
  }
  click() {
    if (this.isin()) {
      this.clicked = true;
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
}

var puzzleImg;
function createPuzzle(difficulty, IMG) {
  canvasSize =
    window.innerWidth > window.innerHeight
      ? window.innerHeight
      : window.innerWidth;
  canvasSize *= 0.8;
  puzzleWidth = canvasSize;
  puzzleHeight = canvasSize * 0.8;
  imageWidth = puzzleWidth / difficulty;
  imageHeight = puzzleHeight / difficulty;
  transX = (width - puzzleWidth) / 2;
  transY = (height - puzzleHeight) / 2;
  loadImage(IMG, (loadedImg) => {
    puzzleImg = loadedImg;

    console.log(`height: ${height}`);
    console.log(`width: ${width}`);
    console.log(`aspect ratio: ${puzzleWidth / puzzleHeight}`);
    pieces = [];
    for (var i = 0; i < puzzleWidth; i += imageWidth) {
      for (var j = 0; j < puzzleHeight; j += imageHeight) {
        pieces.push(
          new PuzzlePiece({
            x: i,
            y: j,
            w: imageWidth,
            h: imageHeight,
            transX: transX,
            transY: transY,

            image: puzzleImg,
          })
        );
      }
    }
  });
}

function draw() {
  background(0);
  fill(200, 100, 0);
  rect(transX, transY, puzzleWidth, puzzleHeight);
  if (puzzleImg) {
    for (var i = pieces.length - 1; i >= 0; i -= 1) {
      pieces[i].display();
    }
    if (chosenElement) {
      pieces[chosenElement].display();
    }
    //    image(puzzleImg,0,0,puzzleWidth,puzzleHeight)
  }
}

function touch_click() {
  var element = 0;
  for (var i = 0; i < pieces.length; i++) {
    if (pieces[i].press()) {
      chosenElement = i;
      element = pieces[i];
      return;
    }
  }
  console.log("clicked");
  pieces.push(pieces.splice(pieces.indexOf(chosenElement), 1)[0]);
}
function drag() {
  for(var i = 0; i < pieces.length; i ++){
      if(pieces[i].press){
          chosenElement = i
          return;
      }
  }
  if (chosenElement >= 0) {
    pieces[chosenElement].drag();
  }
  //   for (var i = 0; i < pieces.length; i++) {
  //     if (pieces[i].clicked) {
  //       pieces[i].drag();
  //     } else {
  //       continue;
  //     }
  //   }
}
function release() {
  if (chosenElement >= 0) {
    pieces[pieces.length-1].clicked = false;
    pieces[pieces.length-1].snap();
    chosenElement = false;
  }
  //   for (var i = 0; i < pieces.length; i++) {
  //     pieces[i].clicked = false;
  //     pieces[i].snap();
  //   }
}

function mouseDragged() {
  if(puzzleImg) drag();
}
function mouseReleased() {
    if(puzzleImg) release();
}
function mousePressed() {
    if(puzzleImg) touch_click();
}
function mouseClicked() {
    if(puzzleImg) touch_click();
}

function windowResized() {
  canvasSize =
    window.innerWidth > window.innerHeight
      ? window.innerHeight
      : window.innerWidth;
  canvasSize *= 0.9;
  _height = canvasSize * 0.8;
  _width = canvasSize;
  resizeCanvas(_width, _height);
}

// var divs = document.querySelectorAll('div')
// function createPuzzle(difficulty,image) {
//     var puzzleWidth = scene3.clientWidth
//     var puzzleHeight = scene3.clientHeight
//     var imageWidth =  (puzzleWidth/ difficulty);
//     var imageHeight = (puzzleHeight / difficulty);

//     console.log(`difficulty: ${difficulty}`)
//     console.log(`puzzleWidth: ${puzzleWidth}, puzzleHeight: ${puzzleHeight}`)
//     console.log(`imageWidth: ${imageWidth}, imageHeight: ${imageHeight}`)
//     for (let i = 0; i < puzzleWidth; i += imageWidth) {
//         for (let j = 0; j < puzzleHeight; j += imageHeight) {
//             console.log(i + ',' + j)
//             var div = document.createElement('div');

//             //background
//             div.style.backgroundImage = `url(${image})`;
//             div.style.backgroundSize = 'cover'
//             div.setAttribute('draggable','true')
//             //position
//             div.style.position = 'absolute';
//             div.style.left = `${i}px`;
//             div.style.top = `${j}px`;

//             //width height
//             div.style.width = `${imageWidth-0.1}px`;
//             div.style.height = `${imageHeight-0.1}px`;
//             div.innerHTML = i

//             scene3.appendChild(div)
//         }

//     }
//     divs = document.querySelectorAll('div')
// }

// divs.forEach((element)=>{
//     element.addEventListener('drag',(e)=>{
//         element.style.left = `${e.clientX}px`;
//         element.style.top = `${e.clientY}px`;
//     })
// })
// document.addEventListener('drag',(event)=>{
//     var element = event.target
//     element.style.left =
// })

// function createPuzzle(difficulty, image) {
//     var a = 0;
//     var canvas = document.getElementById('canvas');
//     canvas.style.border = '1px solid black'
//     canvas.width = 800;
//     canvas.height = 600;

//     var ctx = canvas.getContext('2d');;

//     for (var i = 0; i < difficulty; i += 10) {
//         for (var j = 0; j < difficulty; j += 10) {
//             ctx.drawImage(URL(image),j* 50, i * 38, 50, 38);
//             ctx.rect(100, 100, 200, 200)
//         }
//     }

//     function draw(frameCount) {
//         requestAnimationFrame(draw)
//         ctx.fillStyle = 'rgb(200, 0, 0)';
//         ctx.fillRect(a, 10, 50, 50);
//         a += 1;

//     }

//     draw()
// }
