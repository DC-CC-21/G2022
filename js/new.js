var width;
var height;
var puzzleW;
var puzzleH;
var drawOnce = 0;
var puzzleImg;
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

function createPuzzle(difficulty,IMAGE){
    if(!drawOnce){
        drawOnce = 1;
        loadImage(IMAGE,(img)=>{
            puzzleImg = img;
        })
    }
}

function draw(){

    background(75)

    fill(255)
    rect(0,0,puzzleW,puzzleH)
    if(puzzleImg){
        image(puzzleImg,0,0,puzzleW,puzzleH)
    }
}