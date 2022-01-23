let width;
let height;
let puzzleW;
let puzzleH;
let drawOnce = 0;
let puzzleImg;
let imageW;
let imageH;
let pieces = []

difficulty = 3;

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

        // this.c = createGraphics(puzzleW,puzzleH)
        background(0,0)
        image(this.msk,0,0,puzzleW,puzzleH)
        this.image = get(this.x,this.y,this.w,this.h)

        this.origX = this.x;
        this.origY = this.y;

        this.x = Math.random()*width
        this.y = Math.random()*height
    }
    display(){
        stroke(0)
        fill(this.x,this.y,this.w,50)
        rect(this.x,this.y,this.w,this.h)
        if(this.image) image(this.image,this.x,this.y)
    }
}

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
        image(puzzleImg,0,0,puzzleW,puzzleH)
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
    }
}