var width;
var height;
var puzzleW;
var puzzleH;
var drawOnce = 0;
var puzzleImg;
var imageW;
var imageH;
var difficulty = 3;

function setup(){
    width = window.innerWidth;
    height = window.innerHeight;
    var canvasSize = width > height ? height : width
    puzzleW = canvasSize
    puzzleH = canvasSize*0.8

    var cnv = createCanvas(width,height)
    cnv.parent('canvas')
}

class Piece{
    constructor(self){
        for(let i = 0; i < Object.keys(self).length; i ++){
            this[Object.keys(self)[i]] = self[Object.keys(self)[i]]
        }
    }
    display(){
        stroke(0)
        // fill(this.x,this.y,this.w)
        rect(this.x,this.y,this.w,this.h)
    }
}
var pieces = []

function draw(){
    if(!drawOnce){
        drawOnce = 1;
        imageW = puzzleW/difficulty
        imageH = puzzleH/difficulty
        loadImage('./assets/beach/beach1.svg',(img)=>{
            puzzleImg = img;
        })
    }
    background(75)

    fill(255)
    rect(0,0,puzzleW,puzzleH)
    if(puzzleImg){
        if(!pieces.length){
            for(var i = 0; i < puzzleW; i +=imageW){
                for (var j = 0; j < puzzleH; j += imageH) {
                  pieces.push(
                    new Piece({
                      x: i,
                      y: j,
                      w: imageW,
                      h: imageH,
                      msk: puzzleImg,
                    })
                  );
                }
            }
        }
        else{
            for(var i = 0; i < pieces.length; i ++){
                pieces[i].display()
            }
        }
        // image(puzzleImg,0,0,puzzleW,puzzleH)
    }
}